import React, { useState, useEffect, useRef } from 'react';

const ClientCarousel = () => {
  const [hoveredClient, setHoveredClient] = useState(null);
  const scrollRef = useRef(0);
  const animationRef = useRef(null);
  const containerRef = useRef(null);

  // Datos de clientes en una sola fila con espaciado uniforme
  const clients = [
    {
      id: 1,
      name: "Gobierno Municipal de Parral",
      logo: "assets/image/parral.png",
      description: "Plataforma para la creación de gafetes",
      position: { top: '50%', left: '10%' }
    },
    {
      id: 2,
      name: "Las Chikis Restaurante",
      logo: "assets/image/laschikis.png",
      description: "Sistema de análisis de datos en tiempo real",
      position: { top: '50%', left: '30%' }
    },
    {
      id: 3,
      name: "Capital Transport LLP",
      logo: "assets/image/CapitalTransport.png",
      description: "App móvil para gestión de flotas",
      position: { top: '50%', left: '50%' }
    },
    {
      id: 4,
      name: "Instituto Tecnológico de Parral",
      logo: "assets/image/yec.webp",
      description: "Software para empresas 4.0",
      position: { top: '50%', left: '70%' }
    },
    {
      id: 5,
      name: "Coronado Gym",
      logo: "assets/image/gym.png",
      description: "Plataforma web para control del gimnasio y plataforma para sus miembros",
      position: { top: '50%', left: '90%' }
    }
  ];

  // Multiplicar clientes para loop seamless
  const infiniteClients = [...clients, ...clients, ...clients, ...clients, ...clients, ...clients];

  useEffect(() => {
    const animate = () => {
      if (!hoveredClient) {
        // Velocidad ultra suave
        scrollRef.current += 0.04;
        
        // Reset perfecto
        const singleSetWidth = 100 / 6;
        if (scrollRef.current >= singleSetWidth * 3) {
          scrollRef.current = scrollRef.current - singleSetWidth * 3;
        }
        
        if (containerRef.current) {
          containerRef.current.style.transform = `translateX(-${scrollRef.current}%)`;
        }
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [hoveredClient]);

  return (
    <div className="w-full bg-[#222220] relative overflow-hidden">
      {/* Efecto de respiración dorada en el fondo */}
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            background: 'radial-gradient(circle at 30% 50%, #D4AF37 0%, transparent 50%)',
            animation: 'breathe 4s ease-in-out infinite'
          }}
        ></div>
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            background: 'radial-gradient(circle at 70% 50%, #D4AF37 0%, transparent 50%)',
            animation: 'breathe 4s ease-in-out infinite 2s'
          }}
        ></div>
      </div>

      {/* Título Section */}
      <div className="text-center py-12 px-4 relative z-10">
        <h2 className="text-4xl md:text-5xl font-bold text-[#D4AF37] mb-3">
          Compañías, Organizaciones y Más
        </h2>
        <p className="text-lg text-[#F4E4BC] font-light tracking-wide">
          con las cuales hemos colaborado
        </p>
      </div>

      {/* Carousel Section */}
      <div className="relative w-full h-[400px] overflow-hidden py-10">
        {/* Gradientes laterales oscuros */}
        <div className="absolute left-0 top-0 bottom-0 w-40 bg-gradient-to-r from-[#222220] via-[#222220]/80 to-transparent z-10 pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-40 bg-gradient-to-l from-[#222220] via-[#222220]/80 to-transparent z-10 pointer-events-none"></div>

        {/* Carousel Container */}
        <div 
          ref={containerRef}
          className="relative w-full h-full"
          style={{
            transition: hoveredClient ? 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)' : 'none',
            willChange: 'transform'
          }}
        >
          {/* Slides */}
          <div className="flex h-full" style={{ width: `${infiniteClients.length * (100 / 6)}%` }}>
            {infiniteClients.map((client, index) => (
              <div 
                key={`${client.id}-${index}`}
                className="relative flex-shrink-0 h-full"
                style={{ width: `${100 / infiniteClients.length}%` }}
              >
                {/* Logo centrado en una fila */}
                <div
                  className="absolute"
                  style={{
                    top: client.position.top,
                    left: client.position.left,
                    transform: 'translate(-50%, -50%)'
                  }}
                  onMouseEnter={() => setHoveredClient(client.id)}
                  onMouseLeave={() => setHoveredClient(null)}
                >
                  {/* Logo container - TODOS DEL MISMO TAMAÑO */}
                  <div className={`
                    relative bg-white rounded-2xl shadow-xl
                    w-32 h-32 flex items-center justify-center p-6
                    transition-all duration-700 ease-out cursor-pointer
                    ${hoveredClient === client.id 
                      ? 'scale-125 shadow-2xl z-20 ring-4 ring-[#D4AF37]' 
                      : hoveredClient 
                        ? 'opacity-15 blur-sm scale-90' 
                        : 'hover:scale-105'
                    }
                  `}>
                    {/* Glow effect al hacer hover */}
                    {hoveredClient === client.id && (
                      <div className="absolute inset-0 bg-[#D4AF37] rounded-2xl opacity-30 blur-2xl -z-10 scale-150 animate-pulse"></div>
                    )}
                    
                    <img 
                      src={client.logo} 
                      alt={client.name}
                      className={`
                        max-w-full max-h-full object-contain
                        transition-all duration-700
                        ${hoveredClient === client.id ? '' : 'filter grayscale opacity-80'}
                      `}
                    />

                    {/* Tooltip con descripción */}
                    {hoveredClient === client.id && (
                      <div 
                        className="absolute top-full mt-8 left-1/2 transform -translate-x-1/2 w-80 z-30"
                        style={{
                          animation: 'slideDown 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)'
                        }}
                      >
                        <div className="bg-white rounded-2xl shadow-2xl p-6 border-2 border-[#D4AF37]/40">
                          <h4 className="text-[#0B1D33] font-bold text-lg mb-3">
                            {client.name}
                          </h4>
                          <p className="text-[#6B7280] text-base leading-relaxed">
                            {client.description}
                          </p>
                          <div className="h-1 w-20 bg-gradient-to-r from-[#D4AF37] to-[#B8941F] rounded-full mt-4"></div>
                        </div>
                        {/* Flecha del tooltip */}
                        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white rotate-45 border-l-2 border-t-2 border-[#D4AF37]/40"></div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
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

        @keyframes breathe {
          0%, 100% {
            opacity: 0.03;
            transform: scale(1);
          }
          50% {
            opacity: 0.08;
            transform: scale(1.1);
          }
        }
      `}</style>
    </div>
  );
};

export default ClientCarousel;