import React, { useRef, useLayoutEffect, useState } from 'react';
import { motion, useScroll, useSpring, useTransform, useMotionValue, useVelocity, useAnimationFrame } from 'motion/react';

function useElementWidth(ref) {
  const [w, setW] = useState(0);
  useLayoutEffect(() => {
    const upd = () => { if (ref.current) setW(ref.current.offsetWidth); };
    upd();
    window.addEventListener('resize', upd);
    return () => window.removeEventListener('resize', upd);
  }, [ref]);
  return w;
}

function VelocityText({ children, baseVelocity, className, numCopies = 4 }) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], { clamp: false });
  const copyRef = useRef(null);
  const copyWidth = useElementWidth(copyRef);
  const wrap = (min, max, v) => {
    const r = max - min;
    return (((v - min) % r) + r) % r + min;
  };
  const x = useTransform(baseX, (v) => copyWidth === 0 ? '0px' : `${wrap(-copyWidth, 0, v)}px`);
  const dir = useRef(1);

  useAnimationFrame((t, delta) => {
    let moveBy = dir.current * baseVelocity * (delta / 1000);
    if (velocityFactor.get() < 0) dir.current = -1;
    else if (velocityFactor.get() > 0) dir.current = 1;
    moveBy += dir.current * moveBy * velocityFactor.get();
    baseX.set(baseX.get() + moveBy);
  });

  const spans = [];
  for (let i = 0; i < numCopies; i++) {
    spans.push(
      <span key={i} className={`flex-shrink-0 ${className}`} ref={i === 0 ? copyRef : null}>
        {children}
      </span>
    );
  }

  return (
    <div className="relative overflow-hidden">
      <motion.div className="flex whitespace-nowrap" style={{ x }}>
        {spans}
      </motion.div>
    </div>
  );
}

export default function ScrollVelocity({ texts = [], velocity = 50, className = '' }) {
  return (
    <section>
      {texts.map((text, i) => (
        <VelocityText key={i} baseVelocity={i % 2 ? -velocity : velocity} className={className}>
          {text}&nbsp;
        </VelocityText>
      ))}
    </section>
  );
}
