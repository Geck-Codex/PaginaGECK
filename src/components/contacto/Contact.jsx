import { useState, useEffect, useRef } from 'react';
import { Send, User, Mail, MessageSquare, Instagram } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import { trackLead } from '../../data/track.js';

/**
 * Contacto.
 *
 * MISMO LENGUAJE QUE EL RESTO DEL SITIO (WhatWeDo, Processtimeline): no hay
 * tarjetas, ni sombras, ni orbes de fondo, ni iconos con colores de marca
 * ajenos a la paleta. Solo filetes de un pixel, `--font-display` en los
 * titulares y una sola pieza dorada maciza: el boton de enviar.
 *
 * El dorado queda como acento minimo — el filete del metodo activo, el numero,
 * la palabra destacada del titular. El verde de WhatsApp y el rosa de
 * Instagram no pertenecen a la paleta, asi que los iconos van monocromos y se
 * encienden en dorado al pasar por encima.
 *
 * Los campos son subrayados, no cajas: una caja con borde y radio seria el
 * unico contenedor de una seccion que no tiene ninguno, y se leeria como un
 * widget pegado encima.
 */
export default function Contact({ lang }) {
  const { t } = useLanguage(lang);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState(false);
  const [visible, setVisible] = useState({ header: false, body: false });

  const headerRef = useRef(null);
  const bodyRef   = useRef(null);

  const contactConfig = {
    whatsapp: '+52 6271745436',
    email: 'ventas@geckcodex.com',
    instagram: 'https://www.instagram.com/geckcodex/',
  };

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting)
            setVisible(prev => ({ ...prev, [e.target.dataset.reveal]: true }));
        });
      },
      { threshold: 0.1, rootMargin: '-40px 0px -40px 0px' }
    );
    [headerRef, bodyRef].forEach(r => { if (r.current) obs.observe(r.current); });
    return () => obs.disconnect();
  }, []);

  // Access key de Web3Forms: vive en .env (PUBLIC_WEB3FORMS_KEY), no en el código.
  const WEB3FORMS_KEY = import.meta.env.PUBLIC_WEB3FORMS_KEY;

  // El registro vive en `data/track.js`, compartido con el pie y con
  // servicios: cuando estaba escrito aqui, los enlaces de esos dos no
  // contaban nada y los reportes solo veian esta pagina.
  const track = (method) => trackLead(method, 'contact');

  const handleWhatsApp = () => {
    track('whatsapp');
    const msg = t.contact.waMsg(formData.name);
    window.open(`https://wa.me/${contactConfig.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handleGmail = () => {
    track('email');
    const body = `${t.contact.name}: ${formData.name}\nEmail: ${formData.email}\n\n${t.contact.msg}:\n${formData.message}`;
    window.open(`https://mail.google.com/mail/?view=cm&to=${contactConfig.email}&su=${encodeURIComponent(t.contact.emailSubject)}&body=${encodeURIComponent(body)}`, '_blank');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Sin key configurada el POST siempre falla en silencio y el lead se pierde.
    // Mejor mandar al usuario a WhatsApp, que sí funciona.
    if (!WEB3FORMS_KEY) {
      setError(true);
      return;
    }

    setLoading(true);
    setError(false);
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: `Nuevo contacto de ${formData.name || 'la web'} — geckcodex.com`,
          from_name: 'Geck Codex Web',
          // Con replyto, al dar "Responder" en Gmail el correo va directo al
          // cliente en vez de a Web3Forms.
          replyto: formData.email,
          name: formData.name,
          email: formData.email,
          message: formData.message,
          botcheck: false,
        }),
      });
      const data = await res.json();
      if (data.success) {
        track('form');
        setSubmitted(true);
        setTimeout(() => { setFormData({ name: '', email: '', message: '' }); setSubmitted(false); }, 4000);
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <>
      <section className="ct">
        <div className="ct-wrap">

          {/* ── ENCABEZADO ── */}
          <header
            className={`ct-head${visible.header ? ' is-in' : ''}`}
            ref={headerRef}
            data-reveal="header"
          >
            <h1 className="ct-h1">
              {t.contact.title} <span className="ct-accent">{t.contact.titleSpan}</span>
            </h1>
            <p className="ct-desc">{t.contact.desc}</p>
          </header>

          {/* ── CUERPO: dos columnas separadas por un filete ── */}
          <div
            className={`ct-grid${visible.body ? ' is-in' : ''}`}
            ref={bodyRef}
            data-reveal="body"
          >

            {/* ── IZQUIERDA: cómo escribirnos ── */}
            <div className="ct-col ct-col--left">
              <span className="ct-eyebrow">{t.contact.eyebrow}</span>

              <h2 className="ct-h2">
                {t.contact.chooseTitle.split('\n').map((line, i) => (
                  <span key={i}>{line}{i === 0 && <br />}</span>
                ))}
              </h2>
              <p className="ct-sub">{t.contact.chooseSub}</p>

              <div className="ct-methods">
                <button type="button" className="ct-method" onClick={handleWhatsApp}>
                  <span className="ct-num" aria-hidden="true">01</span>
                  <span className="ct-mi" aria-hidden="true">
                    <svg width="17" height="17" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                  </span>
                  <span className="ct-mt">
                    <span className="ct-mlabel">WhatsApp</span>
                    <span className="ct-msub">{t.contact.waSub}</span>
                  </span>
                  <span className="ct-marrow" aria-hidden="true">→</span>
                </button>

                <button type="button" className="ct-method" onClick={handleGmail}>
                  <span className="ct-num" aria-hidden="true">02</span>
                  <span className="ct-mi" aria-hidden="true">
                    <Mail width={17} height={17} />
                  </span>
                  <span className="ct-mt">
                    <span className="ct-mlabel">{t.contact.emailLabel}</span>
                    <span className="ct-msub">{contactConfig.email}</span>
                  </span>
                  <span className="ct-marrow" aria-hidden="true">→</span>
                </button>

                <a className="ct-method" href={contactConfig.instagram} target="_blank" rel="noopener noreferrer">
                  <span className="ct-num" aria-hidden="true">03</span>
                  <span className="ct-mi" aria-hidden="true">
                    <Instagram width={17} height={17} />
                  </span>
                  <span className="ct-mt">
                    <span className="ct-mlabel">Instagram</span>
                    <span className="ct-msub">@geckcodex</span>
                  </span>
                  <span className="ct-marrow" aria-hidden="true">→</span>
                </a>
              </div>

              <p className="ct-avail">
                <span className="ct-dot" aria-hidden="true" />
                {t.contact.available}
              </p>
            </div>

            {/* ── DERECHA: formulario ── */}
            <div className="ct-col ct-col--right">
              <span className="ct-eyebrow">{t.contact.formLabel}</span>

              <form onSubmit={handleSubmit} className="ct-form">
                {/* Honeypot de Web3Forms: invisible para las personas, los bots
                    lo rellenan y el envío se descarta del lado del servicio. */}
                <input
                  type="checkbox"
                  name="botcheck"
                  className="ct-botcheck"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                />

                <div className="ct-field">
                  <label className="ct-flabel" htmlFor="ct-name">{t.contact.name}</label>
                  <div className="ct-iw">
                    <User className="ct-ii" aria-hidden="true" />
                    <input id="ct-name" type="text" name="name" value={formData.name}
                      onChange={handleChange} placeholder={t.contact.namePh} required className="ct-input" />
                  </div>
                </div>

                <div className="ct-field">
                  <label className="ct-flabel" htmlFor="ct-email">Email</label>
                  <div className="ct-iw">
                    <Mail className="ct-ii" aria-hidden="true" />
                    <input id="ct-email" type="email" name="email" value={formData.email}
                      onChange={handleChange} placeholder={t.contact.emailPh} required className="ct-input" />
                  </div>
                </div>

                <div className="ct-field ct-field--grow">
                  <label className="ct-flabel" htmlFor="ct-msg">{t.contact.msg}</label>
                  <div className="ct-iw">
                    <MessageSquare className="ct-ii ct-ii--top" aria-hidden="true" />
                    <textarea id="ct-msg" name="message" value={formData.message}
                      onChange={handleChange} placeholder={t.contact.msgPh}
                      required className="ct-ta" />
                    <span className="ct-char" aria-hidden="true">{formData.message.length}</span>
                  </div>
                </div>

                <div className="ct-row">
                  <button type="submit" className="ct-btn" disabled={loading}>
                    {loading
                      ? <><span className="ct-spinner" />{t.contact.sending}</>
                      : <><Send width={15} height={15} />{t.contact.send}</>
                    }
                  </button>
                  <p className="ct-hint">{t.contact.noSpam.split('\n').map((line, i) => <span key={i}>{line}{i === 0 && <br />}</span>)}</p>
                </div>

                {error && <p className="ct-error">{t.contact.error}</p>}
              </form>

              {submitted && (
                <div className="ct-success">
                  <span className="ct-sring">
                    <svg className="ct-check" width="30" height="30" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  <p className="ct-stitle">{t.contact.successTitle}</p>
                  <p className="ct-ssub">{t.contact.successSub}</p>
                </div>
              )}
            </div>

          </div>
        </div>
      </section>

      <style>{`
        /* ── Sección ──
           Sin fondo propio ni orbes: se apoya en el fondo de la página, igual
           que el resto de las secciones del sitio. */
        .ct {
          position: relative;
          padding: clamp(3.2rem, 8vh, 6rem) 1.25rem clamp(2.6rem, 6vh, 4.5rem);
        }
        .ct-wrap {
          max-width: 1060px;
          margin: 0 auto;
        }

        /* ── Encabezado ── */
        .ct-head {
          text-align: center;
          margin-bottom: clamp(2rem, 5vh, 3.4rem);
          opacity: 0;
          transform: translateY(20px);
          transition: opacity .6s ease, transform .7s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .ct-head.is-in { opacity: 1; transform: none; }

        .ct-h1 {
          font-family: var(--font-display);
          font-size: clamp(1.9rem, 2.6vw + 1vh, 3rem);
          font-weight: 900;
          line-height: 1.12;
          letter-spacing: -0.02em;
          color: var(--text);
          margin: 0 auto .8rem;
          max-width: 18ch;
          text-wrap: balance;
        }
        .ct-accent { color: var(--accent-text); }

        .ct-desc {
          margin: 0 auto;
          max-width: 46ch;
          font-size: clamp(.86rem, 1vw, .96rem);
          line-height: 1.6;
          color: var(--text-muted);
        }

        /* ── Rejilla: dos columnas y un filete, sin tarjeta ── */
        .ct-grid {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
          border-top: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
          opacity: 0;
          transform: translateY(24px);
          transition: opacity .6s ease .1s, transform .7s cubic-bezier(0.22, 1, 0.36, 1) .1s;
        }
        .ct-grid.is-in { opacity: 1; transform: none; }

        .ct-col {
          display: flex;
          flex-direction: column;
          padding: clamp(1.8rem, 4vh, 2.8rem) 0;
        }
        .ct-col--left {
          border-right: 1px solid var(--border);
          padding-right: clamp(1.3rem, 3.5vw, 2.8rem);
        }
        .ct-col--right {
          position: relative;
          padding-left: clamp(1.3rem, 3.5vw, 2.8rem);
        }

        /* ── Cejilla, compartida por las dos columnas ── */
        .ct-eyebrow {
          font-size: clamp(.66rem, .8vw, .73rem);
          font-weight: 700;
          letter-spacing: .28em;
          text-transform: uppercase;
          color: var(--accent-text);
          margin-bottom: .85rem;
        }

        .ct-h2 {
          font-family: var(--font-display);
          font-size: clamp(1.35rem, 1.8vw + .6vh, 2rem);
          font-weight: 800;
          line-height: 1.14;
          letter-spacing: -0.02em;
          color: var(--text);
          margin: 0 0 .45rem;
          text-wrap: balance;
        }
        .ct-sub {
          margin: 0 0 clamp(1.4rem, 3.5vh, 2.2rem);
          font-size: clamp(.8rem, .95vw, .88rem);
          line-height: 1.55;
          color: var(--text-muted);
        }

        /* ── Métodos: filas con filete, no tarjetas ── */
        .ct-methods {
          display: flex;
          flex-direction: column;
          border-top: 1px solid var(--border);
          margin-bottom: auto;
        }
        .ct-method {
          display: grid;
          grid-template-columns: auto auto minmax(0, 1fr) auto;
          align-items: center;
          gap: clamp(.7rem, 1.6vw, 1rem);
          width: 100%;
          padding: clamp(.85rem, 2vh, 1.1rem) .2rem;
          border: 0;
          border-bottom: 1px solid var(--border);
          border-radius: 0;
          background: none;
          text-align: left;
          text-decoration: none;
          font: inherit;
          cursor: pointer;
          position: relative;
          transition: padding-left .3s cubic-bezier(0.22, 1, 0.36, 1);
        }
        /* El único adorno: un filete dorado que crece a la izquierda. */
        .ct-method::before {
          content: '';
          position: absolute;
          left: 0; top: 0; bottom: 0;
          width: 2px;
          background: var(--accent);
          transform: scaleY(0);
          transform-origin: center;
          transition: transform .3s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .ct-method:hover::before,
        .ct-method:focus-visible::before { transform: scaleY(1); }
        .ct-method:hover,
        .ct-method:focus-visible { padding-left: .85rem; outline: none; }
        .ct-method:focus-visible .ct-mlabel { text-decoration: underline; }

        .ct-num {
          font-family: var(--font-display);
          font-size: .68rem;
          font-weight: 800;
          letter-spacing: .16em;
          color: var(--accent-text);
          font-variant-numeric: tabular-nums;
        }
        /* Iconos monocromos: el verde de WhatsApp y el rosa de Instagram no
           están en la paleta. Se encienden en dorado al pasar por encima. */
        .ct-mi {
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-muted);
          transition: color .25s ease;
        }
        .ct-method:hover .ct-mi,
        .ct-method:focus-visible .ct-mi { color: var(--accent); }

        .ct-mt { display: flex; flex-direction: column; min-width: 0; }
        .ct-mlabel {
          font-family: var(--font-display);
          font-size: clamp(.9rem, 1vw, .98rem);
          font-weight: 700;
          color: var(--text);
          line-height: 1.25;
        }
        .ct-msub {
          font-size: .74rem;
          color: var(--text-muted);
          margin-top: .12rem;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .ct-marrow {
          font-size: .95rem;
          color: var(--text-muted);
          transition: color .25s ease, transform .25s ease;
        }
        .ct-method:hover .ct-marrow,
        .ct-method:focus-visible .ct-marrow { color: var(--accent); transform: translateX(4px); }

        .ct-avail {
          display: flex;
          align-items: center;
          gap: .5rem;
          margin: clamp(1.4rem, 3.5vh, 2rem) 0 0;
          font-size: .72rem;
          letter-spacing: .06em;
          color: var(--text-muted);
        }
        .ct-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: var(--success);
          flex-shrink: 0;
          animation: ctPulse 2.4s ease-in-out infinite;
        }
        @keyframes ctPulse {
          0%, 100% { opacity: 1; }
          50%      { opacity: .35; }
        }

        /* ── Formulario ── */
        .ct-form { display: flex; flex-direction: column; flex: 1; }

        /* Honeypot: fuera de la vista y del recorrido de foco, pero presente en
           el DOM para que los bots que rellenan todo caigan en él. No usar
           display:none — algunos bots ignoran los campos ocultos así. */
        .ct-botcheck {
          position: absolute !important;
          left: -9999px !important;
          opacity: 0 !important;
          height: 0 !important;
          width: 0 !important;
          margin: 0 !important;
          pointer-events: none;
        }

        .ct-field { margin-bottom: clamp(1rem, 2.4vh, 1.4rem); }
        .ct-field--grow { flex: 1; display: flex; flex-direction: column; }
        .ct-field--grow .ct-iw { flex: 1; display: flex; }

        .ct-flabel {
          display: block;
          font-size: .64rem;
          font-weight: 700;
          letter-spacing: .16em;
          text-transform: uppercase;
          color: var(--text-muted);
          margin-bottom: .4rem;
          transition: color .2s ease;
        }
        .ct-field:focus-within .ct-flabel { color: var(--accent-text); }

        .ct-iw { position: relative; }
        .ct-ii {
          position: absolute;
          left: 0; top: 50%;
          transform: translateY(-50%);
          width: 15px; height: 15px;
          color: var(--text-muted);
          pointer-events: none;
          transition: color .2s ease;
        }
        .ct-ii--top { top: 12px; transform: none; }
        .ct-field:focus-within .ct-ii { color: var(--accent); }

        /* Campos subrayados: una caja con borde y radio sería el único
           contenedor de la sección. */
        .ct-input, .ct-ta {
          width: 100%;
          background: none;
          border: 0;
          border-bottom: 1px solid var(--border-strong);
          border-radius: 0;
          color: var(--text);
          font-family: inherit;
          font-size: .92rem;
          outline: none;
          padding: .6rem 0 .55rem 1.6rem;
          transition: border-color .25s ease;
        }
        .ct-input:focus, .ct-ta:focus { border-bottom-color: var(--accent); }
        .ct-input::placeholder, .ct-ta::placeholder { color: var(--text-muted); opacity: .75; }
        .ct-ta {
          resize: vertical;
          min-height: 118px;
          line-height: 1.6;
          padding-top: .6rem;
        }
        .ct-char {
          position: absolute;
          bottom: .55rem; right: 0;
          font-size: .62rem;
          color: var(--text-muted);
          pointer-events: none;
          font-variant-numeric: tabular-nums;
        }

        /* ── Envío: la única pieza dorada maciza de la sección ── */
        .ct-row {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-top: clamp(.6rem, 2vh, 1.2rem);
        }
        .ct-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: .55rem;
          padding: .78rem 1.6rem;
          border: 0;
          border-radius: 100px;
          background: var(--accent);
          color: var(--on-accent);
          font-family: inherit;
          font-size: .86rem;
          font-weight: 800;
          letter-spacing: .02em;
          cursor: pointer;
          transition: transform .25s ease, filter .25s ease;
        }
        .ct-btn:hover { transform: translateY(-2px); filter: brightness(1.06); }
        .ct-btn:disabled { opacity: .65; cursor: not-allowed; transform: none; }

        .ct-hint {
          margin: 0 0 0 auto;
          font-size: .68rem;
          line-height: 1.5;
          color: var(--text-muted);
          text-align: right;
        }

        .ct-spinner {
          width: 14px; height: 14px;
          border-radius: 50%;
          border: 2px solid rgba(31,31,30,.25);
          border-top-color: var(--on-accent);
          animation: ctSpin .7s linear infinite;
          flex-shrink: 0;
        }
        @keyframes ctSpin { to { transform: rotate(360deg); } }

        .ct-error {
          margin: .8rem 0 0;
          font-size: .74rem;
          color: #d9534f;
        }

        /* ── Éxito: cubre la columna del formulario ── */
        .ct-success {
          position: absolute;
          inset: 0;
          background: var(--background);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          z-index: 5;
          animation: ctFade .4s ease both;
        }
        @keyframes ctFade {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .ct-sring {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 72px; height: 72px;
          border-radius: 50%;
          border: 1px solid var(--accent);
          color: var(--accent);
          margin-bottom: 1.2rem;
          animation: ctRing .5s .08s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        @keyframes ctRing {
          from { transform: scale(.9); opacity: 0; }
          to   { transform: scale(1); opacity: 1; }
        }
        .ct-stitle {
          font-family: var(--font-display);
          font-size: clamp(1.2rem, 1.8vw, 1.6rem);
          font-weight: 800;
          color: var(--text);
          margin: 0 0 .35rem;
        }
        .ct-ssub {
          margin: 0;
          font-size: .78rem;
          letter-spacing: .06em;
          color: var(--text-muted);
        }

        /* ── Tableta y teléfono: una columna, el filete se acuesta ── */
        @media (max-width: 860px) {
          .ct-grid { grid-template-columns: minmax(0, 1fr); }
          .ct-col--left {
            border-right: 0;
            border-bottom: 1px solid var(--border);
            padding-right: 0;
          }
          .ct-col--right { padding-left: 0; }
        }

        @media (max-width: 560px) {
          .ct { padding-inline: 1rem; }
          .ct-method { gap: .65rem; padding-block: .9rem; }
          .ct-msub { font-size: .7rem; }
          .ct-row { flex-direction: column; align-items: stretch; gap: .7rem; }
          .ct-btn { width: 100%; }
          .ct-hint { text-align: center; margin-left: 0; }
        }

        @media (prefers-reduced-motion: reduce) {
          .ct-head, .ct-grid, .ct-method, .ct-mi, .ct-marrow, .ct-btn,
          .ct-input, .ct-ta { transition: none; }
          .ct-head, .ct-grid { opacity: 1; transform: none; }
          .ct-dot, .ct-sring, .ct-success, .ct-spinner { animation: none; }
        }
      `}</style>
    </>
  );
}
