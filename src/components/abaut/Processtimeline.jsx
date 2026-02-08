import { useState, useEffect, useRef } from 'react';

export default function ProcessTimeline() {
  const [visibleSteps, setVisibleSteps] = useState([]);
  const [scrollY, setScrollY] = useState(0);
  const stepRefs = useRef([]);
  const containerRef = useRef(null);
  const headerRef = useRef(null);

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

  // Parallax scroll handler
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      const scrollStart = rect.top;
      const scrollEnd = rect.bottom - windowHeight;
      const scrollDistance = scrollEnd - scrollStart;
      
      if (scrollStart < windowHeight && scrollEnd > 0) {
        const progress = (windowHeight - scrollStart) / (scrollDistance + windowHeight);
        setScrollY(progress);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // IntersectionObserver con entrada Y salida MEJORADO
  useEffect(() => {
    const observerOptions = {
      threshold: [0, 0.1, 0.2, 0.3], // Umbrales más finos
      rootMargin: '-50px 0px -50px 0px' // Margen un poco más ajustado para que la salida sea visible
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const index = Number(entry.target.dataset.index);
        
        // Ajustamos ligeramente el ratio para disparar la animación
        if (entry.isIntersecting && entry.intersectionRatio >= 0.15) {
          // ENTRADA
          // Pequeño delay natural basado en el índice para evitar bloqueos si scrollea muy rápido
          setVisibleSteps(prev => {
            if (!prev.includes(index)) {
              return [...prev, index].sort((a, b) => a - b);
            }
            return prev;
          });
        } else if (!entry.isIntersecting) {
          // SALIDA
          setVisibleSteps(prev => prev.filter(i => i !== index));
        }
      });
    }, observerOptions);

    stepRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  // Calcular transformación parallax para el header
  const headerTransform = {
    y: scrollY * 300 - 150,
    scale: 1 - scrollY * 0.2,
    opacity: 1 - scrollY * 0.8
  };

  return (
    <>
      <section className="process-timeline" ref={containerRef}>
        <div className="process-timeline__container">
          {/* Header con Parallax */}
          <div 
            className="process-timeline__header"
            ref={headerRef}
            style={{
              transform: `translateY(${headerTransform.y}px) scale(${headerTransform.scale})`,
              opacity: headerTransform.opacity,
              transition: 'none'
            }}
          >
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

          {/* Steps en Zig-Zag */}
          <div className="process-timeline__steps">
            {steps.map((step, index) => {
              const isVisible = visibleSteps.includes(index);
              const isLeft = index % 2 === 0;
              
              return (
                <div
                  key={step.id}
                  ref={(el) => (stepRefs.current[index] = el)}
                  data-index={index}
                  className={`timeline-step ${isLeft ? 'timeline-step--left' : 'timeline-step--right'} ${isVisible ? 'timeline-step--visible' : ''}`}
                  style={{
                    '--delay': `${index * 0.1}s`
                  }}
                >
                  {/* Número con efecto explosivo */}
                  <div className="timeline-step__number">
                    <div className="timeline-step__number-inner">
                      <span className="timeline-step__number-text">{step.number}</span>
                      <div className="timeline-step__number-ring"></div>
                      <div className="timeline-step__number-ring timeline-step__number-ring--delay"></div>
                    </div>
                  </div>

                  {/* Card limpia - SIN decoraciones */}
                  <div className="timeline-step__card">
                    <div className="timeline-step__card-inner">
                      <div className="timeline-step__icon">
                        {step.icon}
                      </div>
                      <h3 className="timeline-step__title">{step.title}</h3>
                      <p className="timeline-step__description">{step.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
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
                animationDuration: `${5 + Math.random() * 10}s`,
                '--size': `${2 + Math.random() * 4}px`
              }}
            />
          ))}
        </div>

        {/* Gradiente de fondo animado */}
        <div className="background-gradient"></div>
      </section>

      <style>{`
        /* SECCIÓN PRINCIPAL */
        .process-timeline {
          position: relative;
          width: 100%;
          background: transparent;
          padding: 12rem 2rem 8rem;
          overflow: hidden;
          min-height: 200vh;
        }

        .process-timeline__container {
          max-width: 1200px;
          margin: 0 auto;
          position: relative;
          z-index: 2;
        }

        /* GRADIENTE DE FONDO ANIMADO */
        .background-gradient {
          position: absolute;
          inset: 0;
          background: radial-gradient(
            ellipse 80% 50% at 50% 50%,
            rgba(212, 175, 55, 0.05),
            transparent
          );
          animation: breathe 8s ease-in-out infinite;
          pointer-events: none;
        }

        @keyframes breathe {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.1); }
        }

        /* HEADER CON PARALLAX */
        .process-timeline__header {
          text-align: center;
          margin-bottom: 8rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.5rem;
          will-change: transform, opacity;
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
          animation: badgePulse 3s ease-in-out infinite;
        }

        @keyframes badgePulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(212, 175, 55, 0.4); }
          50% { box-shadow: 0 0 20px 5px rgba(212, 175, 55, 0.2); }
        }

        .process-timeline__title {
          font-size: 4rem;
          font-weight: 900;
          line-height: 1.1;
          color: #f5f5f5;
          margin: 0;
          max-width: 900px;
          text-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
        }

        .process-timeline__title-highlight {
          background: linear-gradient(135deg, #d4af37 0%, #f4d03f 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          display: block;
          font-weight: 300;
          text-transform: uppercase;
          font-size: 0.35em;
          letter-spacing: 0.5em;
          margin-top: 1rem;
        }

        .process-timeline__description {
          font-size: 1.2rem;
          line-height: 1.8;
          color: #a0a0a0;
          margin: 0;
          max-width: 600px;
        }

        /* STEPS CONTAINER */
        .process-timeline__steps {
          display: flex;
          flex-direction: column;
          gap: 6rem;
          padding: 4rem 0;
        }

        /* --- AQUÍ ESTÁN LAS MEJORAS DE ANIMACIÓN --- */
        
        .timeline-step {
          display: flex;
          align-items: center;
          gap: 3rem;
          opacity: 0;
          /* Añadimos blur y ajustamos la posición inicial */
          filter: blur(15px); 
          /* Usamos una curva Bézier más lujosa para la transición */
          transition: all 0.8s cubic-bezier(0.23, 1, 0.32, 1);
          perspective: 1000px;
          will-change: transform, opacity, filter;
        }

        .timeline-step--left {
          flex-direction: row;
          /* Movimiento más sutil, menos rotación exagerada */
          transform: translateX(-60px) translateY(40px) scale(0.95) rotateY(-5deg);
        }

        .timeline-step--right {
          flex-direction: row-reverse;
          /* Movimiento más sutil */
          transform: translateX(60px) translateY(40px) scale(0.95) rotateY(5deg);
        }

        /* ESTADO VISIBLE (ENTRADA) */
        .timeline-step--visible {
          opacity: 1;
          filter: blur(0);
          transform: translateX(0) translateY(0) scale(1) rotateX(0deg) rotateY(0deg);
        }

        /* ------------------------------------------- */

        /* NÚMERO CON EFECTO */
        .timeline-step__number {
          flex-shrink: 0;
          width: 100px;
          height: 100px;
          position: relative;
        }

        .timeline-step__number-inner {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: radial-gradient(circle, rgba(212, 175, 55, 0.4), rgba(212, 175, 55, 0.05));
          border: 3px solid rgba(212, 175, 55, 0.6);
          border-radius: 50%;
          backdrop-filter: blur(10px);
          box-shadow: 
            0 0 30px rgba(212, 175, 55, 0.5),
            inset 0 0 30px rgba(212, 175, 55, 0.2);
          position: relative;
          z-index: 2;
          /* Transición mejorada */
          transition: all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
          transform: scale(0) rotate(-90deg);
        }

        .timeline-step--visible .timeline-step__number-inner {
          transform: scale(1) rotate(0deg);
        }

        .timeline-step__number-text {
          font-size: 1.8rem;
          font-weight: 900;
          color: #d4af37;
          text-shadow: 0 0 20px rgba(212, 175, 55, 0.8);
          position: relative;
          z-index: 3;
        }

        /* Anillos expansivos */
        .timeline-step__number-ring {
          position: absolute;
          inset: -15px;
          border: 2px solid #d4af37;
          border-radius: 50%;
          opacity: 0;
          z-index: 1;
        }

        .timeline-step--visible .timeline-step__number-ring {
          animation: ringExpand 2s ease-out infinite;
        }

        .timeline-step__number-ring--delay {
          animation-delay: 0.5s;
        }

        @keyframes ringExpand {
          0% {
            transform: scale(1);
            opacity: 0.8;
          }
          100% {
            transform: scale(2.5);
            opacity: 0;
          }
        }

        .timeline-step:hover .timeline-step__number-inner {
          transform: scale(1.15) rotate(360deg);
          box-shadow: 
            0 0 50px rgba(212, 175, 55, 0.8),
            inset 0 0 40px rgba(212, 175, 55, 0.4);
        }

        /* CARD LIMPIA - SIN DECORACIONES */
        .timeline-step__card {
          flex: 1;
          max-width: 650px;
          transform-style: preserve-3d;
          perspective: 1000px;
        }

        .timeline-step__card-inner {
          position: relative;
          padding: 3rem;
          background: rgba(27, 54, 93, 0.5);
          border: 2px solid rgba(212, 175, 55, 0.3);
          border-radius: 28px;
          backdrop-filter: blur(15px);
          overflow: hidden;
          transition: all 0.5s ease;
        }

        .timeline-step:hover .timeline-step__card-inner {
          border-color: rgba(212, 175, 55, 0.6);
          background: rgba(27, 54, 93, 0.7);
          transform: translateY(-10px);
          box-shadow: 
            0 25px 60px rgba(212, 175, 55, 0.25),
            inset 0 2px 0 rgba(255, 255, 255, 0.15);
        }

        /* Icon */
        .timeline-step__icon {
          width: 70px;
          height: 70px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(212, 175, 55, 0.15);
          border: 2px solid rgba(212, 175, 55, 0.4);
          border-radius: 18px;
          color: #d4af37;
          margin-bottom: 1.5rem;
          transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
          transform: scale(0.5) translateY(20px);
          opacity: 0;
        }

        .timeline-step--visible .timeline-step__icon {
          transform: scale(1) translateY(0);
          opacity: 1;
          transition-delay: 0.15s;
        }

        .timeline-step:hover .timeline-step__icon {
          transform: scale(1.15) rotate(10deg);
          box-shadow: 0 0 30px rgba(212, 175, 55, 0.4);
          background: rgba(212, 175, 55, 0.25);
        }

        /* Title */
        .timeline-step__title {
          font-size: 2rem;
          font-weight: 700;
          color: #f5f5f5;
          margin: 0 0 1rem 0;
          transition: all 0.6s ease;
          transform: translateY(20px);
          opacity: 0;
        }

        .timeline-step--visible .timeline-step__title {
          transform: translateY(0);
          opacity: 1;
          transition-delay: 0.25s;
        }

        .timeline-step:hover .timeline-step__title {
          color: #d4af37;
          transform: translateX(5px);
          text-shadow: 0 0 25px rgba(212, 175, 55, 0.4);
        }

        /* Description */
        .timeline-step__description {
          font-size: 1.05rem;
          line-height: 1.8;
          color: #a0a0a0;
          margin: 0;
          transform: translateY(20px);
          opacity: 0;
          filter: blur(4px);
          transition: all 0.6s ease;
        }

        .timeline-step--visible .timeline-step__description {
          transform: translateY(0);
          opacity: 1;
          filter: blur(0);
          transition-delay: 0.35s;
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
          width: var(--size);
          height: var(--size);
          background: radial-gradient(circle, #d4af37, transparent);
          border-radius: 50%;
          animation: float linear infinite;
          opacity: 0;
          box-shadow: 0 0 10px rgba(212, 175, 55, 0.5);
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
            transform: translateY(-100px) scale(2) rotate(360deg);
            opacity: 0;
          }
        }

        /* RESPONSIVE */
        @media (max-width: 1024px) {
          .process-timeline__title {
            font-size: 3rem;
          }

          .timeline-step__number {
            width: 80px;
            height: 80px;
          }

          .timeline-step__card {
            max-width: 550px;
          }
        }

        @media (max-width: 768px) {
          .process-timeline {
            padding: 8rem 1rem 5rem;
            min-height: auto;
          }

          .process-timeline__header {
            margin-bottom: 5rem;
          }

          .process-timeline__title {
            font-size: 2.5rem;
          }

          .process-timeline__title-highlight {
            font-size: 0.4em;
            letter-spacing: 0.3em;
          }

          .process-timeline__description {
            font-size: 1.1rem;
          }

          .process-timeline__steps {
            gap: 4rem;
          }

          .timeline-step {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 2rem;
          }

          /* Ajuste responsive para la animación */
          .timeline-step--left,
          .timeline-step--right {
            transform: translateY(40px) scale(0.9);
          }

          .timeline-step--visible {
            transform: translateY(0) scale(1);
          }

          .timeline-step__number {
            width: 70px;
            height: 70px;
          }

          .timeline-step__number-text {
            font-size: 1.5rem;
          }

          .timeline-step__card {
            max-width: 100%;
            width: 100%;
          }

          .timeline-step__card-inner {
            padding: 2rem;
          }

          .timeline-step__icon {
            width: 60px;
            height: 60px;
          }

          .timeline-step__title {
            font-size: 1.5rem;
          }

          .timeline-step__description {
            font-size: 0.95rem;
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