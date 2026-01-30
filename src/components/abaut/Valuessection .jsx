import { useState, useEffect, useRef } from 'react';

export default function ValuesSection() {
  const [visibleCards, setVisibleCards] = useState([]);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleCards([0, 1, 2, 3]);
          }
        });
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const values = [
    {
      id: 1,
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      title: "Innovación Constante",
      description: "Siempre a la vanguardia tecnológica, explorando nuevas herramientas y metodologías para ofrecer soluciones que marquen la diferencia en el mercado digital."
    },
    {
      id: 2,
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
          <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      title: "Calidad Excepcional",
      description: "Cada línea de código, cada pixel diseñado y cada funcionalidad implementada pasa por rigurosos estándares de calidad para garantizar resultados impecables."
    },
    {
      id: 3,
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
          <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13M16 3.13C16.8604 3.3503 17.623 3.8507 18.1676 4.55231C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89317 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88M13 7C13 9.20914 11.2091 11 9 11C6.79086 11 5 9.20914 5 7C5 4.79086 6.79086 3 9 3C11.2091 3 13 4.79086 13 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      title: "Compromiso Total",
      description: "Tu éxito es nuestro éxito. Nos involucramos profundamente en cada proyecto, comprometiéndonos con plazos, transparencia y comunicación constante."
    },
    {
      id: 4,
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
          <path d="M13 10V3L4 14H11L11 21L20 10L13 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      title: "Agilidad y Eficiencia",
      description: "Implementamos metodologías ágiles que nos permiten adaptarnos rápidamente, iterar con velocidad y entregar valor continuo en cada sprint del proyecto."
    }
  ];

  return (
    <>
      <section className="values-section" ref={sectionRef}>
        <div className="values-section__container">
          {/* Header */}
          <div className="values-section__header">
            <div className="values-section__badge">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 2L12.5 7L18 8L14 12L15 18L10 15L5 18L6 12L2 8L7.5 7L10 2Z" fill="currentColor"/>
              </svg>
              <span>Nuestros Valores</span>
            </div>
            <h2 className="values-section__title">
              Lo Que Nos Define Como
              <span className="values-section__title-highlight"> Equipo</span>
            </h2>
            <p className="values-section__description">
              Estos son los pilares fundamentales que guían cada decisión, 
              cada línea de código y cada interacción con nuestros clientes.
            </p>
          </div>

          {/* Grid de valores */}
          <div className="values-section__grid">
            {values.map((value, index) => (
              <div
                key={value.id}
                className={`values-card ${visibleCards.includes(index) ? 'values-card--visible' : ''}`}
                style={{
                  animationDelay: `${index * 0.15}s`
                }}
              >
                <div className="values-card__glow"></div>
                <div className="values-card__icon">
                  {value.icon}
                </div>
                <h3 className="values-card__title">{value.title}</h3>
                <p className="values-card__description">{value.description}</p>
                
                {/* Decoración */}
                <div className="values-card__corner values-card__corner--tl"></div>
                <div className="values-card__corner values-card__corner--br"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        /* SECCIÓN PRINCIPAL */
        .values-section {
          position: relative;
          width: 100%;
          background: Transparent;
          padding: 8rem 2rem;
          overflow: hidden;
        }

        .values-section__container {
          max-width: 1400px;
          margin: 0 auto;
        }

        /* HEADER */
        .values-section__header {
          text-align: center;
          margin-bottom: 5rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.5rem;
        }

        .values-section__badge {
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
        }

        .values-section__title {
          font-size: 3.5rem;
          font-weight: 900;
          line-height: 1.2;
          color: #f5f5f5;
          margin: 0;
          max-width: 700px;
        }

        .values-section__title-highlight {
          background: linear-gradient(135deg, #d4af37 0%, #f4d03f 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          display: inline-block;
        }

        .values-section__description {
          font-size: 1.2rem;
          line-height: 1.8;
          color: #a0a0a0;
          margin: 0;
          max-width: 600px;
        }

        /* GRID */
        .values-section__grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 2rem;
        }

        /* CARDS */
        .values-card {
          position: relative;
          padding: 3rem;
          background: rgba(27, 54, 93, 0.3);
          border: 1px solid rgba(212, 175, 55, 0.2);
          border-radius: 24px;
          backdrop-filter: blur(10px);
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          opacity: 0;
          transform: translateY(50px);
          overflow: hidden;
        }

        .values-card--visible {
          animation: cardSlideUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        @keyframes cardSlideUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .values-card:hover {
          transform: translateY(-10px);
          border-color: rgba(212, 175, 55, 0.5);
          box-shadow: 0 20px 60px rgba(212, 175, 55, 0.2);
        }

        /* Glow effect */
        .values-card__glow {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 100%;
          background: radial-gradient(
            circle at 50% 0%,
            rgba(212, 175, 55, 0.15) 0%,
            transparent 50%
          );
          opacity: 0;
          transition: opacity 0.5s ease;
        }

        .values-card:hover .values-card__glow {
          opacity: 1;
        }

        /* Icon */
        .values-card__icon {
          width: 80px;
          height: 80px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(212, 175, 55, 0.1);
          border: 2px solid rgba(212, 175, 55, 0.3);
          border-radius: 20px;
          color: #d4af37;
          margin-bottom: 2rem;
          transition: all 0.4s ease;
        }

        .values-card:hover .values-card__icon {
          transform: scale(1.1) rotate(5deg);
          background: rgba(212, 175, 55, 0.2);
          border-color: rgba(212, 175, 55, 0.5);
        }

        /* Title */
        .values-card__title {
          font-size: 1.75rem;
          font-weight: 700;
          color: #f5f5f5;
          margin: 0 0 1rem 0;
          transition: color 0.3s ease;
        }

        .values-card:hover .values-card__title {
          color: #d4af37;
        }

        /* Description */
        .values-card__description {
          font-size: 1rem;
          line-height: 1.7;
          color: #a0a0a0;
          margin: 0;
        }

        /* Decorative corners */
        .values-card__corner {
          position: absolute;
          width: 20px;
          height: 20px;
          border: 2px solid #d4af37;
          opacity: 0;
          transition: all 0.4s ease;
        }

        .values-card__corner--tl {
          top: 1rem;
          left: 1rem;
          border-right: none;
          border-bottom: none;
        }

        .values-card__corner--br {
          bottom: 1rem;
          right: 1rem;
          border-left: none;
          border-top: none;
        }

        .values-card:hover .values-card__corner {
          opacity: 0.6;
        }

        .values-card:hover .values-card__corner--tl {
          top: 0.5rem;
          left: 0.5rem;
        }

        .values-card:hover .values-card__corner--br {
          bottom: 0.5rem;
          right: 0.5rem;
        }

        /* RESPONSIVE */
        @media (max-width: 1024px) {
          .values-section__title {
            font-size: 3rem;
          }

          .values-section__grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }
        }

        @media (max-width: 768px) {
          .values-section {
            padding: 5rem 1.5rem;
          }

          .values-section__header {
            margin-bottom: 3rem;
          }

          .values-section__title {
            font-size: 2.5rem;
          }

          .values-section__description {
            font-size: 1.1rem;
          }

          .values-card {
            padding: 2rem;
          }

          .values-card__icon {
            width: 70px;
            height: 70px;
          }

          .values-card__title {
            font-size: 1.5rem;
          }

          .values-card__description {
            font-size: 0.95rem;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .values-card,
          .values-card__icon,
          .values-card__corner {
            transition: none !important;
            animation: none !important;
          }
        }
      `}</style>
    </>
  );
}