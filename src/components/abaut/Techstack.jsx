import { useState, useEffect, useRef } from 'react';
import Matter from 'matter-js';
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';

export default function TechStackRain() {
  const sceneRef = useRef(null);
  const engineRef = useRef(null);
  const renderRef = useRef(null);
  const containerRef = useRef(null);
  const imagesRef = useRef({});

  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const yTitle = useTransform(scrollYProgress, [0, 1], [400, -400]);
  const yCanvas = useTransform(scrollYProgress, [0, 1], [-100, 100]);
  const springTitle = useSpring(yTitle, { stiffness: 50, damping: 20 });
  const springCanvas = useSpring(yCanvas, { stiffness: 50, damping: 20 });

  const technologies = [
    { name: "React",       color: "#61DAFB", logo: "https://cdn.simpleicons.org/react" },
    { name: "Node.js",     color: "#339933", logo: "https://cdn.simpleicons.org/nodedotjs" },
    { name: "Python",      color: "#3776AB", logo: "https://cdn.simpleicons.org/python" },
    { name: "TypeScript",  color: "#3178C6", logo: "https://cdn.simpleicons.org/typescript" },
    { name: "PostgreSQL",  color: "#4169E1", logo: "https://cdn.simpleicons.org/postgresql" },
    { name: "MongoDB",     color: "#47A248", logo: "https://cdn.simpleicons.org/mongodb" },
    { name: "AWS",         color: "#FF9900", logo: "https://cdn.simpleicons.org/amazonaws" },
    { name: "Docker",      color: "#2496ED", logo: "https://cdn.simpleicons.org/docker" },
    { name: "Next.js",     color: "#ffffff", logo: "https://cdn.simpleicons.org/nextdotjs/ffffff" },
    { name: "Firebase",    color: "#FFCA28", logo: "https://cdn.simpleicons.org/firebase" },
    { name: "Figma",       color: "#F24E1E", logo: "https://cdn.simpleicons.org/figma" },
    { name: "Tailwind",    color: "#06B6D4", logo: "https://cdn.simpleicons.org/tailwindcss" },
    { name: "PHP",         color: "#777BB4", logo: "https://cdn.simpleicons.org/php" },
    { name: "Django",      color: "#092E20", logo: "https://cdn.simpleicons.org/django/ffffff" },
    { name: "FastAPI",     color: "#009688", logo: "https://cdn.simpleicons.org/fastapi" },
    { name: "Supabase",    color: "#3ECF8E", logo: "https://cdn.simpleicons.org/supabase" },
    { name: "Astro",       color: "#FF5D01", logo: "https://cdn.simpleicons.org/astro" },
    { name: "JavaScript",  color: "#F7DF1E", logo: "https://cdn.simpleicons.org/javascript" },
    { name: "HTML",        color: "#E34F26", logo: "https://cdn.simpleicons.org/html5" },
    { name: "CSS",         color: "#1572B6", logo: "https://cdn.simpleicons.org/css3" },
    { name: "Flutter",     color: "#02569B", logo: "https://cdn.simpleicons.org/flutter" },
    { name: "Swift",       color: "#F05138", logo: "https://cdn.simpleicons.org/swift" },
    { name: "Kotlin",      color: "#7F52FF", logo: "https://cdn.simpleicons.org/kotlin" },
    { name: "GraphQL",     color: "#E10098", logo: "https://cdn.simpleicons.org/graphql" },
    { name: "Redis",       color: "#DC382D", logo: "https://cdn.simpleicons.org/redis" },
    { name: "Prisma",      color: "#ffffff", logo: "https://cdn.simpleicons.org/prisma/ffffff" },
    { name: "Vite",        color: "#646CFF", logo: "https://cdn.simpleicons.org/vite" },
    { name: "Git",         color: "#F05032", logo: "https://cdn.simpleicons.org/git" },
    { name: "GitHub",      color: "#ffffff", logo: "https://cdn.simpleicons.org/github/ffffff" },
    { name: "Vercel",      color: "#ffffff", logo: "https://cdn.simpleicons.org/vercel/ffffff" },
  ];

  // 1. PRECARGA — solo registra cuando la imagen ya cargó
  useEffect(() => {
    technologies.forEach(({ name, logo }) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => { imagesRef.current[name] = img; };
      img.src = logo;
    });
  }, []);

  // 2. MATTER.JS
  useEffect(() => {
    if (!isInView || !sceneRef.current) return;

    const { Engine, Render, World, Bodies, Runner, Mouse, MouseConstraint, Events } = Matter;
    const engine = Engine.create({ gravity: { x: 0, y: 1.2 } });
    engineRef.current = engine;

    const width  = sceneRef.current.clientWidth;
    const height = sceneRef.current.clientHeight;

    const render = Render.create({
      element: sceneRef.current,
      engine,
      options: { width, height, wireframes: false, background: 'transparent' },
    });
    renderRef.current = render;

    // Paredes
    const wallOpts = { isStatic: true, render: { fillStyle: 'transparent' } };
    World.add(engine.world, [
      Bodies.rectangle(width / 2, height + 25, width, 50, wallOpts),
      Bodies.rectangle(-25,        height / 2,  50, height, wallOpts),
      Bodies.rectangle(width + 25, height / 2,  50, height, wallOpts),
    ]);

    // Mouse — con fix de scroll
    const mouse = Mouse.create(render.canvas);
    const mc = MouseConstraint.create(engine, {
      mouse,
      constraint: { stiffness: 0.2, render: { visible: false } },
    });

    // 👇 Remover TODOS los listeners que bloquean el scroll
    mc.mouse.element.removeEventListener('mousewheel',     mc.mouse.mousewheel);
    mc.mouse.element.removeEventListener('DOMMouseScroll', mc.mouse.mousewheel);
    mc.mouse.element.removeEventListener('touchstart',     mc.mouse.mousestart);
    mc.mouse.element.removeEventListener('touchmove',      mc.mouse.mousemove);
    mc.mouse.element.removeEventListener('touchend',       mc.mouse.mouseup);

    // 👇 Re-agregar touch como passive para que el scroll funcione
    render.canvas.addEventListener('touchmove', (e) => {
      e.stopPropagation();
    }, { passive: true });

    World.add(engine.world, mc);

    // Pool de cuerpos
    const ACTIVE_COUNT = 16;
    const activeBodies = [];
    let techIndex = 0;

    const getNextTech = () => {
      const t = technologies[techIndex % technologies.length];
      techIndex++;
      return t;
    };

    const spawnBody = (tech) => {
      const x = Math.random() * (width - 100) + 50;
      const body = Bodies.circle(x, -60, 28, {
        restitution: 0.3,
        friction: 0.05,
        frictionAir: 0.01,
        label: JSON.stringify({ name: tech.name, color: tech.color }),
        render: { fillStyle: 'transparent', strokeStyle: 'transparent', lineWidth: 0, opacity: 0 },
      });
      World.add(engine.world, body);
      return body;
    };

    // Spawn escalonado
    for (let i = 0; i < ACTIVE_COUNT; i++) {
      setTimeout(() => {
        activeBodies.push(spawnBody(getNextTech()));
      }, i * 200);
    }

    // Reciclado infinito
    const recycleInterval = setInterval(() => {
      activeBodies.forEach((body, idx) => {
        if (body.position.y > height + 80) {
          World.remove(engine.world, body);
          activeBodies[idx] = spawnBody(getNextTech());
        }
      });
    }, 200);

    // Dibujo en afterRender
    const SIZE = 52;
    Events.on(render, 'afterRender', () => {
      const ctx = render.context;
      if (!ctx) return;

      engine.world.bodies.forEach(body => {
        if (!body.label || body.isStatic) return;
        try {
          const { name, color } = JSON.parse(body.label);
          const img = imagesRef.current[name];
          if (!img || !img.complete || img.naturalWidth === 0) return;

          const { x, y } = body.position;
          ctx.save();
          ctx.translate(x, y);
          ctx.rotate(body.angle);

          ctx.shadowColor = color;
          ctx.shadowBlur  = 14;

          ctx.beginPath();
          ctx.arc(0, 0, SIZE / 2 + 5, 0, Math.PI * 2);
          ctx.fillStyle   = color + '20';
          ctx.fill();
          ctx.strokeStyle = color + 'bb';
          ctx.lineWidth   = 1.5;
          ctx.stroke();

          ctx.shadowBlur = 0;
          ctx.drawImage(img, -SIZE / 2, -SIZE / 2, SIZE, SIZE);
          ctx.restore();
        } catch (e) {}
      });
    });

    const runner = Runner.create();
    Render.run(render);
    Runner.run(runner, engine);

    return () => {
      clearInterval(recycleInterval);
      Events.off(render, 'afterRender');
      Runner.stop(runner);
      Render.stop(render);
      World.clear(engine.world, false);
      Engine.clear(engine);
      if (render.canvas) render.canvas.remove();
    };
  }, [isInView]);

  return (
    <section className="ultra-parallax-section" ref={containerRef}>

      <motion.div style={{ y: springTitle }} className="ultra-header">
        <h2 className="ultra-title">
          Nuestro <span className="ultra-gold">Stack Tecnológico</span>
        </h2>
      </motion.div>

      <motion.div style={{ y: springCanvas }} className="ultra-canvas-wrapper">
        <div ref={sceneRef} className="ultra-canvas" />
      </motion.div>

      <style>{`
        .ultra-parallax-section {
          width: 100%;
          min-height: 160vh;
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
          position: absolute;
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
        /* 👇 Fix scroll — el canvas no bloquea eventos del navegador */
        .ultra-canvas canvas {
          touch-action: pan-y !important;
          pointer-events: auto;
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