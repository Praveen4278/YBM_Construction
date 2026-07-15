import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export const CustomCursor: React.FC = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;

    if (!dot || !ring) return;

    // Set initial position out of screen
    gsap.set(dot, { xPercent: -50, yPercent: -50, x: -100, y: -100 });
    gsap.set(ring, { xPercent: -50, yPercent: -50, x: -100, y: -100 });

    // GSAP quickTo setters for optimal mouse tracking performance
    const xDotTo = gsap.quickTo(dot, 'x', { duration: 0.08, ease: 'power3.out' });
    const yDotTo = gsap.quickTo(dot, 'y', { duration: 0.08, ease: 'power3.out' });

    const xRingTo = gsap.quickTo(ring, 'x', { duration: 0.35, ease: 'power3.out' });
    const yRingTo = gsap.quickTo(ring, 'y', { duration: 0.35, ease: 'power3.out' });

    // Track state to avoid redundant animation calls
    let isHovering = false;

    const onMouseMove = (e: MouseEvent) => {
      xDotTo(e.clientX);
      yDotTo(e.clientY);
      xRingTo(e.clientX);
      yRingTo(e.clientY);
    };

    const addHover = () => {
      if (isHovering) return;
      isHovering = true;
      gsap.to(dot, { scale: 2.2, backgroundColor: '#ffffff', mixBlendMode: 'difference', duration: 0.25 });
      gsap.to(ring, { scale: 1.4, borderColor: '#ffffff', backgroundColor: 'rgba(255, 255, 255, 0.1)', duration: 0.25 });
    };

    const removeHover = () => {
      if (!isHovering) return;
      isHovering = false;
      gsap.to(dot, { scale: 1, backgroundColor: '#d4a853', mixBlendMode: 'difference', duration: 0.25 });
      gsap.to(ring, { scale: 1, borderColor: '#d4a853', backgroundColor: 'transparent', duration: 0.25 });
    };

    // Event Delegation: single mouseover/mouseout listeners on window
    // This completely removes the need for MutationObserver or querySelectorAll loops
    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;
      
      const isInteractive = target.closest('a, button, input, textarea, select, [role="button"], .project-card, .interactive-3d-target, [onClick]');
      if (isInteractive) {
        addHover();
      }
    };

    const onMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;
      
      const isInteractive = target.closest('a, button, input, textarea, select, [role="button"], .project-card, .interactive-3d-target, [onClick]');
      if (isInteractive) {
        const relatedTarget = e.relatedTarget as HTMLElement;
        if (relatedTarget && relatedTarget.closest('a, button, input, textarea, select, [role="button"], .project-card, .interactive-3d-target, [onClick]')) {
          return;
        }
        removeHover();
      }
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mouseover', onMouseOver, { passive: true });
    window.addEventListener('mouseout', onMouseOut, { passive: true });

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseover', onMouseOver);
      window.removeEventListener('mouseout', onMouseOut);
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-2.5 h-2.5 bg-primary rounded-full pointer-events-none z-[9999] mix-blend-difference"
        style={{ transform: 'translate(-50%, -50%)' }}
      />
      <div
        ref={ringRef}
        className="fixed top-0 left-0 w-8 h-8 border border-primary rounded-full pointer-events-none z-[9998]"
        style={{ transform: 'translate(-50%, -50%)' }}
      />
    </>
  );
};

export default CustomCursor;
