import React, { useState, useEffect } from "react";
import { Heart, Trash2, ArrowRight, Film } from "lucide-react";
import { useNavigate } from "react-router-dom";
import MainHeader from "../components/MainHeader";

export default function WishlistPage({ onNavigateHome, onNavigateLogin, onNavigateTickets, user, onLogoutClick }) {
    const navigate = useNavigate();
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadWishlistSmart = () => {
        if (!user) return;

        const potentialIds = [ user.email, user.uid, user.id, user.username, user.userId ].filter(Boolean); 
        let allFoundMovies = [];
        const checkedKeys = new Set();

        potentialIds.forEach(id => {
            const key = `wishlist_${id}`;
            if (checkedKeys.has(key)) return;
            checkedKeys.add(key);

            try {
                const storedData = localStorage.getItem(key);
                if (storedData) {
                    const parsedData = JSON.parse(storedData);
                    if (Array.isArray(parsedData)) {
                        allFoundMovies = [...allFoundMovies, ...parsedData];
                    }
                }
            } catch (e) {
                console.error("Error loading wishlist", e);
            }
        });

        const uniqueMovies = Array.from(new Map(allFoundMovies.map(movie => [movie.id, movie])).values());
        setWishlist(uniqueMovies.reverse());
        
        setTimeout(() => {
            setLoading(false);
        }, 800);
    };

    useEffect(() => {
        if (!user) {
            const timer = setTimeout(() => setLoading(false), 1000);
            return () => clearTimeout(timer);
        } 
        loadWishlistSmart();
    }, [user]); 

    const removeFromWishlist = (movieId) => {
        if (!user) return;
        
        const newWishlist = wishlist.filter(item => item.id !== movieId);
        setWishlist(newWishlist);

        const potentialIds = [user.email, user.uid, user.id, user.username].filter(Boolean);
        potentialIds.forEach(id => {
            const key = `wishlist_${id}`;
            const storedData = localStorage.getItem(key);
            if (storedData) {
                const parsed = JSON.parse(storedData);
                const updated = parsed.filter(m => m.id != movieId);
                localStorage.setItem(key, JSON.stringify(updated));
            }
        });
    };

    const handleBookNow = (movie) => {
        if (!movie || !movie.id) return;
        navigate(`/detail/${movie.id}`, { 
            state: { movie: movie } 
        }); 
    };

    const getPosterUrl = (movie) => {
        const path = movie.poster_path || movie.poster_url || movie.image || "";
        if (!path) return "https://placehold.co/300x450?text=No+Poster";
        if (path.startsWith("http")) return path;
        return `https://image.tmdb.org/t/p/w500${path}`;
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
                    Menyiapkan Koleksimu...
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#6a8e7f] font-sans pb-20">
            <MainHeader
                onNavigateHome={onNavigateHome}
                onNavigateTickets={onNavigateTickets}
                onNavigateLogin={onNavigateLogin}
                user={user}
                onLogoutClick={onLogoutClick}
            />

            <main className="container mx-auto px-4 md:px-8 py-10 max-w-6xl">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 animate-in fade-in slide-in-from-top-4 duration-700">
                    <div className="flex items-center gap-3">
                        <Heart className="text-[#fff9e6] fill-[#ff0404]" size={36} />
                        <h1 className="text-3xl md:text-4xl font-black text-[#fff9e6] tracking-tight drop-shadow-md">
                            Wishlist Kamu Nih
                        </h1>
                        <span className="bg-[#fff9e6] text-[#2a4c44] text-xl font-bold px-2 py-0.5 rounded-full">
                            {wishlist.length}
                        </span>
                    </div>
                </div>

                {wishlist.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 animate-in slide-in-from-bottom-10 fade-in duration-1000 fill-mode-forwards">
                        {wishlist.map((movie, index) => {
                            const posterUrl = getPosterUrl(movie);
                            const title = movie.title || movie.name || "Judul Tidak Tersedia";

                            return (
                                <div 
                                    key={movie.id} 
                                    className="bg-white rounded-2xl overflow-hidden shadow-xl group relative hover:-translate-y-2 transition-all duration-300"
                                >
                                    <div className="aspect-[2/3] relative overflow-hidden bg-gray-200">
                                        <img 
                                            src={posterUrl} 
                                            alt={title} 
                                            loading="lazy"
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            onError={(e) => {
                                                e.target.onerror = null; 
                                                e.target.src = "https://placehold.co/300x450?text=Error+Image";
                                            }}
                                        />
                                        
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                                            <button 
                                                onClick={() => handleBookNow(movie)}
                                                className="w-full bg-[#fff9e6] text-[#2a4c44] font-bold py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-white transition-colors shadow-lg active:scale-95"
                                            >
                                                Lihat Detail <ArrowRight size={16} />
                                            </button>
                                        </div>

                                        <button 
                                            onClick={(e) => { e.stopPropagation(); removeFromWishlist(movie.id); }}
                                            className="absolute top-2 right-2 bg-black/40 hover:bg-red-500 text-white p-2 rounded-full backdrop-blur-sm transition-colors z-10 shadow-md group-hover:scale-110"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>

                                    <div className="p-4 bg-white flex flex-col h-[100px] justify-between">
                                        <div>
                                            <h3 className="font-bold text-[#2a4c44] truncate text-lg leading-tight" title={title}>
                                                {title}
                                            </h3>
                                            <p className="text-xs text-gray-400 mt-1 truncate">
                                                {movie.genre || "Bioskop Indonesia"}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-2 mt-2 bg-green-50 w-fit px-2 py-1 rounded-md border border-green-100">
                                            <div className="relative flex h-2 w-2">
                                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                            </div>
                                            <span className="text-[10px] font-bold text-green-700 uppercase tracking-wide">
                                                Sedang Tayang
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white/10 rounded-3xl border-2 border-dashed border-white/30 text-white/60 flex flex-col items-center animate-in zoom-in-95 duration-500">
                        <Heart size={48} className="mb-4 opacity-50 text-white fill-white/20"/>
                        <p className="text-xl font-bold text-[#fff9e6]">Belum ada film di wishlist.</p>
                        <p className="text-sm text-white/70 mt-1 mb-6">Simpan film favoritmu agar mudah ditemukan nanti.</p>
                        <button 
                            onClick={() => navigate('/')} 
                            className="px-8 py-3 bg-[#fff9e6] text-[#2a4c44] font-bold rounded-full text-sm hover:bg-white transition shadow-xl hover:scale-105"
                        >
                            Cari Film Sekarang
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
}