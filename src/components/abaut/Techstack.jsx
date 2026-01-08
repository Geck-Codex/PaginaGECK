import { useState, useEffect, useRef } from 'react';

export default function TechStack() {
  const [visibleTechs, setVisibleTechs] = useState([]);
  const [hoveredTech, setHoveredTech] = useState(null);
  const sectionRef = useRef(null);

  const technologies = [
    {
      id: 1,
      name: "React",
      category: "Frontend",
      description: "Biblioteca de JavaScript para interfaces de usuario",
      color: "#61DAFB"
    },
    {
      id: 2,
      name: "Node.js",
      category: "Backend",
      description: "Entorno de ejecución JavaScript del lado del servidor",
      color: "#339933"
    },
    {
      id: 3,
      name: "Python",
      category: "Backend",
      description: "Lenguaje versátil para IA, ML y desarrollo web",
      color: "#3776AB"
    },
    {
      id: 4,
      name: "TypeScript",
      category: "Frontend",
      description: "JavaScript con tipado estático para código robusto",
      color: "#3178C6"
    },
    {
      id: 5,
      name: "PostgreSQL",
      category: "Database",
      description: "Base de datos relacional potente y escalable",
      color: "#4169E1"
    },
    {
      id: 6,
      name: "MongoDB",
      category: "Database",
      description: "Base de datos NoSQL flexible y escalable",
      color: "#47A248"
    },
    {
      id: 7,
      name: "AWS",
      category: "Cloud",
      description: "Servicios de nube para infraestructura escalable",
      color: "#FF9900"
    },
    {
      id: 8,
      name: "Docker",
      category: "DevOps",
      description: "Contenedores para despliegue consistente",
      color: "#2496ED"
    },
    {
      id: 9,
      name: "Next.js",
      category: "Frontend",
      description: "Framework de React para aplicaciones fullstack",
      color: "#000000"
    },
    {
      id: 10,
      name: "Vue.js",
      category: "Frontend",
      description: "Framework progresivo para interfaces de usuario",
      color: "#4FC08D"
    },
    {
      id: 11,
      name: "TensorFlow",
      category: "AI/ML",
      description: "Plataforma de machine learning de código abierto",
      color: "#FF6F00"
    },
    {
      id: 12,
      name: "Firebase",
      category: "Backend",
      description: "Plataforma de desarrollo de aplicaciones móviles y web",
      color: "#FFCA28"
    }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            technologies.forEach((_, index) => {
              setTimeout(() => {
                setVisibleTechs((prev) => [...new Set([...prev, index])]);
              }, index * 80);
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
      <section className="tech-stack" ref={sectionRef}>
        <div className="tech-stack__container">
          {/* Header */}
          <div className="tech-stack__header">
            <div className="tech-stack__badge">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 2L12.5 7L18 8L14 12L15 18L10 15L5 18L6 12L2 8L7.5 7L10 2Z" fill="currentColor"/>
              </svg>
              <span>Tecnologías</span>
            </div>
            <h2 className="tech-stack__title">
              Trabajamos Con Las Mejores
              <span className="tech-stack__title-highlight"> Herramientas del Mercado</span>
            </h2>
            <p className="tech-stack__description">
              Dominamos un amplio stack tecnológico que nos permite elegir 
              las herramientas perfectas para cada proyecto.
            </p>
          </div>

          {/* Grid de tecnologías */}
          <div className="tech-stack__grid">
            {technologies.map((tech, index) => (
              <div
                key={tech.id}
                className={`tech-card ${visibleTechs.includes(index) ? 'tech-card--visible' : ''} ${hoveredTech === tech.id ? 'tech-card--hovered' : ''}`}
                onMouseEnter={() => setHoveredTech(tech.id)}
                onMouseLeave={() => setHoveredTech(null)}
                style={{
                  animationDelay: `${index * 0.08}s`
                }}
              >
                {/* Glow effect */}
                <div 
                  className="tech-card__glow"
                  style={{
                    background: `radial-gradient(circle at center, ${tech.color}20, transparent)`
                  }}
                ></div>

                {/* Icon placeholder (usa el color de la tech) */}
                <div 
                  className="tech-card__icon"
                  style={{
                    background: `${tech.color}15`,
                    borderColor: `${tech.color}30`
                  }}
                >
                  <div 
                    className="tech-card__icon-inner"
                    style={{ background: tech.color }}
                  ></div>
                </div>

                {/* Content */}
                <div className="tech-card__content">
                  <h3 className="tech-card__name">{tech.name}</h3>
                  <span 
                    className="tech-card__category"
                    style={{ color: tech.color }}
                  >
                    {tech.category}
                  </span>
                  <p className="tech-card__description">{tech.description}</p>
                </div>

                {/* Hover indicator */}
                <div 
                  className="tech-card__border"
                  style={{ borderColor: tech.color }}
                ></div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="tech-stack__cta">
            <p className="tech-stack__cta-text">
              ¿No encuentras la tecnología que buscas?
            </p>
            <button className="tech-stack__cta-button">
              <span>Hablemos de tu proyecto</span>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M7 3L14 10L7 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </section>

      <style>{`
        /* SECCIÓN PRINCIPAL */
        .tech-stack {
          position: relative;
          width: 100%;
          background: linear-gradient(to bottom, #000000, #0b1f49);
          padding: 8rem 2rem;
          overflow: hidden;
        }

        .tech-stack__container {
          max-width: 1400px;
          margin: 0 auto;
        }

        /* HEADER */
        .tech-stack__header {
          text-align: center;
          margin-bottom: 5rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.5rem;
        }

        .tech-stack__badge {
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

        .tech-stack__title {
          font-size: 3.5rem;
          font-weight: 900;
          line-height: 1.2;
          color: #f5f5f5;
          margin: 0;
          max-width: 800px;
        }

        .tech-stack__title-highlight {
          background: linear-gradient(135deg, #d4af37 0%, #f4d03f 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          display: inline-block;
        }

        .tech-stack__description {
          font-size: 1.2rem;
          line-height: 1.8;
          color: #a0a0a0;
          margin: 0;
          max-width: 600px;
        }

        /* GRID */
        .tech-stack__grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1.5rem;
          margin-bottom: 5rem;
        }

        /* TECH CARD */
        .tech-card {
          position: relative;
          padding: 2rem;
          background: rgba(27, 54, 93, 0.2);
          border: 1px solid rgba(212, 175, 55, 0.15);
          border-radius: 20px;
          backdrop-filter: blur(10px);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          opacity: 0;
          transform: translateY(30px) scale(0.9);
          overflow: hidden;
          cursor: pointer;
        }

        .tech-card--visible {
          animation: techCardAppear 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        @keyframes techCardAppear {
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .tech-card:hover {
          transform: translateY(-8px) scale(1.02);
          border-color: rgba(212, 175, 55, 0.4);
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
        }

        /* Glow effect */
        .tech-card__glow {
          position: absolute;
          inset: 0;
          opacity: 0;
          transition: opacity 0.4s ease;
        }

        .tech-card:hover .tech-card__glow {
          opacity: 1;
        }

        /* Icon */
        .tech-card__icon {
          width: 70px;
          height: 70px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid;
          border-radius: 16px;
          margin-bottom: 1.5rem;
          transition: all 0.4s ease;
          position: relative;
          z-index: 1;
        }

        .tech-card:hover .tech-card__icon {
          transform: scale(1.1) rotate(-5deg);
        }

        .tech-card__icon-inner {
          width: 35px;
          height: 35px;
          border-radius: 8px;
          transition: all 0.4s ease;
        }

        .tech-card:hover .tech-card__icon-inner {
          transform: rotate(180deg);
        }

        /* Content */
        .tech-card__content {
          position: relative;
          z-index: 1;
        }

        .tech-card__name {
          font-size: 1.5rem;
          font-weight: 700;
          color: #f5f5f5;
          margin: 0 0 0.5rem 0;
          transition: color 0.3s ease;
        }

        .tech-card:hover .tech-card__name {
          color: #d4af37;
        }

        .tech-card__category {
          display: inline-block;
          font-size: 0.85rem;
          font-weight: 600;
          padding: 0.25rem 0.75rem;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 20px;
          margin-bottom: 1rem;
          transition: all 0.3s ease;
        }

        .tech-card__description {
          font-size: 0.95rem;
          line-height: 1.6;
          color: #a0a0a0;
          margin: 1rem 0 0 0;
          opacity: 0.8;
          transition: opacity 0.3s ease;
        }

        .tech-card:hover .tech-card__description {
          opacity: 1;
        }

        /* Hover border */
        .tech-card__border {
          position: absolute;
          inset: -1px;
          border: 2px solid;
          border-radius: 20px;
          opacity: 0;
          transition: opacity 0.4s ease;
          pointer-events: none;
        }

        .tech-card:hover .tech-card__border {
          opacity: 0.6;
        }

        /* CTA */
        .tech-stack__cta {
          text-align: center;
          padding: 3rem;
          background: rgba(27, 54, 93, 0.3);
          border: 1px solid rgba(212, 175, 55, 0.2);
          border-radius: 24px;
          backdrop-filter: blur(10px);
        }

        .tech-stack__cta-text {
          font-size: 1.25rem;
          color: #f5f5f5;
          margin: 0 0 1.5rem 0;
          font-weight: 600;
        }

        .tech-stack__cta-button {
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem 2rem;
          background: linear-gradient(135deg, #d4af37 0%, #f4d03f 100%);
          color: #0b1f49;
          border: none;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 20px rgba(212, 175, 55, 0.3);
        }

        .tech-stack__cta-button:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 30px rgba(212, 175, 55, 0.5);
        }

        /* RESPONSIVE */
        @media (max-width: 1024px) {
          .tech-stack__title {
            font-size: 3rem;
          }

          .tech-stack__grid {
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          }
        }

        @media (max-width: 768px) {
          .tech-stack {
            padding: 5rem 1.5rem;
          }

          .tech-stack__header {
            margin-bottom: 3rem;
          }

          .tech-stack__title {
            font-size: 2.5rem;
          }

          .tech-stack__description {
            font-size: 1.1rem;
          }

          .tech-stack__grid {
            grid-template-columns: 1fr;
            gap: 1rem;
            margin-bottom: 3rem;
          }

          .tech-card {
            padding: 1.5rem;
          }

          .tech-card__icon {
            width: 60px;
            height: 60px;
          }

          .tech-card__icon-inner {
            width: 30px;
            height: 30px;
          }

          .tech-card__name {
            font-size: 1.25rem;
          }

          .tech-card__description {
            font-size: 0.9rem;
          }

          .tech-stack__cta {
            padding: 2rem 1.5rem;
          }

          .tech-stack__cta-text {
            font-size: 1.1rem;
          }

          .tech-stack__cta-button {
            width: 100%;
            justify-content: center;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .tech-card,
          .tech-card__icon,
          .tech-card__icon-inner {
            transition: none !important;
            animation: none !important;
          }
        }
      `}</style>
    </>
  );
}