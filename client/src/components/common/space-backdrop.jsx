import { motion } from 'framer-motion';

export function SpaceBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.18),transparent_30%),radial-gradient(circle_at_top_right,rgba(59,130,246,0.12),transparent_28%),radial-gradient(circle_at_bottom,rgba(34,197,94,0.08),transparent_32%)]" />
      <div className="absolute inset-0 bg-grid bg-[size:52px_52px] opacity-[0.14]" />
      <motion.div animate={{ x: [0, 24, -18, 0], y: [0, -18, 22, 0] }} transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }} className="absolute -left-24 top-8 h-72 w-72 rounded-full bg-cyan-400/14 blur-3xl" />
      <motion.div animate={{ x: [0, -18, 22, 0], y: [0, 16, -14, 0] }} transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }} className="absolute right-0 top-20 h-96 w-96 rounded-full bg-blue-500/14 blur-3xl" />
      <motion.div animate={{ y: [0, -10, 12, 0] }} transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }} className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-teal-400/10 blur-3xl" />
    </div>
  );
}