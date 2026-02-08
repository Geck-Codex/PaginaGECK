import { useState, useMemo, useRef, useEffect } from "react";
import { Github, Linkedin, Twitter, Mail, ArrowUp } from "lucide-react";

// --- COMPONENTE DE OLVAS Y PARTÍCULAS (Mismo que la Navbar) ---
function AnimatedWaves() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = 120; // Un poco más alto para el footer
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
      new Wave(80, 8, 0.01, 0.0005, 'rgba(2, 6, 20, 0.3)'),
      new Wave(85, 6, 0.015, 0.0008, 'rgba(2, 6, 20, 0.25)'),
      new Wave(90, 5, 0.02, 0.001, 'rgba(2, 6, 20, 0.2)')
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
    <canvas ref={canvasRef} style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '100%', opacity: 0.6, pointerEvents: 'none', zIndex: 0 }} />
  );
}

// --- COMPONENTE DE DISPERSIÓN DE TEXTO ---
function DisperseFooterText({ text, isHovered }) {
  const scatterMap = useMemo(() => {
    return text.split("").map(() => ({
      x: (Math.random() - 0.5) * 25,
      y: (Math.random() - 0.5) * 25,
      r: (Math.random() - 0.5) * 45,
    }));
  }, [text]);

  return (
    <span style={{ display: "inline-block" }}>
      {text.split("").map((letter, index) => (
        <span
          key={index}
          style={{
            display: "inline-block",
            transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
            transform: isHovered 
              ? `translate(${scatterMap[index].x}px, ${scatterMap[index].y}px) rotate(${scatterMap[index].r}deg)` 
              : "translate(0,0) rotate(0deg)",
            opacity: isHovered ? 0.5 : 1,
            color: isHovered ? "var(--gold)" : "inherit"
          }}
        >
          {letter === " " ? "\u00A0" : letter}
        </span>
      ))}
    </span>
  );
}

export default function GeckFooter() {
  const [hoveredIcon, setHoveredIcon] = useState(null);
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const socialLinks = [
    { Icon: Github, name: 'github', label: 'GitHub', url: 'https://github.com' },
    { Icon: Linkedin, name: 'linkedin', label: 'LinkedIn', url: 'https://linkedin.com' },
    { Icon: Twitter, name: 'twitter', label: 'Twitter', url: 'https://twitter.com' },
    { Icon: Mail, name: 'mail', label: 'Email', url: 'mailto:contacto@geckcodex.com' }
  ];

  return (
    <footer style={{
      position: 'relative',
      background: "linear-gradient(135deg, rgba(2,6,20,0.40) 0%, rgba(2,6,20,0.40) 100%)",
      backdropFilter: "blur(40px) saturate(180%)",
      borderTop: "1px solid rgba(212, 175, 55, 0.3)",
      padding: '60px 2rem 30px 2rem',
      marginTop: 'auto',
      overflow: 'hidden'
    }}>
      
      {/* EFECTOS DE FONDO IGUALES A LA NAVBAR */}
      <AnimatedWaves />
      
      {/* LÍNEA SUPERIOR DE PULSO */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0,
        height: '2px',
        background: 'linear-gradient(90deg, transparent, var(--gold) 20%, #041934 50%, var(--gold) 80%, transparent)',
        animation: 'pulseLine 4s infinite',
        opacity: 0.6,
        zIndex: 3
      }} />

      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        position: 'relative',
        zIndex: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '35px'
      }}>

        {/* REDES SOCIALES - CRISTAL iOS */}
        <div style={{ 
          display: 'flex', 
          gap: '16px',
          padding: '12px 24px',
          background: 'rgba(255, 255, 255, 0.03)',
          backdropFilter: 'blur(20px) saturate(180%)',
          borderRadius: '100px',
          border: '1px solid rgba(212, 175, 55, 0.2)',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.2)'
        }}>
          {socialLinks.map(({ Icon, name, label, url }) => (
            <a
              key={name}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={() => setHoveredIcon(name)}
              onMouseLeave={() => setHoveredIcon(null)}
              style={{
                position: 'relative',
                padding: '12px',
                color: hoveredIcon === name ? '#0A1D35' : 'var(--gold)',
                background: hoveredIcon === name ? 'var(--gold)' : 'rgba(2, 6, 20, 0.4)',
                borderRadius: '50%',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: hoveredIcon === name ? 'translateY(-5px) scale(1.1)' : 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textDecoration: 'none',
                border: '1px solid rgba(212, 175, 55, 0.3)',
              }}
            >
              <Icon size={20} />
              
              {/* Tooltip */}
              <span style={{
                position: 'absolute',
                bottom: '130%',
                padding: '6px 12px',
                background: 'rgba(10, 29, 53, 0.95)',
                backdropFilter: 'blur(10px)',
                color: 'white',
                fontSize: '0.7rem',
                borderRadius: '8px',
                opacity: hoveredIcon === name ? 1 : 0,
                transform: hoveredIcon === name ? 'translateY(0)' : 'translateY(10px)',
                transition: '0.3s',
                pointerEvents: 'none',
                border: '1px solid var(--gold)',
                whiteSpace: 'nowrap',
              }}>
                {label}
              </span>
            </a>
          ))}
        </div>

        {/* BOTTOM BAR */}
        <div style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: '25px',
          borderTop: '1px solid rgba(212, 175, 55, 0.15)',
          color: 'rgba(255, 255, 255, 0.6)',
          fontSize: '0.85rem'
        }}>
          <div 
            onMouseEnter={() => setHoveredIcon('copy')} 
            onMouseLeave={() => setHoveredIcon(null)}
            style={{ cursor: 'default', fontWeight: '500', letterSpacing: '1px' }}
          >
            <DisperseFooterText 
              text={`© ${currentYear} GECK CODEX`} 
              isHovered={hoveredIcon === 'copy'} 
            />
          </div>

          <button 
            onClick={scrollToTop}
            onMouseEnter={() => setHoveredIcon('top')}
            onMouseLeave={() => setHoveredIcon(null)}
            style={{
              background: 'rgba(212, 175, 55, 0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(212, 175, 55, 0.4)',
              color: 'var(--gold)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 20px',
              borderRadius: '12px',
              fontSize: '0.75rem',
              fontWeight: 'bold',
              transition: '0.3s',
              boxShadow: hoveredIcon === 'top' ? '0 0 20px rgba(212, 175, 55, 0.2)' : 'none'
            }}
          >
            UP <ArrowUp size={16} style={{ 
              animation: hoveredIcon === 'top' ? 'bounce 0.8s infinite' : 'none' 
            }} />
          </button>
        </div>
      </div>

      <style>{`
        :root { 
          --gold: #D4AF37; 
          --navy-dark: #0A1D35;
        }
        
        @keyframes pulseLine {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
      `}</style>
    </footer>
  );
}