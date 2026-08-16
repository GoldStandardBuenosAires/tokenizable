import React, { useRef } from 'react';
import { motion, useInView } from 'motion/react';

export default function SplitText({
  text,
  className = '',
  tag: Tag = 'p',
  splitBy = 'word',
  stagger = 0.04,
  duration = 0.6,
  delay = 0,
  from = { opacity: 0, y: 30 },
  to = { opacity: 1, y: 0 },
  once = true,
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once, margin: '-80px' });
  const items = splitBy === 'char' ? text.split('') : text.split(' ');

  return (
    <Tag ref={ref} className={`inline-block ${className}`}>
      {items.map((item, i) => (
        <span key={i} className="inline-block overflow-hidden align-baseline">
          <motion.span
            className="inline-block"
            initial={from}
            animate={inView ? to : from}
            transition={{
              duration,
              delay: delay + i * stagger,
              ease: [0.65, 0, 0.35, 1],
            }}
          >
            {item === ' ' ? '\u00A0' : item}
            {splitBy === 'word' && i < items.length - 1 ? '\u00A0' : ''}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
