'use client'; 

import { motion } from 'framer-motion';

export default function ClientWrapper({ children }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 0.5 }}
      className="min-h-screen" // REMOVED bg-secondary and text-text-primary
    >
      {children}
    </motion.div>
  );
}