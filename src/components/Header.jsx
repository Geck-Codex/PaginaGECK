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
    const styles = {
      'snake-head': 'text-[var(--gold)] text-base sm:text-lg scale-110',
      'snake-tongue': 'text-[var(--gold-light)] text-base sm:text-lg scale-110',
      'snake-body': 'text-[#d4af37] text-sm sm:text-base',
      'snake-tail': 'text-[#b8921f] text-sm sm:text-base',
    };
    return styles[style] || 'text-[var(--white-soft)]';
  };

  const renderBar = (progress) => {
    const totalBlocks = 24;
    const filledBlocks = Math.round((progress / 100) * totalBlocks);
    const emptyBlocks = totalBlocks - filledBlocks;
    return '█'.repeat(filledBlocks) + '░'.repeat(emptyBlocks) + `  ${progress}%`;
  };

  return (
    <header className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0B1D33] via-[#0d2440] to-[#0B1D33] relative overflow-hidden px-2 sm:px-4 pb-12 sm:pb-16 md:pb-24 lg:pb-32">
      {/* Grid de fondo */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(212,175,55,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(212,175,55,0.03)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none"></div>

      {/* Partículas doradas flotantes en los lados */}
      <div className="absolute left-10 top-20 w-2 h-2 bg-[var(--gold)] rounded-full animate-float-slow opacity-40"></div>
      <div className="absolute left-20 top-1/3 w-1.5 h-1.5 bg-[var(--gold-light)] rounded-full animate-float-medium opacity-30"></div>
      <div className="absolute left-16 bottom-1/4 w-2.5 h-2.5 bg-[var(--gold)] rounded-full animate-float-fast opacity-50"></div>
      
      <div className="absolute right-10 top-32 w-2 h-2 bg-[var(--gold)] rounded-full animate-float-medium opacity-40"></div>
      <div className="absolute right-24 top-2/3 w-1.5 h-1.5 bg-[var(--gold-light)] rounded-full animate-float-slow opacity-30"></div>
      <div className="absolute right-14 bottom-20 w-2.5 h-2.5 bg-[var(--gold)] rounded-full animate-float-fast opacity-50"></div>

      {/* Líneas decorativas verticales en los lados */}
      <div className="absolute left-0 top-0 h-full w-px bg-gradient-to-b from-transparent via-[var(--gold)]/20 to-transparent hidden lg:block"></div>
      <div className="absolute left-4 top-0 h-full w-px bg-gradient-to-b from-transparent via-[var(--gold)]/10 to-transparent hidden lg:block"></div>
      
      <div className="absolute right-0 top-0 h-full w-px bg-gradient-to-b from-transparent via-[var(--gold)]/20 to-transparent hidden lg:block"></div>
      <div className="absolute right-4 top-0 h-full w-px bg-gradient-to-b from-transparent via-[var(--gold)]/10 to-transparent hidden lg:block"></div>

      {/* Resplandor lateral */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-64 h-64 bg-[var(--gold)]/5 rounded-full blur-3xl hidden lg:block"></div>
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-64 h-64 bg-[var(--gold)]/5 rounded-full blur-3xl hidden lg:block"></div>

      <div className="w-full max-w-7xl mx-auto relative z-10 py-8 sm:py-12">

        {/* Contenedor Principal - TODO CENTRADO */}
        <div className="flex flex-col items-center gap-12 sm:gap-16 lg:gap-20">

          {/* SECCIÓN DE TEXTO - CENTRADA CON EFECTOS MEJORADOS */}
          <div className="w-full max-w-4xl text-center px-4 sm:px-6 relative">
            
            {/* Decoración superior */}
            <div className="absolute -top-6 sm:-top-8 left-1/2 -translate-x-1/2 flex items-center gap-2 opacity-60">
              <div className="h-px w-8 sm:w-12 bg-gradient-to-r from-transparent to-[var(--gold)]"></div>
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[var(--gold)] rounded-full animate-pulse"></div>
              <div className="h-px w-8 sm:w-12 bg-gradient-to-l from-transparent to-[var(--gold)]"></div>
            </div>

            {/* Título principal con Outfit - CON EFECTOS MEJORADOS */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl font-black uppercase tracking-tight mb-6 sm:mb-8 leading-[0.95]" 
                style={{ fontFamily: "'Outfit', sans-serif" }}>
              <span className="relative inline-block group">
                <span className="bg-gradient-to-r from-[var(--white)] via-[var(--gold-light)] to-[var(--gold)] bg-clip-text text-transparent drop-shadow-2xl animate-gradient hover-glow">
                  ARQUITECTOS
                </span>
                {/* Efecto de resplandor mejorado */}
                <span className="absolute inset-0 bg-gradient-to-r from-[var(--gold)]/30 via-[var(--gold-light)]/30 to-[var(--gold)]/30 blur-3xl -z-10 group-hover:blur-2xl transition-all duration-500"></span>
                {/* Línea decorativa superior */}
                <div className="absolute -top-3 sm:-top-4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--gold)]/40 to-transparent"></div>
              </span>
              <br />
              <span className="relative inline-block group">
                <span className="bg-gradient-to-r from-[var(--gold)] via-[var(--gold-light)] to-[var(--white)] bg-clip-text text-transparent drop-shadow-2xl animate-gradient-reverse hover-glow">
                  DIGITALES
                </span>
                {/* Línea decorativa bajo el texto - CENTRADA Y ANIMADA */}
                <div className="h-0.5 sm:h-1 w-3/4 bg-gradient-to-r from-[var(--gold)] via-[var(--gold-light)] to-transparent mt-3 sm:mt-4 mx-auto animate-line-expand"></div>
                {/* Puntos decorativos */}
                <div className="absolute -bottom-6 sm:-bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
                  <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-[var(--gold)] rounded-full animate-pulse"></div>
                  <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-[var(--gold-light)] rounded-full animate-pulse delay-100"></div>
                  <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-[var(--gold)] rounded-full animate-pulse delay-200"></div>
                </div>
              </span>
            </h1>

            {/* Descripción con Prompt - CENTRADA Y MEJORADA */}
            <div className="relative max-w-3xl mx-auto mt-10 sm:mt-12">
              {/* Marco decorativo sutil */}
              <div className="absolute -inset-4 bg-gradient-to-r from-[var(--gold)]/5 via-transparent to-[var(--gold)]/5 rounded-lg blur-xl"></div>
              
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-[var(--white-soft)]/95 leading-relaxed tracking-wide relative"
                 style={{ fontFamily: "'Prompt', sans-serif", fontWeight: 300 }}>
                No solo desarrollamos software, <span className="text-[var(--gold-light)] font-medium relative inline-block hover:text-[var(--gold)] transition-colors">creamos experiencias digitales</span> que 
                revolucionan industrias. Cada proyecto es una <span className="text-[var(--gold)] font-semibold relative inline-block hover:scale-105 transition-transform">obra maestra</span> de 
                ingeniería y creatividad.
              </p>

              {/* Líneas decorativas laterales */}
              <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full mr-6 hidden xl:flex flex-col items-end gap-2 opacity-40">
                <div className="h-px w-8 bg-[var(--gold)]"></div>
                <div className="h-px w-12 bg-[var(--gold)]"></div>
                <div className="h-px w-8 bg-[var(--gold)]"></div>
              </div>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full ml-6 hidden xl:flex flex-col items-start gap-2 opacity-40">
                <div className="h-px w-8 bg-[var(--gold)]"></div>
                <div className="h-px w-12 bg-[var(--gold)]"></div>
                <div className="h-px w-8 bg-[var(--gold)]"></div>
              </div>
            </div>

          </div>

          {/* TERMINAL - CENTRADA CON HOVER MEJORADO Y OPTIMIZADA PARA MÓVIL */}
          <div className="w-full max-w-5xl px-3 sm:px-6 terminal-container">
            <div className="terminal-card bg-gradient-to-br from-[var(--carbon)]/80 to-[var(--black)]/95 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-[var(--gold)]/40 sm:border-2 shadow-2xl overflow-hidden transition-all duration-500 hover:scale-[1.01] sm:hover:scale-[1.02] hover:border-[var(--gold)]/80 group relative">

              {/* Resplandor hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--gold)]/0 via-[var(--gold)]/5 to-[var(--gold)]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
              
              {/* Efecto de brillo en las esquinas */}
              <div className="absolute top-0 left-0 w-16 h-16 sm:w-20 sm:h-20 bg-[var(--gold)]/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute bottom-0 right-0 w-16 h-16 sm:w-20 sm:h-20 bg-[var(--gold)]/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              {/* Header de la terminal */}
              <div className="bg-gradient-to-r from-[#0B1D33] to-[#0d2440] px-3 sm:px-5 py-3 sm:py-4 flex items-center gap-3 sm:gap-4 border-b border-[var(--gold)]/30 relative z-10">
                <div className="flex gap-1.5 sm:gap-2.5">
                  <div className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 rounded-full bg-red-500 hover:bg-red-400 transition-colors cursor-pointer"></div>
                  <div className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 rounded-full bg-yellow-500 hover:bg-yellow-400 transition-colors cursor-pointer"></div>
                  <div className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 rounded-full bg-green-500 hover:bg-green-400 transition-colors cursor-pointer"></div>
                </div>
                <div className="text-[var(--gold)] text-xs sm:text-sm font-mono">python_digital.py</div>
              </div>

              {/* Contenido Terminal */}
              <div className="p-3 sm:p-4 lg:p-6 xl:p-8 font-mono text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl 
                min-h-[280px] sm:min-h-[320px] lg:min-h-[380px] bg-[var(--black)]/40 backdrop-blur-sm relative z-10">

                <div className="w-full flex flex-col xl:grid xl:grid-cols-[auto_1fr] gap-4 sm:gap-6 items-start xl:justify-items-center">

                  {/* SERPIENTE - Reducida en móvil */}
                  <div className="w-full overflow-x-auto scrollbar-hide">
                    <div className="min-w-max px-2 sm:px-0">
                      {displayedLines.map((line, index) => (
                        <div 
                          key={index}
                          className={`${getLineColor(line.style)} animate-fadeIn leading-snug whitespace-pre relative`}
                          style={line.isSnake && typeof line.snakeIndex === 'number' ? {
                            transform: `translateX(${getOffset(line.snakeIndex)}px)`,
                            transition: 'transform 0.05s linear',
                          } : {}}
                        >
                          {line.isTongue ? getTongueVariation() : line.text}

                          {line.snakeIndex === 0 && (
                            <span 
                              className="absolute animate-pulse"
                              style={{
                                color: 'var(--gold)',
                                textShadow: '0 0 12px var(--gold), 0 0 20px var(--gold-light)',
                                left: '60%',
                                top: '50%',
                                fontSize: '1.2em'
                              }}
                            >
                              ●
                            </span>
                          )}

                          {index === displayedLines.length - 1 && line.text && (
                            <span className="inline-block w-1.5 h-3 sm:w-2 sm:h-4 bg-[var(--gold)] ml-1 animate-blink"></span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* GRÁFICAS GOLD FRAME ANIMADAS - Debajo en móvil, al lado en XL */}
                  <div className="w-full xl:w-auto flex flex-col gap-3 sm:gap-4 text-[var(--gold-muted)] text-xs sm:text-sm md:text-base">

                    <pre className="leading-tight hover:text-[var(--gold)] transition-colors overflow-x-auto scrollbar-hide">
{`┌──────────────────────────────────┐
│     PROYECTOS COMPLETADOS        │
│   ${renderBar(projectProgress)}
└──────────────────────────────────┘`}
                    </pre>

                    <pre className="leading-tight hover:text-[var(--gold)] transition-colors overflow-x-auto scrollbar-hide">
{`┌──────────────────────────────────┐
│     CLIENTES SATISFECHOS         │
│   ${renderBar(clientProgress)}
└──────────────────────────────────┘`}
                    </pre>

                    <pre className="leading-tight hover:text-[var(--gold)] transition-colors overflow-x-auto scrollbar-hide">
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
              <div className="px-3 sm:px-5 py-2 sm:py-3 bg-[var(--black)]/50 border-t border-[var(--gold)]/20 flex flex-wrap items-center justify-between text-[10px] sm:text-xs font-mono gap-2 relative z-10">
                <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
                  <span className="text-[var(--gold-muted)]">v4.2.0</span>
                  <span className="text-green-400">CPU: 12%</span>
                  <span className="text-blue-400">RAM: 2.1GB</span>
                </div>
                <div className="text-[var(--gold-muted)]">Arquitectos Digitales ©</div>
              </div>

            </div>
          </div>

        </div>

      </div>

      <style jsx>{`
        /* Ocultar scrollbar pero mantener funcionalidad */
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        @keyframes fadeIn { 
          from { opacity: 0; transform: translateY(10px); } 
          to { opacity: 1; transform: translateY(0); } 
        }
        @keyframes blink { 
          0%, 50% { opacity: 1; } 
          51%, 100% { opacity: 0; } 
        }
        @keyframes gradient { 
          0% { background-position: 0% 50%; } 
          50% { background-position: 100% 50%; } 
          100% { background-position: 0% 50%; } 
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          25% { transform: translateY(-20px) translateX(10px); }
          50% { transform: translateY(-10px) translateX(-10px); }
          75% { transform: translateY(-30px) translateX(5px); }
        }
        @keyframes float-medium {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          33% { transform: translateY(-15px) translateX(-8px); }
          66% { transform: translateY(-25px) translateX(8px); }
        }
        @keyframes float-fast {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-40px) scale(1.2); }
        }
        @keyframes line-expand {
          0%, 100% { width: 75%; opacity: 1; }
          50% { width: 85%; opacity: 0.8; }
        }
        
        .animate-fadeIn { animation: fadeIn 0.6s ease-out forwards; }
        .animate-blink { animation: blink 1.2s infinite; }
        .animate-gradient { background-size: 200% 200%; animation: gradient 4s ease infinite; }
        .animate-gradient-reverse { background-size: 200% 200%; animation: gradient 4s ease infinite reverse; }
        .animate-float-slow { animation: float-slow 8s ease-in-out infinite; }
        .animate-float-medium { animation: float-medium 6s ease-in-out infinite; }
        .animate-float-fast { animation: float-fast 4s ease-in-out infinite; }
        .animate-line-expand { animation: line-expand 3s ease-in-out infinite; }
        
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        
        .terminal-card {
          box-shadow: 
            0 0 0 1px rgba(212, 175, 55, 0.1),
            0 10px 40px rgba(0, 0, 0, 0.4),
            0 0 60px rgba(212, 175, 55, 0.1);
        }
        
        .terminal-card:hover {
          box-shadow: 
            0 0 0 1px rgba(212, 175, 55, 0.3),
            0 20px 60px rgba(0, 0, 0, 0.5),
            0 0 100px rgba(212, 175, 55, 0.3),
            0 0 150px rgba(212, 175, 55, 0.2);
        }

        .hover-glow:hover {
          filter: drop-shadow(0 0 20px var(--gold-light));
        }
      `}</style>
    </header>
  );
}