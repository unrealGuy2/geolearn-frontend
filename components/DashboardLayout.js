'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import '@/app/DashboardStyles.css'; // <-- Import the NEW dashboard styles

export default function DashboardLayout({ children, user }) {
    const router = useRouter();

    const handleLogout = () => {
        localStorage.removeItem('auth_token');
        router.push('/login');
    };

    return (
        <div className="dashboard-layout">
            
            {/* --- Sidebar --- */}
            <aside className="dashboard-sidebar">
                <Link href="/dashboard" className="sidebar-logo">GeoLearn</Link>

                <span className="sidebar-menu-title">Menu</span>
                <nav>
                    <Link href="/dashboard" className="sidebar-link active">
                        <span>📚</span>
                        <span style={{ marginLeft: '10px' }}>Materials</span>
                    </Link>
                    {/* Add more links here later if needed */}
                </nav>

                {/* Show Admin Portal link ONLY if user is an admin */}
                {user.role === 'admin' && (
                    <>
                        <span className="sidebar-menu-title">Admin</span>
                        <Link href="/admin/dashboard" className="sidebar-link">
                            <span>⚙️</span>
                            <span style={{ marginLeft: '10px' }}>Admin Tools</span>
                        </Link>
                    </>
                )}

                <div className="sidebar-upgrade-card">
                    <p className="text-sm font-bold mb-2">Logout</p>
                    <p className="text-xs opacity-70 mb-3">Tired of studying?</p>
                    <button 
                        onClick={handleLogout} 
                        style={{
                            width: '100%', 
                            padding: '0.5rem', 
                            borderRadius: '0.5rem', 
                            border: 'none', 
                            backgroundColor: '#F8F9FA', 
                            color: '#222B45',
                            fontWeight: '600',
                            cursor: 'pointer'
                        }}
                    >
                        Log out
                    </button>
                </div>
            </aside>

            {/* --- Main Content Area --- */}
            <main className="dashboard-main">
                {children}
            </main>
        </div>
    );
}