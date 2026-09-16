import { motion } from 'framer-motion';

const directions = {
  up: { y: 24, x: 0 },
  down: { y: -24, x: 0 },
  left: { x: 28, y: 0 },
  right: { x: -28, y: 0 },
  none: { x: 0, y: 0 },
};

/** Scroll-triggered entrance. Respects prefers-reduced-motion via framer-motion. */
export default function Reveal({ children, delay = 0, direction = 'up', className, as = 'div', once = true, amount = 0.25 }) {
  const MotionTag = motion[as] || motion.div;
  const offset = directions[direction] || directions.up;

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, ...offset }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once, amount }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </MotionTag>
  );
}
