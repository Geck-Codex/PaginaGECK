import { useState, useEffect, useRef } from "react";
import { Menu, X, Briefcase, Info, BookOpen, Globe, Mail, Layers } from "lucide-react";
import { useContactDrawer } from '../contexts/ContactDrawerContext';

const translations = {
  en: {
    portfolio: "Portfolio",
    about: "About Us",
    blog: "Blog",
    services: "Services",
    contact: "Contact",
    language: "Language",
  },
  es: {
    portfolio: "Portafolio",
    about: "Nosotros",
    blog: "Blog",
    services: "Servicios",
    contact: "Contacto",
    language: "Idioma",
  },
  pt: {
    portfolio: "Portfólio",
    about: "Sobre Nós",
    blog: "Blog",
    services: "Serviços",
    contact: "Contato",
    language: "Idioma",
  },
};

const languageOptions = [
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "es", label: "Español", flag: "🇪🇸" },
  { code: "pt", label: "Português", flag: "🇧🇷" },
];

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
              ? `translate(${(Math.random() - 0.5) * 20}px, ${(Math.random() - 0.5) * 20}px) rotate(${(Math.random() - 0.5) * 45}deg) scale(0.8)`
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

function MagneticLink({ href, icon: Icon, text }) {
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

  return (
    <a
      ref={linkRef}
      href={href}
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
              ? `translate(${(Math.random() - 0.5) * 25}px, ${(Math.random() - 0.5) * 25}px) rotate(${(Math.random() - 0.5) * 50}deg) scale(0.7)`
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

function AnimatedWaves() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = 70;
    };
    setCanvasSize();

    class Wave {
      constructor(y, amplitude, frequency, speed, color) {
        this.y = y; this.amplitude = amplitude; this.frequency = frequency;
        this.speed = speed; this.color = color; this.phase = Math.random() * Math.PI * 2;
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
        this.x = Math.random() * canvas.width; this.y = canvas.height + 20;
        this.size = Math.random() * 2 + 1; this.speedY = Math.random() * 0.3 + 0.1;
        this.speedX = (Math.random() - 0.5) * 0.2; this.opacity = Math.random() * 0.4 + 0.2;
      }
      update() { this.y -= this.speedY; this.x += this.speedX; if (this.y < -20) this.reset(); }
      draw() {
        ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212, 175, 55, ${this.opacity})`;
        ctx.shadowBlur = 10; ctx.shadowColor = `rgba(212, 175, 55, ${this.opacity})`;
        ctx.fill(); ctx.shadowBlur = 0;
      }
    }

    const waves = [
      new Wave(50, 8, 0.01, 0.0005, 'rgba(2, 6, 20, 0.3)'),
      new Wave(55, 6, 0.015, 0.0008, 'rgba(2, 6, 20, 0.25)'),
      new Wave(60, 5, 0.02, 0.001, 'rgba(2, 6, 20, 0.2)')
    ];
    const particles = Array.from({ length: 30 }, () => new Particle());
    let animationTime = 0; let animationId;

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
    <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0.5, pointerEvents: 'none', zIndex: 1 }} />
  );
}

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

  const cssVariables = `
    :root {
      --gold: #D4AF37;
      --navy-dark: #0A1D35;
      --white: #FFFFFF;
      --white-soft: #F8FAFC;
    }
  `;

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target)) {
        setLangMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [mobileMenuOpen]);

  const handleLanguageChange = (code) => {
    setLanguage(code);
    setLangMenuOpen(false);
    if (mobileMenuOpen) closeMobileMenu();
  };

  const closeMobileMenu = () => {
    setMobileMenuClosing(true);
    setTimeout(() => {
      setMobileMenuOpen(false);
      setMobileMenuClosing(false);
    }, 400);
  };

  const handleNavLinkClick = () => { if (mobileMenuOpen) closeMobileMenu(); };

  const toggleMobileMenu = () => {
    if (mobileMenuOpen) closeMobileMenu();
    else setMobileMenuOpen(true);
  };

  // ✅ "servicios" añadido como nueva sección
  const navLinks = [
    { key: "portfolio", icon: Briefcase, href: "/portafolio" },
    { key: "services", icon: Layers, href: "/servicios" },
    { key: "about", icon: Info, href: "/nosotros" },
    { key: "blog", icon: BookOpen, href: "/blog" },
  ];

  return (
    <>
      <style>{cssVariables}</style>
      <style>{`
        * { box-sizing: border-box; }
        .nav-desktop { display: flex; }
        .mobile-menu-btn { display: none; }
        @media (max-width: 768px) {
          .nav-desktop { display: none !important; }
          .mobile-menu-btn { display: flex !important; align-items: center; justify-content: center; }
          .logo-text-mobile { display: block !important; position: absolute !important; left: 50% !important; transform: translateX(-50%) !important; white-space: nowrap !important; }
          .logo-text-desktop { display: none !important; }
          .nav-container { padding: 0 1rem !important; position: relative !important; }
        }
        .mobile-menu { position: fixed; top: 70px; left: 0; right: 0; bottom: 0; background: linear-gradient(180deg, rgba(2, 6, 20, 0.45) 0%, rgba(2, 6, 20, 0.3) 100%); backdrop-filter: blur(60px) saturate(200%); z-index: 55; animation: slideDownFade 0.5s cubic-bezier(0.34, 1.56, 0.64, 1); }
        @keyframes slideDownFade { 0% { opacity: 0; transform: translateY(-50px); } 100% { opacity: 1; transform: translateY(0); } }
        .mobile-menu-closing { animation: slideUpFade 0.4s forwards; }
        @keyframes slideUpFade { 0% { opacity: 1; transform: translateY(0); } 100% { opacity: 0; transform: translateY(-50px); } }
        .nav-pulse-line { position: absolute; bottom: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, transparent, var(--gold) 20%, #041934 50%, var(--gold) 80%, transparent); animation: pulseLine 4s infinite; z-index: 3; }
        @keyframes pulseLine { 0%, 100% { opacity: 0.4; } 50% { opacity: 1; } }
        .contact-button { position: relative; overflow: hidden; backdrop-filter: blur(25px); background: linear-gradient(135deg, rgba(212, 175, 55, 0.18), rgba(212, 175, 55, 0.08)); border: 2px solid var(--gold); animation: contactPulse 2s infinite; }
        @keyframes contactPulse { 0%, 100% { box-shadow: 0 0 20px rgba(212, 175, 55, 0.4); } 50% { box-shadow: 0 0 35px rgba(212, 175, 55, 0.6); } }
        .blur-button-navy { backdrop-filter: blur(25px); background: rgba(2, 6, 20, 0.2); border: 1px solid rgba(212, 175, 55, 0.25); transition: all 0.3s; }
        .mobile-nav-link { backdrop-filter: blur(20px); background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(212, 175, 55, 0.15); transition: all 0.3s; }
        .mobile-lang-btn.active { background: rgba(212, 175, 55, 0.25) !important; border: 1px solid var(--gold) !important; }
      `}</style>

      <nav
        ref={navRef}
        style={{
          background: "linear-gradient(135deg, rgba(2,6,20,0.40) 0%, rgba(2,6,20,0.40) 100%)",
          backdropFilter: "blur(40px) saturate(180%)",
          borderBottom: "1px solid rgba(212, 175, 55, 0.3)",
          position: "sticky", top: 0, zIndex: 50, height: "70px",
          transform: navVisible ? "translateY(0)" : "translateY(-100%)",
          transition: "transform 0.4s",
        }}
      >
        <AnimatedWaves />
        <div className="nav-pulse-line" />

        <div className="nav-container" style={{ padding: "0 2rem", height: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative", zIndex: 2, maxWidth: "2200px", margin: "0 auto" }}>
          
          <a href="/" className="logo-container" style={{ display: "flex", alignItems: "center", gap: "0.75rem", textDecoration: "none", zIndex: 3 }}>
            <img src="/assets/image/logo.png" alt="Geck Codex" style={{ width: "65px", height: "65px", objectFit: "contain" }} />
            <span className="logo-text logo-text-desktop" style={{ fontSize: "2rem", fontWeight: "bold" }}>
              <AnimatedLogo text="Geck Codex" />
            </span>
          </a>

          <span className="logo-text logo-text-mobile" style={{ fontSize: "2rem", fontWeight: "bold", display: "none" }}>
            <AnimatedLogo text="Geck Codex" />
          </span>

          <div className="nav-desktop" style={{ gap: "3.5rem", position: "absolute", left: "50%", transform: "translateX(-50%)", display: "flex", alignItems: "center" }}>
            {navLinks.map(({ key, icon, href }) => (
              <MagneticLink key={key} href={href} icon={icon} text={t[key]} />
            ))}
          </div>

          <div className="nav-desktop" style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            <button onClick={(e) => { e.preventDefault(); openDrawer(); }} className="contact-button" style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--gold)", padding: "0.75rem 1.5rem", borderRadius: "10px", fontWeight: 700, cursor: "pointer", transition: "0.3s" }}>
              <Mail size={18} /> {t.contact}
            </button>

            {/* BOTÓN IDIOMA DESKTOP */}
            <div ref={langMenuRef} style={{ position: "relative" }}>
              <button
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="blur-button-navy"
                style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "white", padding: "0.75rem 1rem", borderRadius: "10px", cursor: "pointer" }}
              >
                <Globe size={18} style={{ color: "var(--gold)" }} />
                <span>{languageOptions.find(l => l.code === language).flag}</span>
              </button>

              {langMenuOpen && (
                <div style={{ position: "absolute", top: "120%", right: 0, background: "rgba(10, 29, 53, 0.95)", backdropFilter: "blur(20px)", borderRadius: "12px", padding: "0.5rem", border: "1px solid rgba(212, 175, 55, 0.3)", display: "flex", flexDirection: "column", gap: "4px", minWidth: "140px", zIndex: 100 }}>
                  {languageOptions.map((opt) => (
                    <button
                      key={opt.code}
                      onClick={() => handleLanguageChange(opt.code)}
                      style={{ display: "flex", alignItems: "center", gap: "10px", padding: "0.75rem 1rem", background: language === opt.code ? "rgba(212, 175, 55, 0.2)" : "transparent", border: "none", color: "white", borderRadius: "8px", cursor: "pointer", transition: "0.2s" }}
                    >
                      <span>{opt.flag}</span> {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <button className="mobile-menu-btn" onClick={toggleMobileMenu} style={{ background: "none", border: "none", color: "white", cursor: "pointer", zIndex: 60 }}>
            {mobileMenuOpen ? <X size={32} /> : <Menu size={32} />}
          </button>
        </div>
      </nav>

      {/* MENÚ MÓVIL OVERLAY */}
      {mobileMenuOpen && (
        <div className={`mobile-menu ${mobileMenuClosing ? "mobile-menu-closing" : ""}`}>
          <div style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "1.5rem", marginTop: "2rem" }}>
            {navLinks.map(({ key, icon: Icon, href }) => (
              <a key={key} href={href} onClick={handleNavLinkClick} className="mobile-nav-link" style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "1.25rem", borderRadius: "15px", color: "white", textDecoration: "none", fontSize: "1.5rem", fontWeight: "600" }}>
                <Icon size={24} style={{ color: "var(--gold)" }} /> {t[key]}
              </a>
            ))}
            <button onClick={openDrawer} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem", padding: "1.25rem", borderRadius: "15px", background: "linear-gradient(135deg, rgba(212,175,55,0.2), rgba(212,175,55,0.08))", border: "2px solid var(--gold)", color: "var(--gold)", fontSize: "1.5rem", fontWeight: "bold" }}>
              <Mail size={24} /> {t.contact}
            </button>
            <div style={{ marginTop: "2rem" }}>
              <p style={{ color: "rgba(255,255,255,0.5)", marginBottom: "1rem" }}>{t.language}</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.5rem" }}>
                {languageOptions.map((opt) => (
                  <button key={opt.code} onClick={() => handleLanguageChange(opt.code)} className={`mobile-lang-btn ${language === opt.code ? "active" : ""}`} style={{ padding: "1rem", borderRadius: "12px", background: "rgba(2,6,20,0.4)", border: "1px solid rgba(212,175,55,0.2)", color: "white" }}>
                    {opt.flag}
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