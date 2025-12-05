import React from "react";
import { useNavigate } from "react-router-dom";
import { Home, Ticket, Heart, List, Star, Code } from "lucide-react"; 

export default function AuthHeader() {
    const navigate = useNavigate();

    const navTo = (path) => {
        if (navigate) {
            navigate(path);
        }
    };
    
    const navButtonStyle = "flex items-center gap-1 hover:text-amber-600 transition hover:scale-105 text-sm font-medium";

    return (
        <header className="px-6 md:px-12 py-4 bg-[#f5f1dc] shadow-md sticky top-0 z-50 transition-all duration-300">
            <div className="flex items-center justify-between max-w-7xl mx-auto w-full">
                
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/')} className="cursor-pointer flex items-center gap-2">
                        <div className="text-4xl font-black text-[#2a4c44] tracking-tighter leading-none">
                            CINIX<span className="text-amber-500">.</span>
                        </div>
                    </button>
                </div>
                
                <div className="flex gap-6 text-[#2a4c44] font-medium text-base">
                    <nav className="hidden lg:flex items-center gap-5">
                        
                        <button onClick={() => navTo('/')} className={navButtonStyle}>
                            <Home size={18} /><span>Home</span>
                        </button>
                        
                        <button onClick={() => navTo('/mytickets')} className={navButtonStyle}>
                            <List size={18} /><span>Tickets</span>
                        </button>
                        
                        <button onClick={() => navTo('/wishlist')} className={navButtonStyle}>
                            <Star size={18} /><span>Wishlist</span> 
                        </button>

                        <button onClick={() => navTo('/about-developer')} className={navButtonStyle}>
                            <Code size={18} /><span>Developer</span> 
                        </button>
                    </nav>
                </div>
            </div>
        </header>
    );
}