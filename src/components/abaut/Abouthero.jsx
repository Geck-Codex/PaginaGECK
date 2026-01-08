import { useState, useEffect, useRef } from 'react';

export default function AboutHero() {
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const parallaxOffset = scrollY * 0.5;

  return (
    <>
      <section className="about-hero" ref={heroRef}>
        {/* Fondo animado */}
        <div className="about-hero__background">
          {/* Orbes de luz */}
          <div className="about-hero__orb about-hero__orb--1"></div>
          <div className="about-hero__orb about-hero__orb--2"></div>
          <div className="about-hero__orb about-hero__orb--3"></div>
          
          {/* Partículas flotantes */}
          <div className="about-hero__particles">
            {[...Array(15)].map((_, i) => (
              <div key={i} className="about-hero__particle"></div>
            ))}
          </div>
        </div>

        {/* Contenido */}
        <div className="about-hero__content">
          <div 
            className="about-hero__text-container"
            style={{
              transform: `translateY(${parallaxOffset}px)`,
            }}
          >
            {/* Badge */}
            <div className="about-hero__badge">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 2L12.5 7L18 8L14 12L15 18L10 15L5 18L6 12L2 8L7.5 7L10 2Z" fill="currentColor"/>
              </svg>
              <span>Sobre Nosotros</span>
            </div>

            {/* Título principal */}
            <h1 className="about-hero__title">
              Transformamos Ideas en
              <span className="about-hero__title-highlight"> Soluciones Digitales</span>
            </h1>

            {/* Descripción */}
            <p className="about-hero__description">
              Somos un equipo apasionado de desarrolladores y diseñadores dedicados a crear 
              experiencias digitales excepcionales. Combinamos innovación, tecnología de punta 
              y creatividad para impulsar el éxito de nuestros clientes.
            </p>

            {/* Stats */}
            <div className="about-hero__stats">
              <div className="about-hero__stat">
                <div className="about-hero__stat-number">50+</div>
                <div className="about-hero__stat-label">Proyectos Completados</div>
              </div>
              <div className="about-hero__stat-divider"></div>
              <div className="about-hero__stat">
                <div className="about-hero__stat-number">5+</div>
                <div className="about-hero__stat-label">Años de Experiencia</div>
              </div>
              <div className="about-hero__stat-divider"></div>
              <div className="about-hero__stat">
                <div className="about-hero__stat-number">98%</div>
                <div className="about-hero__stat-label">Satisfacción del Cliente</div>
              </div>
            </div>

            {/* Botones */}
            <div className="about-hero__buttons">
              <button className="about-hero__button about-hero__button--primary">
                <span>Ver Nuestro Trabajo</span>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M7 3L14 10L7 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <button className="about-hero__button about-hero__button--secondary">
                <span>Contáctanos</span>
              </button>
            </div>
          </div>

          {/* Decoración visual - Código abstracto */}
          <div 
            className="about-hero__visual"
            style={{
              transform: `translateY(${parallaxOffset * 0.3}px)`,
            }}
          >
            <div className="about-hero__code-block">
              <div className="about-hero__code-line">
                <span className="about-hero__code-keyword">const</span>
                <span className="about-hero__code-var"> innovation</span>
                <span> = </span>
                <span className="about-hero__code-string">"limitless"</span>
                <span>;</span>
              </div>
              <div className="about-hero__code-line">
                <span className="about-hero__code-keyword">function</span>
                <span className="about-hero__code-function"> buildFuture</span>
                <span>() {'{'}</span>
              </div>
              <div className="about-hero__code-line about-hero__code-line--indent">
                <span className="about-hero__code-keyword">return</span>
                <span> excellence;</span>
              </div>
              <div className="about-hero__code-line">
                <span>{'}'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Indicador de scroll */}
        <div className="about-hero__scroll-indicator">
          <div className="about-hero__scroll-line"></div>
          <div className="about-hero__scroll-dot"></div>
        </div>
      </section>

      <style>{`
        /* HERO PRINCIPAL */
        .about-hero {
          position: relative;
          min-height: 100vh;
          width: 100%;
          overflow: hidden;
          background: linear-gradient(to bottom, #0b1f49, #000000);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 8rem 2rem 4rem;
        }

        /* FONDO ANIMADO */
        .about-hero__background {
          position: absolute;
          inset: 0;
          z-index: 0;
          pointer-events: none;
        }

        .about-hero__orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(100px);
          animation: float 12s ease-in-out infinite;
        }

        .about-hero__orb--1 {
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(212, 175, 55, 0.15), transparent);
          top: -10%;
          left: -10%;
          animation-delay: 0s;
        }

        .about-hero__orb--2 {
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(74, 158, 255, 0.1), transparent);
          bottom: -10%;
          right: -10%;
          animation-delay: 4s;
        }

        .about-hero__orb--3 {
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(212, 175, 55, 0.08), transparent);
          top: 40%;
          right: 20%;
          animation-delay: 8s;
        }

        @keyframes float {
          0%, 100% {
            transform: translate3d(0, 0, 0) scale(1);
          }
          33% {
            transform: translate3d(30px, -30px, 0) scale(1.1);
          }
          66% {
            transform: translate3d(-30px, 30px, 0) scale(0.9);
          }
        }

        .about-hero__particles {
          position: absolute;
          inset: 0;
        }

        .about-hero__particle {
          position: absolute;
          width: 2px;
          height: 2px;
          background: #d4af37;
          border-radius: 50%;
          animation: particleFloat 15s linear infinite;
          opacity: 0;
        }

        .about-hero__particle:nth-child(1) { left: 10%; animation-delay: 0s; }
        .about-hero__particle:nth-child(2) { left: 20%; animation-delay: 2s; }
        .about-hero__particle:nth-child(3) { left: 30%; animation-delay: 4s; }
        .about-hero__particle:nth-child(4) { left: 40%; animation-delay: 1s; }
        .about-hero__particle:nth-child(5) { left: 50%; animation-delay: 3s; }
        .about-hero__particle:nth-child(6) { left: 60%; animation-delay: 5s; }
        .about-hero__particle:nth-child(7) { left: 70%; animation-delay: 2s; }
        .about-hero__particle:nth-child(8) { left: 80%; animation-delay: 4s; }
        .about-hero__particle:nth-child(9) { left: 90%; animation-delay: 1s; }
        .about-hero__particle:nth-child(10) { left: 15%; animation-delay: 3s; }
        .about-hero__particle:nth-child(11) { left: 25%; animation-delay: 5s; }
        .about-hero__particle:nth-child(12) { left: 35%; animation-delay: 2s; }
        .about-hero__particle:nth-child(13) { left: 45%; animation-delay: 4s; }
        .about-hero__particle:nth-child(14) { left: 55%; animation-delay: 1s; }
        .about-hero__particle:nth-child(15) { left: 65%; animation-delay: 3s; }

        @keyframes particleFloat {
          0% {
            transform: translateY(100vh);
            opacity: 0;
          }
          10% {
            opacity: 0.6;
          }
          90% {
            opacity: 0.6;
          }
          100% {
            transform: translateY(-100px);
            opacity: 0;
          }
        }

        /* CONTENIDO */
        .about-hero__content {
          position: relative;
          z-index: 1;
          max-width: 1400px;
          width: 100%;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
        }

        .about-hero__text-container {
          display: flex;
          flex-direction: column;
          gap: 2rem;
          will-change: transform;
        }

        /* BADGE */
        .about-hero__badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: rgba(212, 175, 55, 0.1);
          border: 1px solid rgba(212, 175, 55, 0.3);
          border-radius: 50px;
          color: #d4af37;
          font-size: 0.9rem;
          font-weight: 600;
          width: fit-content;
          animation: fadeInUp 0.8s ease-out;
        }

        /* TÍTULO */
        .about-hero__title {
          font-size: 4.5rem;
          font-weight: 900;
          line-height: 1.1;
          color: #f5f5f5;
          margin: 0;
          animation: fadeInUp 0.8s ease-out 0.2s backwards;
        }

        .about-hero__title-highlight {
          background: linear-gradient(135deg, #d4af37 0%, #f4d03f 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          display: block;
        }

        /* DESCRIPCIÓN */
        .about-hero__description {
          font-size: 1.25rem;
          line-height: 1.8;
          color: #a0a0a0;
          margin: 0;
          max-width: 600px;
          animation: fadeInUp 0.8s ease-out 0.4s backwards;
        }

        /* STATS */
        .about-hero__stats {
          display: flex;
          align-items: center;
          gap: 2rem;
          padding: 2rem 0;
          animation: fadeInUp 0.8s ease-out 0.6s backwards;
        }

        .about-hero__stat {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .about-hero__stat-number {
          font-size: 3rem;
          font-weight: 900;
          background: linear-gradient(135deg, #d4af37 0%, #f4d03f 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          line-height: 1;
        }

        .about-hero__stat-label {
          font-size: 0.9rem;
          color: #a0a0a0;
          font-weight: 500;
        }

        .about-hero__stat-divider {
          width: 1px;
          height: 60px;
          background: linear-gradient(to bottom, transparent, rgba(212, 175, 55, 0.3), transparent);
        }

        /* BOTONES */
        .about-hero__buttons {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
          animation: fadeInUp 0.8s ease-out 0.8s backwards;
        }

        .about-hero__button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem 2rem;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          border: none;
        }

        .about-hero__button--primary {
          background: linear-gradient(135deg, #d4af37 0%, #f4d03f 100%);
          color: #0b1f49;
          box-shadow: 0 4px 20px rgba(212, 175, 55, 0.3);
        }

        .about-hero__button--primary:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 30px rgba(212, 175, 55, 0.5);
        }

        .about-hero__button--secondary {
          background: rgba(212, 175, 55, 0.1);
          color: #d4af37;
          border: 2px solid rgba(212, 175, 55, 0.3);
        }

        .about-hero__button--secondary:hover {
          background: rgba(212, 175, 55, 0.2);
          border-color: rgba(212, 175, 55, 0.5);
          transform: translateY(-3px);
        }

        /* VISUAL - CÓDIGO */
        .about-hero__visual {
          position: relative;
          will-change: transform;
          animation: fadeInRight 1s ease-out;
        }

        .about-hero__code-block {
          background: rgba(27, 54, 93, 0.3);
          border: 1px solid rgba(212, 175, 55, 0.2);
          border-radius: 16px;
          padding: 3rem;
          backdrop-filter: blur(10px);
          font-family: 'Courier New', monospace;
          font-size: 1.5rem;
          line-height: 2;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }

        .about-hero__code-line {
          animation: typeIn 0.5s ease-out backwards;
        }

        .about-hero__code-line:nth-child(1) { animation-delay: 1s; }
        .about-hero__code-line:nth-child(2) { animation-delay: 1.2s; }
        .about-hero__code-line:nth-child(3) { animation-delay: 1.4s; }
        .about-hero__code-line:nth-child(4) { animation-delay: 1.6s; }

        .about-hero__code-line--indent {
          padding-left: 2rem;
        }

        .about-hero__code-keyword {
          color: #4a9eff;
        }

        .about-hero__code-var {
          color: #d4af37;
        }

        .about-hero__code-string {
          color: #50fa7b;
        }

        .about-hero__code-function {
          color: #f4d03f;
        }

        /* SCROLL INDICATOR */
        .about-hero__scroll-indicator {
          position: absolute;
          bottom: 2rem;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          animation: fadeIn 1s ease-out 2s backwards;
        }

        .about-hero__scroll-line {
          width: 1px;
          height: 40px;
          background: linear-gradient(to bottom, transparent, #d4af37);
        }

        .about-hero__scroll-dot {
          width: 8px;
          height: 8px;
          background: #d4af37;
          border-radius: 50%;
          animation: bounce 2s ease-in-out infinite;
        }

        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(10px);
          }
        }

        /* ANIMACIONES */
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes typeIn {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        /* RESPONSIVE */
        @media (max-width: 1024px) {
          .about-hero__content {
            grid-template-columns: 1fr;
            gap: 3rem;
          }

          .about-hero__title {
            font-size: 3.5rem;
          }

          .about-hero__visual {
            order: -1;
          }

          .about-hero__code-block {
            font-size: 1.2rem;
            padding: 2rem;
          }
        }

        @media (max-width: 768px) {
          .about-hero {
            padding: 6rem 1.5rem 3rem;
          }

          .about-hero__title {
            font-size: 2.5rem;
          }

          .about-hero__description {
            font-size: 1.1rem;
          }

          .about-hero__stats {
            flex-direction: column;
            align-items: flex-start;
            gap: 1.5rem;
            padding: 1.5rem 0;
          }

          .about-hero__stat-divider {
            display: none;
          }

          .about-hero__stat-number {
            font-size: 2.5rem;
          }

          .about-hero__buttons {
            flex-direction: column;
          }

          .about-hero__button {
            width: 100%;
            justify-content: center;
          }

          .about-hero__code-block {
            font-size: 1rem;
            padding: 1.5rem;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .about-hero__orb,
          .about-hero__particle,
          .about-hero__scroll-dot {
            animation: none !important;
          }
        }
      `}</style>
    </>
  );
}