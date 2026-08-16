import React, { useState, useEffect, useRef } from 'react';

export default function Magnet({
  children,
  padding = 80,
  disabled = false,
  magnetStrength = 3,
  className = '',
  innerClassName = '',
  ...props
}) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [active, setActive] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (disabled) return;
    const move = (e) => {
      if (!ref.current) return;
      const { left, top, width, height } = ref.current.getBoundingClientRect();
      const cx = left + width / 2;
      const cy = top + height / 2;
      const dx = Math.abs(cx - e.clientX);
      const dy = Math.abs(cy - e.clientY);
      if (dx < width / 2 + padding && dy < height / 2 + padding) {
        setActive(true);
        setPos({ x: (e.clientX - cx) / magnetStrength, y: (e.clientY - cy) / magnetStrength });
      } else {
        setActive(false);
        setPos({ x: 0, y: 0 });
      }
    };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, [padding, disabled, magnetStrength]);

  return (
    <div ref={ref} className={`relative inline-block ${className}`} {...props}>
      <div
        className={innerClassName}
        style={{
          transform: `translate3d(${pos.x}px, ${pos.y}px, 0)`,
          transition: active ? 'transform 0.25s cubic-bezier(0.65,0,0.35,1)' : 'transform 0.5s cubic-bezier(0.65,0,0.35,1)',
          willChange: 'transform',
        }}
      >
        {children}
      </div>
    </div>
  );
}
