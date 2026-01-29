import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Lock, CheckCircle, Search } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function VideoPage() {
    const { user, createOrder, videos, addVideo } = useApp();
    const navigate = useNavigate();
    const [selectedCategory, setSelectedCategory] = useState('Semua');

    // Tutor Upload State
    const [isUploading, setIsUploading] = useState(false);
    const [uploadForm, setUploadForm] = useState({
        title: '',
        category: 'Sains',
        price: '',
        url: 'https://youtube.com/mock'
    });

    const categories = ['Semua', 'Sains', 'Bahasa', 'Programming', 'Ekonomi', 'Desain'];

    const filteredVideos = selectedCategory === 'Semua'
        ? videos
        : videos.filter(v => v.category === selectedCategory);

    const handleBuy = (video) => {
        const orderId = createOrder({
            title: `Video: ${video.title}`,
            deadline: '-',
            difficulty: 'video',
            price: video.price,
            type: 'video', // Explicit type
            details: `Kategori: ${video.category}`,
            tutorName: video.tutorName,
            videoUrl: video.url
        });
        navigate(`/payment/${orderId}`);
    };

    const handleUpload = (e) => {
        e.preventDefault();
        if (!uploadForm.title || !uploadForm.price) return alert('Mohon lengkapi data');

        addVideo({
            title: uploadForm.title,
            category: uploadForm.category,
            price: parseInt(uploadForm.price),
            url: uploadForm.url,
            tutorName: user.name,
        });

        setIsUploading(false);
        setUploadForm({ title: '', category: 'Sains', price: '', url: 'https://youtube.com/mock' });
        alert('Video berhasil diupload!');
    };

    // TUTOR VIEW
    if (user.role === 'tutor') {
        const myVideos = videos.filter(v => v.tutorName === user.name);

        return (
            <div className="p-6 space-y-6 animate-in fade-in pb-24">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Kelola Video Anda</h1>
                        <p className="text-slate-500 text-sm">Upload materi baru dan pantau penjualan.</p>
                    </div>
                    <button
                        onClick={() => setIsUploading(!isUploading)}
                        className="bg-yellow-400 text-slate-900 px-4 py-2 rounded-xl text-xs font-bold hover:bg-yellow-500 transition-colors shadow-sm"
                    >
                        {isUploading ? 'Batal Upload' : '+ Upload Video Baru'}
                    </button>
                </div>

                {isUploading && (
                    <form onSubmit={handleUpload} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4 animate-in slide-in-from-top-4">
                        <h3 className="font-bold text-slate-900">Form Upload Video</h3>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Judul Video</label>
                            <input
                                type="text"
                                className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-yellow-400"
                                placeholder="Contoh: Tutorial Fisika Dasar Bab 1"
                                value={uploadForm.title}
                                onChange={e => setUploadForm({ ...uploadForm, title: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Link Video / URL</label>
                            <input
                                type="url"
                                className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-yellow-400"
                                placeholder="https://youtube.com/..."
                                value={uploadForm.url}
                                onChange={e => setUploadForm({ ...uploadForm, url: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Kategori</label>
                                <select
                                    className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-yellow-400"
                                    value={uploadForm.category}
                                    onChange={e => setUploadForm({ ...uploadForm, category: e.target.value })}
                                >
                                    {categories.filter(c => c !== 'Semua').map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Harga (Rp)</label>
                                <input
                                    type="number"
                                    className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-yellow-400"
                                    placeholder="50000"
                                    value={uploadForm.price}
                                    onChange={e => setUploadForm({ ...uploadForm, price: e.target.value })}
                                />
                            </div>
                        </div>

                        <button className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold text-sm hover:bg-slate-800 transition-colors">
                            Simpan & Publish
                        </button>
                    </form>
                )
                }

                <h3 className="font-bold text-lg text-slate-900">Video Saya ({myVideos.length})</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {myVideos.length === 0 ? (
                        <div className="text-slate-400 text-sm col-span-2 text-center py-8 bg-slate-50 rounded-2xl border-dashed border border-slate-200">
                            Belum ada video yang diupload.
                        </div>
                    ) : myVideos.map(video => (
                        <div key={video.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex gap-4">
                            <div className={`w-20 h-20 rounded-xl ${video.color || 'bg-slate-200'} flex items-center justify-center shrink-0`}>
                                <Play className="text-white fill-white w-6 h-6" />
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase">{video.category}</span>
                                    <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded">Active</span>
                                </div>
                                <h4 className="font-bold text-slate-900 text-sm line-clamp-1 mt-1">{video.title}</h4>
                                <p className="text-yellow-600 font-bold text-xs mt-1">Rp {video.price.toLocaleString()}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div >
        );
    }

    // STUDENT VIEW
    return (
        <div className="p-6 space-y-6 animate-in fade-in pb-24">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Video Pembelajaran</h1>
                    <p className="text-slate-500 text-sm">Pelajari skill baru dari tutor terbaik.</p>
                </div>
                <div className="p-2 bg-white rounded-full shadow-sm border border-slate-100">
                    <Search className="w-5 h-5 text-slate-400" />
                </div>
            </div>

            {/* Category Chips */}
            <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${selectedCategory === cat
                            ? 'bg-slate-900 text-white shadow-md transform scale-105'
                            : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredVideos.map(video => (
                    <div key={video.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex gap-4 group hover:border-yellow-400 transition-all">
                        <div className={`w-24 h-24 rounded-xl ${video.color} flex items-center justify-center shrink-0 shadow-md relative overflow-hidden`}>
                            <div className="absolute inset-0 bg-black/10"></div>
                            <Play className="text-white fill-white w-8 h-8 relative z-10" />
                            <span className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/50 text-white text-[9px] rounded font-medium">12:30</span>
                        </div>
                        <div className="flex flex-col justify-between flex-1 py-1">
                            <div>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{video.category}</span>
                                <h3 className="font-bold text-slate-900 line-clamp-2 leading-tight mt-1">{video.title}</h3>
                                <p className="text-yellow-600 font-bold text-sm mt-2">Rp {video.price.toLocaleString()}</p>
                            </div>
                            <button
                                onClick={() => handleBuy(video)}
                                className="self-end bg-slate-100 text-slate-900 px-4 py-2 rounded-lg text-xs font-bold hover:bg-slate-900 hover:text-white transition-all"
                            >
                                Beli Video
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
