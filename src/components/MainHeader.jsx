import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Ticket, Heart, User, LogOut, Code, Star, List, MapPin } from 'lucide-react';

export default function MainHeader({ onNavigateHome, onNavigateLogin, onNavigateTickets, onNavigateWishlist, user, onLogoutClick }) {
    const navigate = useNavigate(); 
    const navTo = (path, propFunc) => {
        if (propFunc) {
            propFunc();
        } else if (navigate) {
            navigate(path);
        }
    };

    const navToAboutDeveloper = () => {
        navTo('/about-developer');
    };
    
    return (
        <header className="px-6 md:px-12 py-4 bg-[#f5f1dc] shadow-md sticky top-0 z-50 transition-all duration-300">
            <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
                
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 cursor-pointer group" onClick={() => navTo('/', onNavigateHome)}>
                        <div className="text-4xl font-black text-[#2a4c44] tracking-tighter leading-none">
                            CINIX<span className="text-amber-500">.</span>
                        </div>
                    </div>
                    <button onClick={navToAboutDeveloper} className="flex items-center gap-2 bg-amber-500 text-black px-3 py-1.5 rounded-full hover:shadow-lg hover:bg-amber-400 transition-all font-bold shadow-md transform hover:-translate-y-0.5 text-sm hidden lg:flex">
                        <Code size={16} /><span>Developer</span>
                    </button>
                </div>

                <div className="flex items-center gap-8 text-[#2a4c44] font-bold text-base">
                    
                    <nav className="hidden lg:flex items-center gap-5">
                        <button onClick={() => navTo('/', onNavigateHome)} className="cursor-pointer flex items-center gap-1 hover:text-amber-600 transition hover:scale-105 text-sm"><Home size={18} /><span className="hidden lg:inline">Home</span></button>
                        
                        <button onClick={() => navTo('/mytickets', onNavigateTickets)} className="cursor-pointer flex items-center gap-1 hover:text-amber-600 transition hover:scale-105 text-sm"><List size={18} /><span className="hidden lg:inline">Tickets</span></button>
                        
                        <button onClick={() => navTo('/wishlist', onNavigateWishlist)} className="cursor-pointer flex items-center gap-1 hover:text-amber-600 transition hover:scale-105 text-sm" > <Star size={18} /><span className="hidden lg:inline">Wishlist</span> </button>
                    </nav>

                    {user ? (
                        <div className="flex items-center gap-4 group relative cursor-pointer pl-4 border-l-2 border-gray-300">
                            <div className="text-right hidden md:block leading-tight">
                                <p className="text-[11px] text-gray-500 uppercase font-extrabold">Welcome,</p>
                                <p className="font-black text-[#2a4c44] text-base truncate max-w-[120px]">{user.name}</p>
                            </div>
                            <div className="w-10 h-10 bg-gradient-to-tr from-[#2a4c44] to-[#1e3630] text-white rounded-full flex items-center justify-center shadow-lg group-hover:shadow-amber-400/50 transition-all border-2 border-white"><User size={20} /></div>
                            
                            <div className="absolute top-full right-0 pt-1 hidden group-hover:block z-50">
                                <button onClick={onLogoutClick} className="bg-white shadow-xl border border-gray-200 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 text-sm font-bold w-40 flex items-center gap-2 transition"><LogOut size={18} /><span>Logout</span></button>
                            </div>
                        </div>
                    ) : (
                        <button onClick={() => navTo('/login', onNavigateLogin)} className="flex items-center gap-2 bg-gradient-to-r from-[#2a4c44] to-[#1e3630] text-white px-5 py-2.5 rounded-full hover:shadow-lg hover:from-[#3a6a5e] transition-all font-bold shadow-md transform hover:-translate-y-0.5 text-sm"><User size={18} /><span>Login</span></button>
                    )}
                </div>
            </div>
        </header>
    );
}