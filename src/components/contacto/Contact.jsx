// src/components/contacto/Contact.jsx
import { useState } from 'react';
import { Send, User, Mail, MessageSquare, Calendar, Linkedin } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [focusedField, setFocusedField] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  // Configuración
  const contactConfig = {
    whatsapp: '+34600000000',
    calendly: 'https://calendly.com/tuempresa/30min',
    email: 'contacto@tuempresa.com',
    linkedin: 'https://linkedin.com/company/tuempresa',
    slackWebhook: 'https://hooks.slack.com/services/YOUR/WEBHOOK/URL',
  };

  const handleWhatsAppContact = () => {
    const message = formData.name 
      ? `Hola! Soy ${formData.name}. Quiero hablar sobre mi proyecto.`
      : 'Hola! Quiero hablar sobre un proyecto.';
    
    const whatsappUrl = `https://wa.me/${contactConfig.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleScheduleCall = () => {
    window.open(contactConfig.calendly, '_blank');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // 1. Envío a Slack (opcional)
      if (contactConfig.slackWebhook) {
        await fetch(contactConfig.slackWebhook, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: `🚀 Nuevo Lead!`,
            blocks: [
              {
                type: 'section',
                text: {
                  type: 'mrkdwn',
                  text: `*Nuevo contacto desde la web*\n*Nombre:* ${formData.name}\n*Email:* ${formData.email}\n*Mensaje:* ${formData.message}`
                }
              }
            ]
          })
        });
      }

      // 2. Envío a tu propia API interna
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          timestamp: new Date().toISOString(),
          source: 'website_form'
        })
      });

      setSubmitted(true);

      // Reset del formulario después de 4 segundos
      setTimeout(() => {
        setFormData({ name: '', email: '', message: '' });
        setSubmitted(false);
      }, 4000);

    } catch (error) {
      console.error('Error al enviar:', error);
      alert('Hubo un error. Por favor, contáctanos por WhatsApp.');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <>
      <div style={{
        minHeight: '100vh',
        backgroundColor: 'transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '80px 24px',
        overflow: 'visible',
        position: 'relative'
      }}>
        <div style={{ 
          position: 'relative', 
          zIndex: 10, 
          width: '100%', 
          maxWidth: '900px' 
        }}>
          {submitted ? (
            <div className="fade-in" style={{
              textAlign: 'center',
              padding: '100px 40px',
              backdropFilter: 'blur(24px)',
              backgroundColor: 'rgba(12, 30, 60, 0.4)',
              borderRadius: '24px',
              border: '1px solid rgba(212, 175, 55, 0.2)'
            }}>
              <div className="bounce" style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #D4AF37, #B8941F)',
                marginBottom: '32px',
                boxShadow: '0 20px 60px rgba(212, 175, 55, 0.4)'
              }}>
                <svg style={{ width: '60px', height: '60px', color: '#0B1D33' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 style={{ color: 'white', fontSize: '3rem', fontWeight: 800, marginBottom: '16px' }}>¡Mensaje Recibido!</h3>
              <p style={{ color: 'rgba(248, 249, 250, 0.7)', fontSize: '1.25rem', margin: 0 }}>Te responderemos lo antes posible</p>
            </div>
          ) : (
            <>
              {/* HERO SECTION */}
              <div style={{ textAlign: 'center', marginBottom: '64px' }}>
                <h1 className="hero-title" style={{
                  fontSize: '3.5rem',
                  fontWeight: 900,
                  background: 'linear-gradient(135deg, #F4E4BC 0%, #D4AF37 50%, #B8941F 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  lineHeight: 1.2,
                  marginBottom: '24px'
                }}>
                  Hablemos de tu Proyecto
                </h1>
                <p style={{
                  color: 'rgba(248, 249, 250, 0.8)',
                  fontSize: '1.25rem',
                  maxWidth: '600px',
                  margin: '0 auto 56px'
                }}>
                  Respuesta rápida garantizada • 100% confidencial
                </p>

                <button onClick={handleWhatsAppContact} className="primary-whatsapp" style={{
                    width: '100%',
                    maxWidth: '500px',
                    padding: '32px 40px',
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: 'white',
                    borderRadius: '18px',
                    fontWeight: 800,
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '20px',
                    fontSize: '1.5rem',
                    transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    boxShadow: '0 20px 50px rgba(5, 150, 105, 0.4)',
                    margin: '0 auto 32px',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                  <svg style={{ width: '36px', height: '36px', position: 'relative', zIndex: 1 }} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                  <span style={{ position: 'relative', zIndex: 1 }}>Chatea por WhatsApp</span>
                </button>

                <div className="secondary-buttons" style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '16px',
                  maxWidth: '500px',
                  margin: '0 auto'
                }}>
                  <button onClick={handleScheduleCall} className="secondary-btn" style={{
                      padding: '20px 24px',
                      backgroundColor: 'rgba(12, 30, 60, 0.6)',
                      backdropFilter: 'blur(10px)',
                      border: '2px solid rgba(212, 175, 55, 0.3)',
                      color: 'white',
                      borderRadius: '14px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '12px',
                      fontSize: '1rem',
                      transition: 'all 0.3s ease'
                    }}>
                    <Calendar style={{ width: '22px', height: '22px', color: '#D4AF37' }} />
                    <span>Agenda</span>
                  </button>

                  <a href={contactConfig.linkedin} target="_blank" rel="noopener noreferrer" className="secondary-btn" style={{
                      padding: '20px 24px',
                      backgroundColor: 'rgba(12, 30, 60, 0.6)',
                      backdropFilter: 'blur(10px)',
                      border: '2px solid rgba(27, 54, 93, 0.4)',
                      color: 'white',
                      borderRadius: '14px',
                      fontWeight: 600,
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '12px',
                      fontSize: '1rem',
                      transition: 'all 0.3s ease'
                    }}>
                    <Linkedin style={{ width: '22px', height: '22px', color: '#0A66C2' }} />
                    <span>LinkedIn</span>
                  </a>
                </div>
              </div>

              {/* DIVIDER */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '56px', opacity: 0.6 }}>
                <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.3), transparent)' }}></div>
                <span style={{ color: 'rgba(248, 249, 250, 0.6)', fontSize: '0.875rem', fontWeight: 600, letterSpacing: '0.1em' }}>¿PREFIERES ESCRIBIRNOS?</span>
                <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.3), transparent)' }}></div>
              </div>

              {/* FORMULARIO */}
              <div className="form-container" style={{
                backgroundColor: 'rgba(27, 54, 93, 0.25)',
                backdropFilter: 'blur(20px)',
                borderRadius: '24px',
                padding: '48px 40px',
                border: '1px solid rgba(212, 175, 55, 0.2)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
              }}>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <div style={{ position: 'relative' }}>
                    <User style={{
                      position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)',
                      width: '22px', height: '22px',
                      color: focusedField === 'name' ? '#D4AF37' : 'rgba(212, 175, 55, 0.5)',
                      pointerEvents: 'none', transition: 'color 0.3s ease'
                    }} />
                    <input
                      type="text" name="name" value={formData.name} onChange={handleChange}
                      onFocus={() => setFocusedField('name')} onBlur={() => setFocusedField(null)}
                      placeholder="Tu nombre" required
                      style={{
                        width: '100%', padding: '18px 16px 18px 52px',
                        backgroundColor: 'rgba(11, 31, 73, 0.4)', backdropFilter: 'blur(10px)',
                        border: `2px solid ${focusedField === 'name' ? '#D4AF37' : 'rgba(212, 175, 55, 0.2)'}`,
                        borderRadius: '12px', color: 'white', fontSize: '1rem', outline: 'none',
                        transition: 'all 0.3s ease'
                      }}
                    />
                  </div>

                  <div style={{ position: 'relative' }}>
                    <Mail style={{
                      position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)',
                      width: '22px', height: '22px',
                      color: focusedField === 'email' ? '#D4AF37' : 'rgba(212, 175, 55, 0.5)',
                      pointerEvents: 'none', transition: 'color 0.3s ease'
                    }} />
                    <input
                      type="email" name="email" value={formData.email} onChange={handleChange}
                      onFocus={() => setFocusedField('email')} onBlur={() => setFocusedField(null)}
                      placeholder="tu@email.com" required
                      style={{
                        width: '100%', padding: '18px 16px 18px 52px',
                        backgroundColor: 'rgba(11, 31, 73, 0.4)', backdropFilter: 'blur(10px)',
                        border: `2px solid ${focusedField === 'email' ? '#D4AF37' : 'rgba(212, 175, 55, 0.2)'}`,
                        borderRadius: '12px', color: 'white', fontSize: '1rem', outline: 'none',
                        transition: 'all 0.3s ease'
                      }}
                    />
                  </div>

                  <div style={{ position: 'relative' }}>
                    <MessageSquare style={{
                      position: 'absolute', left: '16px', top: '20px',
                      width: '22px', height: '22px',
                      color: focusedField === 'message' ? '#D4AF37' : 'rgba(212, 175, 55, 0.5)',
                      pointerEvents: 'none', transition: 'color 0.3s ease'
                    }} />
                    <textarea
                      name="message" value={formData.message} onChange={handleChange}
                      onFocus={() => setFocusedField('message')} onBlur={() => setFocusedField(null)}
                      placeholder="Describe tu proyecto..." required
                      style={{
                        width: '100%', minHeight: '160px', padding: '18px 16px 18px 52px',
                        backgroundColor: 'rgba(11, 31, 73, 0.4)', backdropFilter: 'blur(10px)',
                        border: `2px solid ${focusedField === 'message' ? '#D4AF37' : 'rgba(212, 175, 55, 0.2)'}`,
                        borderRadius: '12px', color: 'white', fontSize: '1rem', lineHeight: 1.6,
                        resize: 'vertical', outline: 'none', fontFamily: 'inherit',
                        transition: 'all 0.3s ease'
                      }}
                    />
                  </div>

                  <button type="submit" className="submit-btn" style={{
                      width: '100%', padding: '20px 32px',
                      backgroundColor: 'rgba(212, 175, 55, 0.15)', backdropFilter: 'blur(15px)',
                      border: '2px solid rgba(212, 175, 55, 0.5)', borderRadius: '12px',
                      color: '#F4E4BC', fontSize: '1.125rem', fontWeight: 700, cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
                      marginTop: '16px', transition: 'all 0.3s ease', boxShadow: '0 4px 20px rgba(212, 175, 55, 0.2)'
                    }}>
                    Enviar Mensaje
                    <Send style={{ width: '20px', height: '20px' }} />
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      </div>

      <style jsx>{`
        .primary-whatsapp:hover { 
          transform: translateY(-4px) scale(1.02); 
          box-shadow: 0 25px 60px rgba(5, 150, 105, 0.5); 
        }

        .secondary-btn:hover { 
          transform: translateY(-2px); 
          border-color: rgba(212, 175, 55, 0.6); 
        }

        .submit-btn:hover { 
          transform: translateY(-2px); 
          background-color: rgba(212, 175, 55, 0.25); 
          border-color: rgba(212, 175, 55, 0.8); 
        }

        .fade-in { 
          animation: fadeIn 0.5s ease-out; 
        }

        @keyframes fadeIn { 
          from { opacity: 0; transform: scale(0.95); } 
          to { opacity: 1; transform: scale(1); } 
        }

        .bounce { 
          animation: bounce 1s infinite; 
        }

        @keyframes bounce { 
          0%, 100% { transform: translateY(0); } 
          50% { transform: translateY(-10px); } 
        }

        input::placeholder, textarea::placeholder { 
          color: rgba(212, 175, 55, 0.4); 
        }

        @media (max-width: 767px) {
          .hero-title { font-size: 2.25rem !important; }
          .primary-whatsapp { font-size: 1.125rem !important; padding: 24px 32px !important; }
          .secondary-buttons { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}