'use client';

import { motion } from 'framer-motion';
import '@/app/AuthStyles.css'; 
import Link from 'next/link';

const containerVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
};

export default function AuthLayout({ children }) {
  return (
    <div className="auth-container"> 
      
      {/* --- NEW GLOBAL HEADER --- */}
      <header className="auth-global-header">
        <Link href="/" className="auth-logo-link">
          GeoLearn
        </Link>
        <nav className="auth-nav-links">
          <Link href="/login">Login</Link>
          <Link href="/register">Join</Link>
        </nav>
      </header>
      {/* --- END GLOBAL HEADER --- */}

      <motion.div
        className="auth-card-wrapper"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {children}
      </motion.div>
    </div>
  );
}