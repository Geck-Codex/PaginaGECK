import React, { useState, useEffect, useRef } from 'react';

const ClientCarousel = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [touchedIndex, setTouchedIndex] = useState(null);
  const animationRef = useRef(null);
  const containerRef = useRef(null);
  const offsetRef = useRef(0);
  const componentRef = useRef(null);
  const touchStartRef = useRef(null);

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

  // Funciones para manejar touch en móvil
  const handleTouchStart = (index, e) => {
    touchStartRef.current = {
      index,
      time: Date.now(),
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    };
  };

  const handleTouchEnd = (index, e) => {
    if (!touchStartRef.current) return;
    
    const touchEnd = {
      time: Date.now(),
      x: e.changedTouches[0].clientX,
      y: e.changedTouches[0].clientY
    };
    
    const deltaTime = touchEnd.time - touchStartRef.current.time;
    const deltaX = Math.abs(touchEnd.x - touchStartRef.current.x);
    const deltaY = Math.abs(touchEnd.y - touchStartRef.current.y);
    
    // Si fue un tap rápido (no un scroll), mostrar el tooltip
    if (deltaTime < 300 && deltaX < 10 && deltaY < 10) {
      setTouchedIndex(touchedIndex === index ? null : index);
      setHoveredIndex(null);
    }
    
    touchStartRef.current = null;
  };

  const handleMouseEnter = (index) => {
    setHoveredIndex(index);
    setTouchedIndex(null);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  // Scroll-linked animation con Intersection Observer
  useEffect(() => {
    const handleScroll = () => {
      if (!componentRef.current) return;

      const rect = componentRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Calcular el progreso basado en la posición del componente
      // Rango más amplio para animaciones más lentas y perceptibles
      const startPoint = windowHeight * 1.0; // Comienza antes (más abajo)
      const endPoint = windowHeight * 0.1;   // Termina más arriba
      
      if (rect.top <= startPoint && rect.top >= endPoint) {
        // Mapear la posición a un valor entre 0 y 1
        const progress = 1 - ((rect.top - endPoint) / (startPoint - endPoint));
        const clampedProgress = Math.max(0, Math.min(1, progress));
        setScrollProgress(clampedProgress);
        
        if (clampedProgress > 0.05 && !hasAnimated) {
          setHasAnimated(true);
        }
      } else if (rect.top > startPoint) {
        setScrollProgress(0);
      } else if (rect.top < endPoint) {
        setScrollProgress(1);
      }
    };

    // Intersection Observer para optimización (solo escuchar scroll cuando está cerca)
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            window.addEventListener('scroll', handleScroll, { passive: true });
            handleScroll(); // Llamar inmediatamente para calcular posición inicial
          } else {
            window.removeEventListener('scroll', handleScroll);
          }
        });
      },
      { 
        rootMargin: '100px 0px 100px 0px' // Empezar a observar antes de que entre en vista
      }
    );

    if (componentRef.current) {
      observer.observe(componentRef.current);
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (componentRef.current) {
        observer.unobserve(componentRef.current);
      }
    };
  }, [hasAnimated]);

  // Cerrar tooltip al tocar fuera (solo móvil)
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (touchedIndex !== null && containerRef.current && !containerRef.current.contains(e.target)) {
        setTouchedIndex(null);
      }
    };

    if (touchedIndex !== null) {
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [touchedIndex]);

  useEffect(() => {
    let lastTime = performance.now();
    
    const animate = (currentTime) => {
      // Pausar animación si hay hover o touch activo
      if (hoveredIndex === null && touchedIndex === null && containerRef.current) {
        const deltaTime = currentTime - lastTime;
        lastTime = currentTime;
        
        // Velocidad más lenta para mejor percepción (reducida de 30 a 20)
        const speed = 20;
        offsetRef.current += (speed * deltaTime) / 1000;
        
        // Ancho del contenedor de un set de logos (aproximado)
        const itemWidth = 200; // 128px logo + padding + gap
        const setWidth = itemWidth * clients.length;
        
        // Reset cuando completa un ciclo completo
        if (offsetRef.current >= setWidth) {
          offsetRef.current = offsetRef.current % setWidth;
        }
        
        containerRef.current.style.transform = `translateX(-${offsetRef.current}px)`;
      } else {
        // Actualizar lastTime incluso cuando está pausado para evitar saltos
        lastTime = currentTime;
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [hoveredIndex, touchedIndex, clients.length]);

  return (
    <div ref={componentRef} className="w-full bg-[#222220] relative overflow-hidden pt-16 md:pt-20 lg:pt-24">
      {/* Línea dorada animada de entrada - vinculada al scroll */}
      {scrollProgress > 0 && (
        <div className="absolute top-0 left-0 w-full h-1 z-50 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent"
            style={{
              width: '40%',
              transform: `translateX(${Math.min(scrollProgress * 250, 250)}%)`,
              boxShadow: '0 0 20px #D4AF37, 0 0 40px #D4AF37',
              opacity: Math.min(scrollProgress * 2, 1),
              transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.6s ease-out'
            }}
          />
        </div>
      )}

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

      {/* Título Section - animado con scroll */}
      <div 
        className="text-center py-8 md:py-12 px-4 relative z-10"
        style={{
          opacity: Math.max(0, Math.min(1, (scrollProgress - 0.15) * 1.8)),
          transform: `translateY(${Math.max(0, (1 - scrollProgress) * 80 - 12)}px)`,
          transition: 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#D4AF37] mb-2 md:mb-3">
          Compañías, Organizaciones y Más
        </h2>
        <p 
          className="text-base md:text-lg text-[#F4E4BC] font-light tracking-wide"
          style={{
            opacity: Math.max(0, Math.min(1, (scrollProgress - 0.25) * 1.6)),
            transform: `translateY(${Math.max(0, (1 - scrollProgress) * 60 - 8)}px)`,
            transition: 'opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1), transform 0.9s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          con las cuales hemos colaborado
        </p>
      </div>

      {/* Carousel Section - animado con scroll */}
      <div 
        className="relative w-full h-[280px] md:h-[350px] lg:h-[400px] overflow-hidden py-6 md:py-10"
        style={{
          opacity: Math.max(0, Math.min(1, (scrollProgress - 0.35) * 1.5)),
          transform: `translateY(${Math.max(0, (1 - scrollProgress) * 100 - 35)}px) scale(${0.92 + (scrollProgress * 0.08)})`,
          transition: 'opacity 1s cubic-bezier(0.16, 1, 0.3, 1), transform 1s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
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
          {[...clients, ...clients, ...clients].map((client, index) => {
            const isActive = hoveredIndex === index || touchedIndex === index;
            const isOtherActive = (hoveredIndex !== null && hoveredIndex !== index) || 
                                  (touchedIndex !== null && touchedIndex !== index);
            
            return (
              <div
                key={`${client.id}-${index}`}
                className="flex-shrink-0"
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={handleMouseLeave}
                onTouchStart={(e) => handleTouchStart(index, e)}
                onTouchEnd={(e) => handleTouchEnd(index, e)}
              >
                {/* Logo container - TODOS DEL MISMO TAMAÑO */}
                <div className={`
                  relative bg-white rounded-xl md:rounded-2xl shadow-xl
                  w-24 h-24 md:w-32 md:h-32 lg:w-36 lg:h-36
                  flex items-center justify-center p-4 md:p-6
                  transition-all duration-700 ease-out cursor-pointer
                  ${isActive
                    ? 'scale-110 md:scale-125 shadow-2xl z-20 ring-2 md:ring-4 ring-[#D4AF37]' 
                    : isOtherActive
                      ? 'opacity-15 blur-sm scale-90' 
                      : 'hover:scale-105'
                  }
                `}>
                  {/* Glow effect al hacer hover/touch */}
                  {isActive && (
                    <div className="absolute inset-0 bg-[#D4AF37] rounded-xl md:rounded-2xl opacity-30 blur-xl md:blur-2xl -z-10 scale-150 animate-pulse"></div>
                  )}
                  
                  <img 
                    src={client.logo} 
                    alt={client.name}
                    className={`
                      max-w-full max-h-full object-contain
                      transition-all duration-700
                      ${isActive ? '' : 'filter grayscale opacity-80'}
                    `}
                  />

                  {/* Tooltip con descripción - ahora funciona en móvil también */}
                  {isActive && (
                    <div 
                      className="absolute top-full mt-6 lg:mt-8 left-1/2 transform -translate-x-1/2 w-64 lg:w-80 z-30"
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
            );
          })}
        </div>
      </div>

      <style>{`
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