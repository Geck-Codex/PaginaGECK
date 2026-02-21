// src/components/abaut/python.jsx
import { useState, useEffect, useRef } from 'react';


export default function Header() {
  const [displayedLines, setDisplayedLines] = useState([]);
  const [phase, setPhase] = useState(0);
  const [tonguePhase, setTonguePhase] = useState(0);

  // Estado animación barras
  const [projectProgress, setProjectProgress] = useState(0);
  const [clientProgress, setClientProgress] = useState(0);
  const [dotPhase, setDotPhase] = useState(0);

  // Estado para animación de scroll
  const [scrollProgress, setScrollProgress] = useState(0);
  
  const terminalRef = useRef(null);


  const targetProject = 92;
  const targetClient = 100;

  const codeLines = [
    { text: '', delay: 0 },
    { text: '', delay: 100 },
    { text: '', delay: 200 },
    { text: '', delay: 300 },
    { text: '                  ___  ___      ', delay: 400, style: 'snake-head', isSnake: true, snakeIndex: 0 },
    { text: '         \\/     /~  ╱    \\  ', delay: 500, style: 'snake-tongue', isSnake: true, snakeIndex: 1, isTongue: true },
    { text: '          \\____|           \\  ', delay: 600, style: 'snake-head', isSnake: true, snakeIndex: 2 },
    { text: '                 \\ _______/\\/ \\ ', delay: 700, style: 'snake-body', isSnake: true, snakeIndex: 3 },
    { text: '                         `/\\/\\/\\                    \\', delay: 800, style: 'snake-body', isSnake: true, snakeIndex: 4 },
    { text: '                           |\\/\\/|                    \\', delay: 900, style: 'snake-body', isSnake: true, snakeIndex: 5 },
    { text: '                          /\\/\\//                      \\', delay: 1000, style: 'snake-body', isSnake: true, snakeIndex: 6 },
    { text: '                         / / / /                       \\\\', delay: 1100, style: 'snake-body', isSnake: true, snakeIndex: 7 },
    { text: '                       /      /                         \\ \\', delay: 1200, style: 'snake-body', isSnake: true, snakeIndex: 8 },
    { text: '                      /     /                            \\  \\', delay: 1300, style: 'snake-body', isSnake: true, snakeIndex: 9 },
    { text: '                    /     /             _----_            \\   \\', delay: 1400, style: 'snake-body', isSnake: true, snakeIndex: 10 },
    { text: '                   /     /           _-~      ~-_         |   |', delay: 1500, style: 'snake-body', isSnake: true, snakeIndex: 11 },
    { text: '                  (      (        _-~    _--_    ~-_     _/   |', delay: 1600, style: 'snake-body', isSnake: true, snakeIndex: 12 },
    { text: '                   \\      ~-____-~    _-~    ~-_    ~-_-~    /', delay: 1700, style: 'snake-tail', isSnake: true, snakeIndex: 13 },
    { text: '                     ~-_           _-~          ~-_       _-~', delay: 1800, style: 'snake-tail', isSnake: true, snakeIndex: 14 },
    { text: '                        ~--______-~                ~-___-~', delay: 1900, style: 'snake-tail', isSnake: true, snakeIndex: 15 },
    { text: '', delay: 2100 },
    { text: '', delay: 2200 },
    { text: '', delay: 2300 },
    { text: '', delay: 2400 },
  ];

  useEffect(() => {
    // Mostrar líneas de la serpiente solo una vez
    if (displayedLines.length === 0) {
      codeLines.forEach((line) => {
        setTimeout(() => setDisplayedLines((prev) => [...prev, line]), line.delay);
      });
    }

    // Animación ondulante serpiente
    const phaseInterval = setInterval(() => setPhase((prev) => (prev + 0.1) % (Math.PI * 2)), 50);

    // Animación lengua
    const tongueInterval = setInterval(() => setTonguePhase((prev) => (prev + 1) % 4), 150);

    // Animación barras
    const projectInterval = setInterval(() => {
      setProjectProgress(prev => {
        if (prev >= targetProject) { clearInterval(projectInterval); return prev; }
        return prev + 1;
      });
    }, 20);

    const clientInterval = setInterval(() => {
      setClientProgress(prev => {
        if (prev >= targetClient) { clearInterval(clientInterval); return prev; }
        return prev + 1;
      });
    }, 20);

    // Animación puntos soporte
    const dotInterval = setInterval(() => setDotPhase(prev => (prev + 1) % 3), 500);

    // Listener de scroll para animación enlazada
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      
      // Animación de entrada de la Terminal ENLAZADA AL SCROLL
      if (terminalRef.current) {
        const rect = terminalRef.current.getBoundingClientRect();
        const elementTop = rect.top;
        
        // Rango más amplio para hacer la animación más lenta
        const triggerPoint = windowHeight * 0.8;
        const endPoint = windowHeight * 0.2;
        
        if (elementTop <= triggerPoint && elementTop >= endPoint) {
          // Calcular progreso de 0 a 1
          const progress = 1 - ((elementTop - endPoint) / (triggerPoint - endPoint));
          // Aplicar easing para suavizar aún más
          const easedProgress = progress * progress * (3 - 2 * progress); // smoothstep
          setScrollProgress(Math.max(0, Math.min(1, easedProgress)));
        } else if (elementTop < endPoint) {
          setScrollProgress(1);
        } else {
          setScrollProgress(0);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Chequeo inicial

    return () => {
      clearInterval(phaseInterval);
      clearInterval(tongueInterval);
      clearInterval(projectInterval);
      clearInterval(clientInterval);
      clearInterval(dotInterval);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const getTongueVariation = () => {
    const tongues = [
      '         \\/     /~  ╱    \\  ',
      '         \\ /    /~  ╱    \\  ',
      '         \\  /   /~  ╱    \\  ',
      '         \\ /    /~  ╱    \\  ',
    ];
    return tongues[tonguePhase];
  };

  const getOffset = (index) => {
    const baseAmplitude = 3;
    const frequency = 0.3;
    const amplitudeMultiplier = Math.pow(index / 16, 2) * 10;
    return Math.sin(phase + index * frequency) * (baseAmplitude + amplitudeMultiplier);
  };

  const renderBar = (progress) => {
    const totalBlocks = 24;
    const filledBlocks = Math.round((progress / 100) * totalBlocks);
    const emptyBlocks = totalBlocks - filledBlocks;
    return '█'.repeat(filledBlocks) + '░'.repeat(emptyBlocks) + `  ${progress}%`;
  };

  // Calcular transformaciones basadas en el progreso del scroll
  const getScrollTransform = () => {
    const translateY = 100 - (scrollProgress * 100); // De 100px a 0
    const scale = 0.7 + (scrollProgress * 0.3); // De 0.7 a 1
    const opacity = scrollProgress; // De 0 a 1
    const rotateX = 20 - (scrollProgress * 20); // De 20deg a 0
    
    return {
      transform: `translateY(${translateY}px) scale(${scale}) rotateX(${rotateX}deg)`,
      opacity: opacity,
    };
  };

 

  return (
    <>
      <header className="header">
        <div className="header__container">
          <div 
            ref={terminalRef}
            className="terminal"
            style={getScrollTransform()}
          >
            {/* Header de la terminal */}
            <div className="terminal__header">
              <div className="terminal__buttons">
                <div className="terminal__button terminal__button--red"></div>
                <div className="terminal__button terminal__button--yellow"></div>
                <div className="terminal__button terminal__button--green"></div>
              </div>
              <div className="terminal__title">python_digital.py</div>
            </div>

            {/* Contenido Terminal */}
            <div className="terminal__body">
              <div className="terminal__content">
                {/* SERPIENTE */}
                <div className="snake-container">
                  <div className="snake">
                    {displayedLines.map((line, index) => (
                      <div 
                        key={index}
                        className={`snake-line ${line.style || ''}`}
                        style={line.isSnake && typeof line.snakeIndex === 'number' ? {
                          transform: `translateX(${getOffset(line.snakeIndex)}px)`,
                          transition: 'transform 0.05s linear',
                        } : {}}
                      >
                        {line.isTongue ? getTongueVariation() : line.text}
                        {line.snakeIndex === 0 && (
                          <span className="snake-eye">●</span>
                        )}
                        {index === displayedLines.length - 1 && line.text && (
                          <span className="snake-cursor"></span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* STATS */}
                <div className="stats">
                  <pre className="stat-box">
{`┌──────────────────────────────────┐
│     PROYECTOS COMPLETADOS        │
│   ${renderBar(projectProgress)}
└──────────────────────────────────┘`}
                  </pre>

                  <pre className="stat-box">
{`┌──────────────────────────────────┐
│     CLIENTES SATISFECHOS         │
│   ${renderBar(clientProgress)}
└──────────────────────────────────┘`}
                  </pre>

                  <pre className="stat-box">
{`┌──────────────────────────────────┐
│         SOPORTE 24/7             │
│   ${['ONLINE','DISPONIBLE','OK'].map((label,i) => dotPhase===i ? `● ${label}` : `○ ${label}`).join('  ')}
└──────────────────────────────────┘`}
                  </pre>
                </div>
              </div>
            </div>

            {/* FOOTER DE LA TERMINAL */}
            <div className="terminal__footer">
              <div className="contact-button-container">
               <button className="contact-button" onClick={() => window.location.href = '/contacto'}>
                  <span className="contact-button__icon">►</span>
                  <span className="contact-button__text">INICIAR CONTACTO</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <style jsx>{`
        .header {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          position: relative;
          overflow: hidden;
          padding: 2rem 1rem;
        }

        .header__container {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          position: relative;
          z-index: 10;
          padding: 0 1rem;
        }

        /* TERMINAL CON ANIMACIÓN ENLAZADA AL SCROLL */
        .terminal {
          background: linear-gradient(to bottom right, rgba(15, 23, 42, 0.9), rgba(0, 0, 0, 0.95));
          backdrop-filter: blur(12px);
          border-radius: 1rem;
          border: 2px solid rgba(212, 175, 55, 0.4);
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
          overflow: hidden;
          position: relative;
          perspective: 1500px;
          
          /* Transición más suave y lenta */
          transition: transform 0.15s ease-out, opacity 0.15s ease-out;
          will-change: transform, opacity;
        }

        .terminal__header {
          background: #222220;
          padding: 0.75rem 1rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          border-bottom: 1px solid rgba(212, 175, 55, 0.3);
        }

        .terminal__buttons { display: flex; gap: 0.5rem; }
        .terminal__button { width: 0.75rem; height: 0.75rem; border-radius: 50%; }
        .terminal__button--red { background: #ef4444; }
        .terminal__button--yellow { background: #eab308; }
        .terminal__button--green { background: #22c55e; }
        .terminal__title { color: #d4af37; font-size: 0.8rem; font-family: monospace; }

        .terminal__body {
          padding: 1.5rem;
          font-family: monospace;
          font-size: 0.95rem;
          min-height: 350px;
          background: #030C1D;
          position: relative;
        }

        /* FOOTER DE LA TERMINAL - CARBON COMO EL HEADER */
        .terminal__footer {
          background: #222220;
          padding: 1.5rem;
          border-top: 1px solid rgba(212, 175, 55, 0.3);
        }

        .terminal__content {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .snake-container { width: 100%; overflow: hidden; }
        .snake-line { line-height: 1.2; white-space: pre; position: relative; }
        .snake-head { color: #d4af37; font-size: 1.05rem; }
        .snake-tongue { color: #f4d03f; font-size: 1.05rem; }
        .snake-body { color: #d4af37; }
        .snake-tail { color: #b8921f; }

        .snake-eye {
          position: absolute;
          color: #d4af37;
          text-shadow: 0 0 12px #d4af37;
          left: 60%;
          top: 50%;
          animation: pulse 2s infinite;
        }

        .snake-cursor {
          display: inline-block;
          width: 0.5rem;
          height: 1rem;
          background: #d4af37;
          margin-left: 0.25rem;
          animation: blink 1.2s infinite;
        }

        .stats {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          color: rgba(212, 175, 55, 0.7);
          font-size: 0.8rem;
          width: 100%;
          align-items: center;
        }

        .stat-box { line-height: 1.4; margin: 0; width: 100%; }

        /* BOTÓN DE CONTACTO */
        .contact-button-container {
          display: flex;
          justify-content: center;
        }

        .contact-button {
          background: linear-gradient(135deg, #d4af37 0%, #b8921f 100%);
          border: 2px solid #d4af37;
          color: #000;
          padding: 0.875rem 2rem;
          font-family: monospace;
          font-size: 0.9rem;
          font-weight: bold;
          border-radius: 0.5rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(212, 175, 55, 0.3);
          position: relative;
          overflow: hidden;
        }

        .contact-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
          transition: left 0.5s ease;
        }

        .contact-button:hover::before {
          left: 100%;
        }

        .contact-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(212, 175, 55, 0.5);
          border-color: #f4d03f;
        }

        .contact-button:active {
          transform: translateY(0);
          box-shadow: 0 2px 10px rgba(212, 175, 55, 0.4);
        }

        .contact-button__icon {
          font-size: 1.1rem;
          animation: pulse-icon 2s infinite;
        }

        .contact-button__text {
          position: relative;
          z-index: 1;
        }

        @keyframes blink { 0%, 50% { opacity: 1; } 51%, 100% { opacity: 0; } }
        @keyframes pulse { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.2); opacity: 0.8; } }
        @keyframes pulse-icon { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.1); } }

        @media (min-width: 1280px) {
          .terminal__content { display: grid; grid-template-columns: auto 1fr; align-items: center; gap: 2rem; }
        }

        /* MÓVIL - TODO EL TERMINAL SE REDUCE */
        @media (max-width: 768px) {
          .header {
            padding: 1rem 0.5rem;
          }

          .header__container {
            padding: 0 0.5rem;
            max-width: 100%;
          }

          /* TODO EL TERMINAL SE ESCALA */
          .terminal {
            transform-origin: center;
            scale: 0.75;
            margin: -2rem 0;
          }

          .terminal__body {
            padding: 1rem;
            min-height: 280px;
            font-size: 0.75rem;
          }

          .terminal__footer {
            padding: 1rem;
          }

          .terminal__header {
            padding: 0.5rem 0.75rem;
          }

          .terminal__title {
            font-size: 0.7rem;
          }

          .terminal__buttons {
            gap: 0.4rem;
          }

          .terminal__button {
            width: 0.6rem;
            height: 0.6rem;
          }

          .snake-head,
          .snake-tongue {
            font-size: 0.95rem;
          }

          .stat-box {
            font-size: 0.7rem;
          }

          .stats {
            gap: 0.5rem;
          }

          .terminal__content {
            gap: 1rem;
          }

          .contact-button {
            padding: 0.75rem 1.5rem;
            font-size: 0.8rem;
          }
        }

        /* MÓVILES PEQUEÑOS */
        @media (max-width: 480px) {
          .terminal {
            scale: 0.6;
            margin: -3rem 0;
          }

          .terminal__body {
            padding: 0.75rem;
            min-height: 250px;
            font-size: 0.7rem;
          }

          .terminal__footer {
            padding: 0.75rem;
          }

          .stat-box {
            font-size: 0.65rem;
          }

          .contact-button {
            padding: 0.65rem 1.25rem;
            font-size: 0.75rem;
          }
        }
      `}</style>
    </>
  );
}