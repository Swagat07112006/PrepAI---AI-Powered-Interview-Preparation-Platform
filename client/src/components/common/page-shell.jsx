import { motion } from 'framer-motion';

export function PageShell({ children, className = '' }) {
  return (
    <motion.main
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className={`mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 ${className}`}
    >
      {children}
    </motion.main>
  );
}