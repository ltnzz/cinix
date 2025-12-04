import React, { useState, useEffect } from "react";
import { Trash2, ShoppingBag, Film, ArrowRight, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import MainHeader from "../components/MainHeader";

const WishlistItem = ({ movie, onRemove, onBook }) => (
  <div className="flex flex-col-reverse md:flex-row justify-between items-start border-b border-[#2a4c44]/20 py-8 gap-6 group">
    
    <div className="flex-1 w-full md:w-auto">
      <h3 className="text-2xl font-black text-[#2a4c44] mb-1">{movie.title}</h3>
      <p className="text-lg font-bold text-amber-600 mb-2">Rp 50.000</p>
      
      <div className="text-sm text-gray-600 font-medium mb-6 space-y-1">
        <p>Genre: {movie.genres}</p>
        <p>Durasi: {movie.duration}</p>
      </div>

      <button 
        onClick={() => onBook(movie)}
        className="w-full md:w-auto px-8 py-3 border-2 border-[#2a4c44] text-[#2a4c44] font-bold hover:bg-[#2a4c44] hover:text-white transition-all uppercase tracking-wider text-sm mb-4"
      >
        Book Ticket
      </button>

      <div className="flex items-center gap-4 text-sm text-gray-500">
        <button 
          onClick={() => onRemove(movie.id)}
          className="flex items-center gap-1 hover:text-red-500 transition-colors"
        >
          <Trash2 size={16} /> Remove item
        </button>
      </div>
    </div>

    <div className="w-full md:w-48 h-64 md:h-40 bg-gray-200 shrink-0 overflow-hidden shadow-md">
      <img 
          src={movie.poster_url} 
          alt={movie.title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
      />
    </div>
  </div>
);

const EmptyWishlist = ({ onNavigateHome }) => (
  <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in zoom-in-95 duration-500">
      <div className="w-24 h-24 bg-[#2a4c44]/10 rounded-full flex items-center justify-center mb-6">
          <Film className="text-[#2a4c44] w-10 h-10 opacity-50" />
      </div>
      <h2 className="text-2xl font-black text-[#2a4c44] mb-3">
        Wishlist Masih Kosong
      </h2>
      <p className="text-gray-600 mb-8 max-w-md">
        Belum ada, tambahkan movie yang Anda ingin tonton sekarang.
      </p>
      <button 
        onClick={onNavigateHome}
        className="px-8 py-3 bg-[#2a4c44] text-white font-bold rounded-full hover:bg-[#1e3630] transition-all shadow-lg hover:shadow-xl active:scale-95 flex items-center gap-2"
      >
        Cari Film <ArrowRight size={18}/>
      </button>
  </div>
);

export default function WishlistPage({ onNavigateHome, onNavigateLogin, onNavigateTickets, user, onLogoutClick }) {
  const navigate = useNavigate();
  
  const [wishlistItems, setWishlistItems] = useState([]); 

  const handleRemove = (id) => {
    setWishlistItems(items => items.filter(item => item.id !== id));
  };

  const handleBook = (movie) => {
    navigate('/detail', { state: { movie } });
  };

  return (
    <div className="min-h-screen bg-[#6a8e7f] font-sans">
      <MainHeader 
        onNavigateHome={onNavigateHome} 
        onNavigateLogin={onNavigateLogin} 
        onNavigateTickets={onNavigateTickets}
        user={user} 
        onLogoutClick={onLogoutClick} 
      />

      <main className="container mx-auto px-4 md:px-8 py-10 max-w-5xl">
        <div className="bg-[#f5f1dc] min-h-[600px] rounded-3xl shadow-2xl p-8 md:p-12 relative overflow-hidden">
            
            <div className="text-center mb-12">
                <h1 className="text-4xl font-black text-[#2a4c44] tracking-tight">Wishlist</h1>
                <div className="h-1 w-20 bg-amber-500 mx-auto mt-4 rounded-full"></div>
            </div>

            {wishlistItems.length > 0 ? (
                <div className="animate-in slide-in-from-bottom-4 duration-500">
                    <div className="border-t border-[#2a4c44]/20">
                        {wishlistItems.map((movie) => (
                            <WishlistItem 
                                key={movie.id} 
                                movie={movie} 
                                onRemove={handleRemove}
                                onBook={handleBook}
                            />
                        ))}
                    </div>
                    <div className="mt-12 flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="text-[#2a4c44]">
                            <span className="font-bold">Total Item:</span> {wishlistItems.length} Film
                        </div>
                        <button className="w-full md:w-auto bg-[#2a4c44] text-white px-10 py-4 font-bold uppercase tracking-widest hover:bg-[#1e3630] transition-all shadow-xl hover:scale-105 active:scale-95 flex items-center justify-center gap-3">
                            <ShoppingBag size={20} />
                            Book All Now
                        </button>
                    </div>
                </div>
            ) : (
                <EmptyWishlist onNavigateHome={onNavigateHome} />
            )}

        </div>
      </main>
    </div>
  );
}