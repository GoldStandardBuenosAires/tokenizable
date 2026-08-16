import { useInView, useMotionValue, useSpring } from 'motion/react';
import { useEffect, useRef, useCallback } from 'react';

export default function CountUp({
  to,
  from = 0,
  delay = 0,
  duration = 2,
  className = '',
  separator = '',
}) {
  const ref = useRef(null);
  const mv = useMotionValue(from);
  const damping = 20 + 40 * (1 / duration);
  const stiffness = 100 * (1 / duration);
  const spring = useSpring(mv, { damping, stiffness });
  const inView = useInView(ref, { once: true, margin: '0px' });

  const format = useCallback((latest) => {
    const opts = {
      useGrouping: !!separator,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    };
    const fmt = Intl.NumberFormat('en-US', opts).format(latest);
    return separator ? fmt.replace(/,/g, separator) : fmt;
  }, [separator]);

  useEffect(() => {
    if (ref.current) ref.current.textContent = format(from);
  }, [from, format]);

  useEffect(() => {
    if (inView) {
      const t = setTimeout(() => mv.set(to), delay * 1000);
      return () => clearTimeout(t);
    }
  }, [inView, mv, to, delay]);

  useEffect(() => {
    const unsub = spring.on('change', (v) => {
      if (ref.current) ref.current.textContent = format(v);
    });
    return () => unsub();
  }, [spring, format]);

  return <span ref={ref} className={className} />;
}
