import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Home, Film } from 'lucide-react';
import bone from "../assets/img/bone.jpg"
import ijul from "../assets/img/ijul2.png"
import benita from "../assets/img/benita.jpg"
import paras from "../assets/img/paras.jpg"

const TEAM_MEMBERS = [
    {
        name: "Latanza Akbar Fadilah",
        role: "Project Lead (Full-Stack)",
        nim: "2410501004",
        photoUrl: bone,
    },
    {
        name: "Zulfikar Hasan",
        role: "UI Designer, Front-End Developer",
        nim: "2410501016",
        photoUrl: ijul,
    },
    {
        name: "Faraz Thifal",
        role: "Back-End Developer",
        nim: "2410501022",
        photoUrl: paras,
    },
    {
        name: "Benita Aryani",
        role: "Front-End Developer",
        nim: "2410501023",
        photoUrl: benita,
    },
];

const CustomHeader = ({ navigate }) => (
    <header className="bg-[#1f3630] text-[#fff9e6] p-3 shadow-xl sticky top-0 z-50 flex justify-between items-center border-b-4 border-amber-500/50">
        <button 
            onClick={() => navigate(-1)} 
            className="flex items-center gap-1 text-[#fff9e6] hover:text-amber-400 transition-colors px-2 py-1 rounded-lg"
        >
            <ChevronLeft size={20} />
            <span className="font-bold hidden sm:inline text-sm">Kembali</span>
        </button>
        
        <div className="text-center">
            <h1 className="text-lg font-black tracking-wider text-amber-400">Cinix Team</h1>
        </div>

        <button 
            onClick={() => navigate('/')} 
            className="p-1 text-[#fff9e6] hover:bg-white/10 rounded-full transition-colors"
            title="Home"
        >
            <Home size={20} />
        </button>
    </header>
);

const MemberCard = ({ member }) => (
    <div className="bg-[#1f3630] rounded-lg shadow-lg transition-transform hover:scale-[1.02] duration-300 relative overflow-hidden group border border-amber-500/50">
        
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,#3a6a5e_10%,transparent_50%)] opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>

        <div className="p-1 flex flex-col items-center relative z-10"> 
            
            <div className="w-full aspect-square max-w-20 md:max-w-24 rounded-full p-0.5 bg-white/10 ring-1 ring-[#fff9e6] shadow-md mb-1 mt-1 transition-all group-hover:ring-amber-500">
                <img
                    src={member.photoUrl}
                    alt={member.name}
                    className="w-full h-full object-cover rounded-full ring-1 ring-[#2a4c44]"
                    onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/400x400/8B0000/FFFFFF?text=NO+IMG"; }}
                />
            </div>

            <div className="text-center w-full">
                <h3 className="text-sm md:text-base font-black text-[#fff9e6] leading-tight">{member.name}</h3>
                
                <p className="text-amber-400 font-semibold text-xs mt-0">{member.role}</p>

                <div className="mt-1 pt-1 border-t border-white/30 w-1/2 mx-auto"> 
                    <p className="text-[9px] text-gray-300 font-mono tracking-wider">{member.nim}</p>
                </div>
            </div>
        </div>
    </div>
);


export default function AboutDeveloperPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#6a8e7f] font-sans pb-20">
            
            <CustomHeader navigate={navigate} />

            <main className="container mx-auto px-4 md:px-8 py-6 max-w-7xl">
                
                <div className="mb-4 animate-in slide-in-from-top-6 duration-500 text-center">
                    <h1 className="text-3xl md:text-4xl font-black text-[#fff9e6] drop-shadow-md flex items-center justify-center gap-3">
                        <Film size={32} className="text-amber-400"/> Struktur Tim
                    </h1>
                    <p className="text-[#dbece5] mt-1 text-base">Mengenal tim inti di balik pengembangan Cinix Studio.</p>
                </div>

                <div className="bg-[#2a4c44] p-2 md:p-3 rounded-3xl shadow-2xl shadow-black/30">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {TEAM_MEMBERS.map((member, index) => (
                            <MemberCard key={index} member={member} />
                        ))}
                    </div>
                    
                    <div className="mt-4 pt-3 border-t border-white/20">
                        <p className="text-center text-xs text-gray-400">
                            Ciao bangsul
                        </p>
                    </div>
                </div>

            </main>
        </div>
    );
}