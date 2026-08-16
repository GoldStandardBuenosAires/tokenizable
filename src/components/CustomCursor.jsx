import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

export default function CustomCursor() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const ringX = useSpring(cursorX, { stiffness: 200, damping: 25 });
  const ringY = useSpring(cursorY, { stiffness: 200, damping: 25 });
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    const move = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };
    const over = (e) => {
      const target = e.target;
      if (target.closest('a, button, [data-cursor="hover"]')) setHovering(true);
      else setHovering(false);
    };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseover', over);
    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseover', over);
    };
  }, [cursorX, cursorY]);

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 bg-spark rounded-full pointer-events-none z-[100] hidden md:block"
        style={{ x: cursorX, y: cursorY, translateX: '-50%', translateY: '-50%' }}
      />
      <motion.div
        className="fixed top-0 left-0 border border-spark/50 rounded-full pointer-events-none z-[100] hidden md:block"
        style={{
          x: ringX,
          y: ringY,
          translateX: '-50%',
          translateY: '-50%',
          width: hovering ? 60 : 32,
          height: hovering ? 60 : 32,
        }}
        animate={{ width: hovering ? 60 : 32, height: hovering ? 60 : 32 }}
        transition={{ duration: 0.2 }}
      />
    </>
  );
}
