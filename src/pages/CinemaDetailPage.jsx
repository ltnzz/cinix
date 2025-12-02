import React from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { MapPin, Star, ArrowLeft, Calendar, Clock } from "lucide-react";
import DetailHeader from "../components/detMovieHeader"; 

export default function CinemaDetailPage({ onNavigateHome, onNavigateLogin, onNavigateBooking }) {
    const location = useLocation();
    const navigate = useNavigate();
    const cinema = location.state?.cinemaData;

    const handleSelectTime = (movie, time) => {
        navigate('/booking', {
            state: {
                movie: { 
                    title: movie.title, 
                    img: movie.poster_url, 
                    poster_url: movie.poster_url 
                },
                cinema: cinema.name,
                time: time
            }
        });
    };

return (
    <div className="min-h-screen bg-[#6a8e7f] font-sans">
        <DetailHeader onNavigateHome={onNavigateHome} onNavigateLogin={onNavigateLogin} />

        <main className="max-w-5xl mx-auto px-6 py-8">
        
        <div className="mb-8 animate-in slide-in-from-bottom-4 duration-500">
            <button 
                onClick={() => navigate(-1)} 
                className="flex items-center gap-2 text-[#fff9e6] hover:text-amber-400 mb-4 transition-colors font-semibold"
            >
                <ArrowLeft size={20} /> Kembali
            </button>

            <div className="bg-[#f5f1dc] rounded-3xl p-8 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <span className={`text-xs font-bold px-2 py-1 rounded text-white ${
                            cinema.brand === 'XXI' ? 'bg-[#2a4c44]' : cinema.brand === 'CGV' ? 'bg-red-600' : 'bg-blue-600'
                        }`}>
                            {cinema.brand}
                        </span>
                        <div className="flex items-center gap-1 text-gray-500 text-sm font-medium">
                            <MapPin size={14} /> {cinema.city || "Jakarta"}
                        </div>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-black text-[#2a4c44] leading-tight">
                        {cinema.name}
                    </h1>
                    <p className="text-gray-500 mt-2 text-sm max-w-lg">
                        Nikmati pengalaman menonton terbaik dengan teknologi audio visual terkini di {cinema.name}.
                    </p>
                </div>
                
                <div className="flex gap-4">
                    <div className="text-center bg-white p-3 rounded-xl border border-[#2a4c44]/10 shadow-sm">
                        <div className="text-2xl font-black text-[#2a4c44]">4</div>
                        <div className="text-[10px] uppercase font-bold text-gray-400">Studio</div>
                    </div>
                    <div className="text-center bg-white p-3 rounded-xl border border-[#2a4c44]/10 shadow-sm">
                        <div className="text-2xl font-black text-[#2a4c44]">Dolby</div>
                        <div className="text-[10px] uppercase font-bold text-gray-400">Audio</div>
                    </div>
                </div>
            </div>
        </div>

        <h2 className="text-2xl font-bold text-[#fff9e6] mb-6 flex items-center gap-2">
            <Calendar size={24} /> Sedang Tayang Disini
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {moviesPlaying.map((movie) => (
                <div key={movie.id} className="bg-white rounded-2xl overflow-hidden shadow-lg group hover:-translate-y-1 transition-all duration-300">
                    <div className="flex h-48">
                        <div className="w-32 h-full shrink-0">
                            <img 
                                src={movie.poster_url} 
                                alt={movie.title} 
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="p-4 flex flex-col justify-between flex-1">
                            <div>
                                <h3 className="text-lg font-black text-[#2a4c44] line-clamp-2 leading-tight mb-1">
                                    {movie.title}
                                </h3>
                                <p className="text-xs text-gray-500 font-medium mb-2">{movie.genre}</p>
                                <div className="flex items-center gap-1 text-amber-500 font-bold text-sm">
                                    <Star size={14} fill="currentColor" /> {movie.rating}
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="p-4 bg-gray-50 border-t border-gray-100">
                        <div className="flex items-center gap-2 mb-3 text-xs font-bold text-gray-400 uppercase">
                            <Clock size={12} /> Jadwal Hari Ini
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {movie.times.map((time) => (
                                <button
                                    key={time}
                                    onClick={() => handleSelectTime(movie, time)}
                                    className="px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-sm font-bold text-[#2a4c44] hover:bg-[#2a4c44] hover:text-white hover:border-[#2a4c44] transition-colors shadow-sm"
                                >
                                    {time}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            ))}
        </div>

        </main>
    </div>
    

);
}