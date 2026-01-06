import { useState, useEffect } from 'react';

export default function VideoHero() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Animación de entrada
    const timer = setTimeout(() => setIsLoaded(true), 100);
    
    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <>
      <div className="video-hero-container">
        {/* Texto en esquina inferior izquierda */}
        <div className="video-subtitle-corner">
          <p className="video-subtitle">Arquitectos Digitales</p>
        </div>

        {/* Flecha hacia abajo en esquina inferior derecha */}
        <div className="scroll-arrow-corner">
          <div className="arrow-container">
            <svg className="arrow-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 5V19M12 19L5 12M12 19L19 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>

      <style jsx>{`
        /* ============================================
           CONTENEDOR PRINCIPAL (SIN VIDEO)
           ============================================ */
        .video-hero-container {
          position: relative;
          width: 100%;
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* ============================================
           SUBTÍTULO EN ESQUINA INFERIOR IZQUIERDA
           ============================================ */
        .video-subtitle-corner {
          position: absolute;
          bottom: 60px;
          left: 60px;
          z-index: 10;
        }

        .video-subtitle {
          font-size: 1.5rem;
          font-weight: 300;
          letter-spacing: 0.15em;
          color: #F4E4BC;
          text-shadow: 0 2px 12px rgba(0, 0, 0, 0.9);
          margin: 0;
          opacity: 0;
          transform: translateX(-20px);
          animation: slideInLeft 1s ease-out 0.5s forwards;
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

        /* ============================================
           FLECHA EN ESQUINA INFERIOR DERECHA
           ============================================ */
        .scroll-arrow-corner {
          position: absolute;
          bottom: 60px;
          right: 60px;
          z-index: 10;
        }

        .arrow-container {
          width: 50px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid rgba(212, 175, 55, 0.5);
          border-radius: 50%;
          opacity: 0;
          transform: translateY(-20px);
          animation: fadeInDown 1s ease-out 0.8s forwards, arrowBounce 2s ease-in-out 1.8s infinite;
        }

        .arrow-icon {
          width: 28px;
          height: 28px;
          color: #D4AF37;
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5));
        }

        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes arrowBounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(10px);
          }
        }

        /* ============================================
           RESPONSIVE
           ============================================ */
        @media (max-width: 767px) {
          .video-subtitle-corner {
            bottom: 40px;
            left: 24px;
          }

          .video-subtitle {
            font-size: 1rem;
          }

          .scroll-arrow-corner {
            bottom: 40px;
            right: 24px;
          }

          .arrow-container {
            width: 40px;
            height: 40px;
          }

          .arrow-icon {
            width: 22px;
            height: 22px;
          }
        }

        @media (min-width: 768px) and (max-width: 1023px) {
          .video-subtitle-corner {
            bottom: 50px;
            left: 40px;
          }

          .video-subtitle {
            font-size: 1.25rem;
          }

          .scroll-arrow-corner {
            bottom: 50px;
            right: 40px;
          }

          .arrow-container {
            width: 45px;
            height: 45px;
          }

          .arrow-icon {
            width: 26px;
            height: 26px;
          }
        }

        @media (min-width: 1024px) {
          .video-subtitle {
            font-size: 1.75rem;
          }
        }

        /* ============================================
           ACCESIBILIDAD
           ============================================ */
        @media (prefers-reduced-motion: reduce) {
          .video-subtitle,
          .arrow-container {
            animation: none !important;
            opacity: 1;
            transform: none;
          }
        }
      `}</style>
    </>
  );
}