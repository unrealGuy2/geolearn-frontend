'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout'; // <-- USE THE NEW LIGHT LAYOUT
import { motion } from 'framer-motion';
import axios from 'axios';
import '@/app/DashboardStyles.css'; // <-- USE THE NEW DASHBOARD STYLES

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
function getAuthToken() { return localStorage.getItem('auth_token'); }

export default function ManageCoursesPage() {
    const [user, setUser] = useState(null); // Need user data for the layout
    const [courses, setCourses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [message, setMessage] = useState(null);
    const [isSuccess, setIsSuccess] = useState(null);

    // Form state for new course
    const [newCourseCode, setNewCourseCode] = useState('');
    const [newCourseTitle, setNewCourseTitle] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // --- Fetch all courses ---
    async function fetchCourses() {
        const token = getAuthToken();
        if (!token) return;

        try {
            const response = await axios.get(`${API_URL}/courses`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setCourses(response.data);
        } catch (error) {
            console.error("Failed to fetch courses", error);
            setMessage("Error: Could not load course list.");
            setIsSuccess(false);
        } finally {
            setIsLoading(false);
        }
    }

    // Fetch on initial page load
    useEffect(() => {
        const token = getAuthToken();
        if (!token) {
            router.push('/login');
            return;
        }
        
        // Fetch user data for the layout
        axios.get(`${API_URL}/users/me`, { headers: { Authorization: `Bearer ${token}` }})
            .then(response => setUser(response.data))
            .catch(() => router.push('/login'));
        
        fetchCourses();
    }, []);

    // --- Handle New Course Submission ---
    const handleCreateCourse = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage(null);
        setIsSuccess(null);

        const token = getAuthToken();
        const courseData = {
            course_code: newCourseCode,
            course_title: newCourseTitle
        };

        try {
            const response = await axios.post(`${API_URL}/courses`, courseData, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            setMessage(`Success! Course "${response.data.course_code}" created.`);
            setIsSuccess(true);
            setNewCourseCode('');
            setNewCourseTitle('');
            fetchCourses(); 

        } catch (error) {
            const detail = error.response?.data?.detail || "Creation failed.";
            setMessage(`Error: ${detail}`);
            setIsSuccess(false);
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
                        Admin Tools / Courses
                    </p>
                    <h1 className="text-4xl font-extrabold" style={{color: 'var(--color-text-dark)'}}>
                        Manage Courses
                    </h1>
                </motion.div>
                
                {/* --- Main Content (2-Column Layout) --- */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* --- Column 1: Create New Course --- */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }} 
                        animate={{ y: 0, opacity: 1 }} 
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="metric-card lg:col-span-1" // <-- USE THE NEW LIGHT CARD
                        style={{ padding: '2rem' }}
                    >
                        <h2 className="content-section-title mb-6">Create New Course</h2>
                        
                        {message && (
                            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} 
                                className={`p-3 rounded-lg mb-4 text-sm font-medium ${isSuccess ? 'bg-accent' : 'bg-red-600'}`}
                                style={{ color: 'white' }}
                            >
                                {message}
                            </motion.p>
                        )}

                        <form onSubmit={handleCreateCourse} className="space-y-4">
                            <div className="form-input-group">
                                <label htmlFor="course_code" className="form-label" style={{ color: 'var(--color-text-dark)' }}>Course Code (e.g., GEY 450)</label>
                                <input
                                    id="course_code"
                                    type="text"
                                    required
                                    value={newCourseCode}
                                    onChange={(e) => setNewCourseCode(e.target.value)}
                                    className="form-input"
                                    style={{backgroundColor: 'var(--color-bg-light)', color: 'var(--color-text-dark)'}}
                                />
                            </div>
                            <div className="form-input-group">
                                <label htmlFor="course_title" className="form-label" style={{ color: 'var(--color-text-dark)' }}>Course Title (e.g., Advanced Petrology)</label>
                                <input
                                    id="course_title"
                                    type="text"
                                    required
                                    value={newCourseTitle}
                                    onChange={(e) => setNewCourseTitle(e.target.value)}
                                    className="form-input"
                                    style={{backgroundColor: 'var(--color-bg-light)', color: 'var(--color-text-dark)'}}
                                />
                            </div>
                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="dashboard-header-button"
                                >
                                    {isSubmitting ? 'Creating...' : 'Create Course'}
                                </button>
                            </div>
                        </form>
                    </motion.div>

                    {/* --- Column 2: Full Course List --- */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }} 
                        animate={{ y: 0, opacity: 1 }} 
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="metric-card lg:col-span-2 overflow-y-auto"
                        style={{ padding: '2rem', maxHeight: '600px' }}
                    >
                        <h2 className="content-section-title mb-6">Existing Courses ({courses.length})</h2>
                        
                        {isLoading ? (
                            <p style={{ color: 'var(--color-text-dark)' }}>Loading course list...</p>
                        ) : (
                            <div> 
                                <table className="w-full text-left" style={{ color: 'var(--color-text-dark)' }}>
                                    <thead>
                                        <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                                            <th className="p-2">Course Code</th>
                                            <th className="p-2">Course Title</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {courses.map(course => (
                                            <tr key={course.id} className="hover:bg-gray-100" style={{borderBottom: '1px solid var(--color-border)'}}>
                                                <td className="p-2 font-bold">{course.course_code}</td>
                                                <td className="p-2">{course.course_title}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </motion.div>

                </div>
            </div>
        </DashboardLayout>
    );
}