import React, { useState, useEffect } from "react";
import { Clapperboard, Clock, MapPin, Ticket, Trash2, User, QrCode, CalendarDays, Film } from "lucide-react"; 
import { useNavigate } from "react-router-dom";
import MainHeader from "../components/MainHeader";

export default function MyTicketsPage({ onNavigateHome, onNavigateLogin, onNavigateWishlist, user, onLogoutClick }) {
    const navigate = useNavigate();
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadTicketsSmart = () => {
        if (!user) return;

        const potentialIds = [
            user.email,
            user.uid,
            user.id,
            user.username,
            user.userId 
        ].filter(Boolean); 

        let allFoundTickets = [];
        const checkedKeys = new Set();

        potentialIds.forEach(id => {
            const key = `tickets_${id}`;
            if (checkedKeys.has(key)) return;
            checkedKeys.add(key);

            try {
                const storedData = localStorage.getItem(key);
                if (storedData) {
                    const parsedData = JSON.parse(storedData);
                    if (Array.isArray(parsedData)) {
                        allFoundTickets = [...allFoundTickets, ...parsedData];
                    }
                }
            } catch (e) {
                console.error("Error loading tickets", e);
            }
        });

        const uniqueTickets = Array.from(new Map(allFoundTickets.map(ticket => [ticket.id, ticket])).values());
        const sortedTickets = uniqueTickets.sort((a, b) => new Date(b.booking_date) - new Date(a.booking_date));

        setTickets(sortedTickets);
        
        setTimeout(() => {
            setLoading(false);
        }, 800);
    };

    useEffect(() => {
        if (!user) {
            const timer = setTimeout(() => setLoading(false), 1000);
            return () => clearTimeout(timer);
        } 
        loadTicketsSmart();
    }, [user]); 

    const clearHistory = () => {
        if(!user) return;
        if(window.confirm("Apakah Anda yakin ingin menghapus semua riwayat tiket?")) {
            const potentialIds = [user.email, user.uid, user.id, user.username].filter(Boolean);
            potentialIds.forEach(id => {
                localStorage.removeItem(`tickets_${id}`);
            });
            setTickets([]);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#6a8e7f] flex flex-col items-center justify-center gap-4">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-[#fff9e6]/30 border-t-[#fff9e6] rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Film size={20} className="text-[#fff9e6] opacity-80" />
                    </div>
                </div>
                <p className="text-[#fff9e6] font-bold text-lg animate-pulse tracking-wide">
                    Menyiapkan Tiketmu...
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#6a8e7f] font-sans pb-20">
            <MainHeader
                onNavigateHome={onNavigateHome}
                onNavigateWishlist={onNavigateWishlist}
                onNavigateLogin={onNavigateLogin}
                user={user}
                onLogoutClick={onLogoutClick}
            />

            <main className="container mx-auto px-4 md:px-8 py-10 max-w-4xl">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 animate-in fade-in slide-in-from-top-4 duration-700">
                    <h1 className="text-3xl md:text-4xl font-black text-[#fff9e6] tracking-tight drop-shadow-md">
                        Tiket Saya
                    </h1>
                    
                    {tickets.length > 0 && user && (
                        <button 
                            onClick={clearHistory} 
                            className="text-red-300 hover:text-red-100 flex items-center gap-1 text-sm bg-black/20 px-3 py-2 rounded-full transition hover:bg-red-900/30 ml-auto md:ml-0"
                        >
                            <Trash2 size={14} /> Hapus Riwayat
                        </button>
                    )}
                </div>

                <div className="space-y-6 animate-in slide-in-from-bottom-10 duration-1000 fill-mode-forwards">
                    {tickets.length > 0 ? (
                        tickets.map((ticket) => {
                            const rawDate = ticket.watch_date || ticket.watchDate || ticket.date || ticket.show_date || ticket.booking_date;
                            const dateObj = new Date(rawDate);
                            const validDate = isNaN(dateObj.getTime()) ? new Date() : dateObj;
                            
                            const dateString = validDate.toLocaleDateString('id-ID', { 
                                weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
                            });

                            const qrData = JSON.stringify({
                                id: ticket.id, movie: ticket.movie_title, seats: ticket.seats,
                                cinema: ticket.cinema_name, date: dateString, time: ticket.showtime
                            });
                            
                            return (
                                <div key={ticket.id} className="bg-white rounded-3xl overflow-hidden shadow-xl flex flex-col md:flex-row relative group hover:-translate-y-1 transition-transform duration-300">
                                    <div className="w-full md:w-40 h-48 md:h-auto relative bg-gray-200 shrink-0">
                                        <img 
                                            src={ticket.movie_poster} 
                                            alt={ticket.movie_title} 
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.target.onerror = null; 
                                                e.target.src = "https://placehold.co/300x450?text=No+Poster";
                                            }}
                                        />
                                        <div className={`absolute top-2 left-2 text-white text-xs font-bold px-2 py-1 rounded shadow z-10 ${ticket.status === 'Lunas' ? 'bg-green-500' : 'bg-amber-500'}`}>
                                            {ticket.status}
                                        </div>
                                    </div>

                                    <div className="flex-1 p-6 flex flex-col justify-between relative overflow-hidden">
                                        <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(circle_at_1px_1px,#2a4c44_1px,transparent_0)] bg-[length:10px_10px]"></div>

                                        <div className="relative z-10">
                                            <h2 className="text-2xl font-black text-[#2a4c44] mb-2 leading-tight">{ticket.movie_title}</h2>
                                            <div className="flex flex-col gap-2 text-sm text-gray-600 font-medium">
                                                <div className="flex items-center gap-2">
                                                    <MapPin size={16} className="text-amber-500"/> {ticket.cinema_name}
                                                </div>
                                                
                                                <div className="flex flex-wrap items-center gap-4">
                                                    <div className="flex items-center gap-2 text-[#2a4c44]">
                                                        <CalendarDays size={16} className="text-amber-500"/> 
                                                        <span className="font-bold">{dateString}</span>
                                                        <span className="text-gray-300 mx-1">|</span>
                                                        <Clock size={16} className="text-amber-500"/> 
                                                        <span>{ticket.showtime} WIB</span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2 mt-1">
                                                    <Ticket size={16} className="text-amber-500"/> {ticket.quantity} Tiket
                                                </div>

                                                <div className="mt-3 inline-flex items-center gap-2 bg-amber-50 border border-amber-200 px-3 py-1 rounded-lg w-fit">
                                                    <span className="text-[#2a4c44] font-bold text-xs uppercase tracking-wide">Kursi:</span>
                                                    <span className="text-amber-700 font-black">
                                                        {Array.isArray(ticket.seats) ? ticket.seats.join(", ") : ticket.seats}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-6 flex justify-between items-end border-t border-dashed border-gray-300 pt-4 relative z-10">
                                            <div className="text-xs text-gray-400 font-mono">
                                                ID: #{ticket.id}
                                            </div>
                                            <div className="text-xl font-black text-amber-600">
                                                {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(ticket.total_amount)}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="hidden md:block w-px border-l-2 border-dashed border-gray-300 relative">
                                        <div className="absolute -top-3 -left-[5px] w-4 h-4 rounded-full bg-[#6a8e7f]"></div>
                                        <div className="absolute -bottom-3 -left-[5px] w-4 h-4 rounded-full bg-[#6a8e7f]"></div>
                                    </div>
                                    <div className="md:hidden h-px border-t-2 border-dashed border-gray-300 relative mx-4">
                                        <div className="absolute -left-5 -top-[7px] w-4 h-4 rounded-full bg-[#6a8e7f]"></div>
                                        <div className="absolute -right-5 -top-[7px] w-4 h-4 rounded-full bg-[#6a8e7f]"></div>
                                    </div>

                                    <div className="p-6 md:w-48 bg-gray-50 flex flex-col items-center justify-center gap-2 text-center border-l-0 md:border-l border-dashed border-gray-100">
                                        <div className="p-2 bg-white rounded-xl shadow-sm border border-gray-200">
                                            <img 
                                                src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(qrData)}`} 
                                                alt="Ticket QR Code" 
                                                className="w-24 h-24 object-contain"
                                            />
                                        </div>
                                        <div>
                                            <span className="text-[10px] text-gray-400 font-mono block mb-1">SCAN ENTRY</span>
                                            <div className="flex items-center justify-center gap-1 text-xs font-bold text-[#2a4c44] bg-[#2a4c44]/10 px-2 py-1 rounded-md">
                                                <QrCode size={12} />
                                                <span>CHECK-IN</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="text-center py-20 bg-white/10 rounded-3xl border-2 border-dashed border-white/30 text-white/60 flex flex-col items-center animate-in zoom-in-95 duration-500">
                            <Clapperboard size={48} className="mb-4 opacity-50"/>
                            <p className="text-xl font-bold">Belum ada tiket.</p>
                            <p className="text-sm mt-1 mb-6 max-w-xs mx-auto">
                                {user 
                                    ? "Yuk, pesan tiket nonton sekarang!" 
                                    : "Silakan login terlebih dahulu untuk melihat riwayat tiket kamu."}
                            </p>
                            
                            {!user ? (
                                <button onClick={() => navigate('/login')} className="px-6 py-2 bg-[#fff9e6] text-[#2a4c44] font-bold rounded-full text-sm hover:bg-white transition shadow-lg">Masuk Sekarang</button>
                            ) : (
                                <button onClick={() => navigate('/')} className="px-6 py-2 bg-[#fff9e6] text-[#2a4c44] font-bold rounded-full text-sm hover:bg-white transition shadow-lg">Cari Film</button>
                            )}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}