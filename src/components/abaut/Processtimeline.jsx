import { useState, useEffect, useRef } from 'react';

export default function ProcessTimeline() {
  const [activeStep, setActiveStep] = useState(0);
  const [visibleSteps, setVisibleSteps] = useState([]);
  const sectionRef = useRef(null);

  const steps = [
    {
      id: 1,
      number: "01",
      title: "Descubrimiento",
      description: "Analizamos tu negocio, objetivos y audiencia para entender a fondo tus necesidades y crear una estrategia sólida.",
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
          <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      id: 2,
      number: "02",
      title: "Diseño y Prototipado",
      description: "Creamos wireframes y prototipos interactivos que visualizan la experiencia del usuario antes del desarrollo.",
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      id: 3,
      number: "03",
      title: "Desarrollo",
      description: "Nuestro equipo de desarrolladores construye tu solución con código limpio, escalable y siguiendo las mejores prácticas.",
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
          <path d="M16 18L22 12L16 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M8 6L2 12L8 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      id: 4,
      number: "04",
      title: "Testing y QA",
      description: "Realizamos pruebas exhaustivas de funcionalidad, rendimiento y seguridad para garantizar un producto sin errores.",
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
          <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      id: 5,
      number: "05",
      title: "Lanzamiento y Soporte",
      description: "Desplegamos tu proyecto y proporcionamos soporte continuo, mantenimiento y actualizaciones para asegurar su éxito.",
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            steps.forEach((_, index) => {
              setTimeout(() => {
                setVisibleSteps((prev) => [...new Set([...prev, index])]);
              }, index * 200);
            });
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

  return (
    <>
      <section className="process-timeline" ref={sectionRef}>
        <div className="process-timeline__container">
          {/* Header */}
          <div className="process-timeline__header">
            <div className="process-timeline__badge">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 2L12.5 7L18 8L14 12L15 18L10 15L5 18L6 12L2 8L7.5 7L10 2Z" fill="currentColor"/>
              </svg>
              <span>Nuestro Proceso</span>
            </div>
            <h2 className="process-timeline__title">
              Cómo Llevamos Tu Proyecto
              <span className="process-timeline__title-highlight"> De Idea a Realidad</span>
            </h2>
            <p className="process-timeline__description">
              Un proceso probado y refinado que garantiza resultados excepcionales 
              en cada etapa del desarrollo.
            </p>
          </div>

          {/* Timeline */}
          <div className="process-timeline__steps">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`timeline-step ${visibleSteps.includes(index) ? 'timeline-step--visible' : ''} ${activeStep === index ? 'timeline-step--active' : ''}`}
                onMouseEnter={() => setActiveStep(index)}
                style={{
                  animationDelay: `${index * 0.2}s`
                }}
              >
                {/* Línea conectora */}
                {index < steps.length - 1 && (
                  <div className="timeline-step__line"></div>
                )}

                {/* Número */}
                <div className="timeline-step__number-container">
                  <div className="timeline-step__number">{step.number}</div>
                  <div className="timeline-step__pulse"></div>
                </div>

                {/* Card */}
                <div className="timeline-step__card">
                  <div className="timeline-step__icon">
                    {step.icon}
                  </div>
                  <h3 className="timeline-step__title">{step.title}</h3>
                  <p className="timeline-step__description">{step.description}</p>
                  
                  {/* Indicador de progreso */}
                  <div className="timeline-step__progress"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        /* SECCIÓN PRINCIPAL */
        .process-timeline {
          position: relative;
          width: 100%;
          background: linear-gradient(to bottom, #0b1f49, #000000);
          padding: 8rem 2rem;
          overflow: hidden;
        }

        .process-timeline__container {
          max-width: 1200px;
          margin: 0 auto;
        }

        /* HEADER */
        .process-timeline__header {
          text-align: center;
          margin-bottom: 6rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.5rem;
        }

        .process-timeline__badge {
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

        .process-timeline__title {
          font-size: 3.5rem;
          font-weight: 900;
          line-height: 1.2;
          color: #f5f5f5;
          margin: 0;
          max-width: 800px;
        }

        .process-timeline__title-highlight {
          background: linear-gradient(135deg, #d4af37 0%, #f4d03f 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          display: inline-block;
        }

        .process-timeline__description {
          font-size: 1.2rem;
          line-height: 1.8;
          color: #a0a0a0;
          margin: 0;
          max-width: 600px;
        }

        /* TIMELINE STEPS */
        .process-timeline__steps {
          display: flex;
          flex-direction: column;
          gap: 3rem;
          position: relative;
        }

        /* STEP */
        .timeline-step {
          position: relative;
          display: grid;
          grid-template-columns: 100px 1fr;
          gap: 3rem;
          align-items: start;
          opacity: 0;
          transform: translateX(-50px);
        }

        .timeline-step--visible {
          animation: stepSlideIn 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        @keyframes stepSlideIn {
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        /* Línea conectora */
        .timeline-step__line {
          position: absolute;
          left: 50px;
          top: 100px;
          width: 2px;
          height: calc(100% + 3rem);
          background: linear-gradient(
            to bottom,
            rgba(212, 175, 55, 0.5),
            rgba(212, 175, 55, 0.1)
          );
        }

        .timeline-step--active .timeline-step__line {
          background: linear-gradient(
            to bottom,
            rgba(212, 175, 55, 0.8),
            rgba(212, 175, 55, 0.3)
          );
        }

        /* Número */
        .timeline-step__number-container {
          position: relative;
          width: 100px;
          height: 100px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .timeline-step__number {
          width: 100px;
          height: 100px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(27, 54, 93, 0.5);
          border: 2px solid rgba(212, 175, 55, 0.3);
          border-radius: 50%;
          font-size: 2rem;
          font-weight: 900;
          color: #d4af37;
          transition: all 0.4s ease;
          position: relative;
          z-index: 2;
        }

        .timeline-step--active .timeline-step__number {
          background: rgba(212, 175, 55, 0.2);
          border-color: rgba(212, 175, 55, 0.8);
          transform: scale(1.1);
          box-shadow: 0 0 30px rgba(212, 175, 55, 0.4);
        }

        /* Pulse effect */
        .timeline-step__pulse {
          position: absolute;
          inset: -5px;
          border: 2px solid #d4af37;
          border-radius: 50%;
          opacity: 0;
          animation: pulse 2s ease-out infinite;
        }

        .timeline-step--active .timeline-step__pulse {
          animation: pulse 2s ease-out infinite;
        }

        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 0.8;
          }
          100% {
            transform: scale(1.3);
            opacity: 0;
          }
        }

        /* Card */
        .timeline-step__card {
          position: relative;
          padding: 2.5rem;
          background: rgba(27, 54, 93, 0.3);
          border: 1px solid rgba(212, 175, 55, 0.2);
          border-radius: 20px;
          backdrop-filter: blur(10px);
          transition: all 0.4s ease;
          overflow: hidden;
        }

        .timeline-step--active .timeline-step__card {
          border-color: rgba(212, 175, 55, 0.5);
          transform: translateX(10px);
          box-shadow: 0 10px 40px rgba(212, 175, 55, 0.2);
        }

        /* Icon */
        .timeline-step__icon {
          width: 60px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(212, 175, 55, 0.1);
          border: 2px solid rgba(212, 175, 55, 0.3);
          border-radius: 12px;
          color: #d4af37;
          margin-bottom: 1.5rem;
          transition: all 0.3s ease;
        }

        .timeline-step--active .timeline-step__icon {
          transform: scale(1.1) rotate(5deg);
          background: rgba(212, 175, 55, 0.2);
          border-color: rgba(212, 175, 55, 0.5);
        }

        /* Title */
        .timeline-step__title {
          font-size: 1.75rem;
          font-weight: 700;
          color: #f5f5f5;
          margin: 0 0 1rem 0;
          transition: color 0.3s ease;
        }

        .timeline-step--active .timeline-step__title {
          color: #d4af37;
        }

        /* Description */
        .timeline-step__description {
          font-size: 1rem;
          line-height: 1.7;
          color: #a0a0a0;
          margin: 0;
        }

        /* Progress bar */
        .timeline-step__progress {
          position: absolute;
          bottom: 0;
          left: 0;
          height: 3px;
          width: 0;
          background: linear-gradient(90deg, #d4af37, #f4d03f);
          transition: width 0.6s ease;
        }

        .timeline-step--active .timeline-step__progress {
          width: 100%;
        }

        /* RESPONSIVE */
        @media (max-width: 1024px) {
          .process-timeline__title {
            font-size: 3rem;
          }

          .timeline-step {
            grid-template-columns: 80px 1fr;
            gap: 2rem;
          }

          .timeline-step__number-container,
          .timeline-step__number {
            width: 80px;
            height: 80px;
          }

          .timeline-step__number {
            font-size: 1.5rem;
          }

          .timeline-step__line {
            left: 40px;
          }
        }

        @media (max-width: 768px) {
          .process-timeline {
            padding: 5rem 1.5rem;
          }

          .process-timeline__header {
            margin-bottom: 4rem;
          }

          .process-timeline__title {
            font-size: 2.5rem;
          }

          .process-timeline__description {
            font-size: 1.1rem;
          }

          .timeline-step {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }

          .timeline-step__number-container {
            justify-self: start;
          }

          .timeline-step__line {
            display: none;
          }

          .timeline-step__card {
            padding: 2rem;
          }

          .timeline-step__icon {
            width: 50px;
            height: 50px;
          }

          .timeline-step__title {
            font-size: 1.5rem;
          }

          .timeline-step__description {
            font-size: 0.95rem;
          }

          .timeline-step--active .timeline-step__card {
            transform: translateX(0);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .timeline-step,
          .timeline-step__number,
          .timeline-step__icon,
          .timeline-step__pulse {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>
    </>
  );
}