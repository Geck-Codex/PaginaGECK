import { useState, useEffect, useRef } from "react";
import { Menu, X, Briefcase, Info, BookOpen, Globe, Mail } from "lucide-react";
import { useContactDrawer } from '../contexts/ContactDrawerContext';

const translations = {
  en: {
    portfolio: "Portfolio",
    about: "About Us",
    blog: "Blog",
    contact: "Contact",
    language: "Language",
  },
  es: {
    portfolio: "Portafolio",
    about: "Nosotros",
    blog: "Blog",
    contact: "Contacto",
    language: "Idioma",
  },
  pt: {
    portfolio: "Portfólio",
    about: "Sobre Nós",
    blog: "Blog",
    contact: "Contato",
    language: "Idioma",
  },
};

const languageOptions = [
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "es", label: "Español", flag: "🇪🇸" },
  { code: "pt", label: "Português", flag: "🇧🇷" },
];



// Partículas fijas para evitar problemas de hidratación con Math.random()
const FIXED_PARTICLES = [
  { left: "10%", delay: "0s", duration: "5s", color: "gold", width: "2px", height: "2px" },
  { left: "25%", delay: "1s", duration: "6s", color: "navy", width: "3px", height: "3px" },
  { left: "40%", delay: "2s", duration: "4s", color: "gold", width: "2px", height: "2px" },
  { left: "55%", delay: "0.5s", duration: "5.5s", color: "navy", width: "2px", height: "3px" },
  { left: "70%", delay: "1.5s", duration: "4.5s", color: "gold", width: "3px", height: "2px" },
  { left: "85%", delay: "2.5s", duration: "6s", color: "navy", width: "2px", height: "2px" },
  { left: "15%", delay: "3s", duration: "5s", color: "gold", width: "2px", height: "3px" },
  { left: "30%", delay: "0.8s", duration: "5.8s", color: "navy", width: "3px", height: "2px" },
  { left: "45%", delay: "1.8s", duration: "4.8s", color: "gold", width: "2px", height: "2px" },
  { left: "60%", delay: "2.8s", duration: "5.2s", color: "navy", width: "2px", height: "3px" },
];

// -------------------------------
//  COMPONENTE: DisperseText
// -------------------------------
function DisperseText({ text, isHovered }) {
  const letters = text.split("");

  return (
    <span style={{ display: "inline-block", position: "relative" }}>
      {letters.map((letter, index) => (
        <span
          key={index}
          style={{
            display: "inline-block",
            transition: "all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
            transform: isHovered
              ? `translate(${(Math.random() - 0.5) * 20}px, ${
                  (Math.random() - 0.5) * 20
                }px) rotate(${(Math.random() - 0.5) * 45}deg) scale(0.8)`
              : "translate(0, 0) rotate(0deg) scale(1)",
            opacity: isHovered ? 0.3 : 1,
          }}
        >
          {letter === " " ? "\u00A0" : letter}
        </span>
      ))}
    </span>
  );
}

// -------------------------------
//  COMPONENTE: MagneticLink
// -------------------------------
function MagneticLink({ href, icon: Icon, text, onClick }) {
  const [hover, setHover] = useState(false);
  const [disperseHover, setDisperseHover] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const linkRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!linkRef.current) return;
    const rect = linkRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = (e.clientX - centerX) * 0.3;
    const deltaY = (e.clientY - centerY) * 0.3;

    setPosition({ x: deltaX, y: deltaY });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
    setHover(false);
    setTimeout(() => setDisperseHover(false), 100);
  };

  const handleClick = (e) => {
    if (onClick) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <a
      ref={linkRef}
      href={href}
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => {
        setHover(true);
        setTimeout(() => setDisperseHover(true), 50);
      }}
      onMouseLeave={handleMouseLeave}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        color: "var(--white-soft)",
        fontSize: "1.25rem",
        transition: "color 0.3s ease",
        padding: "0.5rem 0",
        transform: `translate(${position.x}px, ${position.y}px)`,
        textDecoration: "none",
        cursor: "pointer",
      }}
    >
      <Icon
        size={18}
        style={{
          transition: "all 0.3s ease",
          color: hover ? "var(--gold)" : "inherit",
        }}
      />
      <DisperseText text={text} isHovered={disperseHover} />
    </a>
  );
}

// -------------------------------
//  COMPONENTE: AnimatedLogo (con efecto disperse)
// -------------------------------
function AnimatedLogo({ text }) {
  const [isHovered, setIsHovered] = useState(false);
  const [disperseActive, setDisperseActive] = useState(false);
  const letters = text.split("");

  const handleMouseEnter = () => {
    setIsHovered(true);
    setTimeout(() => setDisperseActive(true), 50);
  };

  const handleMouseLeave = () => {
    setDisperseActive(false);
    setTimeout(() => setIsHovered(false), 100);
  };

  return (
    <span
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        display: "inline-block",
        position: "relative",
        cursor: "pointer",
      }}
    >
      {letters.map((letter, index) => (
        <span
          key={index}
          style={{
            display: "inline-block",
            transition: "all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
            transitionDelay: `${index * 0.03}s`,
            transform: disperseActive
              ? `translate(${(Math.random() - 0.5) * 25}px, ${
                  (Math.random() - 0.5) * 25
                }px) rotate(${(Math.random() - 0.5) * 50}deg) scale(0.7)`
              : "translate(0, 0) rotate(0deg) scale(1)",
            opacity: disperseActive ? 0.4 : 1,
            background: "linear-gradient(135deg, var(--white), var(--gold))",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            color: "transparent",
          }}
        >
          {letter === " " ? "\u00A0" : letter}
        </span>
      ))}
    </span>
  );
}

// -------------------------------
//  COMPONENTE: AnimatedWaves (del Footer)
// -------------------------------
function AnimatedWaves() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = 70; // Altura del navbar
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
        this.size = Math.random() * 2 + 1;
        this.speedY = Math.random() * 0.3 + 0.1;
        this.speedX = (Math.random() - 0.5) * 0.2;
        this.opacity = Math.random() * 0.4 + 0.2;
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
        ctx.shadowBlur = 10;
        ctx.shadowColor = `rgba(212, 175, 55, ${this.opacity})`;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    const waves = [
      new Wave(50, 8, 0.01, 0.0005, 'rgba(2, 6, 20, 0.3)'),
      new Wave(55, 6, 0.015, 0.0008, 'rgba(2, 6, 20, 0.25)'),
      new Wave(60, 5, 0.02, 0.001, 'rgba(2, 6, 20, 0.2)')
    ];

    const particles = Array.from({ length: 30 }, () => new Particle());

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
        opacity: 0.5,
        pointerEvents: 'none',
        zIndex: 1,
      }}
    />
  );
}

// -------------------------------
//  COMPONENTE PRINCIPAL: GeckNavbar
// -------------------------------
export default function GeckNavbar() {
  const [language, setLanguage] = useState("es");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileMenuClosing, setMobileMenuClosing] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [navVisible, setNavVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const langMenuRef = useRef(null);
  const navRef = useRef(null);

  const t = translations[language];
  const { openDrawer } = useContactDrawer();

  // -------- CSS Variables --------
  const cssVariables = `
    :root {
      --gold: #D4AF37;
      --navy-dark: #0A1D35;
      --navy-medium: #f1f1f1ff;
      --navy-light: #fdfdffff;
      --white: #FFFFFF;
      --white-soft: #F8FAFC;
    }
  `;

  // -------- Scroll Auto-Hide --------
  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY;

      if (current < 10) setNavVisible(true);
      else if (current > lastScrollY && current > 100) setNavVisible(false);
      else if (current < lastScrollY) setNavVisible(true);

      setLastScrollY(current);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // -------- Cerrar menú de idioma al hacer clic fuera --------
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target)) {
        setLangMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // -------- Prevenir scroll cuando el menú móvil está abierto --------
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  const handleLanguageChange = (code) => {
    setLanguage(code);
    setLangMenuOpen(false);
    if (mobileMenuOpen) {
      closeMobileMenu();
    }
  };


  

  const closeMobileMenu = () => {
    setMobileMenuClosing(true);
    setTimeout(() => {
      setMobileMenuOpen(false);
      setMobileMenuClosing(false);
    }, 400);
  };

  const handleNavLinkClick = () => {
    if (mobileMenuOpen) {
      closeMobileMenu();
    }
  };

  const toggleMobileMenu = () => {
    if (mobileMenuOpen) {
      closeMobileMenu();
    } else {
      setMobileMenuOpen(true);
    }
  };

  const navLinks = [
    { key: "portfolio", icon: Briefcase, href: "#portfolio" },
    { key: "about", icon: Info, href: "#about" },
    { key: "blog", icon: BookOpen, href: "#blog" },
  ];

  return (
    <>
      <style>{cssVariables}</style>
      <style>{`
        /* Reset básico */
        * {
          box-sizing: border-box;
        }

        /* DESKTOP - por defecto todo visible */
        .nav-desktop {
          display: flex;
        }
        
        .mobile-menu-btn {
          display: none;
        }

        /* TABLETS (768px - 1024px) */
        @media (max-width: 1024px) and (min-width: 769px) {
          .nav-desktop {
            gap: 2rem !important;
          }
          
          .logo-text {
            font-size: 1.8rem !important;
          }
          
          .logo-image {
            width: 60px !important;
            height: 60px !important;
          }
        }

        /* MÓVIL Y TABLETS PEQUEÑAS (hasta 768px) */
        @media (max-width: 768px) {
          .nav-desktop {
            display: none !important;
          }
          
          .mobile-menu-btn {
            display: flex !important;
            align-items: center;
            justify-content: center;
          }

          /* Logo a la izquierda */
          .logo-container {
            display: flex !important;
            align-items: center;
            gap: 0.5rem !important;
          }

          .logo-image {
            width: 65px !important;
            height: 65px !important;
          }

          /* Nombre centrado en móvil */
          .logo-text-mobile {
            display: block !important;
            position: absolute !important;
            left: 50% !important;
            transform: translateX(-50%) !important;
            font-size: 1.5rem !important;
            white-space: nowrap !important;
          }

          .logo-text-desktop {
            display: none !important;
          }

          /* Contenedor del navbar ajustado */
          .nav-container {
            padding: 0 1rem !important;
            position: relative !important;
          }
        }

        /* Menú móvil MEJORADO - Translúcido y minimalista */
        .mobile-menu {
          position: fixed;
          top: 70px;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            180deg,
            rgba(2, 6, 20, 0.45) 0%,
            rgba(2, 6, 20, 0.35) 50%,
            rgba(2, 6, 20, 0.3) 100%
          );
          backdrop-filter: blur(60px) saturate(200%) !important;
          -webkit-backdrop-filter: blur(60px) saturate(200%) !important;
          z-index: 55;
          overflow-y: auto;
          animation: slideDownFade 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        @keyframes slideDownFade {
          0% {
            opacity: 0;
            transform: translateY(-50px) scale(0.95);
            filter: blur(10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0px);
          }
        }

        /* Animación de cierre del menú */
        .mobile-menu-closing {
          animation: slideUpFade 0.4s cubic-bezier(0.4, 0, 1, 1) forwards;
        }

        @keyframes slideUpFade {
          0% {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0px);
          }
          100% {
            opacity: 0;
            transform: translateY(-50px) scale(0.95);
            filter: blur(10px);
          }
        }

        /* Efecto de partículas en el menú móvil */
        .mobile-menu::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: 
            radial-gradient(circle at 20% 20%, rgba(212, 175, 55, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 60%, rgba(212, 175, 55, 0.08) 0%, transparent 50%),
            radial-gradient(circle at 40% 80%, rgba(2, 6, 20, 0.2) 0%, transparent 50%);
          pointer-events: none;
          animation: particleFloat 8s ease-in-out infinite;
        }

        @keyframes particleFloat {
          0%, 100% {
            opacity: 0.5;
            transform: translateY(0px);
          }
          50% {
            opacity: 0.8;
            transform: translateY(-20px);
          }
        }

        /* Efectos épicos para los lados */
        .nav-glow-left, .nav-glow-right {
          position: absolute;
          top: 0;
          width: 300px;
          height: 100%;
          pointer-events: none;
          z-index: 1;
        }
        
        .nav-glow-left {
          left: 0;
          background: radial-gradient(ellipse at left, rgba(212, 175, 55, 0.25) 0%, transparent 70%);
          filter: blur(30px);
          animation: pulseLeft 5s ease-in-out infinite;
        }
        
        .nav-glow-right {
          right: 0;
          background: radial-gradient(ellipse at right, rgba(2, 6, 20, 0.4) 0%, transparent 70%);
          filter: blur(30px);
          animation: pulseRight 5s ease-in-out infinite;
        }

        @keyframes pulseLeft {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.1); }
        }

        @keyframes pulseRight {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.1); }
        }

        /* Partículas que caen */
        .falling-particle {
          position: absolute;
          border-radius: 50%;
          animation: fall linear infinite;
          pointer-events: none;
          z-index: 1;
          opacity: 0.5;
        }

        @keyframes fall {
          0% {
            transform: translateY(-100px) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.7;
          }
          90% {
            opacity: 0.5;
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }

        /* Línea dorada con pulso */
        .nav-pulse-line {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(
            90deg,
            transparent,
            var(--gold) 20%,
            #041934 50%,
            var(--gold) 80%,
            transparent
          );
          animation: pulseLine 4s ease-in-out infinite;
          z-index: 3;
        }

        @keyframes pulseLine {
          0%, 100% {
            opacity: 0.4;
            box-shadow: 0 0 15px rgba(212, 175, 55, 0.3);
          }
          50% {
            opacity: 1;
            box-shadow: 0 0 25px rgba(212, 175, 55, 0.6), 0 0 35px rgba(212, 175, 55, 0.3);
          }
        }

        /* Animación del botón hamburguesa */
        .menu-icon {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .menu-icon-open {
          transform: rotate(90deg);
        }

        /* Botón de Contacto MEJORADO - Más llamativo */
        .contact-button {
          position: relative;
          overflow: hidden;
          backdrop-filter: blur(25px) !important;
          -webkit-backdrop-filter: blur(25px) !important;
          background: linear-gradient(135deg, rgba(212, 175, 55, 0.18), rgba(212, 175, 55, 0.08)) !important;
          border: 2px solid var(--gold) !important;
          box-shadow: 
            0 0 20px rgba(212, 175, 55, 0.4),
            inset 0 0 20px rgba(212, 175, 55, 0.1) !important;
          animation: contactPulse 2s ease-in-out infinite;
        }

        .contact-button::before {
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

        @keyframes contactPulse {
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

        @keyframes shimmer {
          0% {
            transform: translateX(-100%) translateY(-100%) rotate(45deg);
          }
          100% {
            transform: translateX(100%) translateY(100%) rotate(45deg);
          }
        }

        /* Efectos blur para botones */
        .blur-button {
          backdrop-filter: blur(20px) !important;
          -webkit-backdrop-filter: blur(20px) !important;
          background: rgba(255, 255, 255, 0.03) !important;
          border: 1px solid rgba(255, 255, 255, 0.12) !important;
        }

        .blur-button-navy {
          backdrop-filter: blur(25px) !important;
          -webkit-backdrop-filter: blur(25px) !important;
          background: rgba(2, 6, 20, 0.2) !important;
          border: 1px solid rgba(212, 175, 55, 0.25) !important;
        }

        .blur-button-navy:hover {
          background: rgba(2, 6, 20, 0.35) !important;
          border-color: rgba(212, 175, 55, 0.4) !important;
        }

        /* Mejora del scroll en el menú móvil */
        .mobile-menu::-webkit-scrollbar {
          width: 6px;
        }

        .mobile-menu::-webkit-scrollbar-track {
          background: rgba(2, 6, 20, 0.3);
        }

        .mobile-menu::-webkit-scrollbar-thumb {
          background: var(--gold);
          border-radius: 3px;
        }

        /* Estilos para el menú móvil minimalista */
        .mobile-nav-link {
          backdrop-filter: blur(20px) !important;
          -webkit-backdrop-filter: blur(20px) !important;
          background: rgba(255, 255, 255, 0.02) !important;
          border: 1px solid rgba(212, 175, 55, 0.15) !important;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
          animation: slideInLeft 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) backwards;
        }

        .mobile-nav-link:nth-child(1) { animation-delay: 0.1s; }
        .mobile-nav-link:nth-child(2) { animation-delay: 0.15s; }
        .mobile-nav-link:nth-child(3) { animation-delay: 0.2s; }

        @keyframes slideInLeft {
          0% {
            opacity: 0;
            transform: translateX(-50px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .mobile-nav-link:hover {
          background: rgba(212, 175, 55, 0.1) !important;
          border-color: rgba(212, 175, 55, 0.4) !important;
          transform: translateX(10px) !important;
          box-shadow: 0 6px 20px rgba(212, 175, 55, 0.2) !important;
        }

        .mobile-contact-btn {
          backdrop-filter: blur(25px) !important;
          -webkit-backdrop-filter: blur(25px) !important;
          background: linear-gradient(135deg, rgba(212, 175, 55, 0.2), rgba(212, 175, 55, 0.08)) !important;
          border: 2px solid var(--gold) !important;
          box-shadow: 0 0 25px rgba(212, 175, 55, 0.4) !important;
          animation: slideInLeft 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.25s backwards;
        }

        .mobile-contact-btn:hover {
          background: linear-gradient(135deg, rgba(212, 175, 55, 0.3), rgba(212, 175, 55, 0.15)) !important;
          box-shadow: 0 0 35px rgba(212, 175, 55, 0.6) !important;
          transform: scale(1.03) !important;
        }

        .mobile-lang-section {
          animation: slideInLeft 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.3s backwards;
        }

        .mobile-lang-btn {
          backdrop-filter: blur(20px) !important;
          -webkit-backdrop-filter: blur(20px) !important;
          background: rgba(2, 6, 20, 0.2) !important;
          border: 1px solid rgba(212, 175, 55, 0.2) !important;
          transition: all 0.3s ease !important;
        }

        .mobile-lang-btn:hover {
          background: rgba(212, 175, 55, 0.15) !important;
          border-color: rgba(212, 175, 55, 0.4) !important;
        }

        .mobile-lang-btn.active {
          background: rgba(212, 175, 55, 0.25) !important;
          border-color: var(--gold) !important;
          box-shadow: 0 0 20px rgba(212, 175, 55, 0.3) !important;
        }
      `}</style>

      <nav
        ref={navRef}
        style={{
          background: `
            linear-gradient(135deg, 
              rgba(2,6,20,0.40) 0%, 
              rgba(2,6,20,0.40) 50%, 
              rgba(2,6,20,0.40) 100%
            ),
            radial-gradient(ellipse at 20% 50%, rgba(212,175,55,0.08) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 50%, rgba(212,175,55,0.05) 0%, transparent 50%)
          `,
          backdropFilter: "blur(40px) saturate(180%)",
          WebkitBackdropFilter: "blur(40px) saturate(180%)",
          border: "none",
          borderBottom: "1px solid rgba(212, 175, 55, 0.3)",
          position: "sticky",
          top: 0,
          zIndex: 50,
          height: "70px",
          transform: navVisible ? "translateY(0)" : "translateY(-100%)",
          transition: "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
          overflow: "hidden",
          boxShadow: "0 4px 30px rgba(2, 6, 20, 0.3)",
        }}
      >
        {/* Canvas con ondas animadas del footer */}
        <AnimatedWaves />

        {/* Efectos de glow en los lados con pulso */}
        <div className="nav-glow-left" />
        <div className="nav-glow-right" />
        
        {/* Partículas que caen - FIJAS para evitar error de hidratación */}
        {FIXED_PARTICLES.map((particle, i) => (
          <div
            key={`particle-${i}`}
            className="falling-particle"
            style={{
              left: particle.left,
              animationDelay: particle.delay,
              animationDuration: particle.duration,
              background: particle.color === "gold" ? "var(--gold)" : "#041934",
              width: particle.width,
              height: particle.height,
            }}
          />
        ))}

        {/* Línea dorada con pulso */}
        <div className="nav-pulse-line" />

        <div
          className="nav-container"
          style={{
            padding: "0 2rem",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "relative",
            zIndex: 2,
            maxWidth: "2200px",
            margin: "0 auto",
          }}
        >
          {/* LOGO A LA IZQUIERDA - siempre visible */}
          <a
            href="/"
            className="logo-container"
            style={{ 
              display: "flex", 
              alignItems: "center", 
              gap: "0.75rem",
              textDecoration: "none",
              zIndex: 3,
            }}
          >
            <img 
              src="/assets/image/logo.png" 
              alt="Geck Codex"
              className="logo-image"
              style={{
                width: "85px",
                height: "85px",
                objectFit: "contain",
              }}
              onError={(e) => {
                e.target.style.display = 'none';
                const fallback = document.createElement('div');
                fallback.innerHTML = 'G';
                fallback.style.cssText = `
                  width: 50px;
                  height: 50px;
                  background: var(--gold);
                  border-radius: 8px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-weight: bold;
                  font-size: 1.5rem;
                  color: var(--navy-dark);
                  box-shadow: 0 4px 12px rgba(212, 175, 55, 0.3);
                `;
                e.target.parentNode.appendChild(fallback);
              }}
            />

            {/* Texto del logo en desktop - con animación disperse */}
            <span
              className="logo-text logo-text-desktop"
              style={{
                fontSize: "2rem",
                fontWeight: "bold",
              }}
            >
              <AnimatedLogo text="Geck Codex" />
            </span>
          </a>

          {/* NOMBRE CENTRADO EN MÓVIL - con animación disperse */}
          <span
            className="logo-text logo-text-mobile"
            style={{
              fontSize: "2rem",
              fontWeight: "bold",
              display: "none",
            }}
          >
            <AnimatedLogo text="Geck Codex" />
          </span>

          {/* NAV DESKTOP - CENTRO CON DISPERSE TEXT */}
          <div
            className="nav-desktop"
            style={{ 
              gap: "3.5rem", 
              position: "absolute", 
              left: "50%", 
              transform: "translateX(-50%)",
              display: "flex",
              alignItems: "center"
            }}
          >
            {navLinks.map(({ key, icon, href }) => (
              <MagneticLink 
                key={key} 
                href={href} 
                icon={icon} 
                text={t[key]}
                onClick={handleNavLinkClick}
              />
            ))}
          </div>

          {/* NAV DESKTOP - DERECHA */}
          <div className="nav-desktop" style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            {/* Botón Contacto MEJORADO - Más llamativo */}
            <button
              onClick={(e) => {
                e.preventDefault();
                openDrawer();
              }}
              className="contact-button"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                color: "var(--gold)",
                padding: "0.75rem 1.5rem",
                borderRadius: "10px",
                fontWeight: 700,
                textDecoration: "none",
                transition: "all 0.3s ease",
                cursor: "pointer",
                position: "relative",
                zIndex: 1,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.08) translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 0 35px rgba(212, 175, 55, 0.7), 0 0 50px rgba(212, 175, 55, 0.4), inset 0 0 25px rgba(212, 175, 55, 0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              <Mail size={18} />
              {t.contact}
            </button>

            {/* Menu Idioma */}
            <div ref={langMenuRef} style={{ position: "relative" }}>
              <button
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="blur-button-navy"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  color: "white",
                  padding: "0.75rem 1rem",
                  borderRadius: "10px",
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.05)";
                  e.currentTarget.style.boxShadow = "0 6px 20px rgba(212, 175, 55, 0.2)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <Globe size={18} />
                {languageOptions.find((l) => l.code === language)?.flag}
              </button>

              {langMenuOpen && (
                <div
                  style={{
                    position: "absolute",
                    right: 0,
                    top: "calc(100% + 0.5rem)",
                    background: "rgba(2, 6, 20, 0.4)",
                    backdropFilter: "blur(30px)",
                    WebkitBackdropFilter: "blur(30px)",
                    border: "1px solid rgba(212, 175, 55, 0.25)",
                    borderRadius: "10px",
                    overflow: "hidden",
                    minWidth: "160px",
                    zIndex: 100,
                    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
                  }}
                >
                  {languageOptions.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageChange(lang.code)}
                      style={{
                        width: "100%",
                        padding: "0.75rem 1rem",
                        background: language === lang.code
                          ? "rgba(212, 175, 55, 0.2)"
                          : "transparent",
                        backdropFilter: "blur(15px)",
                        WebkitBackdropFilter: "blur(15px)",
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.75rem",
                        border: "none",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        if (language !== lang.code) {
                          e.currentTarget.style.background = "rgba(212, 175, 55, 0.12)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (language !== lang.code) {
                          e.currentTarget.style.background = "transparent";
                        }
                      }}
                    >
                      <span style={{ fontSize: "1.5rem" }}>{lang.flag}</span>
                      {lang.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* BOTÓN HAMBURGUESA A LA DERECHA - solo visible en móvil */}
          <button
            className="mobile-menu-btn blur-button-navy"
            onClick={toggleMobileMenu}
            style={{ 
              color: "white", 
              cursor: "pointer",
              zIndex: 60,
              padding: "0.6rem",
              borderRadius: "8px",
              transition: "all 0.3s ease",
              border: "none",
            }}
          >
            <div className={`menu-icon ${mobileMenuOpen ? 'menu-icon-open' : ''}`}>
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </div>
          </button>
        </div>
      </nav>

      {/* MENU MOBILE MEJORADO - Translúcido y minimalista */}
      {mobileMenuOpen && (
        <div className={`mobile-menu ${mobileMenuClosing ? 'mobile-menu-closing' : ''}`}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              padding: "2rem 1.5rem",
              maxWidth: "500px",
              margin: "2rem auto 0",
            }}
          >
            {/* Links de navegación */}
            {navLinks.map(({ key, icon: Icon, href }, index) => (
              <a
                key={key}
                href={href}
                onClick={handleNavLinkClick}
                className="mobile-nav-link"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  padding: "1rem 1.5rem",
                  color: "rgba(248, 250, 252, 0.95)",
                  textDecoration: "none",
                  borderRadius: "12px",
                  fontSize: "1.05rem",
                  fontWeight: 500,
                }}
              >
                <Icon size={20} style={{ color: "var(--gold)", opacity: 0.9 }} />
                <span>{t[key]}</span>
              </a>
            ))}

            {/* Botón de Contacto */}
            <button
              onClick={(e) => {
                e.preventDefault();
                openDrawer();
              }}
              className="contact-button"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.75rem",
                padding: "1.1rem 1.5rem",
                color: "var(--gold)",
                fontWeight: 700,
                borderRadius: "12px",
                textDecoration: "none",
                marginTop: "0.5rem",
                fontSize: "1.05rem",
              }}
            >
              <Mail size={20} />
              {t.contact}
            </button>

            {/* Selector de idioma - REDISEÑADO */}
            <div
              className="mobile-lang-section"
              style={{
                marginTop: "1.5rem",
                paddingTop: "1.5rem",
                borderTop: "1px solid rgba(212, 175, 55, 0.25)",
              }}
            >
              <p
                style={{
                  color: "rgba(212, 175, 55, 0.95)",
                  fontWeight: 600,
                  marginBottom: "1rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  fontSize: "0.95rem",
                }}
              >
                <Globe size={16} />
                {t.language}
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.75rem" }}>
                {languageOptions.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)}
                    className={`mobile-lang-btn-card ${language === lang.code ? 'active' : ''}`}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.5rem",
                      padding: "1rem 0.5rem",
                      color: "rgba(248, 250, 252, 0.95)",
                      border: "none",
                      cursor: "pointer",
                      borderRadius: "12px",
                      fontSize: "0.85rem",
                      fontWeight: 500,
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    <span style={{ fontSize: "2rem", lineHeight: 1 }}>{lang.flag}</span>
                    <span style={{ fontSize: "0.8rem", opacity: 0.9 }}>{lang.code.toUpperCase()}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}