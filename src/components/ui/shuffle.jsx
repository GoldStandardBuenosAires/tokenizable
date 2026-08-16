import React, { useEffect, useRef, useState } from 'react';

const CHARSET = '!@#$%^&*<>{}[]/\\|ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

export default function Shuffle({
  text,
  className = '',
  duration = 800,
  trigger = 'view',
  tag: Tag = 'span',
}) {
  const ref = useRef(null);
  const [display, setDisplay] = useState(text);
  const playedRef = useRef(false);

  const play = () => {
    if (playedRef.current) return;
    playedRef.current = true;
    const chars = text.split('');
    const startTime = performance.now();

    const frame = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const revealCount = Math.floor(chars.length * progress);
      const out = chars.map((c, i) => {
        if (i < revealCount) return c;
        if (c === ' ') return ' ';
        return CHARSET[Math.floor(Math.random() * CHARSET.length)];
      }).join('');
      setDisplay(out);
      if (progress < 1) requestAnimationFrame(frame);
      else setDisplay(text);
    };
    requestAnimationFrame(frame);
  };

  useEffect(() => {
    if (trigger === 'mount') {
      play();
      return;
    }
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) play(); });
    }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [text, trigger]);

  return <Tag ref={ref} className={`font-mono ${className}`}>{display}</Tag>;
}
