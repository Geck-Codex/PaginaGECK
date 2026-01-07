import { useState, useEffect, useRef } from 'react';

export default function ServiceSection({ 
  videoSrc, 
  title, 
  description, 
  link,
  buttonText 
}) {
  const [letterOpacity, setLetterOpacity] = useState(0);
  const sectionRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;

      const sectionTop = sectionRef.current.offsetTop;
      const sectionHeight = sectionRef.current.offsetHeight;
      const windowHeight = window.innerHeight;
      const scrollY = window.scrollY;

      // Calcular posición de la sección en viewport
      const sectionCenter = sectionTop + (sectionHeight / 2);
      const viewportCenter = scrollY + (windowHeight / 2);

      // Distancia del centro (-1 arriba, 0 centro, 1 abajo)
      const distance = (viewportCenter - sectionCenter) / (windowHeight / 2);
      
      // Progreso (0 = lejos arriba, 0.5 = centro, 1 = lejos abajo)
      const progress = (distance + 1) / 2;

      setLetterOpacity(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Calcular opacidad del video (se mantiene visible por más tiempo)
  const getVideoOpacity = () => {
    // Video aparece más temprano y se queda más tiempo
    if (letterOpacity < 0.15) return 0; // Empieza a aparecer antes
    if (letterOpacity > 0.85) return 0; // Se queda hasta más tarde
    
    // Entre 0.15 y 0.85, transición muy suave
    if (letterOpacity <= 0.5) {
      // Fade in: de 0.15 a 0.5 → opacidad de 0 a 1
      return Math.min(1, (letterOpacity - 0.15) / 0.25);
    } else {
      // Fade out: de 0.5 a 0.85 → opacidad de 1 a 0
      return Math.max(0, 1 - ((letterOpacity - 0.5) / 0.35));
    }
  };

  // Calcular opacidad del texto (aparece gradualmente)
  const getTextOpacity = () => {
    // Texto empieza a aparecer cuando el video ya está visible
    if (letterOpacity < 0.25) return 0;
    if (letterOpacity > 0.75) return Math.max(0, 1 - ((letterOpacity - 0.75) / 0.25));
    
    // Entre 0.25 y 0.5, fade in suave
    if (letterOpacity <= 0.5) {
      return (letterOpacity - 0.25) / 0.25;
    }
    
    return 1; // Visible en el centro
  };

  // Calcular parallax del texto (mucho más marcado)
  const getTextParallax = () => {
    // progress 0 (muy arriba) → texto MUY abajo (600px)
    // progress 0.5 (centro) → texto en posición (0px)
    // progress 1 (muy abajo) → texto sigue subiendo (-300px)
    
    if (letterOpacity < 0.5) {
      // Subiendo: de 600px abajo → 0px (mucho más marcado)
      return 600 - (letterOpacity / 0.5) * 600;
    } else {
      // Sigue subiendo: de 0px → -300px (más recorrido)
      return -((letterOpacity - 0.5) / 0.5) * 300;
    }
  };

  const videoOpacity = getVideoOpacity();
  const textOpacity = getTextOpacity();
  const textParallax = getTextParallax();

  return (
    <>
      <section className="service-section" ref={sectionRef}>
        {/* Video de fondo */}
        <div className="service-section__video-container">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="service-section__video"
            style={{
              opacity: videoOpacity,
              transition: 'opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1)' // Transición más larga y suave
            }}
          >
            <source src={videoSrc} type="video/mp4" />
          </video>
        </div>

        {/* Contenido */}
        <div 
          className="service-section__content"
          style={{
            opacity: textOpacity,
            transform: `translateY(${textParallax}px)`,
            transition: 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1)' // Suavizado
          }}
        >
          <h2 className="service-section__title">
            {title}
          </h2>
          <p className="service-section__description">
            {description}
          </p>
          <a href={link} className="service-section__button">
            <span className="service-section__button-text">{buttonText}</span>
            <span className="service-section__button-arrow">→</span>
          </a>
        </div>
      </section>

      <style>{`
        /* ============================================
           SECCIÓN
           ============================================ */
        .service-section {
          position: relative;
          width: 100%;
          height: 100vh;
          display: flex;
          align-items: center;
          overflow: hidden;
          background: #030c1d ; /* Azul muy oscuro - casi negro */
        }

        /* ============================================
           VIDEO DE FONDO
           ============================================ */
        .service-section__video-container {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
        }

        .service-section__video {
          position: absolute;
          top: 50%;
          left: 50%;
          min-width: 100%;
          min-height: 100%;
          width: auto;
          height: auto;
          transform: translate(-50%, -50%);
          object-fit: cover;
          filter: brightness(0.5) contrast(1.1); /* Más oscuro para legibilidad sin overlay */
        }

        /* ============================================
           CONTENIDO
           ============================================ */
        .service-section__content {
          position: relative;
          z-index: 10;
          max-width: 700px;
          padding-left: 5rem;
          padding-right: 2rem;
          will-change: transform, opacity;
        }

        /* ============================================
           TÍTULO
           ============================================ */
        .service-section__title {
          font-size: 4rem;
          font-weight: 900;
          margin-bottom: 1.5rem;
          background: linear-gradient(
            135deg,
            #F4E4BC 0%,
            #D4AF37 50%,
            #B8941F 100%
          );
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          line-height: 1.2;
          letter-spacing: 0.02em;
          filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.8));
        }

        /* ============================================
           DESCRIPCIÓN
           ============================================ */
        .service-section__description {
          font-size: 1.5rem;
          font-weight: 300;
          line-height: 1.7;
          color: #F4E4BC;
          margin-bottom: 2.5rem;
          text-shadow: 0 2px 12px rgba(0, 0, 0, 0.9);
        }

        /* ============================================
           BOTÓN (ESTILO NAVBAR)
           ============================================ */
        .service-section__button {
          display: inline-flex;
          align-items: center;
          gap: 1rem;
          padding: 1.25rem 3rem;
          background: linear-gradient(135deg, rgba(212, 175, 55, 0.18), rgba(212, 175, 55, 0.08));
          backdrop-filter: blur(25px);
          -webkit-backdrop-filter: blur(25px);
          color: #D4AF37;
          font-weight: 700;
          font-size: 1.125rem;
          text-decoration: none;
          border-radius: 12px;
          border: 2px solid #D4AF37;
          box-shadow: 
            0 0 20px rgba(212, 175, 55, 0.4),
            inset 0 0 20px rgba(212, 175, 55, 0.1);
          transition: all 0.3s ease;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          animation: buttonPulse 2s ease-in-out infinite;
        }

        /* Shimmer effect */
        .service-section__button::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(
            45deg,
            transparent,
            rgba(212, 175, 55, 0.3),
            transparent
          );
          transform: rotate(45deg);
          animation: shimmer 3s linear infinite;
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%) translateY(-100%) rotate(45deg);
          }
          100% {
            transform: translateX(100%) translateY(100%) rotate(45deg);
          }
        }

        @keyframes buttonPulse {
          0%, 100% {
            box-shadow: 
              0 0 20px rgba(212, 175, 55, 0.4),
              inset 0 0 20px rgba(212, 175, 55, 0.1);
          }
          50% {
            box-shadow: 
              0 0 30px rgba(212, 175, 55, 0.6),
              0 0 40px rgba(212, 175, 55, 0.3),
              inset 0 0 25px rgba(212, 175, 55, 0.2);
          }
        }

        .service-section__button:hover {
          transform: scale(1.08) translateY(-2px);
          box-shadow: 
            0 0 35px rgba(212, 175, 55, 0.7),
            0 0 50px rgba(212, 175, 55, 0.4),
            inset 0 0 25px rgba(212, 175, 55, 0.2);
        }

        .service-section__button-text {
          position: relative;
          z-index: 1;
        }

        .service-section__button-arrow {
          font-size: 1.5rem;
          transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          position: relative;
          z-index: 1;
        }

        .service-section__button:hover .service-section__button-arrow {
          transform: translateX(6px);
        }

        /* ============================================
           RESPONSIVE - MOBILE
           ============================================ */
        @media (max-width: 767px) {
          .service-section__content {
            padding-left: 1.5rem;
            padding-right: 1.5rem;
          }

          .service-section__title {
            font-size: 2rem;
          }

          .service-section__description {
            font-size: 1.125rem;
            margin-bottom: 2rem;
          }

          .service-section__button {
            padding: 1rem 2rem;
            font-size: 1rem;
          }
        }

        /* ============================================
           RESPONSIVE - TABLET
           ============================================ */
        @media (min-width: 768px) and (max-width: 1023px) {
          .service-section__content {
            padding-left: 3rem;
          }

          .service-section__title {
            font-size: 2.75rem;
          }

          .service-section__description {
            font-size: 1.25rem;
          }

          .service-section__button {
            padding: 1.25rem 2.75rem;
            font-size: 1.125rem;
          }
        }

        /* ============================================
           RESPONSIVE - DESKTOP
           ============================================ */
        @media (min-width: 1024px) {
          .service-section__content {
            padding-left: 8rem;
          }
        }

        /* ============================================
           ACCESIBILIDAD
           ============================================ */
        @media (prefers-reduced-motion: reduce) {
          .service-section__video {
            animation: none !important;
          }

          .service-section__title span,
          .service-section__description span {
            transition: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
        }
      `}</style>
    </>
  );
}