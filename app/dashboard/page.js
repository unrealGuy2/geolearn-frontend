'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import axios from 'axios';
import Link from 'next/link';
import '@/app/DashboardStyles.css'; 
import DashboardLayout from '@/components/DashboardLayout'; 

// --- Configuration ---
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

// --- Helper functions ---
function getAuthToken() {
    return localStorage.getItem('auth_token');
}

export default function DashboardPage() {
    const [user, setUser] = useState(null);
    const [materials, setMaterials] = useState([]);
    const [courses, setCourses] = useState(0); 
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    // Fetch User and Materials on Load
    useEffect(() => {
        const token = getAuthToken();
        if (!token) {
            router.push('/login');
            return;
        }

        async function fetchData() {
            try {
                // Fetch all data in parallel
                const [userResponse, materialsResponse, coursesResponse] = await Promise.all([
                    axios.get(`${API_URL}/users/me`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    axios.get(`${API_URL}/materials`),
                    axios.get(`${API_URL}/courses`, { 
                        headers: { Authorization: `Bearer ${token}` },
                    })
                ]);

                setUser(userResponse.data);
                setMaterials(materialsResponse.data);
                setCourses(coursesResponse.data.length); 
                setIsLoading(false);

            } catch (error) {
                localStorage.removeItem('auth_token');
                router.push('/login');
            }
        }

        fetchData();
    }, [router]);


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
                <p style={{ fontSize: '1.2rem', fontWeight: '500' }}>Loading GeoLearn...</p>
            </div>
        );
    }
    
    // --- Material Card Component (Light Theme) ---
    const MaterialCard = ({ material }) => (
        <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="content-card-item"
        >
            <div className="content-card-details">
                <h4>{material.title}</h4>
                <p>{material.courses?.course_code} - {material.courses?.course_title}</p>
            </div>
            
            <a 
                href={material.file_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="content-card-button"
            >
                Download
            </a>
        </motion.div>
    );

    return (
        <DashboardLayout user={user}>
            {/* --- Dashboard Header --- */}
            <header className="dashboard-header">
                <h1 className="dashboard-header-title">
                    Good afternoon, {user.full_name.split(' ')[0]}!
                </h1>
                <button 
                    onClick={() => router.push('/admin/upload')} 
                    className="dashboard-header-button"
                >
                    Start new upload
                </button>
            </header>

            {/* --- Metric Cards --- */}
            <div className="metric-cards-grid">
                <div className="metric-card">
                    <h3>Materials Available</h3>
                    <p>{materials.length}</p>
                </div>
                <div className="metric-card">
                    <h3>Total Courses</h3>
                    <p>{courses}</p>
                </div>
                
                {/* --- FIX IS HERE --- */}
                {/* Show Level for Student, show Role for Admin/Lecturer */}
                <div className="metric-card">
                    {user.role === 'student' ? (
                        <>
                            <h3>Your Level</h3>
                            <p>{user.level || 'N/A'}</p> 
                        </>
                    ) : (
                        <>
                            <h3>Your Role</h3>
                            <p style={{textTransform: 'capitalize'}}>{user.role}</p>
                        </>
                    )}
                </div>
                {/* --- END FIX --- */}

            </div>

            {/* --- Main Content Section --- */}
            <div className="content-section-header" style={{marginTop: '2rem'}}>
                <h2 className="content-section-title">Materials Library</h2>
                <a href="#" style={{ color: 'var(--color-accent-blue)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '500' }}>Show all</a>
            </div>

            {materials.length === 0 ? (
                <p className="text-lg text-gray-400">No approved materials available yet.</p>
            ) : (
                <div className="content-card-list">
                    {materials.map(material => (
                        <MaterialCard key={material.id} material={material} />
                    ))}
                </div>
            )}

        </DashboardLayout>
    );
}