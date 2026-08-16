import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export default function LogoLoop({
  logos,
  speed = 60,
  direction = 'left',
  logoHeight = 32,
  gap = 48,
  fadeOut = true,
  className = '',
}) {
  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const seqRef = useRef(null);
  const [seqWidth, setSeqWidth] = useState(0);
  const [copies, setCopies] = useState(2);
  const rafRef = useRef(null);
  const offsetRef = useRef(0);
  const lastTs = useRef(null);
  const dir = direction === 'left' ? 1 : -1;

  const update = useCallback(() => {
    const cw = containerRef.current?.clientWidth ?? 0;
    const sw = seqRef.current?.getBoundingClientRect?.().width ?? 0;
    if (sw > 0) {
      setSeqWidth(Math.ceil(sw));
      setCopies(Math.max(2, Math.ceil(cw / sw) + 2));
    }
  }, []);

  useEffect(() => {
    update();
    const ro = new ResizeObserver(update);
    if (containerRef.current) ro.observe(containerRef.current);
    if (seqRef.current) ro.observe(seqRef.current);
    return () => ro.disconnect();
  }, [update, logos]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || seqWidth === 0) return;
    const animate = (ts) => {
      if (lastTs.current === null) lastTs.current = ts;
      const dt = (ts - lastTs.current) / 1000;
      lastTs.current = ts;
      let next = offsetRef.current + dir * speed * dt;
      next = ((next % seqWidth) + seqWidth) % seqWidth;
      offsetRef.current = next;
      track.style.transform = `translate3d(${-next}px,0,0)`;
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(rafRef.current);
      lastTs.current = null;
    };
  }, [speed, seqWidth, dir]);

  const lists = useMemo(() => {
    return Array.from({ length: copies }, (_, ci) => (
      <ul key={ci} className="flex items-center" ref={ci === 0 ? seqRef : null}>
        {logos.map((logo, i) => (
          <li key={`${ci}-${i}`} className="flex-none flex items-center" style={{ marginRight: gap, height: logoHeight }}>
            {logo.node || (
              <img src={logo.src} alt={logo.alt || ''} style={{ height: logoHeight }} className="object-contain" />
            )}
          </li>
        ))}
      </ul>
    ));
  }, [copies, logos, gap, logoHeight]);

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
      {fadeOut && (
        <>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-32 z-10 bg-gradient-to-r from-ink to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-32 z-10 bg-gradient-to-l from-ink to-transparent" />
        </>
      )}
      <div ref={trackRef} className="flex will-change-transform">
        {lists}
      </div>
    </div>
  );
}
