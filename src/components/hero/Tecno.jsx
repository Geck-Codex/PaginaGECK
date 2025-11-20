import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const NeuralNetworkPro = () => {
  const [hoveredNode, setHoveredNode] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [particles, setParticles] = useState([]);
  const [backgroundParticles, setBackgroundParticles] = useState([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);
  const [focusedNode, setFocusedNode] = useState(null);
  const [networkPulse, setNetworkPulse] = useState(0);
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  const centralNode = {
    id: 'core',
    name: 'IA & Computer Vision',
    x: 50,
    y: 50,
    size: 'large',
    color: 'gold',
    description: 'Núcleo central de inteligencia artificial y visión por computadora',
    details: 'Desarrollamos soluciones de IA avanzada, machine learning y computer vision para automatizar procesos complejos y extraer insights valiosos de datos visuales.',
    technologies: [
      { name: 'TensorFlow', icon: '🧮', color: '#FF6F00' },
      { name: 'PyTorch', icon: '🔥', color: '#EE4C2C' },
      { name: 'OpenCV', icon: '👁️', color: '#5C3EE8' },
      { name: 'Neural Nets', icon: '🕸️', color: '#00D9FF' }
    ],
    projects: ['Reconocimiento facial', 'Detección de objetos', 'Análisis predictivo'],
    stats: { projects: 45, clients: 20, accuracy: '98%' }
  };

  const nodes = [
    {
      id: 1,
      name: 'Desarrollo Web',
      x: 20,
      y: 20,
      connections: ['core', 2, 5],
      description: 'Aplicaciones web modernas y escalables',
      details: 'Creamos experiencias web de alta performance usando las últimas tecnologías. Desde landing pages hasta aplicaciones empresariales complejas.',
      technologies: [
        { name: 'React', icon: '⚛️', color: '#61DAFB' },
        { name: 'Node.js', icon: '🟢', color: '#339933' },
        { name: 'PHP', icon: '🐘', color: '#777BB4' }
      ],
      projects: ['E-commerce', 'Portales corporativos', 'SaaS platforms'],
      stats: { projects: 120, clients: 50, satisfaction: '95%' }
    },
    {
      id: 2,
      name: 'Desarrollo Móvil',
      x: 80,
      y: 15,
      connections: ['core', 1, 3],
      description: 'Apps móviles nativas y cross-platform',
      details: 'Desarrollamos aplicaciones móviles que tus usuarios amarán. Optimizadas para iOS y Android con la mejor UX.',
      technologies: [
        { name: 'React Native', icon: '📱', color: '#61DAFB' },
        { name: 'Flutter', icon: '🎯', color: '#02569B' },
        { name: 'Swift', icon: '🍎', color: '#FA7343' }
      ],
      projects: ['Apps bancarias', 'Delivery apps', 'Social networks'],
      stats: { projects: 80, clients: 35, downloads: '2M+' }
    },
    {
      id: 3,
      name: 'Sistemas Empresariales',
      x: 85,
      y: 60,
      connections: ['core', 2, 4],
      description: 'Soluciones ERP y CRM personalizadas',
      details: 'Sistemas robustos que integran todos los procesos de tu empresa. Aumenta la eficiencia y reduce costos operativos.',
      technologies: [
        { name: 'ERP', icon: '🏢', color: '#FF6B6B' },
        { name: 'CRM', icon: '👥', color: '#4ECDC4' },
        { name: 'Cloud', icon: '☁️', color: '#95E1D3' }
      ],
      projects: ['Gestión inventario', 'Control de ventas', 'HR Management'],
      stats: { projects: 60, clients: 25, uptime: '99.9%' }
    },
    {
      id: 4,
      name: 'Automatización',
      x: 65,
      y: 85,
      connections: ['core', 3, 5],
      description: 'Automatización e integraciones',
      details: 'Conectamos tus sistemas y automatizamos tareas repetitivas. Ahorra tiempo y elimina errores humanos.',
      technologies: [
        { name: 'API', icon: '🔌', color: '#A8E6CF' },
        { name: 'Python', icon: '🐍', color: '#3776AB' },
        { name: 'RPA', icon: '🤖', color: '#FFD93D' }
      ],
      projects: ['Zapier workflows', 'API integrations', 'Bot automation'],
      stats: { projects: 95, clients: 40, timeSaved: '10k hrs' }
    },
    {
      id: 5,
      name: 'Datos & Analytics',
      x: 15,
      y: 75,
      connections: ['core', 1, 4],
      description: 'Business Intelligence y análisis de datos',
      details: 'Convertimos tus datos en decisiones estratégicas. Dashboards, reportes y predicciones basadas en IA.',
      technologies: [
        { name: 'Analytics', icon: '📊', color: '#6C5CE7' },
        { name: 'ML', icon: '🧠', color: '#FD79A8' },
        { name: 'BI', icon: '📈', color: '#00B894' }
      ],
      projects: ['Dashboards ejecutivos', 'Modelos predictivos', 'Data lakes'],
      stats: { projects: 70, clients: 30, insights: '500+' }
    }
  ];

  useEffect(() => {
    const particles = Array.from({ length: 100 }, (_, i) => ({
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
    return () => clearTimeout(loadSequence);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setBackgroundParticles(prev =>
        prev.map(p => ({
          ...p,
          x: (p.x + p.vx + 100) % 100,
          y: (p.y + p.vy + 100) % 100
        }))
      );
    }, 50);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
          x: ((e.clientX - rect.left) / rect.width) * 100,
          y: ((e.clientY - rect.top) / rect.height) * 100
        });
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setNetworkPulse(prev => (prev + 1) % 100);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (hoveredNode) {
      const interval = setInterval(() => {
        const newParticle = {
          id: Date.now() + Math.random(),
          startNode: hoveredNode,
          endNode: hoveredNode === 'core'
            ? nodes[Math.floor(Math.random() * nodes.length)].id
            : 'core',
          progress: 0,
          trail: []
        };
        setParticles(prev => [...prev, newParticle]);
      }, 200);
      return () => clearInterval(interval);
    }
  }, [hoveredNode]);

  useEffect(() => {
    const interval = setInterval(() => {
      setParticles(prev =>
        prev
          .map(p => ({ ...p, progress: p.progress + 0.015 }))
          .filter(p => p.progress < 1)
      );
    }, 20);
    return () => clearInterval(interval);
  }, []);

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

  const getNodePosition = (nodeId) => {
    if (nodeId === 'core') return { x: centralNode.x, y: centralNode.y };
    const node = nodes.find(n => n.id === nodeId);
    return node ? { x: node.x, y: node.y } : { x: 50, y: 50 };
  };

  const isConnected = (nodeId) => {
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
  };

  const handleNodeClick = (nodeId) => {
    setSelectedNode(nodeId);
    setFocusedNode(nodeId);
  };

  const getNodeData = (nodeId) => {
    if (nodeId === 'core') return centralNode;
    return nodes.find(n => n.id === nodeId);
  };

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
          --black: #1E1E1E;
          --carbon: #2B2B2B;
          --white: #FFFFFF;
          --white-soft: #F8F9FA;
          --text-muted: #6B7280;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>

      <div 
        className="absolute inset-0 opacity-10"
        style={{
          background: 'radial-gradient(circle at 20% 30%, var(--gold-dark) 0%, transparent 60%), radial-gradient(circle at 80% 70%, var(--accent-blue) 0%, transparent 60%)',
          filter: 'blur(100px)'
        }}
      />

      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
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
          return backgroundParticles.slice(i + 1).map((p2, j) => {
            const dx = p1.x - p2.x;
            const dy = p1.y - p2.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 15) {
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
        {focusedNode && (
          <motion.div
            className="absolute inset-0 z-10"
            style={{ backgroundColor: 'rgba(11, 29, 51, 0.7)', backdropFilter: 'blur(4px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setFocusedNode(null);
              setSelectedNode(null);
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
        <svg className="absolute inset-0 w-full h-full" style={{ zIndex: focusedNode ? 15 : 5 }}>
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--gold-dark)" stopOpacity="0.4" />
              <stop offset="50%" stopColor="var(--gold)" stopOpacity="0.7" />
              <stop offset="100%" stopColor="var(--gold-light)" stopOpacity="0.4" />
            </linearGradient>

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

            <linearGradient id="nodeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--navy-light)" />
              <stop offset="100%" stopColor="var(--navy-dark)" />
            </linearGradient>

            <linearGradient id="nodeActiveGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--accent-blue)" />
              <stop offset="100%" stopColor="var(--navy)" />
            </linearGradient>

            <filter id="glow">
              <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
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
          </defs>

          {nodes.map(node =>
            node.connections.map(targetId => {
              const start = getNodePosition(node.id);
              const end = getNodePosition(targetId);
              const isActive = isConnected(node.id) && isConnected(targetId);
              const shouldShow = !focusedNode || isActive;

              return (
                <motion.line
                  key={`${node.id}-${targetId}`}
                  x1={`${start.x}%`}
                  y1={`${start.y}%`}
                  x2={`${end.x}%`}
                  y2={`${end.y}%`}
                  stroke={isActive ? "url(#pulseGradient)" : "var(--navy-medium)"}
                  strokeWidth={isActive ? "3" : "1.5"}
                  filter={isActive ? "url(#goldGlow)" : "none"}
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{
                    pathLength: isLoaded ? 1 : 0,
                    opacity: shouldShow ? (isActive ? 1 : 0.25) : 0.08
                  }}
                  transition={{
                    pathLength: { duration: 1.5, delay: 0.5, ease: "easeInOut" },
                    opacity: { duration: 0.3 }
                  }}
                />
              );
            })
          )}

          {particles.map(particle => {
            const start = getNodePosition(particle.startNode);
            const end = getNodePosition(particle.endNode);
            const x = start.x + (end.x - start.x) * particle.progress;
            const y = start.y + (end.y - start.y) * particle.progress;

            return (
              <g key={particle.id}>
                <motion.line
                  x1={`${start.x + (end.x - start.x) * Math.max(0, particle.progress - 0.1)}%`}
                  y1={`${start.y + (end.y - start.y) * Math.max(0, particle.progress - 0.1)}%`}
                  x2={`${x}%`}
                  y2={`${y}%`}
                  stroke="var(--gold)"
                  strokeWidth="2"
                  opacity={0.7 * (1 - particle.progress)}
                  filter="url(#goldGlow)"
                />
                <circle
                  cx={`${x}%`}
                  cy={`${y}%`}
                  r="5"
                  fill="var(--gold-light)"
                  filter="url(#strongGlow)"
                  opacity={1 - particle.progress * 0.3}
                />
              </g>
            );
          })}
        </svg>

        <motion.div
          className="absolute rounded-full cursor-pointer flex items-center justify-center"
          style={{
            left: `${centralNode.x}%`,
            top: `${centralNode.y}%`,
            width: '120px',
            height: '120px',
            transform: 'translate(-50%, -50%)',
            background: `radial-gradient(circle at 30% 30%, var(--gold-light) 0%, var(--gold) 40%, var(--gold-dark) 80%, transparent 100%)`,
            boxShadow: hoveredNode === 'core'
              ? '0 0 80px var(--gold), 0 0 120px rgba(212, 175, 55, 0.5), inset 0 0 40px rgba(244, 228, 188, 0.3)'
              : '0 0 50px var(--gold-dark), 0 0 80px rgba(212, 175, 55, 0.4), inset 0 0 30px rgba(244, 228, 188, 0.2)',
            zIndex: focusedNode === 'core' ? 25 : 20,
            opacity: focusedNode && focusedNode !== 'core' ? 0.3 : 1,
            border: '3px solid var(--gold)'
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: isLoaded ? 1 : 0,
            opacity: focusedNode && focusedNode !== 'core' ? 0.3 : 1
          }}
          transition={{ duration: 0.6, delay: 0.2 }}
          onHoverStart={() => setHoveredNode('core')}
          onHoverEnd={() => setHoveredNode(null)}
          onClick={() => handleNodeClick('core')}
          whileHover={{ scale: 1.15 }}
        >
          <div className="text-center relative z-10">
            <motion.div 
              className="text-3xl sm:text-4xl mb-1 sm:mb-2"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              🧠
            </motion.div>
            <div 
              className="text-xs sm:text-sm font-bold px-2 sm:px-3 leading-tight" 
              style={{ 
                color: 'var(--navy-dark)',
                textShadow: '0 1px 2px rgba(255,255,255,0.5), 0 0 8px rgba(244, 228, 188, 0.6)'
              }}
            >
              {centralNode.name}
            </div>
          </div>

          <motion.div
            className="absolute inset-0 rounded-full"
            style={{ border: '2px solid rgba(244, 228, 188, 0.3)' }}
            animate={{
              scale: [1, 1.25, 1],
              opacity: [0.5, 0, 0.5]
            }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          />

          {hoveredNode === 'core' && centralNode.technologies.map((tech, idx) => {
            const angle = (idx * 360) / centralNode.technologies.length;
            const radian = (angle * Math.PI) / 180;
            const radius = 90;
            const x = Math.cos(radian) * radius;
            const y = Math.sin(radian) * radius;

            return (
              <motion.div
                key={tech.name}
                className="absolute w-16 h-16 rounded-full flex flex-col items-center justify-center text-2xl shadow-lg"
                style={{
                  left: '50%',
                  top: '50%',
                  x: x,
                  y: y,
                  background: 'linear-gradient(135deg, var(--navy-dark) 0%, var(--navy) 100%)',
                  border: '2px solid var(--gold)',
                  boxShadow: '0 0 25px rgba(212, 175, 55, 0.6), 0 4px 15px rgba(11, 29, 51, 0.8)'
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.08 }}
              >
                <div>{tech.icon}</div>
              </motion.div>
            );
          })}
        </motion.div>

        {nodes.map((node, index) => {
          const isActive = isConnected(node.id);
          const isHovered = hoveredNode === node.id;
          const isFocused = focusedNode === node.id;

          return (
            <motion.div
              key={node.id}
              className="absolute rounded-full cursor-pointer flex items-center justify-center"
              style={{
                left: `${node.x}%`,
                top: `${node.y}%`,
                width: '95px',
                height: '95px',
                transform: 'translate(-50%, -50%)',
                background: isHovered || isFocused
                  ? 'linear-gradient(135deg, var(--accent-blue) 0%, var(--navy) 60%, var(--navy-dark) 100%)'
                  : 'linear-gradient(135deg, var(--navy-light) 0%, var(--navy-dark) 100%)',
                border: '2px solid',
                borderColor: isActive ? 'rgba(212, 175, 55, 0.4)' : 'var(--navy-medium)',
                boxShadow: isActive
                  ? '0 0 25px rgba(212, 175, 55, 0.3), inset 0 0 20px rgba(212, 175, 55, 0.08)'
                  : '0 4px 20px rgba(11, 29, 51, 0.6)',
                zIndex: isFocused ? 25 : isHovered ? 15 : 10,
                opacity: focusedNode && !isFocused && focusedNode !== 'core' ? 0.3 : 1
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: isLoaded ? 1 : 0,
                opacity: focusedNode && !isFocused && focusedNode !== 'core' ? 0.3 : 1
              }}
              transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
              onHoverStart={() => setHoveredNode(node.id)}
              onHoverEnd={() => setHoveredNode(null)}
              onClick={() => handleNodeClick(node.id)}
            >
              <div className="text-center px-2 relative z-10">
                <p 
                  className="text-xs sm:text-sm font-bold leading-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]" 
                  style={{ 
                    color: 'var(--gold-light)',
                    textShadow: '0 0 10px rgba(11, 29, 51, 0.8), 0 2px 4px rgba(0,0,0,1)' 
                  }}
                >
                  {node.name}
                </p>
              </div>

              {isActive && (
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{ border: '2px solid rgba(212, 175, 55, 0.3)' }}
                  animate={{
                    scale: [1, 1.4],
                    opacity: [0.4, 0]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeOut"
                  }}
                />
              )}

              {isHovered && node.technologies.map((tech, idx) => {
                const angle = (idx * 360) / node.technologies.length;
                const radian = (angle * Math.PI) / 180;
                const radius = 70;
                const x = Math.cos(radian) * radius;
                const y = Math.sin(radian) * radius;

                return (
                  <motion.div
                    key={tech.name}
                    className="absolute w-14 h-14 rounded-full flex items-center justify-center text-2xl shadow-lg"
                    style={{
                      left: '50%',
                      top: '50%',
                      x: x,
                      y: y,
                      background: 'linear-gradient(135deg, var(--navy-dark) 0%, var(--accent-blue) 100%)',
                      border: '2px solid var(--gold-muted)',
                      boxShadow: '0 0 20px rgba(146, 130, 80, 0.5), 0 4px 12px rgba(11, 29, 51, 0.8)'
                    }}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ duration: 0.3, delay: idx * 0.1 }}
                  >
                    {tech.icon}
                  </motion.div>
                );
              })}
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence>
        {selectedNode && (
          <motion.div
            className="fixed right-0 top-0 h-full w-full md:w-[500px] lg:w-[550px] shadow-2xl z-30 overflow-y-auto"
            style={{
              background: 'linear-gradient(180deg, #050D1A 0%, #0B1D33 100%)',
              borderLeft: '1px solid var(--gold-muted)'
            }}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            {(() => {
              const data = getNodeData(selectedNode);
              return (
                <div className="min-h-full flex flex-col">
                  {/* Header */}
                  <div 
                    className="sticky top-0 z-10 p-6 sm:p-8 border-b"
                    style={{
                      background: 'rgba(5, 13, 26, 0.95)',
                      backdropFilter: 'blur(10px)',
                      borderBottomColor: 'var(--navy-medium)'
                    }}
                  >
                    <div className="flex justify-between items-start gap-4">
                      <h2 
                        className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight"
                        style={{ color: 'var(--gold)' }}
                      >
                        {data.name}
                      </h2>
                      <button
                        onClick={() => {
                          setSelectedNode(null);
                          setFocusedNode(null);
                        }}
                        className="text-3xl transition-colors touch-manipulation p-2 -m-2 flex-shrink-0"
                        style={{ color: 'var(--text-muted)' }}
                        onMouseEnter={(e) => e.target.style.color = 'var(--white-soft)'}
                        onMouseLeave={(e) => e.target.style.color = 'var(--text-muted)'}
                      >
                        ✕
                      </button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-6 sm:p-8 space-y-8">
                    {/* Description */}
                    <div>
                      <p 
                        className="text-base sm:text-lg leading-relaxed"
                        style={{ color: 'var(--white-soft)' }}
                      >
                        {data.description}
                      </p>
                    </div>

                    {/* Details */}
                    <div 
                      className="rounded-xl p-5 sm:p-6 border"
                      style={{
                        backgroundColor: 'rgba(27, 54, 93, 0.15)',
                        borderColor: 'rgba(27, 54, 93, 0.3)'
                      }}
                    >
                      <p 
                        className="text-sm sm:text-base leading-relaxed"
                        style={{ color: 'var(--white-soft)', opacity: 0.9 }}
                      >
                        {data.details}
                      </p>
                    </div>

                    {/* Technologies */}
                    <div>
                      <h3 
                        className="text-lg sm:text-xl font-semibold mb-4 flex items-center gap-3"
                        style={{ color: 'var(--gold-light)' }}
                      >
                        <span className="text-2xl">⚡</span>
                        Tecnologías
                      </h3>
                      <div className="grid grid-cols-2 gap-3 sm:gap-4">
                        {data.technologies.map((tech, idx) => (
                          <motion.div
                            key={tech.name}
                            className="rounded-xl p-4 sm:p-5 flex items-center gap-3 border"
                            style={{
                              backgroundColor: 'rgba(27, 54, 93, 0.2)',
                              borderColor: 'rgba(146, 130, 80, 0.2)'
                            }}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                          >
                            <span className="text-3xl sm:text-4xl flex-shrink-0">{tech.icon}</span>
                            <span 
                              className="font-medium text-sm sm:text-base"
                              style={{ color: 'var(--white-soft)' }}
                            >
                              {tech.name}
                            </span>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Projects */}
                    <div>
                      <h3 
                        className="text-lg sm:text-xl font-semibold mb-4 flex items-center gap-3"
                        style={{ color: 'var(--gold-light)' }}
                      >
                        <span className="text-2xl">🚀</span>
                        Proyectos
                      </h3>
                      <div className="space-y-3">
                        {data.projects.map((project, idx) => (
                          <motion.div
                            key={project}
                            className="rounded-xl p-4 sm:p-5 border"
                            style={{
                              background: 'linear-gradient(90deg, rgba(212, 175, 55, 0.08) 0%, rgba(27, 54, 93, 0.1) 100%)',
                              borderColor: 'rgba(212, 175, 55, 0.15)'
                            }}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 + idx * 0.1 }}
                          >
                            <p 
                              className="text-sm sm:text-base"
                              style={{ color: 'var(--white-soft)' }}
                            >
                              • {project}
                            </p>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Statistics */}
                    <div>
                      <h3 
                        className="text-lg sm:text-xl font-semibold mb-4 flex items-center gap-3"
                        style={{ color: 'var(--gold-light)' }}
                      >
                        <span className="text-2xl">📊</span>
                        Estadísticas
                      </h3>
                      <div className="grid grid-cols-3 gap-3 sm:gap-4">
                        {Object.entries(data.stats).map(([key, value], idx) => (
                          <motion.div
                            key={key}
                            className="rounded-xl p-4 sm:p-5 text-center border"
                            style={{
                              background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.1) 0%, rgba(27, 54, 93, 0.1) 100%)',
                              borderColor: 'rgba(212, 175, 55, 0.2)'
                            }}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.5 + idx * 0.1 }}
                          >
                            <div 
                              className="text-2xl sm:text-3xl font-bold mb-2"
                              style={{ color: 'var(--gold)' }}
                            >
                              {value}
                            </div>
                            <div 
                              className="text-xs sm:text-sm capitalize leading-tight"
                              style={{ color: 'var(--text-muted)' }}
                            >
                              {key}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                      <button 
                        className="flex-1 font-semibold py-4 px-6 rounded-xl transition-all transform active:scale-95 border text-base sm:text-lg"
                        style={{
                          background: 'linear-gradient(135deg, var(--gold-dark) 0%, var(--gold) 100%)',
                          color: 'var(--navy-dark)',
                          borderColor: 'var(--gold)',
                          boxShadow: '0 4px 20px rgba(212, 175, 55, 0.2)'
                        }}
                      >
                        Contactar
                      </button>
                      <button 
                        className="flex-1 font-semibold py-4 px-6 rounded-xl transition-all transform active:scale-95 border text-base sm:text-lg"
                        style={{
                          background: 'transparent',
                          color: 'var(--gold-light)',
                          borderColor: 'var(--gold-muted)'
                        }}
                      >
                        Ver Más
                      </button>
                    </div>
                  </div>
                </div>
              );
            })()}
          </motion.div>
        )}
      </AnimatePresence>

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
          </kbd> para salir
        </div>
      </div>
    </div>
  );
};

export default NeuralNetworkPro;