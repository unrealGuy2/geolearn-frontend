'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout'; 
import { motion } from 'framer-motion';
import axios from 'axios';
import '@/app/DashboardStyles.css'; 
import { useRouter } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'; 
function getAuthToken() { return localStorage.getItem('auth_token'); }

// --- This is the REAL data you fetched ---
const courseData = [
  { "course_code": "BIO 101", "course_title": "General Biology I", "id": "18f29538-4201-4e31-9e86-5f35d5e6e9a9" },
  { "course_code": "CHM 101", "course_title": "General Physical Chemistry", "id": "60268d8c-8d60-4049-bd1a-4553229ffc19" },
  { "course_code": "CHM 102", "course_title": "General Chemistry", "id": "7b5ced05-6578-4581-8a10-3149bedf936e" },
  { "course_code": "CHM 107", "course_title": "General Chemistry Practical I", "id": "ea07415f-edcc-40cb-86d3-d1f1e46b76d8" },
  { "course_code": "CHM 108", "course_title": "General Chemistry Practical II", "id": "ab6a9d9b-4acf-48a4-891a-cd0d32352c2a" },
  { "course_code": "COS 101", "course_title": "Introduction to Computer Science", "id": "2c94071f-62af-46de-a9c2-67261f75360b" },
  { "course_code": "ENT 211", "course_title": "Entrepreneurship and Innovation", "id": "36e76bb7-f3f7-4405-8800-5e97f3d25384" },
  { "course_code": "ENT 312", "course_title": "Venture Creation", "id": "659b521e-6505-472c-ab91-e045aaaac7b2" },
  { "course_code": "GEY 101", "course_title": "Introduction to Geology I", "id": "19886f09-76be-40a2-bb8e-05c8ac3c4184" },
  { "course_code": "GEY 102", "course_title": "Introduction to Geology II", "id": "7605a61e-e1a0-4343-9065-0edaabca51b9" },
  { "course_code": "GEY 202", "course_title": "Crystallography and Systematic Mineralogy", "id": "4bfa2cf2-b818-4e3b-96f4-388dc5f76eb5" },
  { "course_code": "GEY 203", "course_title": "Introduction to Petrology", "id": "6444bfcb-58c1-4c2c-8135-763157ca5b94" },
  { "course_code": "GEY 205", "course_title": "Invertebrate Palaeontology", "id": "ada40965-f769-4e32-8106-46cea988f32d" },
  { "course_code": "GEY 207", "course_title": "Principles of Stratigraphy", "id": "b3eeec02-61ec-452e-9ccc-3bf1da9cdc0e" },
  { "course_code": "GEY 209", "course_title": "Introduction to Surveying", "id": "fbd77a08-db20-486f-bb1b-e17a88f2ba5e" },
  { "course_code": "GEY 210", "course_title": "Introduction to Structural Geology and Map Interpretation", "id": "020d7fa0-b2b8-4658-a515-119a801db551" },
  { "course_code": "GEY 212", "course_title": "Introduction to Field Mapping", "id": "67cb7add-59e4-4a75-b0d4-72cdd8ccbb52" },
  { "course_code": "GEY 301", "course_title": "Geochronology & Precambrian Geology of Africa", "id": "76c575cd-2ae7-464e-b229-08538f4eaf30" },
  { "course_code": "GEY 305", "course_title": "Sedimentary Depositional Environments and Basins of Africa", "id": "63df3e5a-9009-4240-b9d1-492c3420543d" },
  { "course_code": "GEY 308", "course_title": "Principles of Geophysics", "id": "ba2bad00-524d-4f3b-be55-c25af2ad2d4b" },
  { "course_code": "GEY 310", "course_title": "Independent Geological Mapping", "id": "5d5901e3-91b8-4d48-b5e1-7e7f006e19f8" },
  { "course_code": "GEY 312", "course_title": "Photogeology and Remote Sensing", "id": "b8c8a913-42e6-4dca-aeb6-f9d5411de40a" },
  { "course_code": "GEY 313", "course_title": "Structural Geology", "id": "4e43d87b-ea15-4479-a011-1ee9fb31de47" },
  { "course_code": "GEY 315", "course_title": "Geochemistry", "id": "d5ec5dda-10ed-4206-a1b4-5e242bb16adf" },
  { "course_code": "GEY 399", "course_title": "Industrial Attachment", "id": "2d34e757-b0d2-4159-a9b8-634d8421902b" },
  { "course_code": "GEY 404", "course_title": "Economic Geology", "id": "f798cd7d-7fe3-4a29-8e2c-de860c791ed7" },
  { "course_code": "GEY 406", "course_title": "Micropalaeontology and Palynology", "id": "a429f223-8d11-4180-b6e4-8e4a321a2add" },
  { "course_code": "GEY 408", "course_title": "Petroleum Geology", "id": "9c51f281-a321-41c1-b626-77f7989db9e6" },
  { "course_code": "GEY 409", "course_title": "Applied Geophysics", "id": "bd368616-d601-4afb-9567-5c32a9f6993e" },
  { "course_code": "GEY 410", "course_title": "Engineering Geology", "id": "1622c37b-9b36-48fd-b8a4-24957d4ee5dc" },
  { "course_code": "GEY 411", "course_title": "Hydrogeology", "id": "e3c5090b-4c96-46e9-ac8b-4ebc156e9792" },
  { "course_code": "GEY 414", "course_title": "Entrepreneurship in Geosciences", "id": "f3627464-67a6-4196-b61d-b0e761bcfad2" },
  { "course_code": "GEY 415", "course_title": "Geology of Nigeria", "id": "0c6ee85a-5485-49f4-87d7-8ecfffa0b869" },
  { "course_code": "GEY 416", "course_title": "Seminar in Geology", "id": "121f75ca-424b-40fe-b316-ad9d47529797" },
  { "course_code": "GEY 417", "course_title": "Project in Geology", "id": "008154a9-e98d-48e8-8a56-aa5a8ec01f6d" },
  { "course_code": "GST 111", "course_title": "Communication in English", "id": "3cf8d93b-16fc-44e3-b7dc-c70adfb07cb1" },
  { "course_code": "GST 112", "course_title": "Nigerian Peoples and Culture", "id": "30aa74fd-2654-47aa-b08e-accba2bfa370" },
  { "course_code": "GST 212", "course_title": "Philosophy, Logic and Human Existence", "id": "f3667326-9fc7-4681-8fce-10f172a40dbf" },
  { "course_code": "GST 312", "course_title": "Peace and Conflict resolution", "id": "cbf0af95-af86-424d-9dde-eb4169fdf3c4" },
  { "course_code": "MTH 101", "course_title": "Elementary Mathematics I", "id": "9bc81c0c-a089-479b-b41c-2335821f207a" },
  { "course_code": "MTH 102", "course_title": "Elementary Mathematics II", "id": "471f5363-b7e4-4f49-a7b5-27eb64d4bdd8" },
  { "course_code": "PHY 101", "course_title": "General Physics I", "id": "682802ed-b690-4181-837a-ce1ec179536f" },
  { "course_code": "PHY 102", "course_title": "General Physics II", "id": "ccf75001-1ad3-4f5f-b3e8-40fd8bcacbaa" },
  { "course_code": "PHY 107", "course_title": "General Physics Practical I", "id": "047bd096-4d7f-43cf-9907-7873bb905fdb" },
  { "course_code": "PHY 108", "course_title": "General Physics Practical II", "id": "cea2d274-3457-4a18-83da-6b71e81bb2b1" },
  { "course_code": "UIL-GEY 104", "course_title": "Introduction to Geological Laboratory", "id": "879ce6aa-cea5-406f-996a-c1add6b51f56" },
  { "course_code": "UIL-GEY 204", "course_title": "Geomorphology", "id": "ffc89f48-e9e0-44e8-a815-74615435636d" },
  { "course_code": "UIL-GEY 206", "course_title": "Optical Mineralogy", "id": "1f366f14-53de-4475-a757-49b7724bd3c3" },
  { "course_code": "UIL-GEY 208", "course_title": "Environmental Geology", "id": "f986a295-9286-4934-9d8b-9423e48cd280" },
  { "course_code": "UIL-GEY 211", "course_title": "Energy Resources", "id": "dd64cefa-e6d9-4ec4-a548-ee568a3458b9" },
  { "course_code": "UIL-GEY 213", "course_title": "Gemstone Technology", "id": "9757cac1-5ef4-4e8f-8d07-7656fa850052" },
  { "course_code": "UIL-GEY 214", "course_title": "Mineral Science", "id": "d280aa4f-53bb-4eb9-bd57-baddb572708f" },
  { "course_code": "UIL-GEY 302", "course_title": "Petrology of Igneous and Metamorphic Rocks", "id": "fb4e1a49-33ab-489d-aedb-bb130e22dfb9" },
  { "course_code": "UIL-GEY 303", "course_title": "Geology of Osi Sheet", "id": "a9c9639c-6d28-466c-98cd-8d8f787d2224" },
  { "course_code": "UIL-GEY 317", "course_title": "Report Writing in Geology", "id": "2b640b5d-c9f7-4b88-a36e-898f5ebd5d6d" },
  { "course_code": "UIL-GEY 403", "course_title": "Geostatistics", "id": "ebc8d41e-e827-4473-acbf-d6daa8a98e18" },
  { "course_code": "UIL-GEY 418", "course_title": "Geohazard", "id": "8214bb81-6a18-435f-9a46-b36b1a723c36" },
  { "course_code": "UIL-GEY 420", "course_title": "Marine Geology", "id": "a67ac129-c03b-4c59-9b05-0cc957526ce1" },
  { "course_code": "UIL-GEY 421", "course_title": "Applied Geochemistry", "id": "63f7fee2-fd1f-4e49-a960-4cb8fdc8992e" },
  { "course_code": "UIL-GEY 422", "course_title": "Geoheritage and Geodiversity", "id": "4d0cfaf3-24d6-4cc8-bed9-1057daa01f56" },
  { "course_code": "UIL-GEY 425", "course_title": "Mining Geology", "id": "62bf166d-2da7-4b69-b861-cf16e204cb38" },
  { "course_code": "ZOO 102", "course_title": "Animal Diversity", "id": "47894869-8298-4fa9-9a50-898d58e80486" }
];
// --- END OF REAL DATA ---

export default function LecturerUploadPage() {
    const [formData, setFormData] = useState({
        title: '',
        material_type: 'Past Question',
        course_id: '',
        file: null,
    });
    
    const [user, setUser] = useState(null); 
    const [courses, setCourses] = useState(courseData); 
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [isSuccess, setIsSuccess] = useState(null);
    const router = useRouter(); 

    // Fetch user data for the layout
    useEffect(() => {
        const token = getAuthToken();
        if (!token) {
            router.push('/login');
            return;
        }
        axios.get(`${API_URL}/users/me`, { headers: { Authorization: `Bearer ${token}` }})
            .then(response => {
                setUser(response.data);
                // Security check: if user is not a lecturer or admin, kick them out
                if (response.data.role !== 'lecturer' && response.data.role !== 'admin') {
                    router.push('/dashboard');
                }
            })
            .catch(() => router.push('/login'));
    }, [router]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, file: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);
        setIsSuccess(null);
        setIsLoading(true);

        const token = getAuthToken();
        if (!token) {
            setMessage("Authentication failed. Please log in again.");
            setIsLoading(false);
            return;
        }

        if (!formData.file) {
             setMessage("Error: Please select a file to upload.");
            setIsLoading(false);
            setIsSuccess(false);
            return;
        }

        const data = new FormData();
        data.append('title', formData.title);
        data.append('material_type', formData.material_type);
        data.append('course_id', formData.course_id);
        data.append('file', formData.file);

        try {
            // POST to the new lecturer endpoint
            const response = await axios.post(`${API_URL}/lecturer/upload`, data, {
                headers: { 'Authorization': `Bearer ${token}` },
            });

            setMessage(`Success! Your file has been submitted for admin approval.`);
            setIsSuccess(true);
            setFormData({ ...formData, title: '', file: null }); 

        } catch (error) {
            const detail = error.response?.data?.detail || "Upload failed.";
            setMessage(`Error: ${detail}`);
            setIsSuccess(false);
        } finally {
            setIsLoading(false);
        }
    };
    
    if (!user) { 
         return (
            <div style={{
                display: 'flex', 
                minHeight: '100vh', 
                alignItems: 'center', 
                justifyContent: 'center', 
                backgroundColor: 'var(--color-bg-light)', 
                color: 'var(--color-text-dark)'
            }}>
                <p style={{ fontSize: '1.2rem', fontWeight: '500' }}>Loading Upload Tool...</p>
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
                        Tools / Upload for Approval
                    </p>
                    <h1 className="text-4xl font-extrabold" style={{color: 'var(--color-text-dark)'}}>
                        Upload New Material
                    </h1>
                </motion.div>
                
                {/* --- UPLOAD FORM CARD (Light Theme) --- */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }} 
                    animate={{ y: 0, opacity: 1 }} 
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="metric-card"
                    style={{ maxWidth: '50rem', padding: '3rem' }}
                >
                    <h2 className="content-section-title mb-6">File Details</h2>

                    {/* Notification Message */}
                    {message && (
                        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} 
                            className={`p-3 rounded-lg mb-4 text-sm font-medium ${isSuccess ? 'bg-accent' : 'bg-red-500'}`}
                            style={{ color: 'white' }}
                        >
                            {message}
                        </motion.p>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Material Title */}
                        <div className="form-input-group">
                            <label htmlFor="title" className="form-label" style={{ color: 'var(--color-text-dark)' }}>Material Title</label>
                            <input
                                id="title"
                                name="title"
                                type="text"
                                required
                                value={formData.title}
                                onChange={handleChange}
                                className="form-input"
                            />
                        </div>

                        {/* Material Type and Course ID (Two Columns) */}
                        <div className="grid grid-cols-2 gap-6">
                            <div className="form-input-group">
                                <label htmlFor="material_type" className="form-label" style={{ color: 'var(--color-text-dark)' }}>Material Type</label>
                                <select
                                    id="material_type"
                                    name="material_type"
                                    required
                                    value={formData.material_type}
                                    onChange={handleChange}
                                    className="form-input"
                                >
                                    <option>Past Question</option>
                                    <option>Note</option>
                                    <option>Textbook</option>
                                    <option>Syllabus</option>
                                </select>
                            </div>
                            
                            <div className="form-input-group">
                                <label htmlFor="course_id" className="form-label" style={{ color: 'var(--color-text-dark)' }}>Course Code (Link Material)</label>
                                <select
                                    id="course_id"
                                    name="course_id"
                                    required
                                    value={formData.course_id}
                                    onChange={handleChange}
                                    className="form-input"
                                >
                                    <option value="">-- Select Course --</option>
                                    {courses.map(course => (
                                        <option key={course.id} value={course.id}>
                                            {course.course_code} - {course.course_title}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* File Upload Input */}
                        <div className="form-input-group pt-4">
                            <label htmlFor="file" className="form-label" style={{ color: 'var(--color-text-dark)' }}>Select File (PDF/DOCX)</label>
                            <input
                                id="file"
                                name="file"
                                type="file"
                                required
                                onChange={handleFileChange}
                                className="form-input" 
                                style={{ padding: '0.5rem', height: 'auto', border: '1px solid var(--color-border)' }}
                            />
                        </div>

                        {/* Submit Button */}
                        <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="pt-4">
                            <button
                                type="submit"
                                disabled={isLoading || !formData.title || !formData.course_id} 
                                className="dashboard-header-button"
                            >
                                {isLoading ? 'Submitting...' : 'Submit for Approval'}
                            </button>
                        </motion.div>
                    </form>
                </motion.div>
            </div>
        </DashboardLayout>
    );
}