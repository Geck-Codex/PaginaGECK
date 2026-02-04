import { useState, useEffect, useRef } from 'react';

export default function ColorTransition() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const transitionRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!transitionRef.current) return;
      
      const rect = transitionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      const elementCenter = rect.top + rect.height / 2;
      const viewportCenter = windowHeight / 2;
      
      // Rango amplio para transición suave
      const range = 1200;
      const distance = viewportCenter - elementCenter;
      
      let progress = (distance + range / 2) / range;
      const clampedProgress = Math.max(0, Math.min(1, progress));
      
      // Easing suave
      const easedProgress = clampedProgress * clampedProgress * (3 - 2 * clampedProgress);
      
      setScrollProgress(easedProgress);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); 

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const interpolateColor = (colorStart, colorEnd, factor) => {
    const r = Math.round(colorStart.r + (colorEnd.r - colorStart.r) * factor);
    const g = Math.round(colorStart.g + (colorEnd.g - colorStart.g) * factor);
    const b = Math.round(colorStart.b + (colorEnd.b - colorStart.b) * factor);
    return `rgb(${r}, ${g}, ${b})`;
  };

  const azulOriginal = { r: 3, g: 12, b: 29 };
  const carbonFinal = { r: 34, g: 34, b: 32 };
  const currentColor = interpolateColor(azulOriginal, carbonFinal, scrollProgress);

  return (
    <>
      <div 
        ref={transitionRef}
        className="color-transition"
        style={{ backgroundColor: currentColor }}
      >
        
      </div>

      <style jsx>{`
        .color-transition {
          width: 100%;
          min-height: 600px; 
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background-color 0.1s linear;
          will-change: background-color;
          position: relative;
        }

        .content-wrapper {
          color: white;
          text-align: center;
          max-width: 800px;
          padding: 20px;
          z-index: 2;
        }

        h2 {
          font-size: 2.5rem;
          margin-bottom: 1rem;
        }
      `}</style>
    </>
  );
}