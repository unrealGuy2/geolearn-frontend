'use client';

import { useRouter } from 'next/navigation'; 
import Link from 'next/link';
import '@/app/AuthStyles.css'; 

export default function StudentLayout({ children, user }) {
    const router = useRouter();

    const handleLogout = () => {
        localStorage.removeItem('auth_token');
        router.push('/login');
    };
    
    // --- Student Sidebar/Navigation (Dark Theme) ---
    return (
        // FIX: The main background is now LIGHT (--color-secondary)
        <div className="flex min-h-screen" style={{ backgroundColor: 'var(--color-secondary)' }}> 
            {/* Sidebar (Stays Dark) */}
            <div className="admin-sidebar-dark shadow-lg">
                <h2 className="admin-sidebar-header-dark" title="GeoLearn">G.</h2>
                <nav className="space-y-2 pt-8">
                    <AdminNavLink href="/dashboard" label="Dashboard" icon="home" />
                    {/* <AdminNavLink href="/profile" label="Profile" icon="profile" /> */}
                    
                    {user.role === 'admin' && (
                         <div className="border-t border-gray-600 my-4 pt-4">
                            <Link href="/admin/dashboard" className="admin-sidebar-link-dark opacity-70 hover:opacity-100 text-sm">
                                → Admin Portal
                            </Link>
                        </div>
                    )}

                    <div className="border-t border-gray-600 my-4 pt-4">
                        <button onClick={handleLogout} className="admin-sidebar-link-dark opacity-70 hover:opacity-100 text-sm w-full">
                            Logout
                        </button>
                    </div>
                </nav>
            </div>

            {/* Main Content Area (Stays Light) */}
            <main className="flex-1 p-8 text-white"> 
                {children}
            </main>
        </div>
    );
}

// Helper component for sidebar links
function AdminNavLink({ href, label, icon }) {
    let iconContent = '';
    if (icon === 'home') iconContent = '🏠';
    if (icon === 'profile') iconContent = '👤';

    return (
        <Link href={href} className="admin-sidebar-link-dark flex items-center space-x-3">
            <span className="text-xl">{iconContent}</span>
            <span className="text-sm">{label}</span>
        </Link>
    );
}