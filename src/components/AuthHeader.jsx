import React from "react";
import { Home, Ticket, Heart, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AuthHeader() {
  const navigate = useNavigate();

  return (
    <header className="flex items-center justify-between px-8 py-4 bg-[#f5f1dc] shadow z-10 relative">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/')} className="cursor-pointer flex items-center gap-2">
          <div className="text-3xl font-bold text-[#2a4c44]">CINIX</div>
        </button>
        <div className="flex items-center gap-1 ml-4 bg-[#e6ddba] px-3 py-1 rounded-full text-sm text-[#2a4c44]">
          <MapPin size={16} />
          <span>Jabodetabek</span>
        </div>
      </div>
      <div className="flex gap-6 text-[#2a4c44] font-semibold">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 hover:opacity-70 transition-opacity">
          <Home size={20} />
          <span>Home</span>
        </button>
        <button onClick={() => navigate('/mytickets')} className="flex items-center gap-2 hover:opacity-70 transition-opacity">
          <Ticket size={20} />
          <span>Tickets</span>
        </button>
        <button onClick={() => navigate('/wishlist')} className="flex items-center gap-2 hover:opacity-70 transition-opacity">
          <Heart size={20} />
          <span>Wishlist</span>
        </button>
      </div>
    </header>
  );
}