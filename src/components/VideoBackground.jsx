import { useEffect, useRef } from 'react';

export default function VideoBackground({ children }) {
  const videoRef = useRef(null);
  const wrapperRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;

    // Respeta accesibilidad
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion && video) {
      video.pause();
    }

    const handleScroll = () => {
      if (rafRef.current) return;

      rafRef.current = requestAnimationFrame(() => {
        const offset = window.scrollY * 0.35;

        if (video) {
          video.style.transform = `translate(-50%, calc(-50% + ${offset}px))`;
        }

        rafRef.current = null;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <>
      {/* VIDEO BACKGROUND */}
      <div ref={wrapperRef} className="global-video-wrapper">
       <video
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        poster="/assets/image/geck-poster.jpg"
        className="global-video"
      >
        <source src="/assets/video/geck-bg.mp4" type="video/mp4" />
      </video>


        <div className="global-video-overlay" />
        <div className="global-video-vignette" />
      </div>

      {/* CONTENIDO */}
      <div className="global-content-wrapper">
        {children}
      </div>

      <style jsx>{`
        /* ============================================
           VIDEO BACKGROUND
           ============================================ */
        .global-video-wrapper {
        position: fixed;
        inset: 0;
        height: 100dvh; /* viewport real en móvil */
        overflow: hidden;
      }

      .global-video {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 100%;
        height: 100%;
        object-fit: cover;
        transform: translate(-50%, -50%);
        filter: brightness(0.65) contrast(1.1);
        will-change: transform;
      }

      /* 🔥 MOBILE FIX */
      @media (max-width: 768px) {
        .global-video {
          width: 100%;
          height: 100%;
          min-width: unset;
          min-height: unset;
          transform: translate(-50%, -50%) scale(1.02);
        }
      }

        /* ============================================
           OVERLAYS
           ============================================ */
        .global-video-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            135deg,
            rgba(11, 29, 51, 0.75) 0%,
            rgba(5, 13, 26, 0.7) 50%,
            rgba(11, 31, 73, 0.75) 100%
          );
          pointer-events: none;
          z-index: 1;
        }

        .global-video-vignette {
          position: absolute;
          inset: 0;
          background: radial-gradient(
            circle at center,
            transparent 0%,
            rgba(5, 13, 26, 0.5) 60%,
            rgba(5, 13, 26, 0.9) 100%
          );
          pointer-events: none;
          z-index: 2;
        }

        /* ============================================
           CONTENT
           ============================================ */
        .global-content-wrapper {
          position: relative;
          z-index: 1;
        }

        /* ============================================
           MOBILE
           ============================================ */
        @media (max-width: 768px) {
          .global-video {
            filter: brightness(0.55) contrast(1);
            min-height: 100%;
          }
        }

        /* ============================================
           REDUCED MOTION
           ============================================ */
        @media (prefers-reduced-motion: reduce) {
          .global-video {
            transform: translate(-50%, -50%) !important;
            transition: none !important;
          }
        }
      `}</style>
    </>
  );
}
