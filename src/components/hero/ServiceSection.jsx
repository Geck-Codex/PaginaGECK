import { useState, useEffect, useRef } from 'react';

export default function ServiceSection({ 
  videoDesktop,
  videoMobile,
  poster,
  title, 
  description, 
  link,
  buttonText 
}) {
  const [letterOpacity, setLetterOpacity] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const sectionRef = useRef(null);

  /* ===========================
     Detectar mobile
     =========================== */
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 767);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  /* ===========================
     Scroll logic
     =========================== */
  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;

      const sectionTop = sectionRef.current.offsetTop;
      const sectionHeight = sectionRef.current.offsetHeight;
      const windowHeight = window.innerHeight;
      const scrollY = window.scrollY;

      const sectionCenter = sectionTop + sectionHeight / 2;
      const viewportCenter = scrollY + windowHeight / 2;

      const distance = (viewportCenter - sectionCenter) / (windowHeight / 2);
      const progress = (distance + 1) / 2;

      setLetterOpacity(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /* ===========================
     Opacidades
     =========================== */
  const getVideoOpacity = () => {
    if (letterOpacity < 0.15) return 0;
    if (letterOpacity > 0.85) return 0;

    if (letterOpacity <= 0.5) {
      return Math.min(1, (letterOpacity - 0.15) / 0.25);
    } else {
      return Math.max(0, 1 - (letterOpacity - 0.5) / 0.35);
    }
  };

  const getTextOpacity = () => {
    if (letterOpacity < 0.25) return 0;
    if (letterOpacity > 0.75)
      return Math.max(0, 1 - (letterOpacity - 0.75) / 0.25);

    if (letterOpacity <= 0.5) {
      return (letterOpacity - 0.25) / 0.25;
    }

    return 1;
  };

  const getTextParallax = () => {
    if (letterOpacity < 0.5) {
      return 600 - (letterOpacity / 0.5) * 600;
    } else {
      return -((letterOpacity - 0.5) / 0.5) * 300;
    }
  };

  const videoOpacity = getVideoOpacity();
  const textOpacity = getTextOpacity();
  const textParallax = getTextParallax();

  const videoSrc = isMobile ? videoMobile : videoDesktop;

  return (
    <>
      <section className="service-section" ref={sectionRef}>
        {/* VIDEO */}
        <div className="service-section__video-container">
          <video
            autoPlay
            loop
            muted
            playsInline
            poster={poster}
            className="service-section__video"
            style={{
              opacity: videoOpacity,
              transition: 'opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          >
            <source src={videoSrc} type="video/mp4" />
          </video>
        </div>

        {/* CONTENIDO */}
        <div
          className="service-section__content"
          style={{
            opacity: textOpacity,
            transform: `translateY(${textParallax}px)`,
            transition: 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          <h2 className="service-section__title">{title}</h2>
          <p className="service-section__description">{description}</p>
          <a href={link} className="service-section__button">
            <span className="service-section__button-text">{buttonText}</span>
            <span className="service-section__button-arrow">→</span>
          </a>
        </div>
      </section>

      <style>{`
        .service-section {
          position: relative;
          width: 100%;
          height: 100vh;
          display: flex;
          align-items: center;
          overflow: hidden;
          background: #030c1d;
        }

        .service-section__video-container {
          position: absolute;
          inset: 0;
          z-index: 0;
        }

        .service-section__video {
          position: absolute;
          top: 50%;
          left: 50%;
          min-width: 100%;
          min-height: 100%;
          transform: translate(-50%, -50%);
          object-fit: cover;
          filter: brightness(0.5) contrast(1.1);
        }

        .service-section__content {
          position: relative;
          z-index: 10;
          max-width: 700px;
          padding-left: 5rem;
          padding-right: 2rem;
        }

        .service-section__title {
          font-size: 4rem;
          font-weight: 900;
          margin-bottom: 1.5rem;
          background: linear-gradient(135deg, #F4E4BC, #D4AF37, #B8941F);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .service-section__description {
          font-size: 1.5rem;
          color: #F4E4BC;
          margin-bottom: 2.5rem;
        }

        /* MOBILE */
        @media (max-width: 767px) {
          .service-section__video {
            transform: translate(-50%, -50%) scale(1.15);
            object-position: center top;
          }

          .service-section__content {
            padding: 1.5rem;
          }

          .service-section__title {
            font-size: 2rem;
          }

          .service-section__description {
            font-size: 1.125rem;
          }
        }
      `}</style>
    </>
  );
}
