'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout'; 
import { motion } from 'framer-motion';
import axios from 'axios';
import '@/app/DashboardStyles.css'; 

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'; 
function getAuthToken() { return localStorage.getItem('auth_token'); }

export default function ManageUsersPage() {
    const [user, setUser] = useState(null); 
    const [users, setUsers] = useState([]); 
    const [isLoading, setIsLoading] = useState(true);
    const [message, setMessage] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false); // For button loading state

    // --- Fetch all users ---
    async function fetchUsers() {
        const token = getAuthToken();
        if (!token) return;

        try {
            // Check if we are still an admin (for layout)
            if (!user) {
                const meResponse = await axios.get(`${API_URL}/users/me`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setUser(meResponse.data);
            }

            // Fetch the full list of users
            const usersResponse = await axios.get(`${API_URL}/admin/users`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setUsers(usersResponse.data);

        } catch (error) {
            console.error("Failed to fetch users", error);
            setMessage("Error: Could not load user list.");
        } finally {
            setIsLoading(false);
        }
    }

    // Fetch on initial page load
    useEffect(() => {
        fetchUsers();
    }, []);

    // --- Handle Promote User ---
    const handlePromote = async (userId, userName) => {
        if (!confirm(`Are you sure you want to make ${userName} an admin?`)) {
            return;
        }

        setIsSubmitting(true);
        setMessage(null);
        const token = getAuthToken();

        try {
            await axios.post(`${API_URL}/admin/users/${userId}/promote`, {}, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            // Refresh the list to show the new role
            fetchUsers(); 
            
        } catch (error) {
            setMessage("Error: Could not promote user.");
        } finally {
            setIsSubmitting(false);
        }
    };


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
                <p style={{ fontSize: '1.2rem', fontWeight: '500' }}>Loading Admin Tools...</p>
            </div>
        );
    }

    return (
        <DashboardLayout user={user}>
            <div className="space-y-6">
                
                {/* --- HEADER --- */}
                <motion.div
                    initial={{ y: -20, opacity: 0 }} 
                    animate={{ y: 0, opacity: 1 }} 
                    transition={{ duration: 0.5 }}
                    className="mb-8"
                >
                    <p className="text-xl opacity-60" style={{color: 'var(--color-text-light)'}}>
                        Admin Tools / Users
                    </p>
                    <h1 className="text-4xl font-extrabold" style={{color: 'var(--color-text-dark)'}}>
                        Manage Users
                    </h1>
                </motion.div>
                
                {/* --- Full User List Card --- */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }} 
                    animate={{ y: 0, opacity: 1 }} 
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="metric-card" // Use the light card style
                    style={{ padding: '2rem' }}
                >
                    <h2 className="content-section-title mb-6">All Registered Users ({users.length})</h2>
                    
                    {message && (
                         <p style={{ color: 'red' }}>{message}</p>
                    )}
                    
                    {isLoading ? (
                        <p style={{ color: 'var(--color-text-dark)' }}>Loading user list...</p>
                    ) : (
                        <div className="flex flex-col space-y-2">
                            {/* --- LIST HEADER --- */}
                            <div className="user-list-header" style={{gridTemplateColumns: '2fr 3fr 1fr 1fr 1fr'}}>
                                <span>Full Name</span>
                                <span>Email</span>
                                <span>Role</span>
                                <span>Level</span>
                                <span>Action</span>
                            </div>
                            
                            {/* --- USER LIST --- */}
                            {users.map(u => (
                                <div key={u.id} className="user-list-item" style={{gridTemplateColumns: '2fr 3fr 1fr 1fr 1fr'}}>
                                    <p className="font-bold">{u.full_name}</p>
                                    <p className="text-light">{u.email}</p>
                                    <p className="text-light">{u.role}</p>
                                    <p className="text-light">{u.level || 'N/A'}</p>
                                    <div>
                                        {/* Show button only if user is NOT an admin */}
                                        {u.role !== 'admin' && (
                                            <button 
                                                onClick={() => handlePromote(u.id, u.full_name)}
                                                disabled={isSubmitting}
                                                className="navbar-btn"
                                                style={{backgroundColor: 'var(--color-accent-blue)', color: 'white', fontSize: '0.8rem'}}
                                            >
                                                Make Admin
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </motion.div>

            </div>
        </DashboardLayout>
    );
}