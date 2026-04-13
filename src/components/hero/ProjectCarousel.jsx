import { useState, useEffect, useRef } from 'react';

const projects = [
  { id:1,  initials:'CT', name:'Capital Transport LLP',  description:'App oficial de gestión de cargas y despacho para flota en USA' },
  { id:2,  initials:'DG', name:'DrowsyGuard',             description:'Detección de microsueños al volante con visión artificial' },
  { id:3,  initials:'BC', name:'Badge Creator System',    description:'Credenciales digitales para el Gobierno Municipal de Parral' },
  { id:4,  initials:'TP', name:'TrainPad',                description:'Corrección de posturas en tiempo real durante el entrenamiento' },
  { id:5,  initials:'JV', name:'JV Inventory AI',         description:'Inventario inteligente con reconocimiento de productos por cámara' },
  { id:6,  initials:'PS', name:'PostureCheck System',     description:'Monitoreo ergonómico en plantas industriales en tiempo real' },
  { id:7,  initials:'HM', name:'HeadMaus',                description:'Control de computadora mediante movimientos de cabeza y ojos' },
  { id:8,  initials:'GB', name:'Geck Bot',                description:'Gestión completa de tu negocio directo desde WhatsApp' },
  { id:9,  initials:'GP', name:'GECK POS',                description:'Punto de venta en la nube multidispositivo para cualquier negocio' },
  { id:10, initials:'AI', name:'Agend-In',                description:'Agendamiento automático de citas por WhatsApp o Telegram' },
  { id:11, initials:'BP', name:'BizPilot',                description:'Consulta y controla tu empresa en lenguaje natural desde WhatsApp' },
  { id:12, initials:'SF', name:'SocialFlow',              description:'Crea y publica contenido automático en FB, IG y TikTok' },
  { id:13, initials:'FM', name:'Fleet Management App',    description:'Rastreo y gestión de flotas vehiculares en tiempo real' },
  { id:14, initials:'EM', name:'El Mezquite Cattle',      description:'Sistema integral de administración ganadera' },
];

const ProjectCarousel = () => {
  const [hoveredIndex,   setHoveredIndex]   = useState(null);
  const [touchedIndex,   setTouchedIndex]   = useState(null);
  const [tooltipPos,     setTooltipPos]     = useState('center');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [hasAnimated,    setHasAnimated]    = useState(false);

  const animationRef  = useRef(null);
  const containerRef  = useRef(null);
  const componentRef  = useRef(null);
  const offsetRef     = useRef(0);
  const cardRefs      = useRef({});
  const touchStartRef = useRef(null);

  /* ── Tooltip position ── */
  const calcTooltipPos = (index) => {
    const el = cardRefs.current[index];
    if (!el) return 'center';
    const rect        = el.getBoundingClientRect();
    const vw          = window.innerWidth;
    const tooltipW    = vw < 1024 ? 256 : 320;
    const cx          = rect.left + rect.width / 2;
    if (cx - tooltipW / 2 < 16)      return 'left';
    if (cx + tooltipW / 2 > vw - 16) return 'right';
    return 'center';
  };

  /* ── Touch handlers ── */
  const onTouchStart = (i, e) => {
    touchStartRef.current = { i, t: Date.now(), x: e.touches[0].clientX, y: e.touches[0].clientY };
  };
  const onTouchEnd = (i, e) => {
    if (!touchStartRef.current) return;
    const dx = Math.abs(e.changedTouches[0].clientX - touchStartRef.current.x);
    const dy = Math.abs(e.changedTouches[0].clientY - touchStartRef.current.y);
    if (Date.now() - touchStartRef.current.t < 300 && dx < 10 && dy < 10) {
      const next = touchedIndex === i ? null : i;
      setTouchedIndex(next);
      setHoveredIndex(null);
      if (next !== null) setTimeout(() => setTooltipPos(calcTooltipPos(next)), 0);
    }
    touchStartRef.current = null;
  };

  const onMouseEnter = (i) => {
    setHoveredIndex(i);
    setTouchedIndex(null);
    setTimeout(() => setTooltipPos(calcTooltipPos(i)), 0);
  };

  /* ── Scroll entrance ── */
  useEffect(() => {
    const handleScroll = () => {
      if (!componentRef.current) return;
      const rect = componentRef.current.getBoundingClientRect();
      const vh   = window.innerHeight;
      const start = vh * 1.0, end = vh * 0.1;
      if (rect.top <= start && rect.top >= end) {
        const p = Math.max(0, Math.min(1, 1 - (rect.top - end) / (start - end)));
        setScrollProgress(p);
        if (p > 0.05 && !hasAnimated) setHasAnimated(true);
      } else if (rect.top > start) setScrollProgress(0);
      else setScrollProgress(1);
    };

    const observer = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) { window.addEventListener('scroll', handleScroll, { passive: true }); handleScroll(); }
        else window.removeEventListener('scroll', handleScroll);
      }),
      { rootMargin: '100px 0px 100px 0px' }
    );
    if (componentRef.current) observer.observe(componentRef.current);
    return () => { window.removeEventListener('scroll', handleScroll); if (componentRef.current) observer.unobserve(componentRef.current); };
  }, [hasAnimated]);

  /* ── Close on outside touch ── */
  useEffect(() => {
    if (touchedIndex === null) return;
    const close = (e) => { if (containerRef.current && !containerRef.current.contains(e.target)) setTouchedIndex(null); };
    document.addEventListener('touchstart', close);
    return () => document.removeEventListener('touchstart', close);
  }, [touchedIndex]);

  /* ── Resize tooltip recalc ── */
  useEffect(() => {
    const onResize = () => {
      const active = hoveredIndex ?? touchedIndex;
      if (active !== null) setTooltipPos(calcTooltipPos(active));
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [hoveredIndex, touchedIndex]);

  /* ── RAF scroll loop ── */
  useEffect(() => {
    let last = performance.now();
    const animate = (now) => {
      if (hoveredIndex === null && touchedIndex === null && containerRef.current) {
        const delta = now - last;
        last = now;
        offsetRef.current += (20 * delta) / 1000;
        const setW = 200 * projects.length;
        if (offsetRef.current >= setW) offsetRef.current %= setW;
        containerRef.current.style.transform = `translateX(-${offsetRef.current}px)`;
      } else { last = now; }
      animationRef.current = requestAnimationFrame(animate);
    };
    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current);
  }, [hoveredIndex, touchedIndex]);

  /* ── Tooltip classes ── */
  const tooltipClass = () => {
    const base = 'absolute top-full mt-6 lg:mt-8 w-64 lg:w-80 z-30';
    if (tooltipPos === 'left')  return `${base} left-0`;
    if (tooltipPos === 'right') return `${base} right-0`;
    return `${base} left-1/2 transform -translate-x-1/2`;
  };
  const arrowClass = () => {
    const base = 'absolute -top-2 w-4 h-4 bg-white rotate-45 border-l-2 border-t-2 border-[#D4AF37]/40';
    if (tooltipPos === 'left')  return `${base} left-8`;
    if (tooltipPos === 'right') return `${base} right-8`;
    return `${base} left-1/2 transform -translate-x-1/2`;
  };

  return (
    <div ref={componentRef} className="w-full bg-[#222220] relative overflow-hidden pt-16 md:pt-20 lg:pt-24 pb-10">

      {/* Línea dorada de entrada */}
      {scrollProgress > 0 && (
        <div className="absolute top-0 left-0 w-full h-1 z-50 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent"
            style={{
              width: '40%',
              transform: `translateX(${Math.min(scrollProgress * 250, 250)}%)`,
              boxShadow: '0 0 20px #D4AF37, 0 0 40px #D4AF37',
              opacity: Math.min(scrollProgress * 2, 1),
              transition: 'transform 0.6s cubic-bezier(0.16,1,0.3,1), opacity 0.6s ease-out'
            }}
          />
        </div>
      )}

      {/* Título */}
      <div
        className="text-center py-8 md:py-12 px-4 relative z-10"
        style={{
          opacity: Math.max(0, Math.min(1, (scrollProgress - 0.15) * 1.8)),
          transform: `translateY(${Math.max(0, (1 - scrollProgress) * 80 - 12)}px)`,
          transition: 'opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1)'
        }}
      >
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#D4AF37] mb-2 md:mb-3">
          Proyectos Destacados
        </h2>
        <p
          className="text-base md:text-lg text-[#F4E4BC] font-light tracking-wide"
          style={{
            opacity: Math.max(0, Math.min(1, (scrollProgress - 0.25) * 1.6)),
            transform: `translateY(${Math.max(0, (1 - scrollProgress) * 60 - 8)}px)`,
            transition: 'opacity 0.9s cubic-bezier(0.16,1,0.3,1), transform 0.9s cubic-bezier(0.16,1,0.3,1)'
          }}
        >
          lo que hemos construido
        </p>
      </div>

      {/* Carousel */}
      <div
        className="relative w-full h-[280px] md:h-[350px] lg:h-[400px] overflow-hidden py-6 md:py-10"
        style={{
          opacity: Math.max(0, Math.min(1, (scrollProgress - 0.35) * 1.5)),
          transform: `translateY(${Math.max(0, (1 - scrollProgress) * 100 - 35)}px) scale(${0.92 + scrollProgress * 0.08})`,
          transition: 'opacity 1s cubic-bezier(0.16,1,0.3,1), transform 1s cubic-bezier(0.16,1,0.3,1)'
        }}
      >
        {/* Gradientes laterales */}
        <div className="absolute left-0 top-0 bottom-0 w-20 md:w-40 bg-gradient-to-r from-[#222220] via-[#222220]/80 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 md:w-40 bg-gradient-to-l from-[#222220] via-[#222220]/80 to-transparent z-10 pointer-events-none" />

        <div
          ref={containerRef}
          className="flex items-center gap-8 md:gap-12 lg:gap-16 h-full"
          style={{ transition: 'none', willChange: 'transform' }}
        >
          {[...projects, ...projects, ...projects].map((p, index) => {
            const isActive     = hoveredIndex === index || touchedIndex === index;
            const isOtherActive = (hoveredIndex !== null && hoveredIndex !== index) ||
                                  (touchedIndex  !== null && touchedIndex  !== index);
            return (
              <div
                key={`${p.id}-${index}`}
                className="flex-shrink-0"
                ref={el => cardRefs.current[index] = el}
                onMouseEnter={() => onMouseEnter(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                onTouchStart={e => onTouchStart(index, e)}
                onTouchEnd={e => onTouchEnd(index, e)}
              >
                <div className={`
                  relative bg-white rounded-xl md:rounded-2xl shadow-xl
                  w-24 h-24 md:w-32 md:h-32 lg:w-36 lg:h-36
                  flex items-center justify-center
                  transition-all duration-700 ease-out cursor-pointer
                  ${isActive
                    ? 'scale-110 md:scale-125 shadow-2xl z-20 ring-2 md:ring-4 ring-[#D4AF37]'
                    : isOtherActive
                      ? 'opacity-15 blur-sm scale-90'
                      : 'hover:scale-105'
                  }
                `}>
                  {/* Glow dorado */}
                  {isActive && (
                    <div className="absolute inset-0 bg-[#D4AF37] rounded-xl md:rounded-2xl opacity-30 blur-xl md:blur-2xl -z-10 scale-150 animate-pulse" />
                  )}

                  {/* Iniciales */}
                  <span className={`
                    font-black tracking-tight select-none
                    text-2xl md:text-3xl lg:text-4xl
                    transition-all duration-700
                    ${isActive ? 'text-[#D4AF37]' : 'text-[#D4AF37]/30'}
                  `}>
                    {p.initials}
                  </span>

                  {/* Tooltip */}
                  {isActive && (
                    <div className={tooltipClass()} style={{ animation: 'slideDown 0.4s cubic-bezier(0.34,1.56,0.64,1)' }}>
                      <div className="bg-white rounded-xl lg:rounded-2xl shadow-2xl p-4 lg:p-6 border-2 border-[#D4AF37]/40">
                        <h4 className="text-[#0B1D33] font-bold text-base lg:text-lg mb-2 lg:mb-3">
                          {p.name}
                        </h4>
                        <p className="text-[#6B7280] text-sm lg:text-base leading-relaxed">
                          {p.description}
                        </p>
                        <div className="h-0.5 lg:h-1 w-16 lg:w-20 bg-gradient-to-r from-[#D4AF37] to-[#B8941F] rounded-full mt-3 lg:mt-4" />
                      </div>
                      <div className={arrowClass()} />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CTA */}
      <div
        className="text-center pt-4 pb-2 relative z-10"
        style={{
          opacity: Math.max(0, Math.min(1, (scrollProgress - 0.5) * 2)),
          transition: 'opacity 0.8s ease'
        }}
      >
        <a href="/portafolio" className="inline-flex items-center gap-2 text-sm font-semibold tracking-widest uppercase text-[#D4AF37] border-b border-[#D4AF37]/40 pb-0.5 hover:border-[#D4AF37] transition-all duration-200">
          Ver portafolio completo
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </a>
      </div>

      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-15px) scale(0.95); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
};

export default ProjectCarousel;
