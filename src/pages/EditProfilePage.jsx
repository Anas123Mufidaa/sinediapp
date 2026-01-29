import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ChevronLeft, Camera, Save } from 'lucide-react';

export default function EditProfilePage() {
    const { user, updateProfile } = useApp();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || 'student@ui.ac.id',
        phone: user?.phone || '081234567890',
        university: user?.university || 'Universitas Indonesia',
        major: user?.major || 'Teknik Informatika'
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        updateProfile(formData);
        alert('Profil berhasil diperbarui!');
        navigate('/profile'); // Assuming /profile exists, or back to previous
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 pb-24">
            <div className="bg-white p-4 sticky top-0 z-10 border-b border-slate-100 flex items-center gap-3">
                <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-50 rounded-full">
                    <ChevronLeft className="w-6 h-6 text-slate-600" />
                </button>
                <h1 className="text-lg font-bold">Edit Profile</h1>
            </div>

            <form onSubmit={handleSubmit} className="p-6 max-w-lg mx-auto space-y-6 animate-in fade-in">

                {/* Avatar */}
                <div className="flex flex-col items-center gap-4">
                    <div className="relative">
                        <div className="w-24 h-24 rounded-full bg-slate-200 overflow-hidden border-4 border-white shadow-sm">
                            <img src={`https://ui-avatars.com/api/?name=${formData.name}&background=random`} alt="Profile" className="w-full h-full object-cover" />
                        </div>
                        <button type="button" className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2 rounded-full shadow-lg hover:bg-indigo-700 transition-colors">
                            <Camera className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Nama Lengkap</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Nomor HP</label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Universitas</label>
                        <input
                            type="text"
                            name="university"
                            value={formData.university}
                            onChange={handleChange}
                            className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Jurusan</label>
                        <input
                            type="text"
                            name="major"
                            value={formData.major}
                            onChange={handleChange}
                            className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                    </div>
                </div>

                <div className="pt-4">
                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                        <Save className="w-5 h-5" />
                        Simpan Perubahan
                    </button>
                </div>
            </form>
        </div>
    );
}
