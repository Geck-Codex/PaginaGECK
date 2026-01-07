import { useState, useEffect, useRef } from 'react';

// Componente de ondas animadas del footer
function AnimatedWavesBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setCanvasSize();

    // Olas animadas
    class Wave {
      constructor(y, amplitude, frequency, speed, color) {
        this.y = y;
        this.amplitude = amplitude;
        this.frequency = frequency;
        this.speed = speed;
        this.color = color;
        this.phase = Math.random() * Math.PI * 2;
      }

      draw(time) {
        ctx.beginPath();
        ctx.moveTo(0, canvas.height);

        for (let x = 0; x <= canvas.width; x += 5) {
          const y = this.y + Math.sin((x * this.frequency) + (time * this.speed) + this.phase) * this.amplitude;
          ctx.lineTo(x, y);
        }

        ctx.lineTo(canvas.width, canvas.height);
        ctx.lineTo(0, canvas.height);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
    }

    // Partículas flotantes
    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + 20;
        this.size = Math.random() * 3 + 1;
        this.speedY = Math.random() * 0.5 + 0.2;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.opacity = Math.random() * 0.5 + 0.3;
      }

      update() {
        this.y -= this.speedY;
        this.x += this.speedX;

        if (this.y < -20) {
          this.reset();
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212, 175, 55, ${this.opacity})`;
        ctx.shadowBlur = 15;
        ctx.shadowColor = `rgba(212, 175, 55, ${this.opacity})`;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    const waves = [
      new Wave(200, 30, 0.008, 0.0003, 'rgba(11, 14, 19, 0.5)'),
      new Wave(250, 25, 0.012, 0.0005, 'rgba(26, 29, 36, 0.4)'),
      new Wave(300, 20, 0.015, 0.0007, 'rgba(11, 14, 19, 0.3)')
    ];

    const particles = Array.from({ length: 50 }, () => new Particle());

    let animationTime = 0;
    let animationId;

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      waves.forEach(wave => wave.draw(animationTime));
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });
      animationTime += 0.016;
      animationId = requestAnimationFrame(animate);
    }

    animate();

    window.addEventListener('resize', setCanvasSize);
    return () => {
      window.removeEventListener('resize', setCanvasSize);
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        opacity: 0.6,
        pointerEvents: 'none',
        zIndex: 1,
      }}
    />
  );
}

export default function PortfolioSection() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [flippedCards, setFlippedCards] = useState({});
  const sectionRef = useRef(null);

  // Proyectos del portafolio con información extendida
  const projects = [
    {
      id: 1,
      title: "Fleet Management App",
      shortDesc: "App para gestión de flota elaborada para clientes de USA",
      fullDesc: "Sistema completo de rastreo y gestión de flotas vehiculares en tiempo real. Incluye monitoreo GPS, análisis de rutas, gestión de combustible y reportes detallados de rendimiento.",
      technologies: ["React Native", "Node.js", "PostgreSQL", "Google Maps API", "Socket.io"],
      image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&h=600&fit=crop"
    },
    {
      id: 2,
      title: "DrowsyGuard",
      shortDesc: "App para vigilar los microsueños a la hora de conducir",
      fullDesc: "Aplicación de seguridad vial que utiliza visión por computadora para detectar signos de fatiga y microsueños en conductores. Sistema de alertas inteligentes y análisis de patrones de conducción.",
      technologies: ["Python", "TensorFlow", "OpenCV", "React Native", "Firebase"],
      image: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800&h=600&fit=crop"
    },
    {
      id: 3,
      title: "Political Landing Page",
      shortDesc: "Landing page para figura pública",
      fullDesc: "Sitio web optimizado para campañas políticas con diseño responsive, integración de redes sociales, sistema de donaciones y blog de noticias. SEO avanzado para máxima visibilidad.",
      technologies: ["Next.js", "Tailwind CSS", "Stripe", "Contentful CMS", "Vercel"],
      image: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800&h=600&fit=crop"
    },
    {
      id: 4,
      title: "Badge Creator System",
      shortDesc: "App web para facilitar la creación de gafetes para organización gubernamental",
      fullDesc: "Sistema automatizado para diseño e impresión de credenciales oficiales. Incluye base de datos de empleados, plantillas personalizables, códigos QR y sistema de control de acceso.",
      technologies: ["React", "Express.js", "MongoDB", "PDF-lib", "QR Generator"],
      image: "https://images.unsplash.com/photo-1554224311-beee2ece2703?w=800&h=600&fit=crop"
    },
    {
      id: 5,
      title: "Men's E-Commerce",
      shortDesc: "E-commerce para empresa dedicada a la venta de productos masculinos",
      fullDesc: "Plataforma completa de comercio electrónico con carrito de compras, pasarela de pagos, gestión de inventario, sistema de reseñas y panel administrativo para control de ventas.",
      technologies: ["React", "Node.js", "Stripe", "MongoDB", "AWS S3"],
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop"
    },
    {
      id: 6,
      title: "Restaurante Villa Coronado",
      shortDesc: "Landing page para restaurante rústico del municipio de Villa Coronado",
      fullDesc: "Sitio web gastronómico con menú digital interactivo, sistema de reservaciones online, galería de platillos y integración con redes sociales para promociones.",
      technologies: ["Astro", "React", "Tailwind CSS", "Calendly API", "Cloudinary"],
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop"
    },
    {
      id: 7,
      title: "El Mezquite Cattle System",
      shortDesc: "App web para la gestión y control de ganado",
      fullDesc: "Sistema integral de administración ganadera con registro de animales, control de vacunación, monitoreo de alimentación, genealogía y reportes de producción.",
      technologies: ["Vue.js", "Laravel", "MySQL", "Chart.js", "PDF Export"],
      image: "https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=800&h=600&fit=crop"
    },
    {
      id: 8,
      title: "Gym Management Pro",
      shortDesc: "App web para el control y gestión de los usuarios del gym",
      fullDesc: "Plataforma completa de gestión para gimnasios con control de membresías, check-in digital, clases programadas, pagos automatizados y app móvil para miembros.",
      technologies: ["React", "Firebase", "Stripe", "React Native", "Node.js"],
      image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=600&fit=crop"
    },
    {
      id: 9,
      title: "JV Inventory AI",
      shortDesc: "App móvil que se encarga de ayudar con el inventario mediante IA",
      fullDesc: "Aplicación inteligente de inventario que usa reconocimiento de imágenes y IA para identificar productos, actualizar stock automáticamente y generar reportes predictivos.",
      technologies: ["React Native", "TensorFlow", "Python", "FastAPI", "PostgreSQL"],
      image: "https://images.unsplash.com/photo-1553413077-190dd305871c?w=800&h=600&fit=crop"
    },
    {
      id: 10,
      title: "PostureCheck System",
      shortDesc: "Sistema para detección de posturas correctas en empresas manufactureras",
      fullDesc: "Solución de visión artificial para monitoreo ergonómico en plantas industriales. Detecta posturas incorrectas en tiempo real y genera alertas preventivas de riesgos laborales.",
      technologies: ["Python", "OpenCV", "MediaPipe", "React", "WebSockets"],
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=600&fit=crop"
    }
  ];

  // Dividir proyectos en dos columnas
  const leftColumn = projects.filter((_, index) => index % 2 === 0);
  const rightColumn = projects.filter((_, index) => index % 2 !== 0);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;

      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      const sectionTop = rect.top;
      const sectionHeight = rect.height;
      
      const progress = Math.max(0, Math.min(1, (windowHeight - sectionTop) / (windowHeight + sectionHeight)));
      
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const getLeftColumnTransform = () => {
    return scrollProgress * 400;
  };

  const getRightColumnTransform = () => {
    return scrollProgress * 250;
  };

  const handleCardClick = (projectId) => {
    setFlippedCards(prev => ({
      ...prev,
      [projectId]: !prev[projectId]
    }));
  };

  return (
    <>
      <section className="portfolio-section" ref={sectionRef}>
        {/* Fondo épico con ondas animadas estilo footer */}
        <div className="portfolio-section__background">
          {/* Canvas con ondas animadas */}
          <AnimatedWavesBackground />
          
          {/* Orbes de luz */}
          <div className="portfolio-section__orb portfolio-section__orb--1"></div>
          <div className="portfolio-section__orb portfolio-section__orb--2"></div>
          <div className="portfolio-section__orb portfolio-section__orb--3"></div>
          
          {/* Partículas flotantes adicionales */}
          <div className="portfolio-section__particles">
            {[...Array(20)].map((_, i) => (
              <div key={i} className="portfolio-section__particle"></div>
            ))}
          </div>
        </div>

        {/* Contenido */}
        <div className="portfolio-section__content">
          {/* Header simplificado - solo texto */}
          <div className="portfolio-section__header">
            <h2 className="portfolio-section__title">Nuestro Portafolio</h2>
            <p className="portfolio-section__subtitle">
              Proyectos que transforman ideas en realidad digital
            </p>
          </div>

          {/* Grid de proyectos con parallax */}
          <div className="portfolio-section__grid-container">
            {/* Columna izquierda */}
            <div 
              className="portfolio-section__column"
              style={{
                transform: `translateY(-${getLeftColumnTransform()}px)`,
                transition: 'transform 0.1s linear'
              }}
            >
              {leftColumn.map((project, index) => (
                <div 
                  key={project.id} 
                  className={`portfolio-card ${flippedCards[project.id] ? 'flipped' : ''}`}
                  onClick={() => handleCardClick(project.id)}
                  style={{
                    animationDelay: `${index * 0.1}s`
                  }}
                >
                  <div className="portfolio-card__inner">
                    {/* Frente de la card */}
                    <div className="portfolio-card__front">
                      <div 
                        className="portfolio-card__image"
                        style={{
                          backgroundImage: `url(${project.image})`
                        }}
                      ></div>
                      <div className="portfolio-card__overlay"></div>
                      <div className="portfolio-card__content">
                        <h3 className="portfolio-card__title">{project.title}</h3>
                        <p className="portfolio-card__description">{project.shortDesc}</p>
                        <div className="portfolio-card__flip-hint">
                          <span>Click para ver más</span>
                          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M10 4V16M10 16L6 12M10 16L14 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* Reverso de la card */}
                    <div className="portfolio-card__back">
                      <div className="portfolio-card__back-content">
                        <h3 className="portfolio-card__back-title">{project.title}</h3>
                        <p className="portfolio-card__back-description">{project.fullDesc}</p>
                        <div className="portfolio-card__technologies">
                          <h4 className="portfolio-card__tech-title">Tecnologías:</h4>
                          <div className="portfolio-card__tech-list">
                            {project.technologies.map((tech, i) => (
                              <span key={i} className="portfolio-card__tech-tag">{tech}</span>
                            ))}
                          </div>
                        </div>
                        <div className="portfolio-card__flip-hint">
                          <span>Click para volver</span>
                          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M10 16V4M10 4L6 8M10 4L14 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Columna derecha */}
            <div 
              className="portfolio-section__column portfolio-section__column--right"
              style={{
                transform: `translateY(-${getRightColumnTransform()}px)`,
                transition: 'transform 0.1s linear'
              }}
            >
              {rightColumn.map((project, index) => (
                <div 
                  key={project.id} 
                  className={`portfolio-card ${flippedCards[project.id] ? 'flipped' : ''}`}
                  onClick={() => handleCardClick(project.id)}
                  style={{
                    animationDelay: `${index * 0.1 + 0.05}s`
                  }}
                >
                  <div className="portfolio-card__inner">
                    {/* Frente de la card */}
                    <div className="portfolio-card__front">
                      <div 
                        className="portfolio-card__image"
                        style={{
                          backgroundImage: `url(${project.image})`
                        }}
                      ></div>
                      <div className="portfolio-card__overlay"></div>
                      <div className="portfolio-card__content">
                        <h3 className="portfolio-card__title">{project.title}</h3>
                        <p className="portfolio-card__description">{project.shortDesc}</p>
                        <div className="portfolio-card__flip-hint">
                          <span>Click para ver más</span>
                          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M10 4V16M10 16L6 12M10 16L14 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* Reverso de la card */}
                    <div className="portfolio-card__back">
                      <div className="portfolio-card__back-content">
                        <h3 className="portfolio-card__back-title">{project.title}</h3>
                        <p className="portfolio-card__back-description">{project.fullDesc}</p>
                        <div className="portfolio-card__technologies">
                          <h4 className="portfolio-card__tech-title">Tecnologías:</h4>
                          <div className="portfolio-card__tech-list">
                            {project.technologies.map((tech, i) => (
                              <span key={i} className="portfolio-card__tech-tag">{tech}</span>
                            ))}
                          </div>
                        </div>
                        <div className="portfolio-card__flip-hint">
                          <span>Click para volver</span>
                          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M10 16V4M10 4L6 8M10 4L14 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <style>{`
        /* ============================================
           SECCIÓN PRINCIPAL
           ============================================ */
        .portfolio-section {
          position: relative;
          min-height: 250vh;
          width: 100%;
          overflow: hidden;
          background: #0B0E13; /* Color footer oscuro */
        }

        /* ============================================
           FONDO ÉPICO CON PALETA DE FOOTER
           ============================================ */
        .portfolio-section__background {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100vh;
          z-index: 0;
          pointer-events: none;
        }

        /* Orbes de luz con colores footer */
        .portfolio-section__orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(100px);
          opacity: 0.2;
          animation: float 8s ease-in-out infinite;
        }

        .portfolio-section__orb--1 {
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, #D4AF37, transparent);
          top: -10%;
          left: -10%;
          animation-delay: 0s;
        }

        .portfolio-section__orb--2 {
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, #1A1D24, transparent);
          bottom: -10%;
          right: -10%;
          animation-delay: 2s;
        }

        .portfolio-section__orb--3 {
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, #B8941F, transparent);
          top: 40%;
          right: 20%;
          animation-delay: 4s;
        }

        @keyframes float {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -30px) scale(1.1);
          }
          66% {
            transform: translate(-30px, 30px) scale(0.9);
          }
        }

        /* Partículas flotantes */
        .portfolio-section__particles {
          position: absolute;
          inset: 0;
        }

        .portfolio-section__particle {
          position: absolute;
          width: 2px;
          height: 2px;
          background: #D4AF37;
          border-radius: 50%;
          box-shadow: 0 0 8px #D4AF37;
          animation: particleFloat 15s linear infinite;
          opacity: 0;
        }

        .portfolio-section__particle:nth-child(1) { left: 10%; animation-delay: 0s; }
        .portfolio-section__particle:nth-child(2) { left: 20%; animation-delay: 2s; }
        .portfolio-section__particle:nth-child(3) { left: 30%; animation-delay: 4s; }
        .portfolio-section__particle:nth-child(4) { left: 40%; animation-delay: 1s; }
        .portfolio-section__particle:nth-child(5) { left: 50%; animation-delay: 3s; }
        .portfolio-section__particle:nth-child(6) { left: 60%; animation-delay: 5s; }
        .portfolio-section__particle:nth-child(7) { left: 70%; animation-delay: 2s; }
        .portfolio-section__particle:nth-child(8) { left: 80%; animation-delay: 4s; }
        .portfolio-section__particle:nth-child(9) { left: 90%; animation-delay: 1s; }
        .portfolio-section__particle:nth-child(10) { left: 15%; animation-delay: 3s; }
        .portfolio-section__particle:nth-child(11) { left: 25%; animation-delay: 5s; }
        .portfolio-section__particle:nth-child(12) { left: 35%; animation-delay: 2s; }
        .portfolio-section__particle:nth-child(13) { left: 45%; animation-delay: 4s; }
        .portfolio-section__particle:nth-child(14) { left: 55%; animation-delay: 1s; }
        .portfolio-section__particle:nth-child(15) { left: 65%; animation-delay: 3s; }
        .portfolio-section__particle:nth-child(16) { left: 75%; animation-delay: 5s; }
        .portfolio-section__particle:nth-child(17) { left: 85%; animation-delay: 2s; }
        .portfolio-section__particle:nth-child(18) { left: 95%; animation-delay: 4s; }
        .portfolio-section__particle:nth-child(19) { left: 5%; animation-delay: 1s; }
        .portfolio-section__particle:nth-child(20) { left: 50%; animation-delay: 3s; }

        @keyframes particleFloat {
          0% {
            transform: translateY(100vh) scale(0);
            opacity: 0;
          }
          10% {
            opacity: 0.7;
          }
          90% {
            opacity: 0.7;
          }
          100% {
            transform: translateY(-100px) scale(1);
            opacity: 0;
          }
        }

        /* ============================================
           CONTENIDO
           ============================================ */
        .portfolio-section__content {
          position: relative;
          z-index: 1;
          max-width: 1400px;
          margin: 0 auto;
          padding: 6rem 2rem;
        }

        /* ============================================
           HEADER SIMPLIFICADO - SOLO TEXTO
           ============================================ */
        .portfolio-section__header {
          text-align: center;
          margin-bottom: 4rem;
          position: sticky;
          top: 6rem;
          z-index: 10;
          padding: 2rem;
        }

        .portfolio-section__title {
          font-size: 4rem;
          font-weight: 900;
          background: linear-gradient(135deg, #F4E4BC 0%, #D4AF37 50%, #B8941F 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 1rem;
          filter: drop-shadow(0 4px 20px rgba(212, 175, 55, 0.3));
        }

        .portfolio-section__subtitle {
          font-size: 1.5rem;
          color: #F4E4BC;
          font-weight: 300;
          opacity: 0.9;
        }

        /* ============================================
           GRID DE PROYECTOS
           ============================================ */
        .portfolio-section__grid-container {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 2rem;
          position: relative;
        }

        .portfolio-section__column {
          display: flex;
          flex-direction: column;
          gap: 2rem;
          will-change: transform;
        }

        .portfolio-section__column--right {
          padding-top: 8rem;
        }

        /* ============================================
           CARDS DE PROYECTOS CON EFECTO FLIP
           ============================================ */
        .portfolio-card {
          position: relative;
          border-radius: 24px;
          overflow: visible;
          aspect-ratio: 4 / 5;
          animation: cardFadeIn 0.8s ease-out forwards;
          opacity: 0;
          perspective: 1000px;
          cursor: pointer;
        }

        @keyframes cardFadeIn {
          to {
            opacity: 1;
          }
        }

        /* Contenedor interno que se voltea */
        .portfolio-card__inner {
          position: relative;
          width: 100%;
          height: 100%;
          transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
          transform-style: preserve-3d;
        }

        .portfolio-card.flipped .portfolio-card__inner {
          transform: rotateY(180deg);
        }

        /* Estilos comunes para frente y reverso */
        .portfolio-card__front,
        .portfolio-card__back {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          border-radius: 24px;
          overflow: hidden;
        }

        /* FRENTE DE LA CARD */
        .portfolio-card__front {
          background: rgba(15, 23, 42, 0.9);
          border: 1px solid rgba(212, 175, 55, 0.2);
        }

        /* Imagen de fondo */
        .portfolio-card__image {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
          z-index: 1;
        }

        .portfolio-card:hover .portfolio-card__image {
          transform: scale(1.05);
        }

        /* Overlay oscuro */
        .portfolio-card__overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to top,
            rgba(2, 6, 20, 0.95) 0%,
            rgba(2, 6, 20, 0.7) 50%,
            rgba(2, 6, 20, 0.3) 100%
          );
          z-index: 2;
        }

        /* Contenido del frente */
        .portfolio-card__content {
          position: absolute;
          inset: 0;
          z-index: 3;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
        }

        .portfolio-card__title {
          font-size: 1.75rem;
          font-weight: 700;
          color: #F4E4BC;
          margin-bottom: 0.75rem;
          line-height: 1.3;
          text-shadow: 0 2px 12px rgba(0, 0, 0, 0.8);
        }

        .portfolio-card__description {
          font-size: 1rem;
          color: rgba(244, 228, 188, 0.9);
          line-height: 1.6;
          margin-bottom: 1rem;
          text-shadow: 0 2px 8px rgba(0, 0, 0, 0.8);
        }

        .portfolio-card__flip-hint {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #D4AF37;
          font-size: 0.9rem;
          font-weight: 600;
          margin-top: 0.5rem;
          opacity: 0.8;
        }

        .portfolio-card:hover .portfolio-card__flip-hint {
          opacity: 1;
          animation: bounce 1s ease-in-out infinite;
        }

        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }

        /* REVERSO DE LA CARD */
        .portfolio-card__back {
          background: linear-gradient(
            135deg,
            rgba(2, 6, 20, 0.98) 0%,
            rgba(11, 29, 51, 0.95) 100%
          );
          border: 2px solid rgba(212, 175, 55, 0.3);
          transform: rotateY(180deg);
        }

        .portfolio-card__back-content {
          position: relative;
          width: 100%;
          height: 100%;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          overflow-y: auto;
        }

        .portfolio-card__back-content::-webkit-scrollbar {
          width: 4px;
        }

        .portfolio-card__back-content::-webkit-scrollbar-track {
          background: rgba(212, 175, 55, 0.1);
          border-radius: 2px;
        }

        .portfolio-card__back-content::-webkit-scrollbar-thumb {
          background: rgba(212, 175, 55, 0.5);
          border-radius: 2px;
        }

        .portfolio-card__back-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #D4AF37;
          margin-bottom: 1rem;
          line-height: 1.3;
        }

        .portfolio-card__back-description {
          font-size: 0.95rem;
          color: rgba(244, 228, 188, 0.95);
          line-height: 1.7;
          margin-bottom: 1.5rem;
          flex-grow: 1;
        }

        .portfolio-card__technologies {
          margin-top: auto;
        }

        .portfolio-card__tech-title {
          font-size: 0.9rem;
          font-weight: 600;
          color: #D4AF37;
          margin-bottom: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .portfolio-card__tech-list {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .portfolio-card__tech-tag {
          padding: 0.4rem 0.8rem;
          background: rgba(212, 175, 55, 0.15);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(212, 175, 55, 0.3);
          border-radius: 6px;
          font-size: 0.75rem;
          color: #D4AF37;
          font-weight: 600;
          text-shadow: 0 1px 4px rgba(0, 0, 0, 0.5);
        }

        /* ============================================
           RESPONSIVE - MOBILE
           ============================================ */
        @media (max-width: 767px) {
          .portfolio-section__content {
            padding: 3rem 1rem;
          }

          .portfolio-section__header {
            padding: 1.5rem;
            margin-bottom: 2rem;
            top: 4rem;
          }

          .portfolio-section__title {
            font-size: 2rem;
          }

          .portfolio-section__subtitle {
            font-size: 1rem;
          }

          .portfolio-section__grid-container {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }

          .portfolio-section__column--right {
            padding-top: 0;
          }

          /* Desactivar parallax en móvil */
          .portfolio-section__column {
            transform: translateY(0) !important;
          }

          .portfolio-card {
            aspect-ratio: 3 / 4;
          }

          .portfolio-card__content,
          .portfolio-card__back-content {
            padding: 1.5rem;
          }

          .portfolio-card__title {
            font-size: 1.25rem;
          }

          .portfolio-card__description {
            font-size: 0.9rem;
          }

          .portfolio-card__back-title {
            font-size: 1.25rem;
          }

          .portfolio-card__back-description {
            font-size: 0.85rem;
          }

          .portfolio-card__tech-tag {
            font-size: 0.7rem;
            padding: 0.35rem 0.7rem;
          }

          .portfolio-card__flip-hint {
            font-size: 0.85rem;
          }

          /* Efecto táctil mejorado en móvil */
          .portfolio-card:active .portfolio-card__inner {
            transform: scale(0.98);
          }
        }

        /* ============================================
           RESPONSIVE - TABLET
           ============================================ */
        @media (min-width: 768px) and (max-width: 1023px) {
          .portfolio-section__title {
            font-size: 3rem;
          }

          .portfolio-section__subtitle {
            font-size: 1.25rem;
          }

          .portfolio-section__column--right {
            padding-top: 4rem;
          }

          .portfolio-card {
            aspect-ratio: 4 / 5;
          }

          .portfolio-card__title {
            font-size: 1.5rem;
          }

          .portfolio-card__description {
            font-size: 0.95rem;
          }

          .portfolio-card__back-title {
            font-size: 1.4rem;
          }

          .portfolio-card__back-description {
            font-size: 0.9rem;
          }
        }

        /* ============================================
           ACCESIBILIDAD
           ============================================ */
        @media (prefers-reduced-motion: reduce) {
          .portfolio-card__image,
          .portfolio-card__content,
          .portfolio-card__overlay,
          .portfolio-card__inner {
            transition: none !important;
          }

          .portfolio-section__orb {
            animation: none !important;
          }

          .portfolio-card__flip-hint {
            animation: none !important;
          }
        }
      `}</style>
    </>
  );
}