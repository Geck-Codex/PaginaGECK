import { useState, useEffect, useRef } from 'react';

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

    class Wave {
      constructor(y, amplitude, frequency, speed, color) {
        this.y = y; this.amplitude = amplitude; this.frequency = frequency;
        this.speed = speed; this.color = color;
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

    class Particle {
      constructor() { this.reset(); }
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
        if (this.y < -20) this.reset();
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
      particles.forEach(p => { p.update(); p.draw(); });
      animationTime += 0.016;
      animationId = requestAnimationFrame(animate);
    }
    animate();

    window.addEventListener('resize', setCanvasSize);
    return () => {
      window.removeEventListener('resize', setCanvasSize);
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute', top: 0, left: 0,
        width: '100%', height: '100%',
        opacity: 0.6, pointerEvents: 'none', zIndex: 1,
      }}
    />
  );
}

// Iconos SVG por tipo de proyecto
const TYPE_ICONS = {
  'Mobile App': (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/>
    </svg>
  ),
  'Web App': (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
    </svg>
  ),
  'IA / Computer Vision': (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
    </svg>
  ),
  'SaaS': (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
    </svg>
  ),
  'Landing Page': (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  ),
  'Bot / Automatización': (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/><line x1="8" y1="16" x2="8.01" y2="16"/><line x1="16" y1="16" x2="16.01" y2="16"/>
    </svg>
  ),
  'Accesibilidad': (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>
    </svg>
  ),
};

// Colores de acento por tipo
const TYPE_COLORS = {
  'Mobile App':           { bg: 'rgba(59,130,246,0.15)',  border: 'rgba(59,130,246,0.4)',  text: '#60a5fa' },
  'Web App':              { bg: 'rgba(16,185,129,0.15)',  border: 'rgba(16,185,129,0.4)',  text: '#34d399' },
  'IA / Computer Vision': { bg: 'rgba(139,92,246,0.15)',  border: 'rgba(139,92,246,0.4)',  text: '#a78bfa' },
  'SaaS':                 { bg: 'rgba(245,158,11,0.15)',  border: 'rgba(245,158,11,0.4)',  text: '#fbbf24' },
  'Landing Page':         { bg: 'rgba(236,72,153,0.15)',  border: 'rgba(236,72,153,0.4)',  text: '#f472b6' },
  'Bot / Automatización': { bg: 'rgba(20,184,166,0.15)',  border: 'rgba(20,184,166,0.4)',  text: '#2dd4bf' },
  'Accesibilidad':        { bg: 'rgba(251,146,60,0.15)',  border: 'rgba(251,146,60,0.4)',  text: '#fb923c' },
};

function TypeBadge({ type }) {
  const color = TYPE_COLORS[type] || TYPE_COLORS['Web App'];
  const icon  = TYPE_ICONS[type]  || TYPE_ICONS['Web App'];
  return (
    <span
      className="project-type-badge"
      style={{
        background: color.bg,
        border: `1px solid ${color.border}`,
        color: color.text,
      }}
    >
      {icon}
      {type}
    </span>
  );
}

export default function PortfolioSection() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [flippedCards, setFlippedCards] = useState({});
  const sectionRef = useRef(null);

  const projects = [
    {
      id: 1,
      title: "Capital Transport LLP",
      type: "Mobile App",
      shortDesc: "App oficial de gestión de cargas y despacho para flota en USA",
      fullDesc: "La app oficial de Capital Transport LLP centraliza todo lo que un conductor y una empresa necesitan: despacho de camiones, gestión de documentos, estados de carga en tiempo real y comunicación directa con despachadores. Disponible en Google Play Store.",
      technologies: ["React Native", "Node.js", "Firebase", "Google Maps API", "Push Notifications"],
      image: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=800&h=600&fit=crop",
      playStoreUrl: "https://play.google.com/store/apps/details?id=com.geckcodex.capital_transport_llp"
    },
    {
      id: 2,
      title: "Fleet Management App",
      type: "Mobile App",
      shortDesc: "App para gestión de flota elaborada para clientes de USA",
      fullDesc: "Sistema completo de rastreo y gestión de flotas vehiculares en tiempo real. Incluye monitoreo GPS, análisis de rutas, gestión de combustible y reportes detallados de rendimiento.",
      technologies: ["React Native", "Node.js", "PostgreSQL", "Google Maps API", "Socket.io"],
      image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&h=600&fit=crop"
    },
    {
      id: 3,
      title: "DrowsyGuard",
      type: "IA / Computer Vision",
      shortDesc: "App para vigilar los microsueños a la hora de conducir",
      fullDesc: "Aplicación de seguridad vial que utiliza visión por computadora para detectar signos de fatiga y microsueños en conductores. Sistema de alertas inteligentes y análisis de patrones de conducción.",
      technologies: ["Python", "TensorFlow", "OpenCV", "React Native", "Firebase"],
      image: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800&h=600&fit=crop"
    },
    {
      id: 4,
      title: "Political Landing Page",
      type: "Landing Page",
      shortDesc: "Landing page para figura pública",
      fullDesc: "Sitio web optimizado para campañas políticas con diseño responsive, integración de redes sociales, sistema de donaciones y blog de noticias. SEO avanzado para máxima visibilidad.",
      technologies: ["Next.js", "Tailwind CSS", "Stripe", "Contentful CMS", "Vercel"],
      image: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800&h=600&fit=crop"
    },
    {
      id: 5,
      title: "Badge Creator System",
      type: "Web App",
      shortDesc: "App web para facilitar la creación de gafetes para organización gubernamental",
      fullDesc: "Sistema automatizado para diseño e impresión de credenciales oficiales. Incluye base de datos de empleados, plantillas personalizables, códigos QR y sistema de control de acceso.",
      technologies: ["React", "Express.js", "MongoDB", "PDF-lib", "QR Generator"],
      image: "https://images.unsplash.com/photo-1554224311-beee2ece2703?w=800&h=600&fit=crop"
    },
    {
      id: 6,
      title: "Men's E-Commerce",
      type: "Web App",
      shortDesc: "E-commerce para empresa dedicada a la venta de productos masculinos",
      fullDesc: "Plataforma completa de comercio electrónico con carrito de compras, pasarela de pagos, gestión de inventario, sistema de reseñas y panel administrativo para control de ventas.",
      technologies: ["React", "Node.js", "Stripe", "MongoDB", "AWS S3"],
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop"
    },
    {
      id: 7,
      title: "Restaurante Villa Coronado",
      type: "Landing Page",
      shortDesc: "Landing page para restaurante rústico del municipio de Villa Coronado",
      fullDesc: "Sitio web gastronómico con menú digital interactivo, sistema de reservaciones online, galería de platillos y integración con redes sociales para promociones.",
      technologies: ["Astro", "React", "Tailwind CSS", "Calendly API", "Cloudinary"],
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop"
    },
    {
      id: 8,
      title: "El Mezquite Cattle System",
      type: "Web App",
      shortDesc: "App web para la gestión y control de ganado",
      fullDesc: "Sistema integral de administración ganadera con registro de animales, control de vacunación, monitoreo de alimentación, genealogía y reportes de producción.",
      technologies: ["Vue.js", "Laravel", "MySQL", "Chart.js", "PDF Export"],
      image: "https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=800&h=600&fit=crop"
    },
    {
      id: 9,
      title: "Gym Management Pro",
      type: "SaaS",
      shortDesc: "App web para el control y gestión de los usuarios del gym",
      fullDesc: "Plataforma completa de gestión para gimnasios con control de membresías, check-in digital, clases programadas, pagos automatizados y app móvil para miembros.",
      technologies: ["React", "Firebase", "Stripe", "React Native", "Node.js"],
      image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=600&fit=crop"
    },
    {
      id: 10,
      title: "JV Inventory AI",
      type: "IA / Computer Vision",
      shortDesc: "App móvil que se encarga de ayudar con el inventario mediante IA",
      fullDesc: "Aplicación inteligente de inventario que usa reconocimiento de imágenes y IA para identificar productos, actualizar stock automáticamente y generar reportes predictivos.",
      technologies: ["React Native", "TensorFlow", "Python", "FastAPI", "PostgreSQL"],
      image: "https://images.unsplash.com/photo-1553413077-190dd305871c?w=800&h=600&fit=crop"
    },
    {
      id: 11,
      title: "PostureCheck System",
      type: "IA / Computer Vision",
      shortDesc: "Sistema para detección de posturas correctas en empresas manufactureras",
      fullDesc: "Solución de visión artificial para monitoreo ergonómico en plantas industriales. Detecta posturas incorrectas en tiempo real y genera alertas preventivas de riesgos laborales.",
      technologies: ["Python", "OpenCV", "MediaPipe", "React", "WebSockets"],
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=600&fit=crop"
    },
    {
      id: 12,
      title: "TrainPad",
      type: "IA / Computer Vision",
      shortDesc: "Análisis y corrección de posturas durante el entrenamiento en el gym",
      fullDesc: "Aplicación de visión por computadora que monitorea en tiempo real la postura del usuario durante sus rutinas de gimnasio. Detecta desalineaciones, riesgo de lesión y proporciona retroalimentación visual instantánea para mejorar la técnica y maximizar resultados.",
      technologies: ["Python", "MediaPipe", "TensorFlow", "React Native", "WebSockets"],
      image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&h=600&fit=crop"
    },
    {
      id: 13,
      title: "HeadMaus",
      type: "Accesibilidad",
      shortDesc: "Control de computadora mediante movimientos de cabeza y ojos",
      fullDesc: "Sistema de accesibilidad innovador que transforma los movimientos de cabeza y ojos en controles de cursor y teclado. Diseñado para personas con movilidad reducida, permite operar cualquier computadora con total independencia usando únicamente la mirada y gestos cefálicos.",
      technologies: ["Python", "OpenCV", "MediaPipe", "PyAutoGUI", "Dlib"],
      image: "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=800&h=600&fit=crop"
    },
    {
      id: 14,
      title: "Geck Bot",
      type: "Bot / Automatización",
      shortDesc: "Gestión completa de tu negocio directo desde WhatsApp",
      fullDesc: "Bot inteligente para WhatsApp que centraliza la operación de tu negocio: consulta de inventario, registro de ventas, reportes en tiempo real, atención a clientes y alertas automáticas. Sin necesidad de abrir ninguna app extra, todo desde tu chat.",
      technologies: ["Node.js", "WhatsApp Business API", "MongoDB", "OpenAI API", "Webhooks"],
      image: "https://images.unsplash.com/photo-1611746872915-64382b5c76da?w=800&h=600&fit=crop"
    },
    {
      id: 15,
      title: "GECK POS",
      type: "SaaS",
      shortDesc: "Punto de venta SaaS multidispositivo con gestión total del negocio",
      fullDesc: "Sistema de punto de venta en la nube para restaurantes, tiendas y negocios en general. Gestión de mesas, pedidos, inventario, caja, reportes y múltiples sucursales desde cualquier dispositivo. Una alternativa moderna y accesible a soluciones como Soft Restaurant.",
      technologies: ["React", "Node.js", "PostgreSQL", "Stripe", "WebSockets", "PWA"],
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop"
    }
  ];

  const leftColumn  = projects.filter((_, i) => i % 2 === 0);
  const rightColumn = projects.filter((_, i) => i % 2 !== 0);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1,
        (window.innerHeight - rect.top) / (window.innerHeight + rect.height)
      ));
      setScrollProgress(progress);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCardClick   = (id) => setFlippedCards(prev => ({ ...prev, [id]: !prev[id] }));
  const handlePlayStore   = (e, url) => { e.stopPropagation(); window.open(url, '_blank', 'noopener,noreferrer'); };

  const renderCard = (project, index) => (
    <div
      key={project.id}
      className={`portfolio-card ${flippedCards[project.id] ? 'flipped' : ''}`}
      onClick={() => handleCardClick(project.id)}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="portfolio-card__inner">

        {/* ── FRENTE ── */}
        <div className="portfolio-card__front">
          <div className="portfolio-card__image" style={{ backgroundImage: `url(${project.image})` }} />
          <div className="portfolio-card__overlay" />
          <div className="portfolio-card__content">
            <h3 className="portfolio-card__title">{project.title}</h3>
            <p  className="portfolio-card__description">{project.shortDesc}</p>
            <div className="portfolio-card__flip-hint">
              <span>Click para ver más</span>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 4V16M10 16L6 12M10 16L14 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>

        {/* ── REVERSO ── */}
        <div className="portfolio-card__back">
          <div className="portfolio-card__back-content">

            {/* Badge de tipo — parte superior */}
            <div className="portfolio-card__back-header">
              <TypeBadge type={project.type} />
            </div>

            <h3 className="portfolio-card__back-title">{project.title}</h3>
            <p  className="portfolio-card__back-description">{project.fullDesc}</p>

            <div className="portfolio-card__technologies">
              <h4 className="portfolio-card__tech-title">Tecnologías:</h4>
              <div className="portfolio-card__tech-list">
                {project.technologies.map((tech, i) => (
                  <span key={i} className="portfolio-card__tech-tag">{tech}</span>
                ))}
              </div>
            </div>

            {project.playStoreUrl && (
              <button
                className="portfolio-card__playstore-btn"
                onClick={(e) => handlePlayStore(e, project.playStoreUrl)}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3.18 23.76c.3.17.64.24.97.24.4 0 .8-.11 1.15-.34l15.7-9.04c.64-.37 1-.98 1-1.62s-.36-1.25-1-1.62L5.3.34C4.64-.04 3.84-.1 3.18.24 2.5.58 2.1 1.27 2.1 2.06v19.88c0 .79.4 1.48 1.08 1.82z"/>
                </svg>
                Ver en Play Store
              </button>
            )}

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
  );

  return (
    <>
      <section className="portfolio-section" ref={sectionRef}>
        <div className="portfolio-section__background">
          <AnimatedWavesBackground />
          <div className="portfolio-section__orb portfolio-section__orb--1" />
          <div className="portfolio-section__orb portfolio-section__orb--2" />
          <div className="portfolio-section__orb portfolio-section__orb--3" />
          <div className="portfolio-section__particles">
            {[...Array(20)].map((_, i) => <div key={i} className="portfolio-section__particle" />)}
          </div>
        </div>

        <div className="portfolio-section__content">
          <div className="portfolio-section__header">
            <h2 className="portfolio-section__title">Nuestro Portafolio</h2>
            <p  className="portfolio-section__subtitle">Proyectos que transforman ideas en realidad digital</p>
          </div>

          <div className="portfolio-section__grid-container">
            <div
              className="portfolio-section__column"
              style={{ transform: `translateY(-${scrollProgress * 400}px)`, transition: 'transform 0.1s linear' }}
            >
              {leftColumn.map((p, i) => renderCard(p, i))}
            </div>
            <div
              className="portfolio-section__column portfolio-section__column--right"
              style={{ transform: `translateY(-${scrollProgress * 250}px)`, transition: 'transform 0.1s linear' }}
            >
              {rightColumn.map((p, i) => renderCard(p, i))}
            </div>
          </div>
        </div>
      </section>

      <style>{`
        /* ── BASE ── */
        .portfolio-section {
          position: relative; min-height: 250vh;
          width: 100%; overflow: hidden; background: #0B0E13;
        }
        .portfolio-section__background {
          position: fixed; top: 0; left: 0;
          width: 100%; height: 100vh; z-index: 0; pointer-events: none;
        }
        .portfolio-section__orb {
          position: absolute; border-radius: 50%;
          filter: blur(100px); opacity: 0.2;
          animation: float 8s ease-in-out infinite;
        }
        .portfolio-section__orb--1 { width:600px; height:600px; background:radial-gradient(circle,#D4AF37,transparent); top:-10%; left:-10%; animation-delay:0s; }
        .portfolio-section__orb--2 { width:500px; height:500px; background:radial-gradient(circle,#1A1D24,transparent); bottom:-10%; right:-10%; animation-delay:2s; }
        .portfolio-section__orb--3 { width:400px; height:400px; background:radial-gradient(circle,#B8941F,transparent); top:40%; right:20%; animation-delay:4s; }
        @keyframes float {
          0%,100% { transform:translate(0,0) scale(1); }
          33%      { transform:translate(30px,-30px) scale(1.1); }
          66%      { transform:translate(-30px,30px) scale(0.9); }
        }
        .portfolio-section__particles { position:absolute; inset:0; }
        .portfolio-section__particle {
          position:absolute; width:2px; height:2px; background:#D4AF37;
          border-radius:50%; box-shadow:0 0 8px #D4AF37;
          animation:particleFloat 15s linear infinite; opacity:0;
        }
        .portfolio-section__particle:nth-child(1)  { left:10%; animation-delay:0s; }
        .portfolio-section__particle:nth-child(2)  { left:20%; animation-delay:2s; }
        .portfolio-section__particle:nth-child(3)  { left:30%; animation-delay:4s; }
        .portfolio-section__particle:nth-child(4)  { left:40%; animation-delay:1s; }
        .portfolio-section__particle:nth-child(5)  { left:50%; animation-delay:3s; }
        .portfolio-section__particle:nth-child(6)  { left:60%; animation-delay:5s; }
        .portfolio-section__particle:nth-child(7)  { left:70%; animation-delay:2s; }
        .portfolio-section__particle:nth-child(8)  { left:80%; animation-delay:4s; }
        .portfolio-section__particle:nth-child(9)  { left:90%; animation-delay:1s; }
        .portfolio-section__particle:nth-child(10) { left:15%; animation-delay:3s; }
        .portfolio-section__particle:nth-child(11) { left:25%; animation-delay:5s; }
        .portfolio-section__particle:nth-child(12) { left:35%; animation-delay:2s; }
        .portfolio-section__particle:nth-child(13) { left:45%; animation-delay:4s; }
        .portfolio-section__particle:nth-child(14) { left:55%; animation-delay:1s; }
        .portfolio-section__particle:nth-child(15) { left:65%; animation-delay:3s; }
        .portfolio-section__particle:nth-child(16) { left:75%; animation-delay:5s; }
        .portfolio-section__particle:nth-child(17) { left:85%; animation-delay:2s; }
        .portfolio-section__particle:nth-child(18) { left:95%; animation-delay:4s; }
        .portfolio-section__particle:nth-child(19) { left:5%;  animation-delay:1s; }
        .portfolio-section__particle:nth-child(20) { left:50%; animation-delay:3s; }
        @keyframes particleFloat {
          0%   { transform:translateY(100vh) scale(0); opacity:0; }
          10%  { opacity:0.7; }
          90%  { opacity:0.7; }
          100% { transform:translateY(-100px) scale(1); opacity:0; }
        }

        /* ── CONTENT ── */
        .portfolio-section__content {
          position:relative; z-index:1;
          max-width:1400px; margin:0 auto; padding:6rem 2rem;
        }
        .portfolio-section__header {
          text-align:center; margin-bottom:4rem;
          position:sticky; top:6rem; z-index:10; padding:2rem;
        }
        .portfolio-section__title {
          font-size:4rem; font-weight:900;
          background:linear-gradient(135deg,#F4E4BC 0%,#D4AF37 50%,#B8941F 100%);
          -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
          margin-bottom:1rem; filter:drop-shadow(0 4px 20px rgba(212,175,55,0.3));
        }
        .portfolio-section__subtitle { font-size:1.5rem; color:#F4E4BC; font-weight:300; opacity:0.9; }

        /* ── GRID ── */
        .portfolio-section__grid-container {
          display:grid; grid-template-columns:repeat(2,1fr); gap:2rem; position:relative;
        }
        .portfolio-section__column { display:flex; flex-direction:column; gap:2rem; will-change:transform; }
        .portfolio-section__column--right { padding-top:8rem; }

        /* ── CARD SHELL ── */
        .portfolio-card {
          position:relative; border-radius:24px; overflow:visible;
          aspect-ratio:4/5; animation:cardFadeIn 0.8s ease-out forwards;
          opacity:0; perspective:1000px; cursor:pointer;
        }
        @keyframes cardFadeIn { to { opacity:1; } }
        .portfolio-card__inner {
          position:relative; width:100%; height:100%;
          transition:transform 0.8s cubic-bezier(0.4,0,0.2,1); transform-style:preserve-3d;
        }
        .portfolio-card.flipped .portfolio-card__inner { transform:rotateY(180deg); }
        .portfolio-card__front,
        .portfolio-card__back {
          position:absolute; width:100%; height:100%;
          backface-visibility:hidden; -webkit-backface-visibility:hidden;
          border-radius:24px; overflow:hidden;
        }

        /* ── FRENTE ── */
        .portfolio-card__front {
          background:rgba(15,23,42,0.9);
          border:1px solid rgba(212,175,55,0.2);
        }
        .portfolio-card__image {
          position:absolute; inset:0; background-size:cover; background-position:center;
          transition:transform 0.6s cubic-bezier(0.16,1,0.3,1); z-index:1;
        }
        .portfolio-card:hover .portfolio-card__image { transform:scale(1.05); }
        .portfolio-card__overlay {
          position:absolute; inset:0;
          background:linear-gradient(to top,rgba(2,6,20,0.95) 0%,rgba(2,6,20,0.7) 50%,rgba(2,6,20,0.3) 100%);
          z-index:2;
        }
        .portfolio-card__content {
          position:absolute; inset:0; z-index:3;
          padding:2rem; display:flex; flex-direction:column; justify-content:flex-end;
        }
        .portfolio-card__title {
          font-size:1.75rem; font-weight:700; color:#F4E4BC;
          margin-bottom:0.75rem; line-height:1.3; text-shadow:0 2px 12px rgba(0,0,0,0.8);
        }
        .portfolio-card__description {
          font-size:1rem; color:rgba(244,228,188,0.9); line-height:1.6;
          margin-bottom:1rem; text-shadow:0 2px 8px rgba(0,0,0,0.8);
        }
        .portfolio-card__flip-hint {
          display:flex; align-items:center; gap:0.5rem;
          color:#D4AF37; font-size:0.9rem; font-weight:600; margin-top:0.5rem; opacity:0.8;
        }
        .portfolio-card:hover .portfolio-card__flip-hint {
          opacity:1; animation:bounce 1s ease-in-out infinite;
        }
        @keyframes bounce {
          0%,100% { transform:translateY(0); }
          50%      { transform:translateY(-5px); }
        }

        /* ── REVERSO ── */
        .portfolio-card__back {
          background:linear-gradient(135deg,rgba(2,6,20,0.98) 0%,rgba(11,29,51,0.95) 100%);
          border:2px solid rgba(212,175,55,0.3);
          transform:rotateY(180deg);
        }
        .portfolio-card__back-content {
          position:relative; width:100%; height:100%;
          padding:2rem; display:flex; flex-direction:column; overflow-y:auto;
        }
        .portfolio-card__back-content::-webkit-scrollbar { width:4px; }
        .portfolio-card__back-content::-webkit-scrollbar-track { background:rgba(212,175,55,0.1); border-radius:2px; }
        .portfolio-card__back-content::-webkit-scrollbar-thumb { background:rgba(212,175,55,0.5); border-radius:2px; }

        /* Badge header */
        .portfolio-card__back-header {
          margin-bottom:1rem;
        }
        .project-type-badge {
          display:inline-flex; align-items:center; gap:0.45rem;
          padding:0.35rem 0.9rem; border-radius:100px;
          font-size:0.75rem; font-weight:700;
          letter-spacing:0.04em; text-transform:uppercase;
          white-space:nowrap;
        }

        .portfolio-card__back-title {
          font-size:1.5rem; font-weight:700; color:#D4AF37;
          margin-bottom:0.75rem; line-height:1.3;
        }
        .portfolio-card__back-description {
          font-size:0.95rem; color:rgba(244,228,188,0.95);
          line-height:1.7; margin-bottom:1.25rem; flex-grow:1;
        }

        /* Tecnologías */
        .portfolio-card__technologies { margin-top:auto; }
        .portfolio-card__tech-title {
          font-size:0.8rem; font-weight:600; color:#D4AF37;
          margin-bottom:0.6rem; text-transform:uppercase; letter-spacing:0.05em;
        }
        .portfolio-card__tech-list { display:flex; flex-wrap:wrap; gap:0.4rem; margin-bottom:0.9rem; }
        .portfolio-card__tech-tag {
          padding:0.35rem 0.7rem;
          background:rgba(212,175,55,0.12); backdrop-filter:blur(10px);
          border:1px solid rgba(212,175,55,0.25); border-radius:6px;
          font-size:0.72rem; color:#D4AF37; font-weight:600;
        }

        /* Botón Play Store */
        .portfolio-card__playstore-btn {
          display:inline-flex; align-items:center; gap:0.5rem;
          padding:0.55rem 1.1rem;
          background:linear-gradient(135deg,#D4AF37 0%,#B8941F 100%);
          color:#0B0E13; font-weight:700; font-size:0.82rem;
          border:none; border-radius:10px; cursor:pointer;
          transition:all 0.3s ease; margin-bottom:0.75rem;
          box-shadow:0 4px 15px rgba(212,175,55,0.35); width:fit-content;
        }
        .portfolio-card__playstore-btn:hover {
          transform:translateY(-2px); box-shadow:0 6px 25px rgba(212,175,55,0.55);
        }

        /* ── RESPONSIVE MOBILE ── */
        @media (max-width: 767px) {
          .portfolio-section__content { padding:3rem 1rem; }
          .portfolio-section__header { padding:1.5rem; margin-bottom:2rem; top:4rem; }
          .portfolio-section__title { font-size:2rem; }
          .portfolio-section__subtitle { font-size:1rem; }
          .portfolio-section__grid-container { grid-template-columns:1fr; gap:1.5rem; }
          .portfolio-section__column--right { padding-top:0; }
          .portfolio-section__column { transform:translateY(0) !important; }
          .portfolio-card { aspect-ratio:3/4; }
          .portfolio-card__content,
          .portfolio-card__back-content { padding:1.5rem; }
          .portfolio-card__title { font-size:1.25rem; }
          .portfolio-card__description { font-size:0.9rem; }
          .portfolio-card__back-title { font-size:1.25rem; }
          .portfolio-card__back-description { font-size:0.85rem; }
          .portfolio-card__tech-tag { font-size:0.68rem; padding:0.3rem 0.6rem; }
          .portfolio-card__flip-hint { font-size:0.85rem; }
          .portfolio-card:active .portfolio-card__inner { transform:scale(0.98); }
        }

        /* ── RESPONSIVE TABLET ── */
        @media (min-width: 768px) and (max-width: 1023px) {
          .portfolio-section__title { font-size:3rem; }
          .portfolio-section__subtitle { font-size:1.25rem; }
          .portfolio-section__column--right { padding-top:4rem; }
          .portfolio-card { aspect-ratio:4/5; }
          .portfolio-card__title { font-size:1.5rem; }
          .portfolio-card__description { font-size:0.95rem; }
          .portfolio-card__back-title { font-size:1.4rem; }
          .portfolio-card__back-description { font-size:0.9rem; }
        }

        /* ── ACCESIBILIDAD ── */
        @media (prefers-reduced-motion: reduce) {
          .portfolio-card__image, .portfolio-card__inner { transition:none !important; }
          .portfolio-section__orb { animation:none !important; }
          .portfolio-card__flip-hint { animation:none !important; }
        }
      `}</style>
    </>
  );
}