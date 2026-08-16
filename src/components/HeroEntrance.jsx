import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import anime from 'animejs';

export default function HeroEntrance({ onComplete }) {
  const [show, setShow] = useState(true);
  const svgRef = useRef(null);

  useEffect(() => {
    const isReload = performance.getEntriesByType('navigation')[0]?.type === 'reload';
    const played = sessionStorage.getItem('entrancePlayed');
    if (!isReload && played) {
      setShow(false);
      onComplete && onComplete();
      return;
    }

    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    // Animate hexagons
    if (svgRef.current) {
      const hexes = svgRef.current.querySelectorAll('.hex');
      anime({
        targets: hexes,
        translateX: (el) => 0,
        translateY: (el) => 0,
        scale: [
          { value: 0, duration: 0 },
          { value: 1, duration: 800 },
        ],
        opacity: [
          { value: 0, duration: 0 },
          { value: 1, duration: 600 },
        ],
        rotate: [
          { value: 180, duration: 0 },
          { value: 0, duration: 1000 },
        ],
        delay: anime.stagger(40, { from: 'center' }),
        easing: 'cubicBezier(0.65,0,0.35,1)',
      });

      const lines = svgRef.current.querySelectorAll('.line');
      anime({
        targets: lines,
        strokeDashoffset: [anime.setDashoffset, 0],
        delay: 1200,
        duration: 1000,
        easing: 'cubicBezier(0.65,0,0.35,1)',
      });
    }

    const t = setTimeout(() => {
      sessionStorage.setItem('entrancePlayed', 'true');
      setShow(false);
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      onComplete && onComplete();
    }, 4400);

    return () => {
      clearTimeout(t);
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [onComplete]);

  // Hex grid positions
  const hexes = [];
  const rows = 5, cols = 7;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = c * 80 + (r % 2) * 40 + 100;
      const y = r * 70 + 100;
      hexes.push({ x, y, key: `${r}-${c}` });
    }
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          id="hero-entrance"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: '-100%' }}
          transition={{ duration: 1.0, ease: [0.65, 0, 0.35, 1] }}
          className="fixed inset-0 z-[200] bg-ink flex items-center justify-center overflow-hidden"
        >
          <svg
            ref={svgRef}
            viewBox="0 0 800 500"
            className="w-full h-full max-w-[1200px] max-h-[800px]"
            preserveAspectRatio="xMidYMid meet"
          >
            {hexes.map((h, i) => (
              <polygon
                key={h.key}
                className="hex"
                points={`${h.x},${h.y - 12} ${h.x + 10},${h.y - 6} ${h.x + 10},${h.y + 6} ${h.x},${h.y + 12} ${h.x - 10},${h.y + 6} ${h.x - 10},${h.y - 6}`}
                fill={i % 7 === 3 ? '#FF5C28' : i % 4 === 0 ? '#6B7FFF' : '#F5F1E8'}
                opacity={i % 3 === 0 ? 0.9 : 0.4}
                style={{ transformOrigin: `${h.x}px ${h.y}px` }}
              />
            ))}
            {/* Connecting lines */}
            {hexes.slice(0, 25).map((h, i) => {
              const next = hexes[i + 1];
              if (!next) return null;
              return (
                <line
                  key={`l-${i}`}
                  className="line"
                  x1={h.x} y1={h.y} x2={next.x} y2={next.y}
                  stroke="#FF5C28" strokeWidth="0.5" opacity="0.4"
                />
              );
            })}
          </svg>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.5, duration: 0.6 }}
            className="absolute bottom-12 left-1/2 -translate-x-1/2 text-lg font-mono uppercase tracking-[0.3em] text-paper/40"
          >
            community / chain / consensus
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
