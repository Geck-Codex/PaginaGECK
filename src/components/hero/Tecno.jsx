// ✅ VERSIÓN V2 - Contenido 40% más pequeño, contenedor grande para aire
// Ícono: w-12→w-16 | Título: text-xl→text-3xl | Todo reducido
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const NeuralNetworkPro = () => {
  const [hoveredNode, setHoveredNode] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [particles, setParticles] = useState([]);
  const [portalParticles, setPortalParticles] = useState([]);
  const [backgroundParticles, setBackgroundParticles] = useState([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);
  const [focusedNode, setFocusedNode] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef(null);
  const svgRef = useRef(null);

  // Memoizar los datos para evitar recrearlos en cada render
  const centralNode = useMemo(() => ({
    id: 'core',
    name: 'IA & Computer Vision',
    x: 50,
    y: 50,
    icon: '🧠',
    description: 'Núcleo central de inteligencia artificial y visión por computadora',
    details: 'Desarrollamos soluciones de IA avanzada, machine learning y computer vision para automatizar procesos complejos y extraer insights valiosos de datos visuales.',
    technologies: [
      { name: 'TensorFlow', icon: '🧮' },
      { name: 'PyTorch', icon: '🔥' },
      { name: 'OpenCV', icon: '👁️' },
      { name: 'Neural Nets', icon: '🕸️' }
    ],
    projects: ['Reconocimiento facial', 'Detección de objetos', 'Análisis predictivo']
  }), []);

  const nodes = useMemo(() => [
    {
      id: 1,
      name: 'Desarrollo Web',
      icon: '💻',
      x: 20,
      y: 20,
      connections: ['core', 2, 5],
      description: 'Aplicaciones web modernas y escalables',
      details: 'Creamos experiencias web de alta performance usando las últimas tecnologías. Desde landing pages hasta aplicaciones empresariales complejas.',
      technologies: [
        { name: 'React', icon: '⚛️' },
        { name: 'Node.js', icon: '🟢' },
        { name: 'PHP', icon: '🐘' },
        { name: 'TypeScript', icon: '📘' }
      ],
      projects: ['E-commerce', 'Portales corporativos', 'SaaS platforms']
    },
    {
      id: 2,
      name: 'Desarrollo Móvil',
      icon: '📱',
      x: 80,
      y: 15,
      connections: ['core', 1, 3],
      description: 'Apps móviles nativas y cross-platform',
      details: 'Desarrollamos aplicaciones móviles que tus usuarios amarán. Optimizadas para iOS y Android con la mejor UX.',
      technologies: [
        { name: 'React Native', icon: '📱' },
        { name: 'Flutter', icon: '🎯' },
        { name: 'Swift', icon: '🍎' },
        { name: 'Kotlin', icon: '🤖' }
      ],
      projects: ['Apps bancarias', 'Delivery apps', 'Social networks']
    },
    {
      id: 3,
      name: 'Sistemas Empresariales',
      icon: '🏢',
      x: 85,
      y: 60,
      connections: ['core', 2, 4],
      description: 'Soluciones ERP y CRM personalizadas',
      details: 'Sistemas robustos que integran todos los procesos de tu empresa. Aumenta la eficiencia y reduce costos operativos.',
      technologies: [
        { name: 'ERP', icon: '🏢' },
        { name: 'CRM', icon: '👥' },
        { name: 'Cloud', icon: '☁️' },
        { name: 'Database', icon: '🗄️' }
      ],
      projects: ['Gestión inventario', 'Control de ventas', 'HR Management']
    },
    {
      id: 4,
      name: 'Automatización',
      icon: '⚙️',
      x: 65,
      y: 85,
      connections: ['core', 3, 5],
      description: 'Automatización e integraciones',
      details: 'Conectamos tus sistemas y automatizamos tareas repetitivas. Ahorra tiempo y elimina errores humanos.',
      technologies: [
        { name: 'API', icon: '🔌' },
        { name: 'Python', icon: '🐍' },
        { name: 'RPA', icon: '🤖' },
        { name: 'Webhooks', icon: '🔗' }
      ],
      projects: ['Zapier workflows', 'API integrations', 'Bot automation']
    },
    {
      id: 5,
      name: 'Datos & Analytics',
      icon: '📊',
      x: 15,
      y: 75,
      connections: ['core', 1, 4],
      description: 'Business Intelligence y análisis de datos',
      details: 'Convertimos tus datos en decisiones estratégicas. Dashboards, reportes y predicciones basadas en IA.',
      technologies: [
        { name: 'Analytics', icon: '📊' },
        { name: 'ML', icon: '🧠' },
        { name: 'BI', icon: '📈' },
        { name: 'PowerBI', icon: '📉' }
      ],
      projects: ['Dashboards ejecutivos', 'Modelos predictivos', 'Data lakes']
    }
  ], []);

  useEffect(() => {
    // Detectar si es dispositivo móvil
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);

    // Ajustar número de partículas según dispositivo - REDUCIDO
    const particleCount = window.innerWidth < 768 ? 15 : 25;
    const particles = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      vx: (Math.random() - 0.5) * 0.05,
      vy: (Math.random() - 0.5) * 0.05,
      size: Math.random() * 2 + 1,
      opacity: Math.random() * 0.5 + 0.2
    }));
    setBackgroundParticles(particles);

    const loadSequence = setTimeout(() => setIsLoaded(true), 100);
    return () => {
      clearTimeout(loadSequence);
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  useEffect(() => {
    // Aumentado de 50ms a 100ms para reducir carga de CPU
    const interval = setInterval(() => {
      setBackgroundParticles(prev =>
        prev.map(p => ({
          ...p,
          x: (p.x + p.vx + 100) % 100,
          y: (p.y + p.vy + 100) % 100
        }))
      );
    }, 100);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let rafId = null;
    let lastUpdate = 0;
    const throttleDelay = 50; // Actualizar máximo cada 50ms

    const handleMouseMove = (e) => {
      const now = Date.now();
      if (now - lastUpdate < throttleDelay) return;
      
      if (rafId) cancelAnimationFrame(rafId);
      
      rafId = requestAnimationFrame(() => {
        if (containerRef.current) {
          const rect = containerRef.current.getBoundingClientRect();
          setMousePosition({
            x: ((e.clientX - rect.left) / rect.width) * 100,
            y: ((e.clientY - rect.top) / rect.height) * 100
          });
          lastUpdate = now;
        }
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  useEffect(() => {
    if (hoveredNode && !selectedNode) {
      // Aumentado de 200ms a 600ms para generar MUCHAS menos partículas
      const interval = setInterval(() => {
        setParticles(prev => {
          // Limitar partículas según dispositivo: 5 en móvil, 8 en desktop
          const maxParticles = isMobile ? 5 : 8;
          if (prev.length >= maxParticles) return prev;
          
          const newParticle = {
            id: Date.now() + Math.random(),
            startNode: hoveredNode,
            endNode: hoveredNode === 'core'
              ? nodes[Math.floor(Math.random() * nodes.length)].id
              : 'core',
            progress: 0
          };
          return [...prev, newParticle];
        });
      }, 600); // Más lento
      return () => clearInterval(interval);
    }
  }, [hoveredNode, selectedNode, isMobile]);

  useEffect(() => {
    // Aumentado de 40ms a 60ms para reducir re-renders
    const interval = setInterval(() => {
      setParticles(prev =>
        prev
          .map(p => ({ ...p, progress: p.progress + 0.02 }))
          .filter(p => p.progress < 1)
      );
    }, 60);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (selectedNode) {
      const nodePos = getNodePosition(selectedNode);
      // Reducido de 20 a 10 partículas para mejor performance
      const newPortalParticles = Array.from({ length: 10 }, (_, i) => ({
        id: `portal-${Date.now()}-${i}`,
        startX: nodePos.x,
        startY: nodePos.y,
        angle: (i / 10) * Math.PI * 2,
        progress: 0
      }));
      setPortalParticles(newPortalParticles);
    } else {
      setPortalParticles([]);
    }
  }, [selectedNode]);

  useEffect(() => {
    if (portalParticles.length > 0) {
      // Aumentado de 30ms a 50ms para reducir carga
      const interval = setInterval(() => {
        setPortalParticles(prev =>
          prev
            .map(p => ({ ...p, progress: p.progress + 0.05 }))
            .filter(p => p.progress < 1)
        );
      }, 50);
      return () => clearInterval(interval);
    }
  }, [portalParticles]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSelectedNode(null);
        setFocusedNode(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const getNodePosition = useCallback((nodeId) => {
    if (nodeId === 'core') return { x: centralNode.x, y: centralNode.y };
    const node = nodes.find(n => n.id === nodeId);
    return node ? { x: node.x, y: node.y } : { x: 50, y: 50 };
  }, []);

  const isConnected = useCallback((nodeId) => {
    if (!hoveredNode && !focusedNode) return false;
    const activeNode = focusedNode || hoveredNode;
    if (activeNode === 'core') return true;
    if (nodeId === 'core') return true;
    if (activeNode === nodeId) return true;

    const activeNodeData = nodes.find(n => n.id === activeNode);
    if (activeNodeData?.connections.includes(nodeId)) return true;

    const currentNodeData = nodes.find(n => n.id === nodeId);
    if (currentNodeData?.connections.includes(activeNode)) return true;

    return false;
  }, [hoveredNode, focusedNode]);

  const handleNodeClick = useCallback((nodeId) => {
    // Usar requestAnimationFrame para suavizar la interacción
    requestAnimationFrame(() => {
      if (selectedNode === nodeId) {
        setSelectedNode(null);
        setFocusedNode(null);
      } else {
        setSelectedNode(nodeId);
        setFocusedNode(nodeId);
      }
    });
  }, [selectedNode]);

  const getNodeData = useCallback((nodeId) => {
    if (nodeId === 'core') return centralNode;
    return nodes.find(n => n.id === nodeId);
  }, []);

  const getNodeIcon = useCallback((nodeId) => {
    if (nodeId === 'core') return centralNode.icon;
    const node = nodes.find(n => n.id === nodeId);
    return node?.icon || '📦';
  }, []);

  return (
    <div 
      ref={containerRef}
      className="min-h-screen flex flex-col items-center justify-center overflow-hidden relative"
      style={{
        background: 'linear-gradient(135deg, #050D1A 0%, #0B1D33 25%, #0D1825 50%, #0b1f49 75%, #060E1B 100%)'
      }}
    >
      <style>{`
        :root {
          --navy-dark: #0B1D33;
          --navy: #0b1f49;
          --navy-light: #0c1e3c;
          --navy-medium: #2A3441;
          --accent-blue: #1B365D;
          --gold: #D4AF37;
          --gold-light: #F4E4BC;
          --gold-dark: #B8941F;
          --gold-muted: #928250;
          --white-soft: #F8F9FA;
          --text-muted: #6B7280;
          --card-bg: #222220;
        }
        
        /* Optimizaciones de performance */
        * {
          -webkit-tap-highlight-color: transparent;
        }

        /* Animación de pulso SUPER sutil solo para nodo central */
        @keyframes subtlePulse {
          0%, 100% {
            opacity: 0.95;
          }
          50% {
            opacity: 1;
          }
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(11, 29, 51, 0.3);
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: var(--gold-muted);
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: var(--gold);
        }

        /* Prevenir scroll del body cuando modal está abierto */
        body.modal-open {
          overflow: hidden;
        }

        /* Forzar aceleración de hardware */
        svg, foreignObject {
          transform: translateZ(0);
          backface-visibility: hidden;
          perspective: 1000px;
        }

        /* Optimizar animaciones */
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>

      <div 
        className="absolute inset-0 opacity-10"
        style={{
          background: 'radial-gradient(circle at 20% 30%, var(--gold-dark) 0%, transparent 60%), radial-gradient(circle at 80% 70%, var(--accent-blue) 0%, transparent 60%)',
          filter: 'blur(100px)'
        }}
      />

      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0, willChange: 'auto' }}>
        {backgroundParticles.map(p => {
          const parallaxX = p.x + (mousePosition.x - 50) * 0.02;
          const parallaxY = p.y + (mousePosition.y - 50) * 0.02;
          
          return (
            <circle
              key={p.id}
              cx={`${parallaxX}%`}
              cy={`${parallaxY}%`}
              r={p.size}
              fill="var(--white-soft)"
              opacity={p.opacity * 0.2}
            />
          );
        })}

        {backgroundParticles.map((p1, i) => {
          // Optimización: Solo renderizar líneas entre partículas cercanas
          // y limitar el número de comparaciones
          if (i >= backgroundParticles.length - 1) return null;
          
          return backgroundParticles.slice(i + 1, Math.min(i + 6, backgroundParticles.length)).map((p2, j) => {
            const dx = p1.x - p2.x;
            const dy = p1.y - p2.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // Reducido umbral de 15 a 12 para menos líneas
            if (distance < 12) {
              return (
                <line
                  key={`${i}-${j}`}
                  x1={`${p1.x}%`}
                  y1={`${p1.y}%`}
                  x2={`${p2.x}%`}
                  y2={`${p2.y}%`}
                  stroke="var(--accent-blue)"
                  strokeOpacity="0.08"
                  strokeWidth="0.5"
                />
              );
            }
            return null;
          });
        })}
      </svg>

      <AnimatePresence>
        {selectedNode && (
          <motion.div
            className="fixed inset-0 z-40"
            style={{ 
              background: 'radial-gradient(circle at center, rgba(11, 29, 51, 0.92) 0%, rgba(5, 13, 26, 0.96) 100%)',
              backdropFilter: 'blur(12px)'
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            onClick={() => {
              setSelectedNode(null);
              setFocusedNode(null);
            }}
          />
        )}
      </AnimatePresence>

      <motion.div 
        className="relative z-40 text-center mb-4 md:mb-8 px-4"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <motion.h1 
          className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold mb-3 md:mb-4 px-2 sm:px-4"
          style={{
            background: 'linear-gradient(135deg, var(--gold-light) 0%, var(--gold) 30%, var(--gold-dark) 60%, var(--gold) 100%)',
            backgroundSize: '200% 200%',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
            textShadow: '0 0 40px rgba(212, 175, 55, 0.3)',
            filter: 'drop-shadow(0 4px 20px rgba(212, 175, 55, 0.4))'
          }}
          animate={{
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          Nuestros Servicios
        </motion.h1>
        <motion.div 
          className="h-1 w-48 sm:w-64 md:w-80 mx-auto rounded-full mb-3 md:mb-4"
          style={{
            background: 'linear-gradient(90deg, transparent, var(--gold), var(--gold-light), var(--gold), transparent)'
          }}
          animate={{
            opacity: [0.4, 1, 0.4],
            scaleX: [0.9, 1.1, 0.9]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.p 
          className="text-xs sm:text-sm md:text-base lg:text-lg font-light tracking-wide px-2"
          style={{ color: 'var(--gold-light)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          transition={{ delay: 0.5 }}
        >
          Explora nuestra red de soluciones tecnológicas
        </motion.p>
      </motion.div>

      <div className="relative w-full max-w-7xl aspect-square sm:aspect-video px-4 sm:px-6 md:px-8">
        <svg 
          ref={svgRef} 
          className="absolute inset-0 w-full h-full" 
          viewBox="0 0 100 100" 
          preserveAspectRatio="xMidYMid meet" 
          style={{ 
            zIndex: focusedNode ? 15 : 5,
            transform: 'translateZ(0)',
            willChange: focusedNode ? 'contents' : 'auto'
          }}
        >
          <defs>
            <linearGradient id="pulseGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--gold)" stopOpacity="0.9">
                <animate attributeName="offset" values="0;1;0" dur="3s" repeatCount="indefinite" />
              </stop>
              <stop offset="50%" stopColor="var(--gold-light)" stopOpacity="0.7">
                <animate attributeName="offset" values="0.5;1;0" dur="3s" repeatCount="indefinite" />
              </stop>
              <stop offset="100%" stopColor="var(--gold-dark)" stopOpacity="0.9">
                <animate attributeName="offset" values="1;0;1" dur="3s" repeatCount="indefinite" />
              </stop>
            </linearGradient>

            <filter id="goldGlow">
              <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
              <feColorMatrix in="coloredBlur" type="matrix" values="
                1.5 0 0 0 0
                0 1.2 0 0 0
                0 0 0.3 0 0
                0 0 0 1 0"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>

            <filter id="strongGlow">
              <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* LÍNEAS DE CONEXIÓN - Versión simplificada */}
          {nodes.map(node =>
            node.connections.map(targetId => {
              const start = getNodePosition(node.id);
              const end = getNodePosition(targetId);
              const isActive = isConnected(node.id) && isConnected(targetId);
              const shouldShow = !focusedNode || isActive;

              return (
                <motion.line
                  key={`${node.id}-${targetId}`}
                  x1={start.x}
                  y1={start.y}
                  x2={end.x}
                  y2={end.y}
                  stroke={isActive ? "var(--gold-muted)" : "var(--navy-medium)"}
                  strokeWidth={isActive ? "0.35" : "0.2"}
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{
                    pathLength: isLoaded ? 1 : 0,
                    opacity: shouldShow ? (isActive ? 0.7 : 0.3) : 0.1
                  }}
                  transition={{
                    pathLength: { duration: 1.5, delay: 0.5, ease: "easeInOut" },
                    opacity: { duration: 0.3 }
                  }}
                />
              );
            })
          )}

          {/* PARTÍCULAS ANIMADAS (solo hover) */}
          {particles.map(particle => {
            const start = getNodePosition(particle.startNode);
            const end = getNodePosition(particle.endNode);
            const x = start.x + (end.x - start.x) * particle.progress;
            const y = start.y + (end.y - start.y) * particle.progress;

            return (
              <g key={particle.id}>
                <circle
                  cx={x}
                  cy={y}
                  r="0.5"
                  fill="var(--gold-light)"
                  opacity={1 - particle.progress * 0.5}
                />
              </g>
            );
          })}

          {/* NODOS DENTRO DEL SVG USANDO foreignObject */}
          
          {/* Nodo Central */}
          <foreignObject 
            x={centralNode.x - 6} 
            y={centralNode.y - 6} 
            width="16" 
            height="16"
            style={{ overflow: 'visible', pointerEvents: selectedNode ? 'none' : 'auto' }}
          >
            <div
              className="w-full h-full rounded-full cursor-pointer flex items-center justify-center overflow-visible"
              style={{
                background: `radial-gradient(circle at 30% 30%, var(--gold-light) 0%, var(--gold) 40%, var(--gold-dark) 80%, transparent 100%)`,
                boxShadow: hoveredNode === 'core'
                  ? '0 0 80px var(--gold), 0 0 120px rgba(212, 175, 55, 0.5), inset 0 0 40px rgba(244, 228, 188, 0.3)'
                  : '0 0 50px var(--gold-dark), 0 0 80px rgba(212, 175, 55, 0.4), inset 0 0 30px rgba(244, 228, 188, 0.2)',
                opacity: selectedNode && selectedNode !== 'core' ? 0.3 : (selectedNode === 'core' ? 0 : 1),
                border: '3px solid var(--gold)',
                transform: isLoaded ? 'scale(1) translateZ(0)' : 'scale(0) translateZ(0)',
                transition: 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
                touchAction: 'manipulation',
                willChange: hoveredNode === 'core' ? 'transform, opacity' : 'auto',
                animation: hoveredNode !== 'core' ? 'subtlePulse 4s ease-in-out infinite' : 'none'
              }}
              onMouseEnter={() => !selectedNode && setHoveredNode('core')}
              onMouseLeave={() => !selectedNode && setHoveredNode(null)}
              onClick={() => handleNodeClick('core')}
            >
              <div className="text-center relative z-10">
                <div 
                  className="font-bold px-1 leading-tight" 
                  style={{ 
                    color: 'var(--navy-dark)',
                    textShadow: '0 1px 2px rgba(255,255,255,0.5), 0 0 8px rgba(244, 228, 188, 0.6)',
                    fontSize: '0.2rem'
                  }}
                >
                  {centralNode.name}
                </div>
              </div>
            </div>
          </foreignObject>

          {/* Nodos Secundarios */}
          {nodes.map((node, index) => {
            const isActive = isConnected(node.id);
            const isHovered = hoveredNode === node.id;
            const isFocused = focusedNode === node.id;

            return (
              <foreignObject
                key={node.id}
                x={node.x - 4.75}
                y={node.y - 4.75}
                width="9.5"
                height="9.5"
                style={{ 
                  overflow: 'visible',
                  pointerEvents: selectedNode && selectedNode !== node.id ? 'auto' : (selectedNode === node.id ? 'none' : 'auto')
                }}
              >
                <div
                  className="w-full h-full rounded-full cursor-pointer flex items-center justify-center"
                  style={{
                    background: isHovered || isFocused
                      ? 'linear-gradient(135deg, var(--accent-blue) 0%, var(--navy) 60%, var(--navy-dark) 100%)'
                      : 'linear-gradient(135deg, var(--navy-light) 0%, var(--navy-dark) 100%)',
                    border: '2px solid',
                    borderColor: isActive ? 'rgba(212, 175, 55, 0.4)' : 'var(--navy-medium)',
                    boxShadow: isActive
                      ? '0 0 25px rgba(212, 175, 55, 0.3), inset 0 0 20px rgba(212, 175, 55, 0.08)'
                      : '0 4px 20px rgba(11, 29, 51, 0.6)',
                    opacity: selectedNode && selectedNode !== node.id ? 0.3 : (selectedNode === node.id ? 0 : 1),
                    transform: isLoaded ? 'scale(1) translateZ(0)' : 'scale(0) translateZ(0)',
                    transition: `all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) ${0.4 + index * 0.1}s`,
                    touchAction: 'manipulation',
                    willChange: isHovered || isFocused ? 'transform, opacity' : 'auto'
                  }}
                  onMouseEnter={() => !selectedNode && setHoveredNode(node.id)}
                  onMouseLeave={() => !selectedNode && setHoveredNode(null)}
                  onClick={() => handleNodeClick(node.id)}
                >
                  <div className="text-center px-1 relative z-10">
                    <p 
                      className="font-bold leading-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]" 
                      style={{ 
                        color: 'var(--gold-light)',
                        textShadow: '0 0 10px rgba(11, 29, 51, 0.8), 0 2px 4px rgba(0,0,0,1)',
                        fontSize: '0.2rem'
                      }}
                    >
                      {node.name}
                    </p>
                  </div>
                </div>
              </foreignObject>
            );
          })}
        </svg>
      </div>

      {/* MODAL DESDE CERO - DISEÑO LIMPIO */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setSelectedNode(null);
                setFocusedNode(null);
              }
            }}
          >
            <motion.div
              className="relative w-full max-w-4xl bg-[#1a1a1a] rounded-3xl shadow-2xl overflow-hidden"
              style={{
                maxHeight: '85vh',
                border: '1px solid rgba(212, 175, 55, 0.2)'
              }}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Botón cerrar */}
              <button
                onClick={() => {
                  setSelectedNode(null);
                  setFocusedNode(null);
                }}
                className="absolute top-6 right-6 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-colors"
                style={{ color: 'var(--text-muted)' }}
              >
                <span className="text-xl">✕</span>
              </button>

              {/* Contenido scrollable */}
              <div className="overflow-y-auto custom-scrollbar" style={{ maxHeight: '85vh' }}>
                {(() => {
                  const data = getNodeData(selectedNode);
                  return (
                    <div className="p-8 md:p-12">
                      {/* Header con ícono y título */}
                      <div className="flex items-start gap-6 mb-8">
                        <div 
                          className="w-20 h-20 rounded-2xl flex items-center justify-center text-5xl flex-shrink-0"
                          style={{
                            background: 'linear-gradient(135deg, var(--gold-dark), var(--gold))',
                            boxShadow: '0 8px 24px rgba(212, 175, 55, 0.3)'
                          }}
                        >
                          {getNodeIcon(selectedNode)}
                        </div>
                        <div className="flex-1 pt-1">
                          <h2 
                            className="text-3xl md:text-4xl font-bold mb-3"
                            style={{ 
                              background: 'linear-gradient(135deg, var(--gold-light), var(--gold))',
                              WebkitBackgroundClip: 'text',
                              backgroundClip: 'text',
                              color: 'transparent'
                            }}
                          >
                            {data.name}
                          </h2>
                          <p 
                            className="text-base text-gray-400"
                          >
                            {data.description}
                          </p>
                        </div>
                      </div>

                      {/* Descripción del servicio */}
                      <div className="mb-8">
                        <h3 
                          className="text-xl font-semibold mb-4 flex items-center gap-2"
                          style={{ color: 'var(--gold-light)' }}
                        >
                          <span>✨</span>
                          Sobre el servicio
                        </h3>
                        <div 
                          className="p-6 rounded-2xl"
                          style={{
                            backgroundColor: 'rgba(27, 54, 93, 0.1)',
                            border: '1px solid rgba(27, 54, 93, 0.2)'
                          }}
                        >
                          <p className="text-gray-300 leading-relaxed">
                            {data.details}
                          </p>
                        </div>
                      </div>

                      {/* Lista de proyectos */}
                      <div className="mb-8">
                        <h3 
                          className="text-xl font-semibold mb-4 flex items-center gap-2"
                          style={{ color: 'var(--gold-light)' }}
                        >
                          <span>🚀</span>
                          Proyectos
                        </h3>
                        <div className="grid gap-3">
                          {data.projects.map((project, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-3 p-4 rounded-xl transition-all hover:bg-white/5 cursor-pointer"
                              style={{
                                backgroundColor: 'rgba(27, 54, 93, 0.05)',
                                border: '1px solid rgba(212, 175, 55, 0.1)'
                              }}
                            >
                              <div 
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: 'var(--gold)' }}
                              />
                              <span className="text-gray-200">
                                {project}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Botones de acción */}
                      <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-800">
                        <button 
                          className="flex-1 py-4 px-6 rounded-xl font-semibold text-lg transition-all hover:scale-105"
                          style={{
                            background: 'linear-gradient(135deg, var(--gold-dark), var(--gold))',
                            color: 'var(--navy-dark)',
                            boxShadow: '0 4px 16px rgba(212, 175, 55, 0.3)'
                          }}
                        >
                          💬 Contactar
                        </button>
                        <button 
                          className="flex-1 py-4 px-6 rounded-xl font-semibold text-lg transition-all hover:scale-105"
                          style={{
                            background: 'transparent',
                            color: 'var(--gold-light)',
                            border: '1px solid var(--gold-muted)'
                          }}
                        >
                          📖 Ver Más
                        </button>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Instrucciones de teclado */}
      <div className="absolute top-4 right-4 md:top-8 md:right-8 text-xs z-40 hidden md:block">
        <div 
          className="backdrop-blur-sm rounded-lg px-4 py-2 border"
          style={{
            backgroundColor: 'rgba(11, 29, 51, 0.8)',
            borderColor: 'var(--gold-muted)',
            color: 'var(--gold-light)'
          }}
        >
          <kbd 
            className="px-2 py-1 rounded"
            style={{ backgroundColor: 'var(--navy)', color: 'var(--gold-light)' }}
          >
            ESC
          </kbd> para salir • <kbd 
            className="px-2 py-1 rounded"
            style={{ backgroundColor: 'var(--navy)', color: 'var(--gold-light)' }}
          >
            CLICK
          </kbd> en otros nodos
        </div>
      </div>
    </div>
  );
};

export default NeuralNetworkPro;