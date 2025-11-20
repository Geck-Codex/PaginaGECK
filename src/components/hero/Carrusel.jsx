import React, { useState, useEffect, useRef } from 'react';

const ClientCarousel = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const animationRef = useRef(null);
  const containerRef = useRef(null);
  const offsetRef = useRef(0);

  // Datos de clientes en una sola fila con espaciado uniforme
  const clients = [
    {
      id: 1,
      name: "Gobierno Municipal de Parral",
      logo: "assets/image/parral.png",
      description: "Plataforma para la creación de gafetes"
    },
    {
      id: 2,
      name: "Las Chikis Restaurante",
      logo: "assets/image/laschikis.png",
      description: "Sistema de análisis de datos en tiempo real"
    },
    {
      id: 3,
      name: "Capital Transport LLP",
      logo: "assets/image/CapitalTransport.png",
      description: "App móvil para gestión de flotas"
    },
    {
      id: 4,
      name: "Instituto Tecnológico de Parral",
      logo: "assets/image/yec.webp",
      description: "Software para empresas 4.0"
    },
    {
      id: 5,
      name: "Coronado Gym",
      logo: "assets/image/gym.png",
      description: "Plataforma web para control del gimnasio y plataforma para sus miembros"
    }
  ];

  useEffect(() => {
    let lastTime = performance.now();
    
    const animate = (currentTime) => {
      if (hoveredIndex === null && containerRef.current) {
        const deltaTime = currentTime - lastTime;
        lastTime = currentTime;
        
        // Velocidad en píxeles por segundo (ajustable)
        const speed = 30;
        offsetRef.current += (speed * deltaTime) / 1000;
        
        // Ancho del contenedor de un set de logos (aproximado)
        const itemWidth = 200; // 128px logo + padding + gap
        const setWidth = itemWidth * clients.length;
        
        // Reset cuando completa un ciclo completo
        if (offsetRef.current >= setWidth) {
          offsetRef.current = offsetRef.current % setWidth;
        }
        
        containerRef.current.style.transform = `translateX(-${offsetRef.current}px)`;
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [hoveredIndex, clients.length]);

  return (
    <div className="w-full bg-[#222220] relative overflow-hidden pt-16 md:pt-20 lg:pt-24">
      {/* Ondas doradas de fondo */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <svg 
          className="absolute w-full h-full opacity-5" 
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#D4AF37" stopOpacity="0" />
              <stop offset="50%" stopColor="#D4AF37" stopOpacity="1" />
              <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
            </linearGradient>
          </defs>
          
          {/* Primera onda */}
          <path
            d="M0,200 Q250,150 500,200 T1000,200 T1500,200 T2000,200"
            stroke="url(#goldGradient)"
            strokeWidth="3"
            fill="none"
            opacity="0.6"
          >
            <animate
              attributeName="d"
              dur="8s"
              repeatCount="indefinite"
              values="
                M0,200 Q250,150 500,200 T1000,200 T1500,200 T2000,200;
                M0,200 Q250,250 500,200 T1000,200 T1500,200 T2000,200;
                M0,200 Q250,150 500,200 T1000,200 T1500,200 T2000,200
              "
            />
          </path>
          
          {/* Segunda onda */}
          <path
            d="M0,300 Q250,350 500,300 T1000,300 T1500,300 T2000,300"
            stroke="url(#goldGradient)"
            strokeWidth="2"
            fill="none"
            opacity="0.4"
          >
            <animate
              attributeName="d"
              dur="6s"
              repeatCount="indefinite"
              values="
                M0,300 Q250,350 500,300 T1000,300 T1500,300 T2000,300;
                M0,300 Q250,250 500,300 T1000,300 T1500,300 T2000,300;
                M0,300 Q250,350 500,300 T1000,300 T1500,300 T2000,300
              "
            />
          </path>
          
          {/* Tercera onda */}
          <path
            d="M0,400 Q250,380 500,400 T1000,400 T1500,400 T2000,400"
            stroke="url(#goldGradient)"
            strokeWidth="2.5"
            fill="none"
            opacity="0.3"
          >
            <animate
              attributeName="d"
              dur="10s"
              repeatCount="indefinite"
              values="
                M0,400 Q250,380 500,400 T1000,400 T1500,400 T2000,400;
                M0,400 Q250,420 500,400 T1000,400 T1500,400 T2000,400;
                M0,400 Q250,380 500,400 T1000,400 T1500,400 T2000,400
              "
            />
          </path>
        </svg>
      </div>

      {/* Título Section */}
      <div className="text-center py-8 md:py-12 px-4 relative z-10">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#D4AF37] mb-2 md:mb-3">
          Compañías, Organizaciones y Más
        </h2>
        <p className="text-base md:text-lg text-[#F4E4BC] font-light tracking-wide">
          con las cuales hemos colaborado
        </p>
      </div>

      {/* Carousel Section */}
      <div className="relative w-full h-[280px] md:h-[350px] lg:h-[400px] overflow-hidden py-6 md:py-10">
        {/* Gradientes laterales */}
        <div className="absolute left-0 top-0 bottom-0 w-20 md:w-40 bg-gradient-to-r from-[#222220] via-[#222220]/80 to-transparent z-10 pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-20 md:w-40 bg-gradient-to-l from-[#222220] via-[#222220]/80 to-transparent z-10 pointer-events-none"></div>

        {/* Carousel Container - Loop infinito REAL sin saltos */}
        <div 
          ref={containerRef}
          className="flex items-center gap-8 md:gap-12 lg:gap-16 h-full"
          style={{
            transition: hoveredIndex !== null ? 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)' : 'none',
            willChange: 'transform'
          }}
        >
          {/* Triplicar para loop seamless */}
          {[...clients, ...clients, ...clients].map((client, index) => (
            <div
              key={`${client.id}-${index}`}
              className="flex-shrink-0"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Logo container - TODOS DEL MISMO TAMAÑO */}
              <div className={`
                relative bg-white rounded-xl md:rounded-2xl shadow-xl
                w-24 h-24 md:w-32 md:h-32 lg:w-36 lg:h-36
                flex items-center justify-center p-4 md:p-6
                transition-all duration-700 ease-out cursor-pointer
                ${hoveredIndex === index
                  ? 'scale-110 md:scale-125 shadow-2xl z-20 ring-2 md:ring-4 ring-[#D4AF37]' 
                  : hoveredIndex !== null
                    ? 'opacity-15 blur-sm scale-90' 
                    : 'hover:scale-105'
                }
              `}>
                {/* Glow effect al hacer hover */}
                {hoveredIndex === index && (
                  <div className="absolute inset-0 bg-[#D4AF37] rounded-xl md:rounded-2xl opacity-30 blur-xl md:blur-2xl -z-10 scale-150 animate-pulse"></div>
                )}
                
                <img 
                  src={client.logo} 
                  alt={client.name}
                  className={`
                    max-w-full max-h-full object-contain
                    transition-all duration-700
                    ${hoveredIndex === index ? '' : 'filter grayscale opacity-80'}
                  `}
                />

                {/* Tooltip con descripción - solo desktop */}
                {hoveredIndex === index && (
                  <div 
                    className="hidden md:block absolute top-full mt-6 lg:mt-8 left-1/2 transform -translate-x-1/2 w-64 lg:w-80 z-30"
                    style={{
                      animation: 'slideDown 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)'
                    }}
                  >
                    <div className="bg-white rounded-xl lg:rounded-2xl shadow-2xl p-4 lg:p-6 border-2 border-[#D4AF37]/40">
                      <h4 className="text-[#0B1D33] font-bold text-base lg:text-lg mb-2 lg:mb-3">
                        {client.name}
                      </h4>
                      <p className="text-[#6B7280] text-sm lg:text-base leading-relaxed">
                        {client.description}
                      </p>
                      <div className="h-0.5 lg:h-1 w-16 lg:w-20 bg-gradient-to-r from-[#D4AF37] to-[#B8941F] rounded-full mt-3 lg:mt-4"></div>
                    </div>
                    {/* Flecha del tooltip */}
                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white rotate-45 border-l-2 border-t-2 border-[#D4AF37]/40"></div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(-15px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export default ClientCarousel;