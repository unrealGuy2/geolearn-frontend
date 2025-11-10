'use client';

import DashboardLayout from '@/components/DashboardLayout'; // <-- USE THE NEW LIGHT LAYOUT
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import axios from 'axios';
import '@/app/DashboardStyles.css'; // <-- USE THE NEW DASHBOARD STYLES

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
function getAuthToken() { return localStorage.getItem('auth_token'); }


export default function AdminDashboardPage() {
    const [user, setUser] = useState(null); // Need user data for the layout
    const [metrics, setMetrics] = useState({ total_users: 0, total_materials: 0, total_courses: 0 });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const token = getAuthToken();
        if (!token) return;

        async function fetchData() {
            try {
                // Fetch both user and metrics
                const userResponse = await axios.get(`${API_URL}/users/me`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUser(userResponse.data);

                const metricsResponse = await axios.get(`${API_URL}/admin/metrics`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setMetrics(metricsResponse.data);

                setIsLoading(false);
            } catch (error) {
                console.error("Failed to fetch admin data", error);
                setIsLoading(false);
            }
        }
        fetchData();
    }, []);

    if (isLoading || !user) {
        return (
            <div style={{
                display: 'flex', 
                minHeight: '100vh', 
                alignItems: 'center', 
                justifyContent: 'center', 
                backgroundColor: 'var(--color-bg-light)', 
                color: 'var(--color-text-dark)'
            }}>
                <p style={{ fontSize: '1.2rem', fontWeight: '500' }}>Loading Admin Portal...</p>
            </div>
        );
    }

    return (
        <DashboardLayout user={user}>
            <div className="space-y-8">
                
                {/* --- HEADER CONTENT --- */}
                <motion.div
                    initial={{ y: -20, opacity: 0 }} 
                    animate={{ y: 0, opacity: 1 }} 
                    transition={{ duration: 0.5 }}
                    className="mb-8"
                >
                    <p className="text-xl opacity-60" style={{color: 'var(--color-text-light)'}}>
                        Dashboard / Admin Control
                    </p>
                    <h1 className="text-4xl font-extrabold" style={{color: 'var(--color-text-dark)'}}>
                        Admin Control Center
                    </h1>
                </motion.div>
                {/* --- END HEADER CONTENT --- */}

                {/* --- ANALYTICS AND METRIC CARDS (Light Theme) --- */}
                <div className="metric-cards-grid">
                    <MetricCard 
                        title="Total Users" 
                        value={metrics.total_users} 
                        isLoading={isLoading}
                        icon="👥"
                    />
                     <MetricCard 
                        title="Total Materials" 
                        value={metrics.total_materials} 
                        isLoading={isLoading}
                        icon="📚"
                    />
                    <MetricCard 
                        title="Total Courses" 
                        value={metrics.total_courses} 
                        isLoading={isLoading}
                        icon="🗺️"
                    />
                </div>
                {/* --- END ANALYTICS CARDS --- */}

                {/* --- QUICK ACCESS WIDGETS (Light Theme) --- */}
                <div className="content-section-header">
                    <h2 className="content-section-title">Quick Access Tools</h2>
                </div>
                <div className="materials-grid mt-4">
                    <AdminWidget 
                        title="Upload New Material" 
                        description="Add new past questions, notes, or textbooks." 
                        link="/admin/upload"
                    />
                    <AdminWidget 
                        title="Manage Courses" 
                        description="Create, view, or update course codes (GLY101, etc.)." 
                        link="/admin/courses"
                    />
                    <AdminWidget 
                        title="View All Users" 
                        description="Review student and lecturer accounts." 
                        link="/admin/users"
                    />
                </div>
            </div>
        </DashboardLayout>
    );
}

// Helper Widget Component (For Quick Access Links)
function AdminWidget({ title, description, link }) {
    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            className="content-card-item" // <-- USE THE NEW LIGHT CARD
        >
            <div className="content-card-details">
                <h4>{title}</h4>
                <p>{description}</p>
            </div>
            <a 
                href={link} 
                className="content-card-button"
            >
                Go to Tool →
            </a>
        </motion.div>
    );
}

// Helper Card Component (For Analytics)
function MetricCard({ title, value, isLoading, icon }) {
    return (
        <motion.div 
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="metric-card"
        >
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                 <h3>{title}</h3>
                 <span style={{fontSize: '1.5rem'}}>{icon}</span>
            </div>
            <p>
                {isLoading ? '...' : value}
            </p>
        </motion.div>
    );
}