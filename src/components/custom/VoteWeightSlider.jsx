import React, { useState } from 'react';
import { motion } from 'motion/react';

export default function VoteWeightSlider() {
  const [tokens, setTokens] = useState(500);
  // Quadratic voting curve — sqrt for diminishing returns
  const power = Math.round(Math.sqrt(tokens) * 10) / 10;
  const linearPower = tokens;

  return (
    <div id="vote-weight-slider" className="bg-ash border border-paper/10 p-8 md:p-12">
      <div className="text-lg font-mono uppercase tracking-widest text-spark mb-3">
        ◆ try the math
      </div>
      <h3 className="text-3xl md:text-4xl font-display font-extralight text-paper mb-3">
        Quadratic voting prevents whale rule
      </h3>
      <p className="text-lg font-editorial text-paper/60 mb-10 max-w-2xl">
        Drag the slider. Token holdings grow linearly. Your actual voting power grows as the square root — so 100x more tokens gives you only 10x more votes.
      </p>

      <div className="mb-2 flex items-baseline justify-between">
        <span className="text-lg font-mono uppercase tracking-wider text-paper/40">your tokens</span>
        <span className="text-2xl md:text-3xl font-display text-paper">{tokens.toLocaleString()} TKN</span>
      </div>
      <input
        type="range"
        min="1"
        max="100000"
        value={tokens}
        onChange={(e) => setTokens(Number(e.target.value))}
        className="w-full appearance-none h-1 bg-paper/10 outline-none cursor-pointer accent-spark"
      />
      <div className="flex justify-between text-lg font-mono text-paper/30 mt-2">
        <span>1</span>
        <span>100,000</span>
      </div>

      <div className="grid grid-cols-2 gap-6 mt-10">
        <motion.div className="border border-paper/10 p-6">
          <div className="text-lg font-mono uppercase tracking-wider text-paper/40 mb-3">
            linear (broken)
          </div>
          <div className="text-3xl md:text-4xl font-display text-paper/40 line-through">
            {linearPower.toLocaleString()}
          </div>
          <div className="text-lg text-paper/40 mt-2">votes</div>
        </motion.div>
        <motion.div
          className="border border-spark p-6 relative"
          animate={{ boxShadow: ['0 0 20px rgba(255,92,40,0.2)', '0 0 40px rgba(255,92,40,0.4)', '0 0 20px rgba(255,92,40,0.2)'] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <div className="text-lg font-mono uppercase tracking-wider text-spark mb-3">
            quadratic (yours)
          </div>
          <div className="text-3xl md:text-4xl font-display text-spark">
            {power.toLocaleString()}
          </div>
          <div className="text-lg text-paper/60 mt-2">votes</div>
        </motion.div>
      </div>
    </div>
  );
}
