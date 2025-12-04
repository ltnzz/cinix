import React from "react";
import { Home, Ticket, Heart, User, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function DetailHeader() {
  const navigate = useNavigate();

  return (
    <header className="flex items-center justify-between px-8 py-4 bg-[#f5f1dc] shadow sticky top-0 z-50">
      <div className="flex items-center gap-4">
        <div className="text-3xl font-bold text-[#2a4c44] cursor-pointer" onClick={() => navigate('/')}>
            CINIX
        </div>
        <div className="hidden md:flex items-center gap-1 ml-4 bg-[#e6ddba] px-3 py-1 rounded-full text-sm font-bold text-[#2a4c44]">
          <MapPin size={16} />
          <span>Jabodetabek</span>
        </div>
      </div>
      
      <div className="flex items-center gap-6 text-[#2a4c44] font-bold">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 hover:text-amber-600 transition-colors"
        >
          <Home size={20} />
          <span className="hidden md:inline">Home</span>
        </button>
        <button 
            onClick={() => navigate('/mytickets')}
            className="flex items-center gap-2 hover:text-amber-600 transition-colors"
        >
          <Ticket size={20} />
          <span className="hidden md:inline">Tickets</span>
        </button>
        <button 
            onClick={() => navigate('/wishlist')}
            className="flex items-center gap-2 hover:text-amber-600 transition-colors"
        >
          <Heart size={20} />
          <span className="hidden md:inline">Wishlist</span>
        </button>
      </div>
    </header>
  );
}