import { useState, useEffect, useRef } from 'react';

export default function IntroSpecialties() {
  const [progress, setProgress] = useState(0);
  const sectionRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;

      const sectionTop = sectionRef.current.offsetTop;
      const sectionHeight = sectionRef.current.offsetHeight;
      const windowHeight = window.innerHeight;
      const scrollY = window.scrollY;

      const sectionCenter = sectionTop + sectionHeight / 2;
      const viewportCenter = scrollY + windowHeight / 2;

      const distance =
        (viewportCenter - sectionCenter) / (windowHeight / 2);

      const normalized = (distance + 1) / 2;

      setProgress(Math.max(0, Math.min(1, normalized)));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 👇 MISMA FUNCIÓN QUE EN ServiceSection
  const getTextParallax = () => {
    if (progress < 0.5) {
      return 300 - (progress / 0.5) * 300;
    } else {
      return -((progress - 0.5) / 0.5) * 100;
    }
  };

  const translateY = getTextParallax();

  return (
    <>
      <section ref={sectionRef} className="intro-specialties">
        <div
          className="intro-specialties__content"
          style={{
            transform: `translateY(${translateY}px)`,
            transition: 'transform 0.1s linear'
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
          background: #222220;
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
          will-change: transform;
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
        }
      `}</style>
    </>
  );
}
