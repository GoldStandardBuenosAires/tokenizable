import React, { forwardRef, useMemo, useRef, useEffect } from 'react';
import { motion } from 'motion/react';

function useAnimationFrame(cb) {
  useEffect(() => {
    let id;
    const loop = () => { cb(); id = requestAnimationFrame(loop); };
    id = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(id);
  }, [cb]);
}

function useMousePositionRef(containerRef) {
  const pos = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const upd = (x, y) => {
      if (containerRef?.current) {
        const r = containerRef.current.getBoundingClientRect();
        pos.current = { x: x - r.left, y: y - r.top };
      } else pos.current = { x, y };
    };
    const onM = (e) => upd(e.clientX, e.clientY);
    const onT = (e) => { const t = e.touches[0]; upd(t.clientX, t.clientY); };
    window.addEventListener('mousemove', onM);
    window.addEventListener('touchmove', onT);
    return () => {
      window.removeEventListener('mousemove', onM);
      window.removeEventListener('touchmove', onT);
    };
  }, [containerRef]);
  return pos;
}

const VariableProximity = forwardRef(function VariableProximity({
  label,
  fromFontVariationSettings = "'wght' 200, 'wdth' 100",
  toFontVariationSettings = "'wght' 900, 'wdth' 125",
  containerRef,
  radius = 80,
  falloff = 'gaussian',
  className = '',
  style,
}, ref) {
  const letterRefs = useRef([]);
  const interpolated = useRef([]);
  const mouseRef = useMousePositionRef(containerRef);
  const lastPos = useRef({ x: null, y: null });

  const parsed = useMemo(() => {
    const parse = (s) => new Map(
      s.split(',').map(x => x.trim()).map(x => {
        const [n, v] = x.split(' ');
        return [n.replace(/['"]/g, ''), parseFloat(v)];
      })
    );
    const from = parse(fromFontVariationSettings);
    const to = parse(toFontVariationSettings);
    return Array.from(from.entries()).map(([axis, fv]) => ({ axis, fromValue: fv, toValue: to.get(axis) ?? fv }));
  }, [fromFontVariationSettings, toFontVariationSettings]);

  const calcDist = (x1, y1, x2, y2) => Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  const calcFalloff = (d) => {
    const n = Math.min(Math.max(1 - d / radius, 0), 1);
    if (falloff === 'exponential') return n ** 2;
    if (falloff === 'gaussian') return Math.exp(-((d / (radius / 2)) ** 2) / 2);
    return n;
  };

  useAnimationFrame(() => {
    if (!containerRef?.current) return;
    const { x, y } = mouseRef.current;
    if (lastPos.current.x === x && lastPos.current.y === y) return;
    lastPos.current = { x, y };
    const cr = containerRef.current.getBoundingClientRect();
    letterRefs.current.forEach((lr, i) => {
      if (!lr) return;
      const r = lr.getBoundingClientRect();
      const lx = r.left + r.width / 2 - cr.left;
      const ly = r.top + r.height / 2 - cr.top;
      const d = calcDist(mouseRef.current.x, mouseRef.current.y, lx, ly);
      if (d >= radius) { lr.style.fontVariationSettings = fromFontVariationSettings; return; }
      const f = calcFalloff(d);
      const ns = parsed.map(({ axis, fromValue, toValue }) => {
        const iv = fromValue + (toValue - fromValue) * f;
        return `'${axis}' ${iv}`;
      }).join(', ');
      interpolated.current[i] = ns;
      lr.style.fontVariationSettings = ns;
    });
  });

  const words = label.split(' ');
  let li = 0;

  return (
    <span ref={ref} style={{ display: 'inline', fontFamily: '"Roboto Flex", sans-serif', ...style }} className={className}>
      {words.map((w, wi) => (
        <span key={wi} className="inline-block whitespace-nowrap">
          {w.split('').map((letter) => {
            const ci = li++;
            return (
              <motion.span
                key={ci}
                ref={(el) => { letterRefs.current[ci] = el; }}
                style={{ display: 'inline-block', fontVariationSettings: interpolated.current[ci] }}
                aria-hidden="true"
              >
                {letter}
              </motion.span>
            );
          })}
          {wi < words.length - 1 && <span className="inline-block">&nbsp;</span>}
        </span>
      ))}
      <span className="sr-only">{label}</span>
    </span>
  );
});

export default VariableProximity;
