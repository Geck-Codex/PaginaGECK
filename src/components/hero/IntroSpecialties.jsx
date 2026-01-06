import { useState, useEffect, useRef } from 'react';

export default function IntroSpecialties() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const sectionRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;

      const sectionTop = sectionRef.current.offsetTop;
      const sectionHeight = sectionRef.current.offsetHeight;
      const windowHeight = window.innerHeight;
      const scrollY = window.scrollY;

      // Calcular progreso de scroll en la sección (0 = arriba, 0.5 = centro, 1 = abajo)
      const sectionCenter = sectionTop + (sectionHeight / 2);
      const viewportCenter = scrollY + (windowHeight / 2);
      const distance = (viewportCenter - sectionCenter) / (windowHeight / 2);
      const progress = (distance + 1) / 2;

      setScrollProgress(Math.max(0, Math.min(1, progress)));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Calcular opacidad y transformación basado en scroll
  const getTextOpacity = () => {
    // Empieza invisible, llega a 1 en el centro, vuelve a invisible
    if (scrollProgress < 0.3) return scrollProgress / 0.3;
    if (scrollProgress > 0.7) return (1 - scrollProgress) / 0.3;
    return 1;
  };

  const getTextTransform = () => {
    // Sube desde abajo mientras scrolleas
    const translateY = (1 - scrollProgress) * 80;
    const scale = 0.9 + (scrollProgress * 0.1);
    return { translateY, scale };
  };

  const opacity = getTextOpacity();
  const { translateY, scale } = getTextTransform();

  return (
    <>
      <section 
        ref={sectionRef}
        className="intro-specialties"
      >
        <div 
          className="intro-specialties__content"
          style={{
            opacity: opacity,
            transform: `translateY(${translateY}px) scale(${scale})`,
            transition: 'opacity 0.3s ease-out, transform 0.3s ease-out'
          }}
        >
          <h2 className="intro-specialties__title">
            Nuestras Especialidades
          </h2>
          <div className="intro-specialties__line"></div>
          <p className="intro-specialties__text">
            Descubre las áreas donde destacamos y cómo podemos transformar tus ideas en realidad digital
          </p>
        </div>
      </section>

      <style jsx>{`
        .intro-specialties {
          background: #030c1d;
          min-height: 60vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4rem 2rem;
          position: relative;
          overflow: hidden;
        }

        

        .intro-specialties__content {
          max-width: 900px;
          text-align: center;
          will-change: opacity, transform;
        }

        .intro-specialties__title {
          font-size: 3.5rem;
          font-weight: 900;
          margin-bottom: 2rem;
          background: linear-gradient(
            135deg,
            #F4E4BC 0%,
            #D4AF37 50%,
            #B8941F 100%
          );
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          line-height: 1.2;
          letter-spacing: 0.02em;
          filter: drop-shadow(0 4px 20px rgba(212, 175, 55, 0.3));
        }

        .intro-specialties__line {
          width: 150px;
          height: 4px;
          background: linear-gradient(
            90deg,
            transparent,
            #D4AF37,
            #F4E4BC,
            #D4AF37,
            transparent
          );
          margin: 0 auto 2rem;
          border-radius: 9999px;
        }

        .intro-specialties__text {
          font-size: 1.5rem;
          font-weight: 300;
          line-height: 1.8;
          color: #F4E4BC;
          text-shadow: 0 2px 12px rgba(0, 0, 0, 0.8);
        }

        @media (max-width: 767px) {
          .intro-specialties {
            min-height: 50vh;
            padding: 3rem 1.5rem;
          }

          .intro-specialties__title {
            font-size: 2rem;
          }

          .intro-specialties__text {
            font-size: 1.125rem;
          }

          .intro-specialties__line {
            width: 100px;
          }
        }

        @media (min-width: 768px) and (max-width: 1023px) {
          .intro-specialties__title {
            font-size: 2.75rem;
          }

          .intro-specialties__text {
            font-size: 1.25rem;
          }
        }
      `}</style>
    </>
  );
}