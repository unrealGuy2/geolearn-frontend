'use client';

import { useEffect, useState, useMemo } from 'react'; // <-- Import useMemo
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

function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) {
        return "Good morning";
    } else if (hour < 18) {
        return "Good afternoon";
    } else {
        return "Good evening";
    }
}

export default function DashboardPage() {
    const [user, setUser] = useState(null);
    const [materials, setMaterials] = useState([]); // All materials
    const [courses, setCourses] = useState([]); // All courses
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    // --- NEW FILTER STATES ---
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCourse, setSelectedCourse] = useState('');
    const [selectedLevel, setSelectedLevel] = useState('');
    // --- END NEW STATES ---

    // Fetch User, Materials, and Courses on Load
    useEffect(() => {
        const token = getAuthToken();
        if (!token) {
            router.push('/login');
            return;
        }

        async function fetchData() {
            try {
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
                setCourses(coursesResponse.data); // Set full course list
                setIsLoading(false);

            } catch (error) {
                localStorage.removeItem('auth_token');
                router.push('/login');
            }
        }

        fetchData();
    }, [router]);

    // --- NEW: FILTERING LOGIC ---
    // This logic filters the materials based on the filter states
    const filteredMaterials = useMemo(() => {
        return materials.filter(material => {
            const course = courses.find(c => c.id === material.course_id);
            const courseCode = course ? course.course_code : '';
            
            // 1. Filter by Search Term
            const matchesSearch = material.title.toLowerCase().includes(searchTerm.toLowerCase());
            
            // 2. Filter by Course
            const matchesCourse = selectedCourse ? material.course_id === selectedCourse : true;
            
            // 3. Filter by Level (e.g., GEY 101 starts with 1)
            const matchesLevel = selectedLevel ? courseCode.match(/\d+/)?.[0]?.startsWith(selectedLevel) : true;

            return matchesSearch && matchesCourse && matchesLevel;
        });
    }, [materials, courses, searchTerm, selectedCourse, selectedLevel]);
    // --- END FILTERING LOGIC ---


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
    const MaterialCard = ({ material }) => {
        const course = courses.find(c => c.id === material.course_id);
        return (
            <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="content-card-item"
            >
                <div className="content-card-details">
                    <h4>{material.title}</h4>
                    <p>{course?.course_code} - {course?.course_title}</p>
                </div>
                
                <div className="flex items-center justify-between pt-3" style={{ borderTop: '1px solid #E0E0E0', marginTop: 'auto' }}>
                    <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{ backgroundColor: '#E0F7FA', color: 'var(--color-primary)' }}>
                        {material.material_type}
                    </span>
                    <a 
                        href={material.file_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="navbar-btn" style={{ backgroundColor: 'var(--color-accent-green)', color: 'white', padding: '0.5rem 1rem' }}
                    >
                        Download File
                    </a>
                </div>
            </motion.div>
        );
    };
    
    // --- Handle Upload Button Click ---
    const handleUploadClick = () => {
        if (user.role === 'admin') {
            router.push('/admin/upload'); 
        } else {
            router.push('/upload'); 
        }
    };

    return (
        <DashboardLayout user={user}>
            {/* --- Dashboard Header --- */}
            <header className="dashboard-header">
                <h1 className="dashboard-header-title">
                    {getGreeting()}, {user.full_name.split(' ')[0]}!
                </h1>
                {(user.role === 'admin' || user.role === 'lecturer') && (
                    <button 
                        onClick={handleUploadClick} 
                        className="dashboard-header-button"
                    >
                        Start new upload
                    </button>
                )}
            </header>

            {/* --- Metric Cards --- */}
            <div className="metric-cards-grid">
                <div className="metric-card">
                    <h3>Materials Available</h3>
                    <p>{filteredMaterials.length}</p> {/* Shows filtered count */}
                </div>
                <div className="metric-card">
                    <h3>Total Courses</h3>
                    <p>{courses.length}</p>
                </div>
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
            </div>

            {/* --- NEW: FILTER BAR --- */}
            <div className="metric-card" style={{ marginBottom: '2rem', padding: '1.5rem' }}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Search Bar */}
                    <div>
                        <label className="form-label">Search by Title</label>
                        <input
                            type="text"
                            placeholder="e.g., Economic Geology..."
                            className="form-input"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    {/* Filter by Level */}
                    <div>
                        <label className="form-label">Filter by Level</label>
                        <select
                            className="form-input"
                            value={selectedLevel}
                            onChange={(e) => setSelectedLevel(e.target.value)}
                        >
                            <option value="">All Levels</option>
                            <option value="1">100 Level</option>
                            <option value="2">200 Level</option>
                            <option value="3">300 Level</option>
                            <option value="4">400 Level</option>
                        </select>
                    </div>
                    {/* Filter by Course */}
                    <div>
                        <label className="form-label">Filter by Course</label>
                        <select
                            className="form-input"
                            value={selectedCourse}
                            onChange={(e) => setSelectedCourse(e.target.value)}
                        >
                            <option value="">All Courses</option>
                            {courses.map(course => (
                                <option key={course.id} value={course.id}>
                                    {course.course_code} - {course.course_title}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
            {/* --- END FILTER BAR --- */}


            {/* --- Main Content Section --- */}
            <div className="content-section-header">
                <h2 className="content-section-title">Materials Library</h2>
            </div>

            {isLoading ? (
                <p className="text-lg text-gray-400">Loading materials...</p>
            ) : filteredMaterials.length === 0 ? (
                <p className="text-lg text-gray-400">No materials match your filters.</p>
            ) : (
                <div className="content-card-list">
                    {filteredMaterials.map(material => (
                        <MaterialCard key={material.id} material={material} />
                    ))}
                </div>
            )}

        </DashboardLayout>
    );
}