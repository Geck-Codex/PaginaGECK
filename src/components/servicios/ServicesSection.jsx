import { useState, useEffect, useCallback, useMemo } from 'react';

const categories = [
  { id: 0, name: "Desarrollo", icon: "💻", description: "Construimos tu presencia digital" },
  { id: 1, name: "Marketing & Diseño", icon: "🎨", description: "Te hacemos brillar" },
  { id: 2, name: "Inversión", icon: "💰", description: "Únete a nuestros proyectos" }
];

const services = {
  0: [
    { id: 0, slug: "web", name: "Desarrollo Web", tagline: "Tu Negocio en Internet, Pero Bien Hecho", description: "Creamos sitios web que venden mientras duermes. Con tecnologías modernas (React, Next.js) construimos páginas rápidas, optimizadas para Google y que funcionan perfecto en cualquier dispositivo.", features: ["Responsive design para móvil, tablet y desktop", "Optimización SEO para aparecer en Google", "Velocidad de carga ultrarrápida (Core Web Vitals)", "Integración con Google Analytics y CRM"], image: "/images/web-dev.jpg", size: "large" },
    { id: 1, slug: "mobile", name: "Apps Móviles", tagline: "Apps que la Gente Usa Todos los Días", description: "Desarrollamos apps para iPhone y Android que tus clientes van a querer usar. Ya sea nativa (Swift/Kotlin) o híbrida (React Native), creamos experiencias móviles rápidas.", features: ["Desarrollo nativo iOS/Android o híbrido", "Notificaciones push para mantener engagement", "Diseño intuitivo siguiendo guidelines", "Te ayudamos a publicarla en Stores"], image: "/images/mobile-dev.jpg", size: "large" },
    { id: 2, slug: "ia", name: "Inteligencia Artificial", tagline: "IA que Trabaja Por Ti", description: "Implementamos IA real que resuelve problemas de verdad. Chatbots que atienden clientes como humanos, sistemas que predicen ventas y herramientas inteligentes.", features: ["Chatbots con ChatGPT/Claude", "Predicción de demanda y forecasting", "OCR y procesamiento automático", "Integración con OpenAI o modelos propios"], image: "/images/ai.jpg", size: "large" },
    { id: 3, slug: "ecommerce", name: "E-commerce", tagline: "Tienda Online que Vende de Verdad", description: "Montamos tu tienda online completa con Shopify, WooCommerce o custom. Carrito, pagos con tarjeta, envíos, inventario - todo integrado.", features: ["Catálogo con filtros y búsqueda", "Pagos (Stripe, MercadoPago, PayPal)", "Integración con envíos y tracking", "Panel de administración"], image: "/images/ecommerce.jpg", size: "medium" },
    { id: 4, slug: "saas", name: "SaaS & Plataformas", tagline: "Plataformas que Cobran Solas", description: "Creamos plataformas tipo Netflix o Spotify: tus clientes pagan mensual, el sistema cobra automático y tú ves crecer los ingresos.", features: ["Suscripciones recurrentes automáticas", "Multi-tenant: miles de usuarios", "Dashboard con métricas en tiempo real", "API REST para integraciones"], image: "/images/saas.jpg", size: "medium" },
    { id: 5, slug: "automatizacion", name: "Automatización", tagline: "Deja que el Software Haga el Trabajo", description: "Automatizamos procesos que te quitan horas. Conectamos tus sistemas para que trabajen solos. Menos trabajo manual = menos errores.", features: ["Workflows (Zapier, Make o n8n)", "Integración entre sistemas (APIs)", "Bots de tareas repetitivas (RPA)", "Ahorro de tiempo real"], image: "/images/automation.jpg", size: "small" },
    { id: 6, slug: "custom", name: "Software a Medida", tagline: "Software Hecho Para Tu Negocio", description: "Desarrollamos sistemas empresariales personalizados 100% a tu medida. ERP, CRM, gestión de inventario, facturación - lo que necesites.", features: ["Análisis de procesos y necesidades", "Desarrollo custom desde cero", "Dashboards y reportes con KPIs", "Mantenimiento y soporte continuo"], image: "/images/custom.jpg", size: "small" }
  ],
  1: [
    { id: 7, slug: "diseno", name: "Diseño UI/UX", tagline: "Diseño que Vende y Enamora", description: "Diseñamos interfaces que la gente entiende al instante y quiere usar. Combinamos diseño bonito con usabilidad real.", features: ["Research y testing con usuarios", "Diseño system escalable", "Prototipos interactivos", "Implementación pixel-perfect"], image: "/images/design.jpg", size: "large" },
    { id: 8, slug: "redes-sociales", name: "Social Media", tagline: "Redes Sociales que Generan Negocio", description: "Gestionamos tus redes con estrategia. Creamos contenido que tu audiencia quiere ver y compartir.", features: ["Estrategia de contenido", "Calendario editorial y producción", "Community management", "Reportes mensuales de métricas"], image: "/images/social-media.jpg", size: "large" }
  ],
  2: [
    { id: 9, slug: "inversion", name: "Venture Studio", tagline: "Invierte en Productos Tech Reales", description: "Creamos nuestros propios productos digitales y buscamos inversionistas inteligentes para escalarlos. Productos con tracción real.", features: ["Usuarios reales y validación", "Modelos de negocio probados", "Proyecciones financieras claras", "Reportes de crecimiento"], image: "/images/ventures.jpg", size: "featured" }
  ]
};

export default function ImprovedServices() {
  const [activeCategory, setActiveCategory] = useState(0);
  const [expandedServiceId, setExpandedServiceId] = useState(null);
  const [isClosing, setIsClosing] = useState(false);

  const expandedServiceData = useMemo(() => {
    if (expandedServiceId === null) return null;
    return Object.values(services).flat().find(s => s.id === expandedServiceId);
  }, [expandedServiceId]);

  const closeExpanded = useCallback(() => {
    setIsClosing(true);
    // Esperar a que termine la animación de salida antes de cerrar
    setTimeout(() => {
      setExpandedServiceId(null);
      setIsClosing(false);
      window.history.pushState(null, '', window.location.pathname);
      document.body.style.overflow = 'unset';
    }, 800); // Duración de la animación de salida
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => { if (e.key === 'Escape') closeExpanded(); };
    if (expandedServiceId !== null) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [expandedServiceId, closeExpanded]);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash) {
        let foundService = null;
        let foundCategory = 0;
        for (const catId in services) {
          const service = services[catId].find(s => s.slug === hash);
          if (service) { foundService = service; foundCategory = parseInt(catId); break; }
        }
        if (foundService) { setActiveCategory(foundCategory); setExpandedServiceId(foundService.id); }
      }
    };
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleCardClick = (service) => {
    setExpandedServiceId(service.id);
    window.history.pushState(null, '', `#${service.slug}`);
  };

  const getGridClass = (size) => {
    const sizes = { large: 'service-card--large', medium: 'service-card--medium', small: 'service-card--small', featured: 'service-card--featured' };
    return sizes[size] || 'service-card--medium';
  };

  return (
    <>
      <section className="improved-services">
        <div className="improved-services__hero">
          <span className="improved-services__pretitle">Nuestros Servicios</span>
          <h1 className="improved-services__title">Lo Que Hacemos por Tu Negocio</h1>
          <p className="improved-services__subtitle">Sin tecnicismos raros. Solo soluciones que funcionan.</p>
        </div>

        <div className="improved-services__categories">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => { setActiveCategory(category.id); setExpandedServiceId(null); window.history.pushState(null, '', window.location.pathname); }}
              className={`category-card ${activeCategory === category.id ? 'active' : ''}`}
              aria-pressed={activeCategory === category.id}
            >
              <span className="category-card__icon" role="img" aria-hidden="true">{category.icon}</span>
              <div className="category-card__content">
                <h3 className="category-card__name">{category.name}</h3>
                <p className="category-card__description">{category.description}</p>
              </div>
            </button>
          ))}
        </div>

        <div className="improved-services__grid" key={activeCategory}>
          {services[activeCategory].map((service, index) => (
            <div
              key={service.id}
              className={`service-card ${getGridClass(service.size)} ${expandedServiceId !== null && expandedServiceId !== service.id ? 'dimmed' : ''}`}
              onClick={() => handleCardClick(service)}
              style={{ animationDelay: `${index * 0.08}s` }}
            >
              <div className="service-card__bg">
                <img src={service.image} alt="" className="service-card__image" loading="lazy" />
                <div className="service-card__overlay"></div>
              </div>
              <div className="service-card__content">
                <div className="service-card__header">
                  <h3 className="service-card__name">{service.name}</h3>
                  <p className="service-card__tagline">{service.tagline}</p>
                </div>
                <div className="service-card__hint">
                  <span>+</span>
                  <span>Ver detalles</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {expandedServiceData && (
          <div className={`modal-container ${isClosing ? 'closing' : ''}`}>
            <div className="modal-overlay" onClick={closeExpanded} />
            <div className="service-modal" role="dialog" aria-modal="true">
              <button className="service-modal__close" onClick={closeExpanded} aria-label="Cerrar modal">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
              <div className="service-modal__hero">
                <img src={expandedServiceData.image} alt={expandedServiceData.name} />
                <div className="service-modal__hero-overlay"></div>
                <div className="service-modal__hero-content">
                  <h2>{expandedServiceData.name}</h2>
                  <p>{expandedServiceData.tagline}</p>
                </div>
              </div>
              <div className="service-modal__body">
                <div className="service-modal__description">
                  <p>{expandedServiceData.description}</p>
                </div>
                <div className="service-modal__features">
                  <h3 className="service-modal__features-title">¿Qué Incluye?</h3>
                  <div className="service-modal__features-grid">
                    {expandedServiceData.features.map((feature, index) => (
                      <div key={index} className="feature-card" style={{ animationDelay: `${0.8 + (index * 0.2)}s` }}>
                        <div className="feature-card__icon">
                          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M16.6 4L7.5 13.1L3.4 9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="service-modal__cta-wrapper">
                  <a href="/contacto" className="service-modal__cta">
                    <span>{expandedServiceData.id === 9 ? "Quiero Invertir" : "Hablemos de Tu Proyecto"}</span>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M4 10H16M16 10L10 4M16 10L10 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      <style jsx>{`
        /* ─── VARIABLES ──────────────────────────────────────── */
        :root {
          --carbon:      #222220;
          --carbon-dark: #1a1a18;
          --navy:        #030C1D;
          --navy-mid:    rgba(3, 12, 29, 0.6);
          --navy-soft:   rgba(3, 12, 29, 0.35);
          --gold-deep:   #584A1C;
          --gold:        #D4AF37;
          --gold-light:  #F4E4BC;
          --gold-glow:   rgba(212, 175, 55, 0.15);
          --gold-border: rgba(88, 74, 28, 0.35);
        }

        /* ─── SECCIÓN ────────────────────────────────────────── */
        .improved-services {
          background: var(--carbon);
          min-height: 100vh;
          padding: 4rem 2rem 6rem;
          color: white;
          font-family: 'Inter', -apple-system, sans-serif;
          position: relative;
        }

        .improved-services::before {
          content: '';
          position: fixed;
          inset: 0;
          background:
            radial-gradient(ellipse 80% 50% at 50% 0%, rgba(3, 12, 29, 0.5) 0%, transparent 70%),
            radial-gradient(ellipse 50% 40% at 100% 100%, rgba(3, 12, 29, 0.3) 0%, transparent 60%);
          pointer-events: none;
          z-index: 0;
        }

        .improved-services > * { position: relative; z-index: 1; }

        /* ─── HERO ───────────────────────────────────────────── */
        .improved-services__hero {
          text-align: center; max-width: 900px; margin: 0 auto 5rem;
        }
        .improved-services__pretitle {
          display: inline-block; font-size: 0.8rem; font-weight: 600;
          letter-spacing: 0.3em; text-transform: uppercase;
          color: var(--gold);
          padding: 0.45rem 1.4rem;
          border: 1px solid var(--gold-border);
          border-radius: 50px;
          background: rgba(88, 74, 28, 0.1);
          margin-bottom: 1.5rem;
          animation: badgePulse 3s ease-in-out infinite;
        }

        @keyframes badgePulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(88, 74, 28, 0.4); }
          50% { box-shadow: 0 0 0 8px rgba(88, 74, 28, 0); }
        }

        .improved-services__title {
          font-size: clamp(2.5rem, 5vw, 3.5rem); font-weight: 900; line-height: 1.1;
          background: linear-gradient(135deg, var(--gold-light) 0%, var(--gold) 50%, var(--gold-deep) 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          margin-bottom: 1.5rem;
        }
        .improved-services__subtitle {
          font-size: 1.2rem; color: rgba(244, 228, 188, 0.6);
        }

        /* ─── CATEGORÍAS ─────────────────────────────────────── */
        .improved-services__categories {
          max-width: 1200px; margin: 0 auto 4rem;
          display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem;
        }

        .category-card {
          position: relative; padding: 2rem;
          background: var(--carbon-dark);
          border: 1px solid var(--navy-mid);
          border-radius: 20px; cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex; flex-direction: column; gap: 0.5rem;
          text-align: left; color: inherit;
        }

        .category-card::before {
          content: '';
          position: absolute; left: 0; top: 20%; bottom: 20%;
          width: 2px; border-radius: 2px;
          background: var(--gold-border);
          transition: all 0.3s ease;
        }

        .category-card:hover {
          transform: translateY(-8px) scale(1.01);
          border-color: var(--gold-border);
          box-shadow: 
            0 20px 40px rgba(3, 12, 29, 0.4),
            0 0 20px rgba(88, 74, 28, 0.15);
        }

        .category-card.active {
          background: var(--navy);
          border-color: var(--gold-deep);
          transform: translateY(-5px);
          box-shadow: 0 12px 35px rgba(3, 12, 29, 0.6), 0 0 0 1px var(--gold-border);
        }

        .category-card.active::before {
          background: var(--gold);
          top: 10%; bottom: 10%;
        }

        .category-card__icon { 
          font-size: 2.5rem; margin-bottom: 0.5rem;
          transition: transform 0.3s ease;
        }

        .category-card:hover .category-card__icon {
          animation: iconBounce 0.6s ease;
        }

        @keyframes iconBounce {
          0%, 100% { transform: translateY(0); }
          30% { transform: translateY(-8px); }
          50% { transform: translateY(-4px); }
          70% { transform: translateY(-6px); }
        }

        .category-card__name  { font-size: 1.2rem; font-weight: 700; color: var(--gold-light); margin: 0; }
        .category-card__description { font-size: 0.875rem; color: rgba(244, 228, 188, 0.5); margin: 0; line-height: 1.5; }

        .category-card:focus-visible {
          outline: 2px solid var(--gold);
          outline-offset: 4px;
        }

        /* ─── GRID SERVICIOS ─────────────────────────────────── */
        .improved-services__grid {
          max-width: 1200px; margin: 0 auto;
          display: grid; grid-template-columns: repeat(12, 1fr);
          gap: 1.5rem; grid-auto-rows: 280px;
        }

        .service-card {
          position: relative; border-radius: 24px; overflow: hidden;
          cursor: pointer; 
          border: 1px solid rgba(3, 12, 29, 0.8);
          background: var(--navy);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          animation: cardFadeIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) backwards;
        }

        @keyframes cardFadeIn {
          from {
            opacity: 0;
            transform: scale(0.92) translateY(30px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        .service-card--large    { grid-column: span 6; grid-row: span 2; }
        .service-card--medium   { grid-column: span 4; grid-row: span 1; }
        .service-card--small    { grid-column: span 4; grid-row: span 1; }
        .service-card--featured { grid-column: span 12; grid-row: span 2; }
        .service-card.dimmed    { opacity: 0.35; filter: blur(2px); transform: scale(0.98); }

        .service-card::after {
          content: '';
          position: absolute;
          inset: 0;
          border: 2px solid var(--gold);
          border-radius: 24px;
          opacity: 0;
          transform: scale(0.95);
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          pointer-events: none;
        }

        .service-card:hover {
          border-color: var(--gold-deep);
          box-shadow: 0 16px 48px rgba(3, 12, 29, 0.7), 0 0 0 1px var(--gold-border);
          transform: translateY(-4px);
        }

        .service-card:hover::after {
          opacity: 1;
          transform: scale(1);
        }

        .service-card:focus-visible {
          outline: 2px solid var(--gold);
          outline-offset: 4px;
        }

        .service-card__bg { position: absolute; inset: 0; }
        .service-card__image { 
          width: 100%; height: 100%; object-fit: cover; 
          transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .service-card:hover .service-card__image { transform: scale(1.08); }

        .service-card__overlay {
          position: absolute; inset: 0;
          background: linear-gradient(
            to bottom,
            rgba(3, 12, 29, 0.25) 0%,
            rgba(3, 12, 29, 0.75) 55%,
            rgba(3, 12, 29, 0.97) 100%
          );
        }

        .service-card__content {
          position: relative; padding: 2rem; height: 100%;
          display: flex; flex-direction: column; justify-content: flex-end; z-index: 2;
        }

        .service-card__name { 
          font-size: 1.45rem; font-weight: 700; color: var(--gold-light); margin: 0;
          transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .service-card:hover .service-card__name {
          transform: translateX(-4px);
        }

        .service-card__tagline {
          font-size: 0.75rem; color: var(--gold);
          text-transform: uppercase; letter-spacing: 0.08em; margin-top: 0.4rem;
        }

        .service-card__hint {
          display: flex; align-items: center; gap: 0.5rem;
          margin-top: 1rem; font-size: 0.85rem;
          color: var(--gold-light); opacity: 0;
          transform: translateY(15px);
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .service-card:hover .service-card__hint { 
          opacity: 1; 
          transform: translateY(0); 
        }

        /* ─── MODAL (ANIMACIONES CINEMATOGRÁFICAS) ──────────── */
        .modal-container {
          position: fixed; inset: 0; z-index: 2000;
          display: flex; align-items: center; justify-content: center; padding: 1.5rem;
        }

        /* ANIMACIÓN DE ENTRADA: Backdrop blur progresivo */
        .modal-overlay {
          position: absolute; inset: 0;
          background: rgba(26, 26, 24, 0);
          backdrop-filter: blur(0px);
          cursor: zoom-out;
          animation: overlayEnter 1.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes overlayEnter {
          0% {
            background: rgba(26, 26, 24, 0);
            backdrop-filter: blur(0px);
          }
          100% {
            background: rgba(26, 26, 24, 0.94);
            backdrop-filter: blur(16px);
          }
        }

        /* ANIMACIÓN DE SALIDA: Backdrop desvaneciéndose */
        .modal-container.closing .modal-overlay {
          animation: overlayExit 0.8s cubic-bezier(0.4, 0, 1, 1) forwards;
        }

        @keyframes overlayExit {
          0% {
            background: rgba(26, 26, 24, 0.94);
            backdrop-filter: blur(16px);
          }
          100% {
            background: rgba(26, 26, 24, 0);
            backdrop-filter: blur(0px);
          }
        }

        /* ANIMACIÓN DE ENTRADA: Modal desde abajo con fade */
        .service-modal {
          position: relative; width: 100%; max-width: 850px;
          background: var(--navy);
          border-radius: 28px; z-index: 2001;
          border: 1px solid var(--gold-border);
          max-height: 90vh; overflow-y: auto;
          box-shadow:
            0 30px 60px rgba(0, 0, 0, 0.6),
            0 0 0 1px rgba(88, 74, 28, 0.2),
            inset 0 1px 0 rgba(212, 175, 55, 0.08);
          animation: modalEnter 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes modalEnter {
          0% { 
            opacity: 0; 
            transform: scale(0.92) translateY(60px); 
          }
          100% { 
            opacity: 1; 
            transform: scale(1) translateY(0); 
          }
        }

        /* ANIMACIÓN DE SALIDA: Modal hacia abajo con fade */
        .modal-container.closing .service-modal {
          animation: modalExit 0.8s cubic-bezier(0.4, 0, 1, 1) forwards;
        }

        @keyframes modalExit {
          0% { 
            opacity: 1; 
            transform: scale(1) translateY(0); 
          }
          100% { 
            opacity: 0; 
            transform: scale(0.95) translateY(40px); 
          }
        }

        /* Close button */
        .service-modal__close {
          position: absolute; top: 1.5rem; right: 1.5rem;
          background: rgba(34, 34, 32, 0.7);
          border: 1px solid var(--gold-border);
          color: var(--gold); border-radius: 50%;
          width: 40px; height: 40px;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; z-index: 10; 
          transition: all 0.3s ease;
          animation: fadeInDelayed 0.8s ease 1.2s backwards;
        }

        .service-modal__close:hover {
          background: var(--gold-deep);
          color: var(--gold-light);
          border-color: var(--gold);
        }

        .service-modal__close:hover svg {
          transform: rotate(90deg);
          transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .service-modal__close:focus-visible {
          outline: 2px solid var(--gold);
          outline-offset: 4px;
        }

        /* ANIMACIÓN DE SALIDA: Close button desaparece primero */
        .modal-container.closing .service-modal__close {
          animation: fadeOutFast 0.3s ease forwards;
        }

        @keyframes fadeOutFast {
          to { opacity: 0; }
        }

        /* Hero con entrada secuencial */
        .service-modal__hero { 
          height: 320px; position: relative; overflow: hidden;
        }

        .service-modal__hero img { 
          width: 100%; height: 100%; object-fit: cover;
          animation: imageReveal 1.6s cubic-bezier(0.16, 1, 0.3, 1) 0.3s backwards;
        }

        @keyframes imageReveal {
          0% { 
            opacity: 0;
            transform: scale(1.1);
          }
          100% { 
            opacity: 1;
            transform: scale(1);
          }
        }

        /* ANIMACIÓN DE SALIDA: Imagen se desvanece */
        .modal-container.closing .service-modal__hero img {
          animation: imageFadeOut 0.6s ease forwards;
        }

        @keyframes imageFadeOut {
          to { 
            opacity: 0;
            transform: scale(1.05);
          }
        }

        .service-modal__hero-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to top, var(--navy) 0%, rgba(3,12,29,0.6) 55%, transparent 100%);
        }

        .service-modal__hero-content {
          position: absolute; bottom: 2rem; left: 2.5rem; right: 2.5rem;
        }

        /* Título: slide desde izquierda MUY lento */
        .service-modal__hero-content h2 { 
          font-size: 2.5rem; color: var(--gold-light); margin: 0;
          animation: slideInLeftDeep 1.4s cubic-bezier(0.16, 1, 0.3, 1) 0.6s backwards;
        }

        /* Tagline: slide después del título */
        .service-modal__hero-content p { 
          color: var(--gold); font-size: 0.85rem; 
          letter-spacing: 0.1em; text-transform: uppercase; margin-top: 0.5rem;
          animation: slideInLeftDeep 1.4s cubic-bezier(0.16, 1, 0.3, 1) 0.8s backwards;
        }

        @keyframes slideInLeftDeep {
          0% { 
            opacity: 0; 
            transform: translateX(-50px);
          }
          100% { 
            opacity: 1; 
            transform: translateX(0);
          }
        }

        /* ANIMACIÓN DE SALIDA: Contenido hero sale rápido */
        .modal-container.closing .service-modal__hero-content h2,
        .modal-container.closing .service-modal__hero-content p {
          animation: slideOutLeft 0.5s ease forwards;
        }

        @keyframes slideOutLeft {
          to { 
            opacity: 0;
            transform: translateX(-30px);
          }
        }

        .service-modal__body { padding: 2.5rem; }

        /* Descripción: fade desde abajo */
        .service-modal__description {
          font-size: 1.1rem; color: rgba(244, 228, 188, 0.75);
          line-height: 1.7; margin-bottom: 2.5rem;
          animation: fadeInUp 1.4s cubic-bezier(0.16, 1, 0.3, 1) 1s backwards;
        }

        @keyframes fadeInUp {
          0% { 
            opacity: 0; 
            transform: translateY(30px);
          }
          100% { 
            opacity: 1; 
            transform: translateY(0);
          }
        }

        /* ANIMACIÓN DE SALIDA: Descripción se desvanece */
        .modal-container.closing .service-modal__description {
          animation: fadeOutDown 0.5s ease forwards;
        }

        @keyframes fadeOutDown {
          to { 
            opacity: 0;
            transform: translateY(20px);
          }
        }

        .service-modal__features-title {
          color: var(--gold); font-size: 0.8rem; font-weight: 700;
          letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 1.5rem;
          animation: fadeInDelayed 1.2s ease 1.2s backwards;
        }

        @keyframes fadeInDelayed {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }

        /* ANIMACIÓN DE SALIDA: Features title */
        .modal-container.closing .service-modal__features-title {
          animation: fadeOutFast 0.3s ease forwards;
        }

        .service-modal__features-grid {
          display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1rem;
        }

        /* Feature cards: entrada SUPER LENTA en cascada */
        .feature-card {
          display: flex; align-items: center; gap: 1rem;
          background: rgba(34, 34, 32, 0.5);
          border: 1px solid var(--gold-border);
          padding: 1.2rem; border-radius: 14px;
          animation: featureSlideInDeep 1.3s cubic-bezier(0.16, 1, 0.3, 1) backwards;
          transition: all 0.3s ease;
        }

        @keyframes featureSlideInDeep {
          0% {
            opacity: 0;
            transform: translateX(-40px) translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateX(0) translateY(0);
          }
        }

        /* ANIMACIÓN DE SALIDA: Feature cards salen rápido */
        .modal-container.closing .feature-card {
          animation: featureSlideOut 0.4s ease forwards;
        }

        @keyframes featureSlideOut {
          to {
            opacity: 0;
            transform: translateX(-20px);
          }
        }

        .feature-card:hover {
          background: rgba(34, 34, 32, 0.8);
          border-color: var(--gold-deep);
          transform: translateX(8px) scale(1.02);
          box-shadow: -4px 0 12px rgba(212, 175, 55, 0.2);
        }

        .feature-card__icon { 
          color: var(--gold); flex-shrink: 0;
        }

        /* Checkmark dibujado LENTÍSIMO */
        .feature-card__icon svg path {
          stroke-dasharray: 50;
          stroke-dashoffset: 50;
          animation: drawCheckSuperSlow 2s ease forwards;
          animation-delay: inherit;
        }

        @keyframes drawCheckSuperSlow {
          to { stroke-dashoffset: 0; }
        }

        .feature-card span { 
          color: rgba(244, 228, 188, 0.85); 
          font-size: 0.9rem; 
        }

        /* CTA: entrada al final de todo */
        .service-modal__cta-wrapper { 
          margin-top: 2.5rem;
          animation: fadeInUp 1.2s cubic-bezier(0.16, 1, 0.3, 1) 1.6s backwards;
        }

        /* ANIMACIÓN DE SALIDA: CTA desaparece */
        .modal-container.closing .service-modal__cta-wrapper {
          animation: fadeOutDown 0.4s ease forwards;
        }

        .service-modal__cta {
          display: flex; align-items: center; justify-content: center; gap: 0.75rem;
          background: linear-gradient(135deg, var(--gold-deep) 0%, var(--gold) 100%);
          color: var(--carbon);
          padding: 1.1rem 2rem; border-radius: 50px;
          font-weight: 800; font-size: 0.95rem;
          text-decoration: none;
          transition: all 0.4s ease;
          box-shadow: 0 4px 20px rgba(88, 74, 28, 0.4);
          position: relative;
          overflow: hidden;
        }

        .service-modal__cta::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%);
          transform: scale(0);
          transition: transform 0.6s ease;
        }

        .service-modal__cta:active::before {
          transform: scale(2);
        }

        .service-modal__cta::after {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 50%;
          height: 100%;
          background: linear-gradient(90deg, 
            transparent, 
            rgba(255,255,255,0.3), 
            transparent
          );
          transition: left 0.8s ease;
        }

        .service-modal__cta:hover::after {
          left: 100%;
        }

        .service-modal__cta:hover {
          transform: scale(1.02);
          box-shadow: 0 8px 30px rgba(212, 175, 55, 0.35);
          background: linear-gradient(135deg, var(--gold) 0%, var(--gold-light) 100%);
        }

        .service-modal__cta svg {
          transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .service-modal__cta:hover svg {
          transform: translateX(4px);
        }

        /* ─── RESPONSIVE ─────────────────────────────────────── */
        @media (max-width: 900px) {
          .service-card--large,
          .service-card--medium,
          .service-card--small { grid-column: span 12; grid-row: span 1; }
          .improved-services__title { font-size: 2.5rem; }
          .service-modal__hero { height: 200px; }
          .service-modal__hero-content h2 { font-size: 1.8rem; }
        }

        .service-modal {
          scroll-behavior: smooth;
        }
      `}</style>
    </>
  );
}