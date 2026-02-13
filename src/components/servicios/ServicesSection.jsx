import { useState, useEffect, useRef } from 'react';

export default function ImprovedServices() {
  const [activeCategory, setActiveCategory] = useState(0);
  const [expandedService, setExpandedService] = useState(null);
  const expandedRef = useRef(null);

  const categories = [
    {
      id: 0,
      name: "Desarrollo",
      icon: "💻",
      description: "Construimos tu presencia digital"
    },
    {
      id: 1,
      name: "Marketing & Diseño",
      icon: "🎨",
      description: "Te hacemos brillar"
    },
    {
      id: 2,
      name: "Inversión",
      icon: "💰",
      description: "Únete a nuestros proyectos"
    }
  ];

  const services = {
    0: [ // Desarrollo
      {
        id: 0,
        slug: "web",
        name: "Desarrollo Web",
        tagline: "Tu Negocio en Internet, Pero Bien Hecho",
        description: "Tu sitio web es tu vendedor 24/7. Lo hacemos rápido, bonito y que funcione en cualquier dispositivo. Que la gente entre, se quede y compre.",
        features: [
          "Diseño moderno que impacta",
          "Funciona en celular, tablet y compu",
          "Carga rápido y no se traba",
          "Te lo entregamos listo para usar"
        ],
        image: "/images/web-dev.jpg",
        size: "large"
      },
      {
        id: 1,
        slug: "mobile",
        name: "Apps Móviles",
        tagline: "Una App que Tus Clientes Querrán Usar Todos los Días",
        description: "¿Necesitas una app para iPhone o Android? La creamos desde cero. Fácil de usar, rápida y que tus clientes no quieran borrar.",
        features: [
          "Para iPhone y Android",
          "Diseño intuitivo y bonito",
          "Notificaciones push",
          "Te ayudamos a subirla a las tiendas"
        ],
        image: "/images/mobile-dev.jpg",
        size: "large"
      },
      {
        id: 2,
        slug: "ecommerce",
        name: "Tiendas Online",
        tagline: "Vende 24/7 Sin Tener una Tienda Física",
        description: "Montamos tu tienda online completa: catálogo, carrito, pagos, envíos. Todo listo para que empieces a vender desde el día uno.",
        features: [
          "Catálogo de productos ilimitado",
          "Carrito de compras automático",
          "Acepta tarjetas y transferencias",
          "Panel para gestionar pedidos"
        ],
        image: "/images/ecommerce.jpg",
        size: "medium"
      },
      {
        id: 3,
        slug: "saas",
        name: "SaaS",
        tagline: "Como Netflix, Pero Para Tu Servicio",
        description: "Creamos plataformas donde cobras mensualmente. Tus clientes pagan, tu sistema cobra automático, y tú te enfocas en crecer.",
        features: [
          "Cobros automáticos cada mes",
          "Panel para ver todo lo que pasa",
          "Funciona con miles de usuarios",
          "Reportes claros de tus ventas"
        ],
        image: "/images/saas.jpg",
        size: "medium"
      },
      {
        id: 4,
        slug: "ia",
        name: "IA (Robots Inteligentes)",
        tagline: "Tecnología Que Piensa y Trabaja Por Ti",
        description: "Bots que atienden a tus clientes mientras duermes, herramientas que predicen ventas, sistemas que leen facturas. IA que hace dinero.",
        features: [
          "Chatbot que atiende 24/7",
          "Predicciones de ventas automáticas",
          "Lee y procesa documentos solito",
          "Se conecta con todo lo que usas"
        ],
        image: "/images/ai.jpg",
        size: "medium"
      },
      {
        id: 5,
        slug: "automatizacion",
        name: "Automatización",
        tagline: "Deja que la Tecnología Haga lo Aburrido",
        description: "¿Tareas repetitivas que te quitan horas? Las automatizamos. Facturas, reportes, envío de emails, lo que sea.",
        features: [
          "Automatiza tareas repetitivas",
          "Conecta diferentes sistemas",
          "Ahorra horas de trabajo manual",
          "Menos errores humanos"
        ],
        image: "/images/automation.jpg",
        size: "small"
      },
      {
        id: 6,
        slug: "custom",
        name: "Sistemas a Medida",
        tagline: "Software Hecho Exactamente Como Lo Necesitas",
        description: "Sistemas para gestionar tu inventario, clientes, pedidos, empleados. Lo que necesites, sin usar Excel.",
        features: [
          "100% personalizado a tu negocio",
          "Gestión completa de procesos",
          "Reportes automáticos",
          "Acceso desde cualquier lugar"
        ],
        image: "/images/custom.jpg",
        size: "small"
      }
    ],
    1: [ // Marketing & Diseño
      {
        id: 7,
        slug: "diseno",
        name: "Diseño UI/UX",
        tagline: "Que Se Vea Chingón y Sea Fácil de Usar",
        description: "No solo se trata de que se vea bonito. Diseñamos todo para que tus clientes encuentren lo que buscan sin perderse ni frustrarse.",
        features: [
          "Diseños modernos y atractivos",
          "Flujos fáciles de entender",
          "Probado con usuarios reales",
          "Tu marca bien representada"
        ],
        image: "/images/design.jpg",
        size: "large"
      },
      {
        id: 8,
        slug: "redes-sociales",
        name: "Redes Sociales",
        tagline: "Que Tu Marca Brille en Todas Partes",
        description: "Creamos contenido que la gente quiere ver, compartir y comentar. Gestionamos tus redes para que crezcas sin que te quites el sueño.",
        features: [
          "Contenido diseñado para tu marca",
          "Publicaciones programadas",
          "Respondemos comentarios y mensajes",
          "Análisis de resultados mensual"
        ],
        image: "/images/social-media.jpg",
        size: "large"
      }
    ],
    2: [ // Inversión
      {
        id: 9,
        slug: "inversion",
        name: "Proyectos Propios",
        tagline: "Invierte en Nuestras Startups",
        description: "Creamos nuestros propios productos tech y buscamos inversionistas inteligentes. Únete al siguiente Airbnb, Uber o Spotify antes que despegue.",
        features: [
          "Productos validados con usuarios",
          "Modelos de negocio probados",
          "ROI proyectado y transparente",
          "Reportes mensuales de crecimiento"
        ],
        image: "/images/ventures.jpg",
        size: "featured"
      }
    ]
  };

  const currentServices = services[activeCategory];

  // DEEP LINKING: Detectar hash en URL y abrir servicio correspondiente
  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    
    if (hash) {
      // Buscar el servicio por slug en todas las categorías
      let foundService = null;
      let foundCategory = 0;

      Object.keys(services).forEach((catId) => {
        const service = services[catId].find(s => s.slug === hash);
        if (service) {
          foundService = service;
          foundCategory = parseInt(catId);
        }
      });

      if (foundService) {
        setActiveCategory(foundCategory);
        setTimeout(() => {
          setExpandedService(foundService.id);
        }, 300);
      }
    }
  }, []);

  // Scroll to expanded card
  useEffect(() => {
    if (expandedService !== null && expandedRef.current) {
      setTimeout(() => {
        expandedRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }, 100);
    }
  }, [expandedService]);

  // Actualizar URL cuando se expande un servicio
  const handleCardClick = (service) => {
    if (expandedService === service.id) {
      setExpandedService(null);
      window.history.pushState(null, '', window.location.pathname);
    } else {
      setExpandedService(service.id);
      window.history.pushState(null, '', `#${service.slug}`);
    }
  };

  const getGridClass = (size) => {
    switch(size) {
      case 'large': return 'service-card--large';
      case 'medium': return 'service-card--medium';
      case 'small': return 'service-card--small';
      case 'featured': return 'service-card--featured';
      default: return 'service-card--medium';
    }
  };

  return (
    <>
      <section className="improved-services">
        {/* Hero Header */}
        <div className="improved-services__hero">
          <span className="improved-services__pretitle">Nuestros Servicios</span>
          <h1 className="improved-services__title">
            Lo Que Hacemos por Tu Negocio
          </h1>
          <p className="improved-services__subtitle">
            Sin tecnicismos raros. Solo soluciones que funcionan.
          </p>
        </div>

        {/* Categories Navigation */}
        <div className="improved-services__categories">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => {
                setActiveCategory(category.id);
                setExpandedService(null);
                window.history.pushState(null, '', window.location.pathname);
              }}
              className={`category-card ${
                activeCategory === category.id ? 'active' : ''
              }`}
            >
              <span className="category-card__icon">{category.icon}</span>
              <div className="category-card__content">
                <h3 className="category-card__name">{category.name}</h3>
                <p className="category-card__description">{category.description}</p>
              </div>
              <div className="category-card__indicator"></div>
            </button>
          ))}
        </div>

        {/* Services Grid */}
        <div className="improved-services__grid">
          {currentServices.map((service) => (
            <div
              key={service.id}
              ref={expandedService === service.id ? expandedRef : null}
              className={`service-card ${getGridClass(service.size)} ${
                expandedService === service.id ? 'expanded' : ''
              } ${expandedService !== null && expandedService !== service.id ? 'dimmed' : ''}`}
              onClick={() => handleCardClick(service)}
            >
              {/* Close Button */}
              {expandedService === service.id && (
                <button 
                  className="service-card__close"
                  onClick={(e) => {
                    e.stopPropagation();
                    setExpandedService(null);
                    window.history.pushState(null, '', window.location.pathname);
                  }}
                  aria-label="Cerrar"
                >
                  ✕
                </button>
              )}

              {/* Background Image */}
              <div className="service-card__bg">
                <img 
                  src={service.image} 
                  alt={service.name}
                  className="service-card__image"
                />
                <div className="service-card__overlay"></div>
              </div>

              {/* Content */}
              <div className="service-card__content">
                <div className="service-card__header">
                  <h3 className="service-card__name">{service.name}</h3>
                  <p className="service-card__tagline">{service.tagline}</p>
                </div>

                {/* Expanded Content */}
                {expandedService === service.id && (
                  <div className="service-card__expanded">
                    <p className="service-card__description">
                      {service.description}
                    </p>

                    <div className="service-card__features">
                      {service.features.map((feature, index) => (
                        <div 
                          key={index} 
                          className="feature-item"
                          style={{ animationDelay: `${index * 0.05}s` }}
                        >
                          <span className="feature-item__icon">✦</span>
                          <span className="feature-item__text">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <a 
                      href="/contacto" 
                      className="service-card__cta"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <span>
                        {service.id === 9 ? "Quiero Invertir" : "Hablemos de Tu Proyecto"}
                      </span>
                      <span>→</span>
                    </a>
                  </div>
                )}

                {/* Hover Hint */}
                {expandedService !== service.id && (
                  <div className="service-card__hint">
                    <span className="service-card__hint-icon">+</span>
                    <span>Ver detalles</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Overlay Background */}
        {expandedService !== null && (
          <div 
            className="services-overlay"
            onClick={() => {
              setExpandedService(null);
              window.history.pushState(null, '', window.location.pathname);
            }}
          ></div>
        )}
      </section>

      <style jsx>{`
        .improved-services {
          background: #0a0a0a;
          min-height: 100vh;
          padding: 4rem 2rem 6rem;
          position: relative;
        }

        /* Overlay cuando algo está expandido */
        .services-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.8);
          z-index: 8;
          animation: fadeIn 0.3s ease;
          backdrop-filter: blur(5px);
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        /* Hero Section */
        .improved-services__hero {
          text-align: center;
          max-width: 900px;
          margin: 0 auto 5rem;
        }

        .improved-services__pretitle {
          display: inline-block;
          font-size: 0.875rem;
          font-weight: 600;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: #D4AF37;
          margin-bottom: 1.5rem;
          padding: 0.5rem 1.5rem;
          border: 1px solid rgba(212, 175, 55, 0.3);
          border-radius: 50px;
          background: rgba(212, 175, 55, 0.05);
        }

        .improved-services__title {
          font-size: 4.5rem;
          font-weight: 900;
          line-height: 1.1;
          background: linear-gradient(135deg, #F4E4BC 0%, #D4AF37 50%, #B8941F 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 1.5rem;
        }

        .improved-services__subtitle {
          font-size: 1.5rem;
          color: rgba(244, 228, 188, 0.7);
          font-weight: 300;
        }

        /* Categories */
        .improved-services__categories {
          max-width: 1400px;
          margin: 0 auto 4rem;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
        }

        .category-card {
          position: relative;
          padding: 2.5rem 2rem;
          background: rgba(255, 255, 255, 0.02);
          border: 2px solid rgba(212, 175, 55, 0.1);
          border-radius: 24px;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 1rem;
        }

        .category-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(212, 175, 55, 0.1), transparent);
          opacity: 0;
          transition: opacity 0.4s ease;
        }

        .category-card:hover::before {
          opacity: 1;
        }

        .category-card__icon {
          font-size: 3rem;
          transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .category-card:hover .category-card__icon {
          transform: scale(1.2) rotate(5deg);
        }

        .category-card__content {
          flex: 1;
        }

        .category-card__name {
          font-size: 1.75rem;
          font-weight: 700;
          color: #F4E4BC;
          margin-bottom: 0.5rem;
        }

        .category-card__description {
          font-size: 1rem;
          color: rgba(244, 228, 188, 0.6);
          font-weight: 300;
        }

        .category-card__indicator {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 4px;
          background: linear-gradient(90deg, #D4AF37, #F4E4BC);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .category-card.active {
          background: rgba(212, 175, 55, 0.1);
          border-color: rgba(212, 175, 55, 0.4);
          box-shadow: 0 0 40px rgba(212, 175, 55, 0.2);
        }

        .category-card.active .category-card__indicator {
          transform: scaleX(1);
        }

        .category-card:hover {
          transform: translateY(-4px);
          border-color: rgba(212, 175, 55, 0.3);
          box-shadow: 0 10px 40px rgba(212, 175, 55, 0.15);
        }

        /* Services Grid */
        .improved-services__grid {
          max-width: 1400px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(12, 1fr);
          gap: 1.5rem;
          grid-auto-rows: 300px;
          position: relative;
        }

        /* Service Card Sizes */
        .service-card {
          position: relative;
          border-radius: 24px;
          overflow: hidden;
          cursor: pointer;
          transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
          border: 2px solid rgba(212, 175, 55, 0.1);
        }

        .service-card--large {
          grid-column: span 6;
          grid-row: span 2;
        }

        .service-card--medium {
          grid-column: span 4;
          grid-row: span 1;
        }

        .service-card--small {
          grid-column: span 4;
          grid-row: span 1;
        }

        .service-card--featured {
          grid-column: span 12;
          grid-row: span 2;
        }

        /* Dimmed state */
        .service-card.dimmed {
          opacity: 0.3;
          filter: grayscale(0.8) blur(2px);
          pointer-events: none;
        }

        /* Close Button */
        .service-card__close {
          position: absolute;
          top: 1.5rem;
          right: 1.5rem;
          z-index: 20;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(212, 175, 55, 0.2);
          backdrop-filter: blur(20px);
          border: 2px solid #D4AF37;
          color: #D4AF37;
          font-size: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          animation: slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .service-card__close:hover {
          background: rgba(212, 175, 55, 0.4);
          transform: rotate(90deg);
          box-shadow: 0 0 20px rgba(212, 175, 55, 0.5);
        }

        /* Service Card Background */
        .service-card__bg {
          position: absolute;
          inset: 0;
          z-index: 0;
        }

        .service-card__image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .service-card:hover .service-card__image {
          transform: scale(1.05);
        }

        .service-card__overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom,
            rgba(0, 0, 0, 0.4) 0%,
            rgba(0, 0, 0, 0.7) 100%
          );
          transition: background 0.4s ease;
        }

        .service-card:hover .service-card__overlay {
          background: linear-gradient(
            to bottom,
            rgba(0, 0, 0, 0.6) 0%,
            rgba(0, 0, 0, 0.85) 100%
          );
        }

        .service-card.expanded .service-card__overlay {
          background: rgba(0, 0, 0, 0.92);
        }

        /* Service Card Content */
        .service-card__content {
          position: relative;
          z-index: 1;
          padding: 2rem;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .service-card__header {
          transition: transform 0.4s ease;
        }

        .service-card__name {
          font-size: 2rem;
          font-weight: 900;
          background: linear-gradient(135deg, #F4E4BC, #D4AF37);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 0.5rem;
          line-height: 1.2;
        }

        .service-card--featured .service-card__name {
          font-size: 3.5rem;
        }

        .service-card__tagline {
          font-size: 0.875rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(212, 175, 55, 0.8);
        }

        .service-card__hint {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
          color: rgba(244, 228, 188, 0.6);
          padding: 0.75rem 1.25rem;
          background: rgba(212, 175, 55, 0.1);
          backdrop-filter: blur(10px);
          border-radius: 50px;
          border: 1px solid rgba(212, 175, 55, 0.2);
          opacity: 0;
          transform: translateY(10px);
          transition: all 0.3s ease;
          width: fit-content;
        }

        .service-card__hint-icon {
          font-size: 1.25rem;
          color: #D4AF37;
        }

        .service-card:hover .service-card__hint {
          opacity: 1;
          transform: translateY(0);
        }

        .service-card.expanded .service-card__hint {
          display: none;
        }

        /* Expanded Content */
        .service-card__expanded {
          animation: expandIn 0.6s cubic-bezier(0.16, 1, 0.3, 1);
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          margin-top: 1.5rem;
          overflow-y: auto;
          max-height: calc(100% - 100px);
          padding-right: 0.5rem;
        }

        .service-card__expanded::-webkit-scrollbar {
          width: 6px;
        }

        .service-card__expanded::-webkit-scrollbar-track {
          background: rgba(212, 175, 55, 0.05);
          border-radius: 10px;
        }

        .service-card__expanded::-webkit-scrollbar-thumb {
          background: rgba(212, 175, 55, 0.3);
          border-radius: 10px;
        }

        .service-card__expanded::-webkit-scrollbar-thumb:hover {
          background: rgba(212, 175, 55, 0.5);
        }

        @keyframes expandIn {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .service-card__description {
          font-size: 1.125rem;
          line-height: 1.7;
          color: #F4E4BC;
          font-weight: 300;
        }

        .service-card__features {
          display: grid;
          gap: 0.75rem;
        }

        .feature-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.875rem 1rem;
          background: rgba(212, 175, 55, 0.08);
          border-left: 3px solid #D4AF37;
          border-radius: 10px;
          animation: slideInLeft 0.5s cubic-bezier(0.16, 1, 0.3, 1) backwards;
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .feature-item__icon {
          color: #D4AF37;
          font-size: 1rem;
          flex-shrink: 0;
        }

        .feature-item__text {
          color: #F4E4BC;
          font-size: 0.95rem;
          line-height: 1.4;
        }

        .service-card__cta {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          padding: 1.25rem 2.5rem;
          background: linear-gradient(135deg, rgba(212, 175, 55, 0.2), rgba(212, 175, 55, 0.05));
          backdrop-filter: blur(20px);
          border: 2px solid #D4AF37;
          border-radius: 50px;
          color: #D4AF37;
          font-size: 1rem;
          font-weight: 700;
          text-decoration: none;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 0 30px rgba(212, 175, 55, 0.3);
          margin-top: 0.5rem;
          animation: fadeIn 0.6s ease 0.3s backwards;
        }

        .service-card__cta:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 40px rgba(212, 175, 55, 0.5);
          background: linear-gradient(135deg, rgba(212, 175, 55, 0.3), rgba(212, 175, 55, 0.1));
        }

        /* Expanded State */
        .service-card.expanded {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 90vw;
          max-width: 1000px;
          height: auto;
          max-height: 85vh;
          grid-column: unset;
          grid-row: unset;
          z-index: 10;
          border-color: rgba(212, 175, 55, 0.4);
          box-shadow: 0 20px 80px rgba(0, 0, 0, 0.8);
        }

        /* Mobile Responsive */
        @media (max-width: 1023px) {
          .improved-services__categories {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .category-card {
            padding: 1.5rem;
          }

          .improved-services__grid {
            grid-template-columns: repeat(6, 1fr);
            grid-auto-rows: 280px;
          }

          .service-card--large,
          .service-card--medium,
          .service-card--small {
            grid-column: span 6;
            grid-row: span 1;
          }

          .service-card--featured {
            grid-column: span 6;
            grid-row: span 2;
          }

          .service-card.expanded {
            width: 95vw;
            max-height: 90vh;
          }
        }

        @media (max-width: 767px) {
          .improved-services {
            padding: 3rem 1rem 4rem;
          }

          .improved-services__hero {
            margin-bottom: 3rem;
          }

          .improved-services__title {
            font-size: 2.5rem;
          }

          .improved-services__subtitle {
            font-size: 1.125rem;
          }

          .improved-services__categories {
            margin-bottom: 2rem;
            gap: 0.75rem;
          }

          .category-card {
            padding: 1.25rem;
            flex-direction: row;
            align-items: center;
          }

          .category-card__icon {
            font-size: 2rem;
          }

          .category-card__name {
            font-size: 1.25rem;
            margin-bottom: 0.25rem;
          }

          .category-card__description {
            font-size: 0.875rem;
          }

          .improved-services__grid {
            grid-template-columns: 1fr;
            gap: 1rem;
            grid-auto-rows: 320px;
          }

          .service-card--large,
          .service-card--medium,
          .service-card--small,
          .service-card--featured {
            grid-column: span 1;
            grid-row: span 1;
          }

          .service-card {
            border-radius: 20px;
          }

          .service-card__content {
            padding: 1.5rem;
          }

          .service-card__name {
            font-size: 1.75rem;
          }

          .service-card--featured .service-card__name {
            font-size: 2.25rem;
          }

          .service-card__tagline {
            font-size: 0.75rem;
          }

          .service-card__hint {
            font-size: 0.75rem;
            padding: 0.625rem 1rem;
          }

          .service-card.expanded {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 95vw;
            height: auto;
            max-height: 90vh;
            border-radius: 24px;
          }

          .service-card__close {
            top: 1rem;
            right: 1rem;
            width: 36px;
            height: 36px;
            font-size: 1.25rem;
          }

          .service-card__expanded {
            gap: 1.25rem;
            margin-top: 1rem;
            max-height: calc(90vh - 180px);
          }

          .service-card__description {
            font-size: 1rem;
          }

          .feature-item {
            padding: 0.75rem;
          }

          .feature-item__text {
            font-size: 0.875rem;
          }

          .service-card__cta {
            width: 100%;
            padding: 1.125rem 2rem;
            font-size: 0.95rem;
          }
        }
      `}</style>
    </>
  );
}