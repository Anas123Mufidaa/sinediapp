import { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export function AppProvider({ children }) {
    // Mock User Data
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem('sinedi_user');
        return saved ? JSON.parse(saved) : {
            name: 'Mahasiswa',
            role: 'student',
            wallet: 750000,
            availability: { days: ['Senin', 'Rabu', 'Jumat'], timeStart: '09:00', timeEnd: '17:00' } // Default for potential tutor
        };
    });

    // Persist State
    useEffect(() => {
        localStorage.setItem('sinedi_user', JSON.stringify(user));
    }, [user]);

    // Mock Orders Data with Persistence
    const [orders, setOrders] = useState(() => {
        const saved = localStorage.getItem('sinedi_orders');
        return saved ? JSON.parse(saved) : [
            { id: 'ORD-12345', title: 'Calculus Assignment 2', type: 'joki', status: 'In Progress', deadline: 'Besok', price: 150000 },
            { id: 'ORD-67890', title: 'Makalah Sejarah', type: 'joki', status: 'Done', deadline: 'Kemarin', price: 75000 },
            { id: 'ORD-11223', title: 'Joki Coding (React)', type: 'joki', status: 'Queue', deadline: 'Lusa', price: 300000 },
            { id: 'ORD-99887', title: 'Mentoring Skripsi UI/UX', type: 'mentoring', status: 'In Progress', deadline: 'Hari ini', price: 200000, tutorName: 'Mahasiswa' },
        ];
    });

    useEffect(() => {
        localStorage.setItem('sinedi_orders', JSON.stringify(orders));
    }, [orders]);

    // Mock Video Data (Global)
    const [videos, setVideos] = useState([
        { id: 1, title: 'Mastering Calculus 1', price: 50000, color: 'bg-red-500', category: 'Sains', tutorName: 'Dr. Math', url: 'https://youtube.com/mockvideo1' },
        { id: 2, title: 'Dasar Pemrograman Python', price: 75000, color: 'bg-blue-500', category: 'Programming', tutorName: 'Code Master', url: 'https://youtube.com/mockvideo2' },
        { id: 3, title: 'Belajar Akuntansi Dasar', price: 60000, color: 'bg-green-500', category: 'Ekonomi', tutorName: 'Econ Pro', url: 'https://youtube.com/mockvideo3' },
        { id: 4, title: 'Tips Public Speaking', price: 45000, color: 'bg-purple-500', category: 'Bahasa', tutorName: 'Talkative', url: 'https://youtube.com/mockvideo4' },
        { id: 5, title: 'Fisika Dasar: Newton', price: 55000, color: 'bg-red-400', category: 'Sains', tutorName: 'Newton Fan', url: 'https://youtube.com/mockvideo5' },
        { id: 6, title: 'UI/UX Design 101', price: 65000, color: 'bg-pink-500', category: 'Desain', tutorName: 'Creative Mind', url: 'https://youtube.com/mockvideo6' },
    ]);

    // ... (persistance code stays same or is omitted if not in viewing range, but I'll trust the context)
    // Wait, the REPLACE block needs to match exact context.
    // I will target the videos block and the payOrder block separately using MultiReplace if possible, but the tools are distinct.
    // I'll do this in two chunks if needed, or if they are close enough (lines 32 and 88 are far).
    // I'll use multi_replace_file_content since I need to edit two separate blocks.
    // WAIT: I don't have multi_replace available in this turn? I DO have `multi_replace_file_content`.
    // I will use `replace_file_content` for now, just applied twice if need be.
    // Actually, `payOrder` is at line 88. `videos` is at line 32.
    // I will use `multi_replace_file_content`.

    // Oh wait, I am the model. I should check if I have `multi_replace_file_content`. YES I DO.
    // So I will use that.


    // Persist State
    useEffect(() => {
        localStorage.setItem('sinedi_user', JSON.stringify(user));
    }, [user]);

    // Mock Notifications Data
    const [notifications, setNotifications] = useState([
        { id: 1, title: 'Pembayaran Berhasil', desc: 'Pembayaran terkonfirmasi.', type: 'success', time: 'Baru saja', isRead: false },
        { id: 2, title: 'Tutor Menemukanmu!', desc: 'Kak Andi mengambil tugasmu.', type: 'info', time: '5m lalu', isRead: false },
        { id: 3, title: 'Diskon Spesial!', desc: 'Potongan 20% untuk order hari ini.', type: 'promo', time: '1j lalu', isRead: true },
    ]);

    // Actions
    const switchMode = () => {
        setUser(prev => ({
            ...prev,
            role: prev.role === 'student' ? 'tutor' : 'student'
        }));
    };

    const updateProfile = (updatedData) => {
        setUser(prev => ({ ...prev, ...updatedData }));
    };

    const markAllRead = () => {
        setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    };

    const createOrder = (orderData) => {
        const newOrder = {
            id: `ORD-${Math.floor(Math.random() * 100000)}`,
            status: 'Unpaid',
            ...orderData
        };
        setOrders([newOrder, ...orders]);
        return newOrder.id;
    };

    const addVideo = (videoData) => {
        const newVideo = {
            id: Date.now(),
            color: 'bg-indigo-500', // Default color for new uploads
            ...videoData
        };
        setVideos([newVideo, ...videos]);
    };

    const updateOrder = (orderId, data) => {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, ...data } : o));
    };

    const payOrder = (orderId) => {
        setOrders(prevOrders => prevOrders.map(o => {
            if (o.id === orderId) {
                // If it's a video, complete it immediately
                if (o.type === 'video') {
                    return {
                        ...o,
                        status: 'Done',
                        result: { type: 'link', name: 'Tonton Video', url: o.videoUrl || 'https://youtube.com' }
                    };
                }
                // Else (Joki), put in Queue
                return { ...o, status: 'Queue' };
            }
            return o;
        }));
    };

    const takeJob = (orderId) => {
        setOrders(orders.map(o => o.id === orderId ? { ...o, status: 'In Progress', tutorName: user.name } : o));
    };

    const finishJob = (orderId, result = null) => {
        const order = orders.find(o => o.id === orderId);
        if (order) {
            // Update Order Status
            setOrders(orders.map(o => o.id === orderId ? { ...o, status: 'Done', result } : o));

            // Add Funds to User Wallet (Mock)
            setUser(prev => ({
                ...prev,
                wallet: (prev.wallet || 0) + order.price
            }));
        }
    };

    const withdrawFunds = (amount) => {
        if (user.wallet >= amount) {
            setUser(prev => ({
                ...prev,
                wallet: prev.wallet - amount
            }));
            return true;
        }
        return false;
    };

    const addNotification = (notif) => {
        setNotifications(prev => [{
            id: Date.now(),
            time: 'Baru saja',
            isRead: false,
            ...notif
        }, ...prev]);
    };

    return (
        <AppContext.Provider value={{
            user, orders, switchMode, createOrder, payOrder,
            takeJob, finishJob, withdrawFunds, videos, addVideo,
            notifications, markAllRead, updateProfile, updateOrder,
            addNotification
        }}>
            {children}
        </AppContext.Provider>
    );
}

export const useApp = () => useContext(AppContext);
