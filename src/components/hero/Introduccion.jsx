import { useState, useEffect, useRef } from 'react';

export default function Introduction() {
  const [blurAmount, setBlurAmount] = useState(10);
  const [scrollProgress, setScrollProgress] = useState(0);
  const sectionRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (sectionRef.current) {
        const sectionTop = sectionRef.current.offsetTop;
        const sectionHeight = sectionRef.current.offsetHeight;
        const windowHeight = window.innerHeight;
        
        // Calcular posición relativa de la sección en viewport
        const sectionCenter = sectionTop + (sectionHeight / 2);
        const viewportCenter = currentScrollY + (windowHeight / 2);
        
        // Distancia del centro
        const distance = Math.abs(sectionCenter - viewportCenter);
        const maxDistance = windowHeight / 2;
        
        // Calcular blur (0-10px) basado en distancia
        const newBlur = Math.min(10, (distance / maxDistance) * 10);
        setBlurAmount(newBlur);

        // Calcular progreso de scroll (0 = arriba, 0.5 = centro, 1 = abajo)
        const sectionStart = sectionTop - windowHeight;
        const sectionEnd = sectionTop + sectionHeight;
        const scrollRange = sectionEnd - sectionStart;
        const progress = (currentScrollY - sectionStart) / scrollRange;
        
        // Clamped entre 0 y 1
        setScrollProgress(Math.max(0, Math.min(1, progress)));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const text1 = "Somos una empresa mexicana a la vanguardia tecnológica, especializados en transformar ideas en soluciones digitales inteligentes.";
  const text2 = "Desde Computer Vision hasta automatizaciones empresariales, construimos el futuro con tecnología de clase mundial.";

  // Función para calcular opacidad de cada letra basado en progreso de scroll
  const getLetterOpacity = (index, totalLetters) => {
    // Normalizar índice de letra (0 a 1)
    const letterProgress = index / totalLetters;
    
    // Fase de aparición: desde que entras a la sección
    // Las primeras letras aparecen antes, las últimas después
    const fadeInStart = letterProgress * 0.3; // 0% a 30% del scroll
    const fadeInEnd = 0.3 + (letterProgress * 0.1); // termina en 30-40%
    
    // Fase visible completa: TODO visible en el centro
    const visibleStart = 0.4; // 40% del scroll
    const visibleEnd = 0.6;   // 60% del scroll
    
    // Fase de desaparición: al salir de la sección
    const fadeOutStart = 0.6 + (letterProgress * 0.1); // 60-70%
    const fadeOutEnd = 0.7 + (letterProgress * 0.3);   // 70-100%
    
    let opacity = 0;
    
    // Fase de aparición gradual
    if (scrollProgress >= fadeInStart && scrollProgress <= fadeInEnd) {
      opacity = (scrollProgress - fadeInStart) / (fadeInEnd - fadeInStart);
    }
    // Fase visible (TODO EL TEXTO VISIBLE)
    else if (scrollProgress > visibleStart && scrollProgress < visibleEnd) {
      opacity = 1;
    }
    // Transición entre aparecer y estar visible
    else if (scrollProgress > fadeInEnd && scrollProgress <= visibleStart) {
      opacity = 1;
    }
    // Transición entre visible y desaparecer
    else if (scrollProgress >= visibleEnd && scrollProgress < fadeOutStart) {
      opacity = 1;
    }
    // Fase de desaparición gradual
    else if (scrollProgress >= fadeOutStart && scrollProgress <= fadeOutEnd) {
      opacity = 1 - ((scrollProgress - fadeOutStart) / (fadeOutEnd - fadeOutStart));
    }
    
    return Math.max(0, Math.min(1, opacity));
  };

  // Función para dividir texto en spans animados
  const animateText = (text) => {
    const letters = text.split('');
    return letters.map((char, index) => {
      const opacity = getLetterOpacity(index, letters.length);
      
      return (
        <span
          key={index}
          className="animated-letter"
          style={{
            opacity: opacity,
            transform: `translateY(${(1 - opacity) * 10}px)`
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      );
    });
  };

  return (
    <>
      <div className="intro-container" ref={sectionRef}>
        {/* Contenido */}
        <div className="intro-content">
          <div className="intro-content-inner">
            
            {/* Texto central con efecto blur */}
            <div 
              className="intro-text-container"
              style={{
                filter: `blur(${blurAmount}px)`,
                transition: 'filter 0.3s ease-out'
              }}
            >
              <p className="intro-main-text">
                {animateText(text1)}
              </p>
              <p className="intro-main-text">
                {animateText(text2)}
              </p>
            </div>

          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="intro-scroll-indicator">
          <div className="intro-scroll-mouse">
            <div className="intro-scroll-wheel"></div>
          </div>
          <p className="intro-scroll-text">Scroll</p>
        </div>
      </div>

      <style jsx>{`
        /* ============================================
           CONTENEDOR PRINCIPAL (SIN VIDEO)
           ============================================ */
        .intro-container {
          position: relative;
          width: 100%;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* ============================================
           CONTENIDO
           ============================================ */
        .intro-content {
          position: relative;
          z-index: 10;
          text-align: center;
          padding: 3rem 1.5rem;
          max-width: 1100px;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
        }

        .intro-content-inner {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 100%;
        }

        /* ============================================
           TEXTO CENTRAL CON BLUR
           ============================================ */
        .intro-text-container {
          max-width: 900px;
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 2rem;
          will-change: filter, opacity;
        }

        .intro-main-text {
          font-size: 1.75rem;
          font-weight: 300;
          line-height: 1.8;
          color: #F4E4BC;
          text-shadow: 0 2px 12px rgba(0, 0, 0, 0.9);
          margin: 0;
          letter-spacing: 0.02em;
        }

        /* Letras animadas con transición suave */
        .animated-letter {
          display: inline-block;
          transition: opacity 0.4s ease-out, transform 0.4s ease-out;
          will-change: opacity, transform;
        }

        /* Efecto de enfoque en palabras clave */
        .intro-main-text::first-line {
          font-weight: 400;
        }

        /* ============================================
           SCROLL INDICATOR
           ============================================ */
        .intro-scroll-indicator {
          position: absolute;
          bottom: 40px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 10;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          animation: scrollBounce 2s ease-in-out infinite;
        }

        .intro-scroll-mouse {
          width: 28px;
          height: 48px;
          border: 2px solid rgba(212, 175, 55, 0.5);
          border-radius: 20px;
          position: relative;
        }

        .intro-scroll-wheel {
          width: 3px;
          height: 8px;
          background: #D4AF37;
          border-radius: 2px;
          position: absolute;
          top: 8px;
          left: 50%;
          transform: translateX(-50%);
          animation: scrollWheel 2s ease-in-out infinite;
        }

        .intro-scroll-text {
          font-size: 0.75rem;
          color: rgba(244, 228, 188, 0.6);
          text-transform: uppercase;
          letter-spacing: 0.15em;
          margin: 0;
        }

        @keyframes scrollBounce {
          0%, 100% {
            transform: translateX(-50%) translateY(0);
          }
          50% {
            transform: translateX(-50%) translateY(10px);
          }
        }

        @keyframes scrollWheel {
          0% {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
          100% {
            opacity: 0;
            transform: translateX(-50%) translateY(18px);
          }
        }

        /* ============================================
           RESPONSIVE
           ============================================ */
        @media (max-width: 767px) {
          .intro-main-text {
            font-size: 1.125rem;
          }

          .intro-text-container {
            gap: 1.5rem;
          }
        }

        @media (min-width: 768px) {
          .intro-main-text {
            font-size: 2rem;
          }

          .intro-text-container {
            gap: 2.5rem;
          }
        }

        @media (min-width: 1024px) {
          .intro-main-text {
            font-size: 2.25rem;
          }

          .intro-text-container {
            max-width: 1000px;
            gap: 3rem;
          }
        }

        /* ============================================
           ACCESIBILIDAD
           ============================================ */
        @media (prefers-reduced-motion: reduce) {
          .intro-scroll-indicator,
          .intro-scroll-wheel {
            animation: none !important;
          }

          .animated-letter {
            transition: none !important;
          }
          
          .intro-text-container {
            transition: none !important;
          }
        }
      `}</style>
    </>
  );
}