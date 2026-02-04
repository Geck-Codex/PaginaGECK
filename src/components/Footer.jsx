import { useState, useMemo } from "react";
import { Github, Linkedin, Twitter, Mail, ArrowUp } from "lucide-react";

// --- COMPONENTE DE DISPERSIÓN ---
function DisperseFooterText({ text, isHovered }) {
  const scatterMap = useMemo(() => {
    return text.split("").map(() => ({
      x: (Math.random() - 0.5) * 25, // Dispersión media para legibilidad
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
    { Icon: Github, name: 'github', label: 'GitHub' },
    { Icon: Linkedin, name: 'linkedin', label: 'LinkedIn' },
    { Icon: Twitter, name: 'twitter', label: 'Twitter' },
    { Icon: Mail, name: 'mail', label: 'Email' }
  ];

  return (
    <footer style={{
      position: 'relative',
      background: 'linear-gradient(to bottom, transparent, #222220)',
      padding: '50px 2rem 24px 2rem', // Altura optimizada
      marginTop: 'auto',
      overflow: 'hidden'
    }}>
      
      {/* CAPA GLASSMORPHISM */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'rgba(34, 34, 32, 0.6)',
        backdropFilter: 'blur(15px)',
        WebkitBackdropFilter: 'blur(15px)', // Corregido
        zIndex: 0
      }} />

      {/* LÍNEA SUPERIOR DE PULSO */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0,
        height: '2px',
        background: 'linear-gradient(90deg, transparent, var(--gold), transparent)',
        animation: 'shimmer 3s infinite ease-in-out',
        opacity: 0.6,
        zIndex: 1
      }} />

      {/* GLOW ORBS (Espectáculo visual) */}
      <div style={{
        position: 'absolute',
        top: '20%', left: '5%',
        width: '350px', height: '350px',
        background: 'radial-gradient(circle, rgba(212, 175, 55, 0.12) 0%, transparent 70%)',
        filter: 'blur(60px)',
        zIndex: 0,
        animation: 'float 10s ease-in-out infinite'
      }} />
      
      <div style={{
        position: 'absolute',
        bottom: '-10%', right: '5%',
        width: '300px', height: '300px',
        background: 'radial-gradient(circle, rgba(212, 175, 55, 0.08) 0%, transparent 70%)',
        filter: 'blur(50px)',
        zIndex: 0,
        animation: 'float 8s ease-in-out infinite reverse'
      }} />

      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        position: 'relative',
        zIndex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '28px' // Gap ajustado para armonía
      }}>
        
       

        {/* REDES SOCIALES */}
        <div style={{ 
          display: 'flex', 
          gap: '14px',
          padding: '12px 20px',
          background: 'rgba(255, 255, 255, 0.03)',
          borderRadius: '100px',
          border: '1px solid rgba(255, 255, 255, 0.05)',
        }}>
          {socialLinks.map(({ Icon, name, label }) => (
            <a
              key={name}
              href={`#${name}`}
              onMouseEnter={() => setHoveredIcon(name)}
              onMouseLeave={() => setHoveredIcon(null)}
              style={{
                position: 'relative',
                padding: '12px',
                color: hoveredIcon === name ? '#222220' : 'var(--gold)',
                background: hoveredIcon === name ? 'var(--gold)' : 'rgba(212, 175, 55, 0.05)',
                borderRadius: '50%',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: hoveredIcon === name ? 'translateY(-5px) scale(1.1)' : 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textDecoration: 'none',
                border: '1px solid rgba(212, 175, 55, 0.2)',
                boxShadow: hoveredIcon === name ? '0 0 25px rgba(212, 175, 55, 0.4)' : 'none'
              }}
            >
              <Icon size={20} />
              
              {/* Tooltip corregido */}
              <span style={{
                position: 'absolute',
                bottom: '120%',
                padding: '5px 10px',
                background: '#222220',
                color: 'var(--gold)',
                fontSize: '0.65rem',
                borderRadius: '5px',
                opacity: hoveredIcon === name ? 1 : 0,
                transform: hoveredIcon === name ? 'translateY(0)' : 'translateY(10px)',
                transition: '0.3s',
                pointerEvents: 'none',
                border: '1px solid var(--gold)',
                fontWeight: 'bold',
                whiteSpace: 'nowrap'
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
          marginTop: '10px',
          paddingTop: '20px',
          borderTop: '1px solid rgba(212, 175, 55, 0.1)',
          color: 'rgba(255,255,255,0.4)',
          fontSize: '0.8rem'
        }}>
          <div 
            onMouseEnter={() => setHoveredIcon('copy')} 
            onMouseLeave={() => setHoveredIcon(null)}
            style={{ cursor: 'default' }}
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
              background: 'transparent',
              border: '1px solid rgba(212, 175, 55, 0.4)',
              color: 'var(--gold)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 15px',
              borderRadius: '6px',
              fontSize: '0.7rem',
              fontWeight: 'bold',
              transition: '0.3s',
              boxShadow: hoveredIcon === 'top' ? '0 0 15px rgba(212, 175, 55, 0.3)' : 'none'
            }}
          >
            UP <ArrowUp size={14} style={{ animation: hoveredIcon === 'top' ? 'bounce 0.8s infinite' : 'none' }} />
          </button>
        </div>
      </div>

      <style>{`
        :root { --gold: #D4AF37; }
        
        @keyframes shimmer {
          0%, 100% { opacity: 0.3; transform: translateX(-10%); }
          50% { opacity: 0.8; transform: translateX(10%); }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
      `}</style>
    </footer>
  );
}