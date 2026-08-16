import React, { useRef, useEffect, useCallback } from 'react';

export default function ClickSpark({
  sparkColor = '#FF5C28',
  sparkSize = 8,
  sparkRadius = 18,
  sparkCount = 8,
  duration = 500,
  children,
}) {
  const canvasRef = useRef(null);
  const sparksRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  const ease = useCallback((t) => t * (2 - t), []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let raf;
    const draw = (ts) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      sparksRef.current = sparksRef.current.filter((s) => {
        const elapsed = ts - s.startTime;
        if (elapsed >= duration) return false;
        const p = elapsed / duration;
        const eased = ease(p);
        const dist = eased * sparkRadius;
        const len = sparkSize * (1 - eased);
        const x1 = s.x + dist * Math.cos(s.angle);
        const y1 = s.y + dist * Math.sin(s.angle);
        const x2 = s.x + (dist + len) * Math.cos(s.angle);
        const y2 = s.y + (dist + len) * Math.sin(s.angle);
        ctx.strokeStyle = sparkColor;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        return true;
      });
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [sparkColor, sparkSize, sparkRadius, duration, ease]);

  useEffect(() => {
    const handler = (e) => {
      const now = performance.now();
      const newSparks = Array.from({ length: sparkCount }, (_, i) => ({
        x: e.clientX,
        y: e.clientY,
        angle: (2 * Math.PI * i) / sparkCount,
        startTime: now,
      }));
      sparksRef.current.push(...newSparks);
    };
    window.addEventListener('click', handler);
    return () => window.removeEventListener('click', handler);
  }, [sparkCount]);

  return (
    <>
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-[90]" />
      {children}
    </>
  );
}
