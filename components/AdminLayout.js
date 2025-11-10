'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';
import '@/app/AuthStyles.css'; 

// --- Configuration ---
const API_URL = 'http://127.0.0.1:8000'; 

function getAuthToken() {
    return localStorage.getItem('auth_token');
}

export default function AdminLayout({ children }) {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const token = getAuthToken();

        if (!token) {
            router.push('/login');
            return;
        }

        async function fetchAdminData() {
            try {
                const response = await axios.get(`${API_URL}/users/me`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                
                // CRITICAL SECURITY CHECK
                if (response.data.role !== 'admin') {
                    router.push('/dashboard');
                    return;
                }
                
                setUser(response.data);
                setIsLoading(false);

            } catch (error) {
                // If token is invalid, log out
                localStorage.removeItem('auth_token');
                router.push('/login');
            }
        }

        fetchAdminData();
    }, [router]);

    if (isLoading) {
        return (
            <div className="min-h-screen auth-container">
                <p className="text-xl text-primary">Loading Admin Panel...</p>
            </div>
        );
    }
    
    // --- Admin Sidebar/Navigation (Matching Inspiration Sidebar) ---
    return (
        // THIS DIV provides the full-screen dark background
        <div className="flex min-h-screen" style={{ backgroundColor: '#202736' }}> 
            <div className="admin-sidebar-dark shadow-lg">
                <h2 className="admin-sidebar-header-dark">F.</h2>
                <nav className="space-y-2 pt-8">
                    <AdminNavLink href="/admin/dashboard" label="Dashboard" icon="home" />
                    <AdminNavLink href="/admin/upload" label="Upload" icon="upload" />
                    <AdminNavLink href="/admin/courses" label="Courses" icon="book" />
                    <div className="border-t border-gray-600 my-4 pt-4">
                        <Link href="/dashboard" className="admin-sidebar-link-dark opacity-70 hover:opacity-100 text-sm">
                            ← Public View
                        </Link>
                    </div>
                </nav>
            </div>

            {/* Main Content Area */}
            <main className="flex-1 p-8 text-white"> 
                {children}
            </main>
        </div>
    );
}

// Helper component for sidebar links (Image 3/4 style)
function AdminNavLink({ href, label, icon }) {
    // Simple icon placeholder based on text for now
    let iconContent = '';
    if (icon === 'home') iconContent = '🏠';
    if (icon === 'upload') iconContent = '⬆️';
    if (icon === 'book') iconContent = '📚';

    return (
        <Link href={href} className="admin-sidebar-link-dark flex items-center space-x-3">
            <span className="text-xl">{iconContent}</span>
            <span className="text-sm">{label}</span>
        </Link>
    );
}