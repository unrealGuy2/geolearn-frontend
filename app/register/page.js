'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AuthLayout from '@/components/AuthLayout';
import axios from 'axios';
import { motion } from 'framer-motion';

// --- Configuration ---
const API_URL = 'http://127.0.0.1:8000'; 

async function handleSignup(data) {
  try {
    const response = await axios.post(`${API_URL}/signup`, data);
    return { success: true, message: 'Registration successful! Redirecting to login.' };
  } catch (error) {
    const message = error.response?.data?.detail || 'Registration failed. Check server status.';
    return { success: false, message: message };
  }
}

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    role: 'student', 
    level: '100L', // <-- ADDED LEVEL TO STATE
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setIsLoading(true);

    // Prepare data, ensuring level is null if not a student
    const dataToSubmit = {
      ...formData,
      level: formData.role === 'student' ? formData.level : null,
    };

    const result = await handleSignup(dataToSubmit);
    setIsLoading(false);
    setIsSuccess(result.success);
    setMessage(result.message);

    if (result.success) {
      setTimeout(() => {
        router.push('/login'); 
      }, 2000); 
    }
  };

  const inputVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: { x: 0, opacity: 1 },
  };

  return (
    <AuthLayout>
        <div className="auth-card">
            <h2 className="auth-title mb-2">Create new account.</h2>
            <p className="text-sm mb-8 text-white opacity-70">
                Already a member?{' '}
                <Link href="/login" className="form-link">
                    Log in
                </Link>
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Full Name Input */}
                <motion.div variants={inputVariants} initial="hidden" animate="visible" transition={{ delay: 0.1 }}>
                <label htmlFor="full_name" className="form-label">Full Name</label>
                <input
                    id="full_name"
                    name="full_name"
                    type="text"
                    required
                    value={formData.full_name}
                    onChange={handleChange}
                    className="form-input"
                />
                </motion.div>
                
                {/* Email Input */}
                <motion.div variants={inputVariants} initial="hidden" animate="visible" transition={{ delay: 0.2 }}>
                <label htmlFor="email" className="form-label">Email Address</label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="form-input"
                />
                </motion.div>

                {/* Password Input */}
                <motion.div variants={inputVariants} initial="hidden" animate="visible" transition={{ delay: 0.3 }}>
                <label htmlFor="password" className="form-label">Password</label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="form-input"
                />
                </motion.div>

                {/* --- UPDATED ROLE & LEVEL SECTION --- */}
                <div className="grid grid-cols-2 gap-6">
                    <motion.div variants={inputVariants} initial="hidden" animate="visible" transition={{ delay: 0.4 }}>
                        <label htmlFor="role" className="form-label">Your Role</label>
                        <select
                            id="role"
                            name="role"
                            required
                            value={formData.role}
                            onChange={handleChange}
                            className="form-input"
                        >
                            <option value="student">Student</option>
                            <option value="lecturer">Lecturer</option>
                        </select>
                    </motion.div>

                    {/* --- NEW LEVEL DROPDOWN (CONDITIONAL) --- */}
                    {formData.role === 'student' && (
                        <motion.div variants={inputVariants} initial="hidden" animate="visible" transition={{ delay: 0.5 }}>
                            <label htmlFor="level" className="form-label">Your Level</label>
                            <select
                                id="level"
                                name="level"
                                required
                                value={formData.level}
                                onChange={handleChange}
                                className="form-input"
                            >
                                <option value="100L">100 Level</option>
                                <option value="200L">200 Level</option>
                                <option value="300L">300 Level</option>
                                <option value="400L">400 Level</option>
                            </select>
                        </motion.div>
                    )}
                </div>
                {/* --- END UPDATED SECTION --- */}
                
                {/* Messages */}
                {message && (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={isSuccess ? "error-message text-green-600" : "error-message"}>
                        {message}
                    </motion.p>
                )}

                {/* Submit Button */}
                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6 }}>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="form-button"
                >
                    {isLoading ? 'Registering...' : 'Register'}
                </button>
                </motion.div>
            </form>
        </div>
    </AuthLayout>
  );
}