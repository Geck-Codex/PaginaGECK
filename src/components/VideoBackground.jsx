import { useState, useEffect, useRef } from 'react';

export default function VideoBackground({ children }) {
  const [scrollY, setScrollY] = useState(0);
  const videoRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Parallax suave para el video
  const parallaxOffset = scrollY * 0.5;

  return (
    <>
      {/* Video Background Global - FIJO */}
      <div className="global-video-wrapper">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          className="global-video"
          style={{
            transform: `translate(-50%, calc(-50% + ${parallaxOffset}px))`,
            willChange: 'transform'
          }}
        >
          <source src="/assets/video/geck.mp4" type="video/mp4" />
          Tu navegador no soporta el elemento de video.
        </video>
        
        {/* Overlay gradiente */}
        <div className="global-video-overlay"></div>
        
        {/* Viñeta */}
        <div className="global-video-vignette"></div>
      </div>

      {/* Contenido que se superpone */}
      <div className="global-content-wrapper">
        {children}
      </div>

      <style jsx>{`
        /* ============================================
           VIDEO BACKGROUND GLOBAL (FIJO)
           ============================================ */
        .global-video-wrapper {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100vh;
          z-index: -1;
          overflow: hidden;
        }

        .global-video {
          position: absolute;
          top: 50%;
          left: 50%;
          min-width: 100%;
          min-height: 120%;
          width: auto;
          height: auto;
          object-fit: cover;
          filter: brightness(0.65) contrast(1.1);
          transition: transform 0.1s linear;
        }

        /* ============================================
           OVERLAYS GLOBALES
           ============================================ */
        .global-video-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            135deg,
            rgba(11, 29, 51, 0.75) 0%,
            rgba(5, 13, 26, 0.7) 50%,
            rgba(11, 31, 73, 0.75) 100%
          );
          z-index: 1;
          pointer-events: none;
        }

        .global-video-vignette {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: radial-gradient(
            circle at center,
            transparent 0%,
            rgba(5, 13, 26, 0.5) 60%,
            rgba(5, 13, 26, 0.9) 100%
          );
          z-index: 2;
          pointer-events: none;
        }

        /* ============================================
           CONTENT WRAPPER
           ============================================ */
        .global-content-wrapper {
          position: relative;
          z-index: 1;
        }

        /* ============================================
           MOBILE OPTIMIZATION
           ============================================ */
        @media (max-width: 768px) {
          .global-video {
            filter: brightness(0.55) contrast(1);
          }
        }

        /* ============================================
           ACCESIBILIDAD
           ============================================ */
        @media (prefers-reduced-motion: reduce) {
          .global-video {
            transition: none !important;
          }
        }
      `}</style>
    </>
  );
}