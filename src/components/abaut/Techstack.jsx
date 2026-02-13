import { useState, useEffect, useRef } from 'react';
import Matter from 'matter-js';
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';

export default function TechStackRain() {
  const sceneRef = useRef(null);
  const engineRef = useRef(null);
  const renderRef = useRef(null);
  const containerRef = useRef(null);
  
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });
  const [isReady, setIsReady] = useState(false);

  // --- PARALLAX ULTRA AGRESIVO ---
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // El título se desplaza 400px hacia arriba y 400px hacia abajo (Rango total 800px)
  const yTitle = useTransform(scrollYProgress, [0, 1], [400, -400]);
  // El canvas se mueve en sentido contrario o más lento para máximo contraste
  const yCanvas = useTransform(scrollYProgress, [0, 1], [-100, 100]);

  const springTitle = useSpring(yTitle, { stiffness: 50, damping: 20 });
  const springCanvas = useSpring(yCanvas, { stiffness: 50, damping: 20 });

  const technologies = [
    { name: "React", color: "#61DAFB", logo: "⚛️" },
    { name: "Node.js", color: "#339933", logo: "🟢" },
    { name: "Python", color: "#3776AB", logo: "🐍" },
    { name: "TypeScript", color: "#3178C6", logo: "TS" },
    { name: "PostgreSQL", color: "#4169E1", logo: "🐘" },
    { name: "MongoDB", color: "#47A248", logo: "🍃" },
    { name: "AWS", color: "#FF9900", logo: "☁️" },
    { name: "Docker", color: "#2496ED", logo: "🐳" },
    { name: "Next.js", color: "#ffffff", logo: "▲" },
    { name: "Firebase", color: "#FFCA28", logo: "🔥" },
    { name: "Figma", color: "#F24E1E", logo: "🎨" },
    { name: "Tailwind", color: "#06B6D4", logo: "🌊" },
  ];

  useEffect(() => {
    if (!isInView || !sceneRef.current) return;

    const { Engine, Render, World, Bodies, Runner, Mouse, MouseConstraint } = Matter;
    const engine = Engine.create({ gravity: { x: 0, y: 0.8 } });
    engineRef.current = engine;

    const width = sceneRef.current.clientWidth;
    const height = sceneRef.current.clientHeight;

    const render = Render.create({
      element: sceneRef.current,
      engine: engine,
      options: { 
        width, 
        height, 
        wireframes: false, 
        background: 'transparent' 
      },
    });
    renderRef.current = render;

    const wallOptions = { isStatic: true, render: { fillStyle: 'transparent' } };
    World.add(engine.world, [
      Bodies.rectangle(width / 2, height + 25, width, 50, wallOptions),
      Bodies.rectangle(-25, height / 2, 50, height, wallOptions),
      Bodies.rectangle(width + 25, height / 2, 50, height, wallOptions)
    ]);

    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse,
      constraint: { stiffness: 0.2, render: { visible: false } }
    });

    mouseConstraint.mouse.element.removeEventListener("mousewheel", mouseConstraint.mouse.mousewheel);
    World.add(engine.world, mouseConstraint);

    let availableTechs = [...technologies];
    const interval = setInterval(() => {
      if (availableTechs.length > 0) {
        const index = Math.floor(Math.random() * availableTechs.length);
        const tech = availableTechs[index];
        availableTechs.splice(index, 1);
        
        const logo = Bodies.circle(Math.random() * (width - 100) + 50, -100, 30, {
          restitution: 0.5,
          friction: 0.1,
          label: JSON.stringify({ logo: tech.logo })
        });
        World.add(engine.world, logo);
      } else {
        clearInterval(interval);
      }
    }, 400);

    Render.run(render);
    Runner.run(Runner.create(), engine);
    setIsReady(true);

    return () => {
      clearInterval(interval);
      Render.stop(render);
      World.clear(engine.world, false);
      Engine.clear(engine);
      if (render.canvas) render.canvas.remove();
    };
  }, [isInView]);

  useEffect(() => {
    if (!isReady) return;
    const context = renderRef.current.context;
    const draw = () => {
      if (!engineRef.current) return;
      engineRef.current.world.bodies.forEach(body => {
        if (body.label && !body.isStatic) {
          try {
            const { logo } = JSON.parse(body.label);
            context.save();
            context.translate(body.position.x, body.position.y);
            context.rotate(body.angle);
            context.font = `35px Arial`;
            context.textAlign = 'center';
            context.fillText(logo, 0, 0);
            context.restore();
          } catch(e) {}
        }
      });
      requestAnimationFrame(draw);
    };
    draw();
  }, [isReady]);

  return (
    <section className="ultra-parallax-section" ref={containerRef}>
      
      {/* Título: Vuela hacia arriba a gran velocidad */}
      <motion.div style={{ y: springTitle }} className="ultra-header">
        <h2 className="ultra-title">
          Nuestro <span className="ultra-gold">Stack Tecnológico</span>
        </h2>
      </motion.div>
      
      {/* Canvas: Se mueve más lento o hacia abajo para el efecto óptico */}
      <motion.div style={{ y: springCanvas }} className="ultra-canvas-wrapper">
        <div ref={sceneRef} className="ultra-canvas" />
      </motion.div>

      <style>{`
        .ultra-parallax-section {
          width: 100%;
          min-height: 160vh; /* Altura aumentada para mayor recorrido de scroll */
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: transparent;
          font-family: 'Outfit', sans-serif;
          position: relative;
        }

        .ultra-header {
          z-index: 20;
          text-align: center;
          pointer-events: none;
          position: absolute; /* Para que el parallax sea más libre */
          top: 30%;
        }

        .ultra-title {
          font-size: clamp(3rem, 8vw, 6rem);
          font-weight: 900;
          color: #ffffff;
          line-height: 0.8;
          margin: 0;
          text-shadow: 0 20px 50px rgba(0,0,0,0.5);
        }

        .ultra-gold {
          background: linear-gradient(135deg, #d4af37 0%, #f4d03f 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          font-weight: 300;
          text-transform: uppercase;
          font-size: 0.3em;
          display: block;
          letter-spacing: 0.8em;
          margin-top: 20px;
        }

        .ultra-canvas-wrapper {
          position: relative;
          width: 100%;
          max-width: 1400px;
          height: 600px;
          background: transparent;
          z-index: 10;
        }

        .ultra-canvas { 
          width: 100%; 
          height: 100%; 
        }

        @media (max-width: 768px) {
          .ultra-parallax-section { min-height: 120vh; }
          .ultra-canvas-wrapper { height: 450px; }
          .ultra-title { font-size: 3.5rem; }
        }
      `}</style>
    </section>
  );
}