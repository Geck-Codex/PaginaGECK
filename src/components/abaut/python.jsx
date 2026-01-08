import { useState, useEffect } from 'react';

export default function Header() {
  const [displayedLines, setDisplayedLines] = useState([]);
  const [phase, setPhase] = useState(0);
  const [tonguePhase, setTonguePhase] = useState(0);

  // Estado animación barras
  const [projectProgress, setProjectProgress] = useState(0);
  const [clientProgress, setClientProgress] = useState(0);
  const [dotPhase, setDotPhase] = useState(0);

  const targetProject = 92;
  const targetClient = 100;

  const codeLines = [
    { text: '', delay: 0 },
    { text: '', delay: 100 },
    { text: '', delay: 200 },
    { text: '', delay: 300 },
    { text: '                  ___  ___      ', delay: 400, style: 'snake-head', isSnake: true, snakeIndex: 0 },
    { text: '         \\/     /~   ╱    \\  ', delay: 500, style: 'snake-tongue', isSnake: true, snakeIndex: 1, isTongue: true },
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
    // Mostrar líneas de la serpiente
    codeLines.forEach((line) => {
      setTimeout(() => setDisplayedLines((prev) => [...prev, line]), line.delay);
    });

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

    return () => {
      clearInterval(phaseInterval);
      clearInterval(tongueInterval);
      clearInterval(projectInterval);
      clearInterval(clientInterval);
      clearInterval(dotInterval);
    };
  }, []);

  const getTongueVariation = () => {
    const tongues = [
      '         \\/     /~   ╱    \\  ',
      '         \\ /    /~   ╱    \\  ',
      '         \\  /   /~   ╱    \\  ',
      '         \\ /    /~   ╱    \\  ',
    ];
    return tongues[tonguePhase];
  };

  const getOffset = (index) => {
    const baseAmplitude = 3;
    const frequency = 0.3;
    const amplitudeMultiplier = Math.pow(index / 16, 2) * 10;
    return Math.sin(phase + index * frequency) * (baseAmplitude + amplitudeMultiplier);
  };

  const getLineColor = (style) => {
    return style || '';
  };

  const renderBar = (progress) => {
    const totalBlocks = 24;
    const filledBlocks = Math.round((progress / 100) * totalBlocks);
    const emptyBlocks = totalBlocks - filledBlocks;
    return '█'.repeat(filledBlocks) + '░'.repeat(emptyBlocks) + `  ${progress}%`;
  };

  return (
    <>
      <header className="header">
        {/* Fondo con grid */}
        <div className="header__grid"></div>

        <div className="header__container">
          {/* Terminal con serpiente y stats */}
          <div className="terminal">
            
            {/* Resplandor hover */}
            <div className="terminal__glow"></div>
            
            {/* Esquinas brillantes */}
            <div className="terminal__corner terminal__corner--tl"></div>
            <div className="terminal__corner terminal__corner--br"></div>

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
                        className={`snake-line ${getLineColor(line.style)}`}
                        style={line.isSnake && typeof line.snakeIndex === 'number' ? {
                          transform: `translateX(${getOffset(line.snakeIndex)}px)`,
                          transition: 'transform 0.05s linear',
                        } : {}}
                      >
                        {line.isTongue ? getTongueVariation() : line.text}

                        {/* Ojo */}
                        {line.snakeIndex === 0 && (
                          <span className="snake-eye">●</span>
                        )}

                        {/* Cursor */}
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
│  
└──────────────────────────────────┘`}
                  </pre>
                </div>

              </div>
            </div>

            {/* Footer */}
            <div className="terminal__footer">
              <div className="terminal__footer-left">
                <span className="terminal__version">v4.2.0</span>
                <span className="terminal__cpu">CPU: 12%</span>
                <span className="terminal__ram">RAM: 2.1GB</span>
              </div>
              <div className="terminal__footer-right">Arquitectos Digitales ©</div>
            </div>

          </div>
        </div>
      </header>

      <style jsx>{`
        /* HEADER PRINCIPAL */
        .header {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(to bottom, #0b1f49, #000000);
          position: relative;
          overflow: hidden;
          padding: 3rem 1rem;
        }

        /* GRID DE FONDO */
        .header__grid {
          position: absolute;
          inset: 0;
          background-image: 
            linear-gradient(rgba(212, 175, 55, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(212, 175, 55, 0.03) 1px, transparent 1px);
          background-size: 50px 50px;
          pointer-events: none;
        }

        .header__container {
          width: 100%;
          max-width: 1400px;
          margin: 0 auto;
          position: relative;
          z-index: 10;
          padding: 0 1.5rem;
        }

        /* TERMINAL */
        .terminal {
          background: linear-gradient(to bottom right, rgba(15, 23, 42, 0.9), rgba(0, 0, 0, 0.95));
          backdrop-filter: blur(12px);
          border-radius: 1rem;
          border: 2px solid rgba(212, 175, 55, 0.4);
          box-shadow: 
            0 0 0 1px rgba(212, 175, 55, 0.1),
            0 10px 40px rgba(0, 0, 0, 0.4),
            0 0 60px rgba(212, 175, 55, 0.1);
          overflow: hidden;
          transition: all 0.5s ease;
          position: relative;
        }

        .terminal:hover {
          transform: scale(1.02);
          border-color: rgba(212, 175, 55, 0.8);
          box-shadow: 
            0 0 0 1px rgba(212, 175, 55, 0.3),
            0 20px 60px rgba(0, 0, 0, 0.5),
            0 0 100px rgba(212, 175, 55, 0.3);
        }

        /* RESPLANDOR HOVER */
        .terminal__glow {
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom right, rgba(212, 175, 55, 0), rgba(212, 175, 55, 0.05), rgba(212, 175, 55, 0));
          opacity: 0;
          transition: opacity 0.5s ease;
          pointer-events: none;
        }

        .terminal:hover .terminal__glow {
          opacity: 1;
        }

        /* ESQUINAS BRILLANTES */
        .terminal__corner {
          position: absolute;
          width: 5rem;
          height: 5rem;
          background: rgba(212, 175, 55, 0.2);
          border-radius: 50%;
          filter: blur(2rem);
          opacity: 0;
          transition: opacity 0.5s ease;
          pointer-events: none;
        }

        .terminal__corner--tl {
          top: 0;
          left: 0;
        }

        .terminal__corner--br {
          bottom: 0;
          right: 0;
        }

        .terminal:hover .terminal__corner {
          opacity: 1;
        }

        /* HEADER TERMINAL */
        .terminal__header {
          background: linear-gradient(to right, #222220, #222220);
          padding: 1rem 1.25rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          border-bottom: 1px solid rgba(212, 175, 55, 0.3);
          position: relative;
          z-index: 10;
        }

        .terminal__buttons {
          display: flex;
          gap: 0.625rem;
        }

        .terminal__button {
          width: 0.875rem;
          height: 0.875rem;
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .terminal__button--red {
          background: #ef4444;
        }

        .terminal__button--red:hover {
          background: #f87171;
        }

        .terminal__button--yellow {
          background: #eab308;
        }

        .terminal__button--yellow:hover {
          background: #facc15;
        }

        .terminal__button--green {
          background: #22c55e;
        }

        .terminal__button--green:hover {
          background: #4ade80;
        }

        .terminal__title {
          color: #d4af37;
          font-size: 0.875rem;
          font-family: monospace;
        }

        /* BODY TERMINAL */
        .terminal__body {
          padding: 2rem;
          font-family: monospace;
          font-size: 1rem;
          min-height: 400px;
          background: #222220;
          backdrop-filter: blur(4px);
          position: relative;
          z-index: 10;
        }

        .terminal__content {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 2rem;
          align-items: flex-start;
        }

        /* SERPIENTE */
        .snake-container {
          width: 100%;
          overflow-x: auto;
        }

        .snake-container::-webkit-scrollbar {
          display: none;
        }

        .snake-container {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        .snake {
          min-width: max-content;
          padding: 0 1rem;
        }

        .snake-line {
          line-height: 1.2;
          white-space: pre;
          position: relative;
          animation: fadeIn 0.6s ease-out forwards;
        }

        /* ESTILOS SERPIENTE */
        .snake-head {
          color: #d4af37;
          font-size: 1.125rem;
          transform: scale(1.1);
        }

        .snake-tongue {
          color: #f4d03f;
          font-size: 1.125rem;
          transform: scale(1.1);
        }

        .snake-body {
          color: #d4af37;
          font-size: 1rem;
        }

        .snake-tail {
          color: #b8921f;
          font-size: 1rem;
        }

        /* OJO SERPIENTE */
        .snake-eye {
          position: absolute;
          color: #d4af37;
          text-shadow: 0 0 12px #d4af37, 0 0 20px #f4d03f;
          left: 60%;
          top: 50%;
          font-size: 1.2em;
          animation: pulse 2s ease-in-out infinite;
        }

        /* CURSOR */
        .snake-cursor {
          display: inline-block;
          width: 0.5rem;
          height: 1rem;
          background: #d4af37;
          margin-left: 0.25rem;
          animation: blink 1.2s infinite;
        }

        /* STATS */
        .stats {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          color: rgba(212, 175, 55, 0.7);
          font-size: 0.875rem;
          width: 100%;
          align-items: center;
        }

        .stat-box {
          line-height: 1.4;
          transition: color 0.3s ease;
          overflow-x: auto;
          margin: 0;
          width: 100%;
        }

        .stat-box:hover {
          color: #d4af37;
        }

        .stat-box::-webkit-scrollbar {
          display: none;
        }

        .stat-box {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        /* FOOTER TERMINAL */
        .terminal__footer {
          padding: 0.75rem 1.25rem;
          background: #222220;
          border-top: 1px solid rgba(212, 175, 55, 0.2);
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.75rem;
          font-family: monospace;
          gap: 1rem;
          flex-wrap: wrap;
          position: relative;
          z-index: 10;
        }

        .terminal__footer-left {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .terminal__version {
          color: rgba(212, 175, 55, 0.7);
        }

        .terminal__cpu {
          color: #22c55e;
        }

        .terminal__ram {
          color: #3b82f6;
        }

        .terminal__footer-right {
          color: rgba(212, 175, 55, 0.7);
        }

        /* ANIMACIONES */
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes blink {
          0%, 50% {
            opacity: 1;
          }
          51%, 100% {
            opacity: 0;
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.2);
          }
        }

        /* RESPONSIVE */
        @media (min-width: 1280px) {
          .terminal__content {
            display: grid;
            grid-template-columns: auto 1fr;
            gap: 3rem;
            align-items: center;
            justify-items: center;
          }
        }

        @media (max-width: 768px) {
          .header {
            padding: 2rem 1rem;
          }

          .terminal__body {
            padding: 1.5rem;
            font-size: 0.875rem;
            min-height: 320px;
          }

          /* CENTRAR TODO EL CONTENIDO EN MÓVIL */
          .terminal__content {
            align-items: center;
            justify-content: center;
          }

          .snake-container {
            display: flex;
            justify-content: center;
          }

          /* ACHICAR SERPIENTE EN MÓVIL */
          .snake {
            transform: scale(0.85);
            transform-origin: center center;
          }

          .snake-head,
          .snake-tongue {
            font-size: 0.875rem;
          }

          .snake-body,
          .snake-tail {
            font-size: 0.75rem;
          }

          /* CENTRAR STATS */
          .stats {
            align-items: center;
            justify-content: center;
          }

          .stat-box {
            font-size: 0.75rem;
            text-align: center;
            display: flex;
            justify-content: center;
          }

          .terminal__footer {
            font-size: 0.625rem;
            padding: 0.5rem 0.75rem;
          }
        }

        /* MÓVIL MUY PEQUEÑO */
        @media (max-width: 480px) {
          .snake {
            transform: scale(0.75);
            transform-origin: center center;
          }

          .snake-head,
          .snake-tongue {
            font-size: 0.75rem;
          }

          .snake-body,
          .snake-tail {
            font-size: 0.625rem;
          }

          .stat-box {
            font-size: 0.625rem;
          }
        }
      `}</style>
    </>
  );
}