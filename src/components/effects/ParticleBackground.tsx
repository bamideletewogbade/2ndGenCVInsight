import { useRef, useEffect } from "react";

// --- Constants ---
const PARTICLE_RADIUS = 1.5;
const CONNECTION_DISTANCE = 100;
const CONNECTION_MAX_OPACITY = 0.15;
const MOUSE_REPEL_DISTANCE = 120;
const MOUSE_REPEL_FORCE = 0.4;
const PULSE_INTERVAL = 4000; // ms
const PULSE_MAX_RADIUS = 80;
const PULSE_MAX_OPACITY = 0.08;
const PULSE_DURATION = 2000; // ms

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseVx: number;
  baseVy: number;
}

interface Pulse {
  x: number;
  y: number;
  startTime: number;
  maxRadius: number;
}

export function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Respect prefers-reduced-motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    // --- Sizing ---
    const isMobile = window.innerWidth < 768;
    const PARTICLE_COUNT = isMobile ? 30 : 60;
    let width = window.innerWidth;
    let height = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const setSize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    setSize();

    // --- Particles ---
    const particles: Particle[] = [];

    const createParticle = (): Particle => {
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.15 + Math.random() * 0.25;
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed;
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx,
        vy,
        baseVx: vx,
        baseVy: vy,
      };
    };

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(createParticle());
    }

    // --- Pulse state ---
    const pulses: Pulse[] = [];
    let lastPulseTime = performance.now();

    // --- Mouse state ---
    let mouseX = -1000;
    let mouseY = -1000;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const onMouseLeave = () => {
      mouseX = -1000;
      mouseY = -1000;
    };

    document.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("mouseleave", onMouseLeave);

    // --- Resize handler ---
    const onResize = () => {
      setSize();
    };

    window.addEventListener("resize", onResize);

    // --- Helper: is dark mode? ---
    const isDark = (): boolean =>
      document.documentElement.classList.contains("dark");

    // --- Helper: particle color string ---
    const particleColor = (alpha: number): string => {
      if (isDark()) {
        return `hsla(0, 0%, 30%, ${alpha})`;
      }
      return `hsla(0, 0%, 75%, ${alpha})`;
    };

    // --- Animation ---
    let rafId = 0;

    const animate = (now: number) => {
      rafId = requestAnimationFrame(animate);

      // Skip rendering when tab is hidden
      if (document.hidden) return;

      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      const dark = isDark();
      const pAlpha = dark ? 0.3 : 0.4;

      // --- Update & draw particles ---
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Mouse repulsion
        const dx = p.x - mouseX;
        const dy = p.y - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < MOUSE_REPEL_DISTANCE && dist > 0) {
          const force = ((MOUSE_REPEL_DISTANCE - dist) / MOUSE_REPEL_DISTANCE) * MOUSE_REPEL_FORCE;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        }

        // Dampen velocity back toward base (gentle return)
        p.vx += (p.baseVx - p.vx) * 0.02;
        p.vy += (p.baseVy - p.vy) * 0.02;

        // Clamp velocity
        const maxSpeed = 2;
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (speed > maxSpeed) {
          p.vx = (p.vx / speed) * maxSpeed;
          p.vy = (p.vy / speed) * maxSpeed;
        }

        // Move
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around edges with padding
        const pad = 10;
        if (p.x < -pad) p.x = width + pad;
        if (p.x > width + pad) p.x = -pad;
        if (p.y < -pad) p.y = height + pad;
        if (p.y > height + pad) p.y = -pad;

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, PARTICLE_RADIUS, 0, Math.PI * 2);
        ctx.fillStyle = dark
          ? `hsla(0, 0%, 30%, ${pAlpha})`
          : `hsla(0, 0%, 75%, ${pAlpha})`;
        ctx.fill();
      }

      // --- Draw connection lines ---
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < CONNECTION_DISTANCE) {
            const opacity =
              (1 - dist / CONNECTION_DISTANCE) * CONNECTION_MAX_OPACITY;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = dark
              ? `hsla(0, 0%, 30%, ${opacity})`
              : `hsla(0, 0%, 75%, ${opacity})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // --- Pulse effect ---
      if (now - lastPulseTime > PULSE_INTERVAL) {
        lastPulseTime = now;
        const randomParticle =
          particles[Math.floor(Math.random() * particles.length)];
        pulses.push({
          x: randomParticle.x,
          y: randomParticle.y,
          startTime: now,
          maxRadius: PULSE_MAX_RADIUS,
        });
      }

      // Draw & prune pulses
      for (let i = pulses.length - 1; i >= 0; i--) {
        const pulse = pulses[i];
        const elapsed = now - pulse.startTime;
        const progress = elapsed / PULSE_DURATION;

        if (progress >= 1) {
          pulses.splice(i, 1);
          continue;
        }

        // Ease-out expansion
        const easedProgress = 1 - Math.pow(1 - progress, 3);
        const radius = easedProgress * pulse.maxRadius;
        // Fade in briefly then fade out
        const opacity =
          progress < 0.2
            ? (progress / 0.2) * PULSE_MAX_OPACITY
            : ((1 - progress) / 0.8) * PULSE_MAX_OPACITY;

        ctx.beginPath();
        ctx.arc(pulse.x, pulse.y, radius, 0, Math.PI * 2);
        ctx.strokeStyle = `hsla(0, 0%, 50%, ${opacity})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    };

    rafId = requestAnimationFrame(animate);

    // --- Cleanup ---
    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  // Respect prefers-reduced-motion at render time too
  if (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    return null;
  }

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  );
}

export default ParticleBackground;