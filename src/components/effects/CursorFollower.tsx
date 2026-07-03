import { useRef, useEffect, useCallback } from "react";

const INTERACTIVE_SELECTOR =
  "a, button, [role='button'], input, textarea, select, [tabindex]";

/**
 * CursorFollower — a dual-layer custom cursor (dot + ring).
 * Renders nothing when prefers-reduced-motion is active or on touch devices.
 * Uses only refs + rAF — zero React re-renders during animation.
 */
export function CursorFollower() {
  const innerRef = useRef<HTMLDivElement>(null);
  const outerRef = useRef<HTMLDivElement>(null);

  // Mutable animation state kept outside React's render cycle
  const state = useRef({
    mouseX: -100,
    mouseY: -100,
    innerX: -100,
    innerY: -100,
    outerX: -100,
    outerY: -100,
    isHovering: false,
    isDown: false,
    currentSize: 36,
    currentOpacity: 0.25,
    targetSize: 36,
    targetOpacity: 0.25,
    rafId: 0,
    visible: false,
    lastMoveTime: 0,
  });

  const animate = useCallback(() => {
    const s = state.current;
    const inner = innerRef.current;
    const outer = outerRef.current;
    if (!inner || !outer) return;

    // Easing factor for outer ring (~80ms lag feel)
    const ease = 0.15;
    const sizeEase = 0.12;

    // Inner dot — snaps instantly
    s.innerX = s.mouseX;
    s.innerY = s.mouseY;

    // Outer ring — smooth spring follow
    s.outerX += (s.mouseX - s.outerX) * ease;
    s.outerY += (s.mouseY - s.outerY) * ease;

    // Smooth size transition
    s.currentSize += (s.targetSize - s.currentSize) * sizeEase;
    s.currentOpacity += (s.targetOpacity - s.currentOpacity) * sizeEase;

    // Down press scale
    const scale = s.isDown ? 0.85 : 1;
    const halfSize = s.currentSize / 2;

    // Apply transforms (using translate for sub-pixel rendering)
    inner.style.transform = `translate3d(${s.innerX - 3}px, ${s.innerY - 3}px, 0)`;
    outer.style.transform = `translate3d(${s.outerX - halfSize}px, ${s.outerY - halfSize}px, 0) scale(${scale})`;

    // Apply dynamic styles
    outer.style.width = `${s.currentSize}px`;
    outer.style.height = `${s.currentSize}px`;
    outer.style.borderColor = `hsl(var(--foreground) / ${s.currentOpacity})`;

    // Visibility fade when mouse hasn't moved
    const now = performance.now();
    const isVisible = now - s.lastMoveTime < 3000;
    if (isVisible !== s.visible) {
      s.visible = isVisible;
      const opacity = isVisible ? "1" : "0";
      inner.style.opacity = opacity;
      outer.style.opacity = opacity;
    }

    s.rafId = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    // Respect prefers-reduced-motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    // Skip on touch-primary devices
    if (window.matchMedia("(pointer: coarse)").matches) {
      return;
    }

    const s = state.current;
    const body = document.body;

    // Activate custom cursor
    body.classList.add("cursor-active");

    const onMouseMove = (e: MouseEvent) => {
      s.mouseX = e.clientX;
      s.mouseY = e.clientY;
      s.lastMoveTime = performance.now();
    };

    const onMouseDown = () => {
      s.isDown = true;
    };

    const onMouseUp = () => {
      s.isDown = false;
    };

    const onMouseLeave = () => {
      s.lastMoveTime = 0; // force hide
    };

    const onMouseEnter = () => {
      s.lastMoveTime = performance.now();
    };

    // Hover detection via event delegation
    const onOverInteractive = () => {
      s.isHovering = true;
      s.targetSize = 48;
      s.targetOpacity = 0.45;
    };

    const onLeaveInteractive = () => {
      s.isHovering = false;
      s.targetSize = 36;
      s.targetOpacity = 0.25;
    };

    // Use event delegation instead of per-element listeners
    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest?.(INTERACTIVE_SELECTOR)) {
        onOverInteractive();
      }
    };

    const onMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest?.(INTERACTIVE_SELECTOR)) {
        onLeaveInteractive();
      }
    };

    document.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("mousedown", onMouseDown, { passive: true });
    document.addEventListener("mouseup", onMouseUp, { passive: true });
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseenter", onMouseEnter);
    document.addEventListener("mouseover", onMouseOver, { passive: true });
    document.addEventListener("mouseout", onMouseOut, { passive: true });

    // Start animation loop
    s.rafId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(s.rafId);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseenter", onMouseEnter);
      document.removeEventListener("mouseover", onMouseOver);
      document.removeEventListener("mouseout", onMouseOut);
      body.classList.remove("cursor-active");
    };
  }, [animate]);

  // Don't render if reduced motion or touch
  if (
    typeof window !== "undefined" &&
    (window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      window.matchMedia("(pointer: coarse)").matches)
  ) {
    return null;
  }

  return (
    <div className="cursor-follower" aria-hidden="true">
      {/* Inner dot — 6px, solid */}
      <div
        ref={innerRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 6,
          height: 6,
          borderRadius: "50%",
          backgroundColor: "hsl(var(--foreground))",
          pointerEvents: "none",
          zIndex: 9999,
          willChange: "transform, opacity",
          transition: "opacity 0.3s ease",
        }}
      />
      {/* Outer ring — 36px, 1.5px border */}
      <div
        ref={outerRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 36,
          height: 36,
          borderRadius: "50%",
          border: "1.5px solid hsl(var(--foreground) / 0.25)",
          backgroundColor: "transparent",
          pointerEvents: "none",
          zIndex: 9999,
          willChange: "transform, width, height, border-color, opacity",
          transition: "opacity 0.3s ease",
        }}
      />
    </div>
  );
}

export default CursorFollower;