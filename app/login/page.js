'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AuthLayout from '@/components/AuthLayout';
import axios from 'axios';
import { motion } from 'framer-motion';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'; 

async function handleLogin(email, password) {
  try {
    const formData = new FormData();
    formData.append('username', email);
    formData.append('password', password);

    const response = await axios.post(`${API_URL}/login`, formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const token = response.data.access_token;
    localStorage.setItem('auth_token', token); 

    return { success: true };
  } catch (error) {
    const message = error.response?.data?.detail || 'Login failed. Check server status.';
    return { success: false, message: message };
  }
}

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const result = await handleLogin(email, password);
    setIsLoading(false);

    if (result.success) {
      router.push('/dashboard');
    } else {
      setError(result.message);
    }
  };

  const inputVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: { x: 0, opacity: 1 },
  };

  return (
    <AuthLayout>
      <div className="auth-card">
        <h2 className="auth-title mb-2">Welcome Back.</h2>
        <p className="text-sm mb-8 text-white opacity-70">
            Log in to access your GeoLearn study materials.
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <motion.div variants={inputVariants} initial="hidden" animate="visible" transition={{ delay: 0.1 }}>
                <label htmlFor="email" className="form-label">
                    Email address
                </label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-input"
                />
            </motion.div>

            {/* Password Input */}
            <motion.div variants={inputVariants} initial="hidden" animate="visible" transition={{ delay: 0.2 }}>
                <label htmlFor="password" className="form-label">
                    Password
                </label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-input"
                />
            </motion.div>
            
            {/* Error Message */}
            {error && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="error-message">
                    {error}
                </motion.p>
            )}

            {/* Submit Button */}
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="pt-4">
                <button
                    type="submit"
                    disabled={isLoading}
                    className="form-button"
                >
                    {isLoading ? 'Signing in...' : 'Sign in'}
                </button>
            </motion.div>
            
            {/* Register Link */}
            <p className="form-link-text">
                Don&apos;t have an account?{' '}
                <Link href="/register" className="form-link">
                    Register here
                </Link>
            </p>
        </form>
      </div>
    </AuthLayout>
  );
}