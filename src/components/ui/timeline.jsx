import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';

export default function Timeline({ data }) {
  const ref = useRef(null);
  const containerRef = useRef(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (ref.current) {
      setHeight(ref.current.getBoundingClientRect().height);
    }
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 30%', 'end 60%'],
  });

  const heightT = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityT = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <div ref={containerRef} className="relative">
      <div ref={ref} className="relative">
        {data.map((item, i) => (
          <div key={i} className="flex justify-start pt-10 md:pt-32 md:gap-10">
            <div className="sticky flex flex-col md:flex-row z-20 items-center top-32 self-start max-w-xs lg:max-w-sm md:w-full">
              <div className="h-10 absolute left-3 md:left-3 w-10 rounded-full bg-ink border border-spark/30 flex items-center justify-center">
                <div className="h-3 w-3 rounded-full bg-spark" />
              </div>
              <h3 className="hidden md:block text-3xl md:pl-20 md:text-5xl font-display font-extralight text-paper/30">
                {item.title}
              </h3>
            </div>
            <div className="relative pl-20 pr-4 md:pl-4 w-full">
              <h3 className="md:hidden block text-2xl mb-4 text-left font-display text-paper/40">
                {item.title}
              </h3>
              {item.content}
            </div>
          </div>
        ))}
        <div
          style={{ height: height + 'px' }}
          className="absolute md:left-8 left-8 top-0 overflow-hidden w-[2px] bg-paper/10 [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)]"
        >
          <motion.div
            style={{ height: heightT, opacity: opacityT }}
            className="absolute inset-x-0 top-0 w-[2px] bg-gradient-to-t from-spark via-signal to-transparent rounded-full"
          />
        </div>
      </div>
    </div>
  );
}
