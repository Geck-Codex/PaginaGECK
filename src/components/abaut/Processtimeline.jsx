import { useState, useEffect, useRef } from 'react';

export default function ProcessTimeline() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [visibleSteps, setVisibleSteps] = useState([]);
  const [activeStep, setActiveStep] = useState(-1);
  const sectionRef = useRef(null);
  const timelineRef = useRef(null);
  const stepRefs = useRef([]);

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

  // Maneja el progreso del scroll con IntersectionObserver
  useEffect(() => {
    const handleScroll = () => {
      if (!timelineRef.current) return;

      const rect = timelineRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const scrollStart = rect.top;
      const scrollEnd = rect.bottom - windowHeight;
      const scrollDistance = scrollEnd - scrollStart;
      
      let progress = 0;
      if (scrollStart > 0) {
        progress = 0;
      } else if (scrollEnd < 0) {
        progress = 100;
      } else {
        progress = Math.min(100, Math.max(0, (Math.abs(scrollStart) / scrollDistance) * 100));
      }

      setScrollProgress(progress);
    };

    // IntersectionObserver para cada step individual
    const observerOptions = {
      threshold: [0, 0.2, 0.5, 0.8, 1],
      rootMargin: '-10% 0px -10% 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const index = Number(entry.target.dataset.index);
        
        // Marca como visible cuando entra al viewport
        if (entry.isIntersecting && entry.intersectionRatio >= 0.2) {
          setVisibleSteps(prev => {
            if (!prev.includes(index)) {
              return [...prev, index].sort((a, b) => a - b);
            }
            return prev;
          });
        }

        // Marca como activo cuando está centrado
        if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
          setActiveStep(index);
        }
      });
    }, observerOptions);

    // Observa cada step
    stepRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
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
          <div className="process-timeline__steps" ref={timelineRef}>
            {/* Raíz/línea principal que crece */}
            <svg className="timeline-root" viewBox="0 0 200 1000" preserveAspectRatio="none">
              <defs>
                <linearGradient id="rootGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#d4af37" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#d4af37" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#d4af37" stopOpacity="0.2" />
                </linearGradient>
                
                <filter id="glow">
                  <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              
              {/* Línea principal orgánica */}
              <path
                d="M100,0 Q90,100 100,200 Q110,300 100,400 Q95,500 100,600 Q105,700 100,800 Q100,900 100,1000"
                fill="none"
                stroke="url(#rootGradient)"
                strokeWidth="6"
                filter="url(#glow)"
                strokeDasharray="1000"
                strokeDashoffset={1000 - (scrollProgress * 10)}
                style={{ transition: 'stroke-dashoffset 0.3s ease-out' }}
              />
              
              {/* Ramificaciones secundarias */}
              {steps.map((_, index) => {
                const yPos = (index / (steps.length - 1)) * 1000;
                const isVisible = visibleSteps.includes(index);
                return (
                  <g key={index} opacity={isVisible ? 1 : 0} style={{ transition: 'opacity 0.5s ease' }}>
                    <path
                      d={`M100,${yPos} Q${index % 2 === 0 ? 70 : 130},${yPos + 20} ${index % 2 === 0 ? 50 : 150},${yPos + 30}`}
                      fill="none"
                      stroke="#d4af37"
                      strokeWidth="3"
                      opacity="0.4"
                      strokeDasharray="100"
                      strokeDashoffset={isVisible ? 0 : 100}
                      style={{ transition: 'stroke-dashoffset 0.8s ease-out' }}
                    />
                  </g>
                );
              })}
            </svg>

            {/* Steps Container */}
            <div className="timeline-step-wrapper">
              {steps.map((step, index) => {
                const isVisible = visibleSteps.includes(index);
                const isActive = activeStep === index;
                
                return (
                  <div
                    key={step.id}
                    ref={(el) => (stepRefs.current[index] = el)}
                    data-index={index}
                    className={`timeline-step ${isVisible ? 'timeline-step--visible' : ''} ${isActive ? 'timeline-step--active' : ''}`}
                    style={{
                      '--step-index': index,
                      '--delay': `${index * 0.1}s`
                    }}
                  >
                    {/* Nodo/semilla en la raíz */}
                    <div className="timeline-step__node">
                      <div className="timeline-step__node-inner">
                        <div className="timeline-step__node-number">{step.number}</div>
                      </div>
                      {isActive && (
                        <>
                          <div className="timeline-step__node-pulse"></div>
                          <div className="timeline-step__node-pulse timeline-step__node-pulse--delay"></div>
                        </>
                      )}
                    </div>

                    {/* Card que crece desde el nodo */}
                    <div className="timeline-step__card">
                      <div className="timeline-step__card-inner">
                        <div className="timeline-step__icon">
                          {step.icon}
                        </div>
                        <h3 className="timeline-step__title">{step.title}</h3>
                        <p className="timeline-step__description">{step.description}</p>
                        
                        {/* Hojas decorativas */}
                        <div className="timeline-step__leaf timeline-step__leaf--1"></div>
                        <div className="timeline-step__leaf timeline-step__leaf--2"></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Partículas flotantes */}
        <div className="floating-particles">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="particle"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${5 + Math.random() * 10}s`
              }}
            />
          ))}
        </div>
      </section>

      <style>{`
        /* SECCIÓN PRINCIPAL */
        .process-timeline {
          position: relative;
          width: 100%;
          background: transparent;
          padding: 8rem 2rem;
          overflow: hidden;
        }

        .process-timeline__container {
          max-width: 1400px;
          margin: 0 auto;
        }

        /* HEADER */
        .process-timeline__header {
          text-align: center;
          margin-bottom: 8rem;
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

        /* TIMELINE STEPS CONTAINER */
        .process-timeline__steps {
          position: relative;
          min-height: 350vh;
          padding: 0 2rem;
        }

        /* SVG RAÍZ */
        .timeline-root {
          position: absolute;
          left: 50%;
          top: 0;
          width: 200px;
          height: 100%;
          transform: translateX(-50%);
          pointer-events: none;
          z-index: 1;
        }

        /* WRAPPER PARA LOS STEPS */
        .timeline-step-wrapper {
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 20vh;
          padding: 15vh 0;
        }

        /* STEP */
        .timeline-step {
          position: relative;
          display: grid;
          grid-template-columns: 1fr 80px 1fr;
          gap: 3rem;
          align-items: center;
          opacity: 0;
          transform: scale(0.85) translateY(60px);
          transition: all 1s cubic-bezier(0.34, 1.56, 0.64, 1);
          min-height: 280px;
        }

        .timeline-step:nth-child(odd) .timeline-step__card {
          grid-column: 1;
          grid-row: 1;
        }

        .timeline-step:nth-child(odd) .timeline-step__node {
          grid-column: 2;
          grid-row: 1;
        }

        .timeline-step:nth-child(even) .timeline-step__card {
          grid-column: 3;
          grid-row: 1;
        }

        .timeline-step:nth-child(even) .timeline-step__node {
          grid-column: 2;
          grid-row: 1;
        }

        .timeline-step--visible {
          opacity: 1;
          transform: scale(1) translateY(0);
        }

        /* NODO (Semilla en la raíz) */
        .timeline-step__node {
          position: relative;
          width: 80px;
          height: 80px;
          z-index: 10;
          justify-self: center;
          opacity: 0;
          transform: scale(0) rotate(-180deg);
          transition: all 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }

        .timeline-step--visible .timeline-step__node {
          opacity: 1;
          transform: scale(1) rotate(0deg);
          transition-delay: 0.2s;
        }

        .timeline-step__node-inner {
          width: 100%;
          height: 100%;
          background: radial-gradient(circle, rgba(212, 175, 55, 0.3), rgba(212, 175, 55, 0.1));
          border: 3px solid rgba(212, 175, 55, 0.5);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          z-index: 2;
          backdrop-filter: blur(10px);
          transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .timeline-step--active .timeline-step__node-inner {
          background: radial-gradient(circle, rgba(212, 175, 55, 0.5), rgba(212, 175, 55, 0.2));
          border-color: #d4af37;
          box-shadow: 
            0 0 40px rgba(212, 175, 55, 0.8),
            inset 0 0 30px rgba(212, 175, 55, 0.3);
          transform: scale(1.2) rotate(360deg);
        }

        .timeline-step__node-number {
          font-size: 1.5rem;
          font-weight: 900;
          color: #d4af37;
          text-shadow: 0 0 10px rgba(212, 175, 55, 0.5);
          transition: transform 0.3s ease;
        }

        .timeline-step--active .timeline-step__node-number {
          transform: scale(1.1);
        }

        /* Pulsos del nodo */
        .timeline-step__node-pulse {
          position: absolute;
          inset: -10px;
          border: 2px solid #d4af37;
          border-radius: 50%;
          animation: nodePulse 2s ease-out infinite;
        }

        .timeline-step__node-pulse--delay {
          animation-delay: 1s;
        }

        @keyframes nodePulse {
          0% {
            transform: scale(1);
            opacity: 0.8;
          }
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }

        /* CARD */
        .timeline-step__card {
          position: relative;
          opacity: 0;
          transform: translateX(-60px) scale(0.9);
          transition: all 0.9s cubic-bezier(0.34, 1.56, 0.64, 1);
          transition-delay: var(--delay, 0s);
        }

        .timeline-step:nth-child(even) .timeline-step__card {
          transform: translateX(60px) scale(0.9);
        }

        .timeline-step--visible .timeline-step__card {
          opacity: 1;
          transform: translateX(0) scale(1);
          transition-delay: 0.4s;
        }

        .timeline-step__card-inner {
          position: relative;
          padding: 2.5rem;
          background: rgba(27, 54, 93, 0.4);
          border: 2px solid rgba(212, 175, 55, 0.2);
          border-radius: 24px;
          backdrop-filter: blur(10px);
          overflow: hidden;
          transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .timeline-step--active .timeline-step__card-inner {
          border-color: rgba(212, 175, 55, 0.6);
          background: rgba(27, 54, 93, 0.7);
          box-shadow: 
            0 25px 70px rgba(212, 175, 55, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.15);
          transform: translateY(-15px) scale(1.03);
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
          border-radius: 16px;
          color: #d4af37;
          margin-bottom: 1.5rem;
          transition: all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
          transform-origin: center;
        }

        .timeline-step--active .timeline-step__icon {
          transform: scale(1.15) rotate(10deg);
          background: rgba(212, 175, 55, 0.25);
          border-color: #d4af37;
          box-shadow: 0 0 30px rgba(212, 175, 55, 0.4);
        }

        /* Title */
        .timeline-step__title {
          font-size: 1.75rem;
          font-weight: 700;
          color: #f5f5f5;
          margin: 0 0 1rem 0;
          transition: all 0.4s ease;
          transform-origin: left center;
        }

        .timeline-step--active .timeline-step__title {
          color: #d4af37;
          transform: scale(1.02);
          text-shadow: 0 0 20px rgba(212, 175, 55, 0.3);
        }

        /* Description */
        .timeline-step__description {
          font-size: 1rem;
          line-height: 1.7;
          color: #a0a0a0;
          margin: 0;
          transition: color 0.3s ease;
        }

        .timeline-step--active .timeline-step__description {
          color: #b8b8b8;
        }

        /* Hojas decorativas */
        .timeline-step__leaf {
          position: absolute;
          width: 50px;
          height: 50px;
          background: radial-gradient(ellipse at center, rgba(212, 175, 55, 0.4), transparent);
          border-radius: 0 100% 0 100%;
          opacity: 0;
          transition: all 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }

        .timeline-step__leaf--1 {
          top: 10px;
          right: 10px;
          transform: rotate(45deg) scale(0);
        }

        .timeline-step__leaf--2 {
          bottom: 10px;
          left: 10px;
          transform: rotate(-135deg) scale(0);
        }

        .timeline-step--active .timeline-step__leaf {
          opacity: 0.7;
        }

        .timeline-step--active .timeline-step__leaf--1 {
          transform: rotate(45deg) scale(1) translateX(5px) translateY(-5px);
          transition-delay: 0.2s;
        }

        .timeline-step--active .timeline-step__leaf--2 {
          transform: rotate(-135deg) scale(1) translateX(-5px) translateY(5px);
          transition-delay: 0.3s;
        }

        /* PARTÍCULAS FLOTANTES */
        .floating-particles {
          position: absolute;
          inset: 0;
          pointer-events: none;
          overflow: hidden;
        }

        .particle {
          position: absolute;
          width: 5px;
          height: 5px;
          background: radial-gradient(circle, #d4af37, transparent);
          border-radius: 50%;
          animation: float linear infinite;
          opacity: 0;
        }

        @keyframes float {
          0% {
            transform: translateY(100vh) scale(0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100px) scale(1.5) rotate(360deg);
            opacity: 0;
          }
        }

        /* RESPONSIVE */
        @media (max-width: 1024px) {
          .process-timeline__title {
            font-size: 3rem;
          }

          .timeline-step {
            grid-template-columns: 1fr 70px 1fr;
            gap: 2rem;
            min-height: 220px;
          }

          .timeline-step__node {
            width: 70px;
            height: 70px;
          }

          .timeline-step-wrapper {
            gap: 18vh;
          }
        }

        @media (max-width: 768px) {
          .process-timeline {
            padding: 5rem 1rem;
          }

          .process-timeline__header {
            margin-bottom: 5rem;
          }

          .process-timeline__title {
            font-size: 2.5rem;
          }

          .process-timeline__description {
            font-size: 1.1rem;
          }

          .process-timeline__steps {
            padding: 0;
            min-height: auto;
          }

          .timeline-step-wrapper {
            gap: 12vh;
            padding: 8vh 0;
          }

          .timeline-step {
            grid-template-columns: 70px 1fr;
            gap: 1.5rem;
            min-height: auto;
          }

          .timeline-step__node {
            grid-column: 1;
            grid-row: 1;
            justify-self: start;
            width: 60px;
            height: 60px;
          }

          .timeline-step__card {
            grid-column: 2;
            grid-row: 1;
          }

          .timeline-step:nth-child(odd) .timeline-step__card,
          .timeline-step:nth-child(even) .timeline-step__card {
            grid-column: 2;
          }

          .timeline-step:nth-child(odd) .timeline-step__node,
          .timeline-step:nth-child(even) .timeline-step__node {
            grid-column: 1;
          }

          .timeline-root {
            left: 35px;
            width: 100px;
          }

          .timeline-step__card-inner {
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

          .timeline-step__node-number {
            font-size: 1.2rem;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          * {
            animation: none !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </>
  );
}