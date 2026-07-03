import { useRef, useEffect } from 'react';
import * as THREE from 'three';

/**
 * HeroScene — minimalist Three.js background.
 * Floating document-like planes connected by thin lines,
 * subtle mouse parallax. Monochrome. Performance-first.
 */
export function HeroScene() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Respect reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const container = containerRef.current;
    if (!container) return;

    // ── Setup ──
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
    camera.position.z = 8;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // ── Sizing ──
    const setSize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    setSize();
    window.addEventListener('resize', setSize);

    // ── Colors ──
    const isDark = () => document.documentElement.classList.contains('dark');
    const fgColor = () => isDark() ? 0xe0e0e0 : 0x1a1a1a;
    const lineColor = () => isDark() ? 0x404040 : 0xd0d0d0;

    // ── Document planes ──
    interface Doc {
      mesh: THREE.Mesh;
      vel: THREE.Vector3;
      rotVel: THREE.Vector3;
      baseY: number;
    }

    const docs: Doc[] = [];
    const DOC_COUNT = window.innerWidth < 640 ? 6 : 10;

    const docGeom = new THREE.PlaneGeometry(0.6, 0.8, 1, 1);
    const docMat = new THREE.MeshBasicMaterial({
      color: fgColor(),
      transparent: true,
      opacity: 0.08,
      side: THREE.DoubleSide,
    });

    for (let i = 0; i < DOC_COUNT; i++) {
      const mesh = new THREE.Mesh(docGeom, docMat.clone());
      mesh.position.set(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 4 - 1
      );
      mesh.rotation.set(
        Math.random() * 0.6 - 0.3,
        Math.random() * 0.6 - 0.3,
        Math.random() * 0.4 - 0.2
      );
      scene.add(mesh);
      docs.push({
        mesh,
        vel: new THREE.Vector3(
          (Math.random() - 0.5) * 0.003,
          (Math.random() - 0.5) * 0.002,
          0
        ),
        rotVel: new THREE.Vector3(
          (Math.random() - 0.5) * 0.002,
          (Math.random() - 0.5) * 0.002,
          (Math.random() - 0.5) * 0.001
        ),
        baseY: mesh.position.y,
      });
    }

    // ── Connection lines ──
    const maxLines = DOC_COUNT * 3;
    const linePositions = new Float32Array(maxLines * 6);
    const lineGeom = new THREE.BufferGeometry();
    lineGeom.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    lineGeom.setDrawRange(0, 0);
    const lineMat = new THREE.LineBasicMaterial({
      color: lineColor(),
      transparent: true,
      opacity: 0.12,
    });
    const linesMesh = new THREE.LineSegments(lineGeom, lineMat);
    scene.add(linesMesh);

    const CONNECTION_DIST = 4.5;

    const updateLines = () => {
      let lineIdx = 0;
      for (let i = 0; i < docs.length && lineIdx < maxLines; i++) {
        for (let j = i + 1; j < docs.length && lineIdx < maxLines; j++) {
          const d = docs[i].mesh.position.distanceTo(docs[j].mesh.position);
          if (d < CONNECTION_DIST) {
            const offset = lineIdx * 6;
            const pi = docs[i].mesh.position;
            const pj = docs[j].mesh.position;
            linePositions[offset] = pi.x;
            linePositions[offset + 1] = pi.y;
            linePositions[offset + 2] = pi.z;
            linePositions[offset + 3] = pj.x;
            linePositions[offset + 4] = pj.y;
            linePositions[offset + 5] = pj.z;
            lineIdx++;
          }
        }
      }
      lineGeom.setDrawRange(0, lineIdx * 2);
      lineGeom.attributes.position.needsUpdate = true;
    };

    // ── Small accent particles ──
    const PARTICLE_COUNT = window.innerWidth < 640 ? 30 : 60;
    const particleGeom = new THREE.BufferGeometry();
    const pPositions = new Float32Array(PARTICLE_COUNT * 3);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      pPositions[i * 3] = (Math.random() - 0.5) * 12;
      pPositions[i * 3 + 1] = (Math.random() - 0.5) * 8;
      pPositions[i * 3 + 2] = (Math.random() - 0.5) * 4 - 1;
    }
    particleGeom.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: fgColor(),
      size: 0.03,
      transparent: true,
      opacity: 0.35,
      sizeAttenuation: true,
    });
    const particles = new THREE.Points(particleGeom, particleMat);
    scene.add(particles);

    // ── Mouse parallax ──
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const onMouseMove = (e: MouseEvent) => {
      targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    // ── Animation ──
    let rafId = 0;
    const clock = new THREE.Clock();

    const animate = () => {
      rafId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Smooth mouse follow
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      // Camera parallax
      camera.position.x = mouseX * 0.5;
      camera.position.y = -mouseY * 0.3;
      camera.lookAt(0, 0, 0);

      // Update docs
      for (const doc of docs) {
        doc.mesh.position.x += doc.vel.x;
        doc.mesh.position.y = doc.baseY + Math.sin(t * 0.5 + doc.baseY) * 0.3;
        doc.mesh.rotation.x += doc.rotVel.x;
        doc.mesh.rotation.y += doc.rotVel.y;
        doc.mesh.rotation.z += doc.rotVel.z;

        // Wrap horizontally
        if (doc.mesh.position.x > 6) doc.mesh.position.x = -6;
        if (doc.mesh.position.x < -6) doc.mesh.position.x = 6;
      }

      // Update connections
      updateLines();

      // Update colors on theme change
      const currentFg = fgColor();
      const currentLine = lineColor();
      for (const doc of docs) {
        (doc.mesh.material as THREE.MeshBasicMaterial).color.setHex(currentFg);
      }
      lineMat.color.setHex(currentLine);
      particleMat.color.setHex(currentFg);

      // Rotate particles slowly
      particles.rotation.y = t * 0.02;
      particles.rotation.x = Math.sin(t * 0.01) * 0.1;

      renderer.render(scene, camera);
    };

    rafId = requestAnimationFrame(animate);

    // ── Cleanup ──
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', setSize);
      window.removeEventListener('mousemove', onMouseMove);
      renderer.dispose();
      docGeom.dispose();
      docMat.dispose();
      lineGeom.dispose();
      lineMat.dispose();
      particleGeom.dispose();
      particleMat.dispose();
      container.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full"
      aria-hidden="true"
    />
  );
}