import React, { memo, useCallback, useEffect, useRef } from 'react';
import { animate } from 'motion/react';
import { cn } from '@/lib/utils';

export const GlowingEffect = memo(function GlowingEffect({
  blur = 0,
  inactiveZone = 0.6,
  proximity = 64,
  spread = 30,
  glow = false,
  className,
  movementDuration = 1.5,
  borderWidth = 1,
  disabled = false,
}) {
  const containerRef = useRef(null);
  const lastPos = useRef({ x: 0, y: 0 });
  const rafRef = useRef(0);

  const handleMove = useCallback((e) => {
    if (!containerRef.current) return;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const el = containerRef.current;
      if (!el) return;
      const { left, top, width, height } = el.getBoundingClientRect();
      const mx = e?.x ?? lastPos.current.x;
      const my = e?.y ?? lastPos.current.y;
      if (e) lastPos.current = { x: mx, y: my };
      const cx = left + width * 0.5;
      const cy = top + height * 0.5;
      const dist = Math.hypot(mx - cx, my - cy);
      const inactiveR = 0.5 * Math.min(width, height) * inactiveZone;
      if (dist < inactiveR) { el.style.setProperty('--active', '0'); return; }
      const active = mx > left - proximity && mx < left + width + proximity && my > top - proximity && my < top + height + proximity;
      el.style.setProperty('--active', active ? '1' : '0');
      if (!active) return;
      const currentA = parseFloat(el.style.getPropertyValue('--start')) || 0;
      const targetA = (180 * Math.atan2(my - cy, mx - cx)) / Math.PI + 90;
      const diff = ((targetA - currentA + 180) % 360) - 180;
      animate(currentA, currentA + diff, {
        duration: movementDuration,
        ease: [0.16, 1, 0.3, 1],
        onUpdate: (v) => el.style.setProperty('--start', String(v)),
      });
    });
  }, [inactiveZone, proximity, movementDuration]);

  useEffect(() => {
    if (disabled) return;
    const onScroll = () => handleMove();
    const onPM = (e) => handleMove(e);
    window.addEventListener('scroll', onScroll, { passive: true });
    document.body.addEventListener('pointermove', onPM, { passive: true });
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener('scroll', onScroll);
      document.body.removeEventListener('pointermove', onPM);
    };
  }, [handleMove, disabled]);

  return (
    <div
      ref={containerRef}
      style={{
        '--blur': `${blur}px`,
        '--spread': spread,
        '--start': '0',
        '--active': '0',
        '--bw': `${borderWidth}px`,
        '--gradient': `conic-gradient(from 0deg at 50% 50%, #FF5C28, #6B7FFF, #FF5C28)`,
      }}
      className={cn(
        'pointer-events-none absolute inset-0 opacity-100 transition-opacity',
        glow && 'opacity-100',
        blur > 0 && 'blur-[var(--blur)]',
        className,
      )}
    >
      <div
        className={cn(
          'rounded-[inherit]',
          'after:content-[""] after:rounded-[inherit] after:absolute after:inset-[calc(-1*var(--bw))]',
          'after:[border:var(--bw)_solid_transparent]',
          'after:[background:var(--gradient)] after:[background-attachment:fixed]',
          'after:opacity-[var(--active)] after:transition-opacity after:duration-300',
          'after:[mask-clip:padding-box,border-box]',
          'after:[mask-composite:intersect]',
          'after:[mask-image:linear-gradient(#0000,#0000),conic-gradient(from_calc((var(--start)-var(--spread))*1deg),#00000000_0deg,#fff,#00000000_calc(var(--spread)*2deg))]'
        )}
      />
    </div>
  );
});
