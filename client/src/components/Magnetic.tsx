import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface MagneticProps {
  children: React.ReactElement;
  range?: number; // range of magnetic pull
  speed?: number; // animation speed
}

export const Magnetic: React.FC<MagneticProps> = ({ children, range = 50, speed = 0.35 }) => {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const xTo = gsap.quickTo(el, 'x', { duration: speed, ease: 'power3.out' });
    const yTo = gsap.quickTo(el, 'y', { duration: speed, ease: 'power3.out' });

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { left, top, width, height } = el.getBoundingClientRect();
      const centerX = left + width / 2;
      const centerY = top + height / 2;

      const distanceX = clientX - centerX;
      const distanceY = clientY - centerY;
      const distance = Math.hypot(distanceX, distanceY);

      if (distance < range) {
        // Pull element towards mouse
        xTo(distanceX * 0.4);
        yTo(distanceY * 0.4);
      } else {
        // Reset position
        xTo(0);
        yTo(0);
      }
    };

    const handleMouseLeave = () => {
      xTo(0);
      yTo(0);
    };

    window.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [range, speed]);

  // Clone children to inject ref without breaking layout
  return React.cloneElement(children, { ref });
};

export default Magnetic;
