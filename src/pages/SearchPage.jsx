import React, { useState, useEffect } from "react";
import axios from "axios";
import { Search, ChevronRight, MapPin, Loader2, Film, User, Clock, Home, LogOut, Code, Star, List, ArrowLeft } from "lucide-react"; 
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "https://cinix-be.vercel.app"; 

const SearchHeader = ({ user, onLogoutClick }) => {
    const navigate = useNavigate(); 
    
    const navTo = (path) => {
        navigate(path);
    };

    return (
        <header className="px-6 md:px-12 py-4 bg-[#f5f1dc] shadow-md sticky top-0 z-50 transition-all duration-300">
            <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
                
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 cursor-pointer group" onClick={() => navTo('/')}>
                        <div className="text-4xl font-black text-[#2a4c44] tracking-tighter leading-none hidden md:block">
                            CINIX<span className="text-amber-500">.</span>
                        </div>
                        <div className="w-8 h-8 bg-amber-400 rounded-lg flex md:hidden items-center justify-center">
                            <span className="text-[#2a4c44] font-black text-lg">C</span>
                        </div>
                    </div>

                    <button onClick={() => navTo('/about-developer')} className="flex items-center gap-2 bg-amber-500 text-black px-3 py-1.5 rounded-full hover:shadow-lg hover:bg-amber-400 transition-all font-bold shadow-md transform hover:-translate-y-0.5 text-sm hidden lg:flex">
                        <Code size={16} /><span>Developer</span>
                    </button>
                </div>

                <div className="flex items-center gap-8 text-[#2a4c44] font-bold text-base">
                    
                    <nav className="hidden lg:flex items-center gap-5">
                        <button onClick={() => navTo('/')} className="cursor-pointer flex items-center gap-1 hover:text-amber-600 transition hover:scale-105 text-sm">
                            <Home size={18} /><span className="hidden lg:inline">Home</span>
                        </button>
                        
                        <button onClick={() => navTo('/mytickets')} className="cursor-pointer flex items-center gap-1 hover:text-amber-600 transition hover:scale-105 text-sm">
                            <List size={18} /><span className="hidden lg:inline">Tickets</span>
                        </button>
                        
                        <button onClick={() => navTo('/wishlist')} className="cursor-pointer flex items-center gap-1 hover:text-amber-600 transition hover:scale-105 text-sm">
                            <Star size={18} /><span className="hidden lg:inline">Wishlist</span>
                        </button>
                    </nav>

                    {user ? (
                        <div className="flex items-center gap-4 group relative cursor-pointer pl-4 border-l-2 border-gray-300">
                            <div className="text-right hidden md:block leading-tight">
                                <p className="text-[11px] text-gray-500 uppercase font-extrabold">Welcome,</p>
                                <p className="font-black text-[#2a4c44] text-base truncate max-w-[120px]">{user.name}</p>
                            </div>
                            <div className="w-10 h-10 bg-gradient-to-tr from-[#2a4c44] to-[#1e3630] text-white rounded-full flex items-center justify-center shadow-lg group-hover:shadow-amber-400/50 transition-all border-2 border-white">
                                <User size={20} />
                            </div>
                            
                            <div className="absolute top-full right-0 pt-2 hidden group-hover:block z-50">
                                <button onClick={onLogoutClick} className="bg-white shadow-xl border border-gray-200 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 text-sm font-bold w-40 flex items-center gap-2 transition">
                                    <LogOut size={18} /><span>Logout</span>
                                </button>
                            </div>
                        </div>
                    ) : (
                        <button onClick={() => navTo('/login')} className="flex items-center gap-2 bg-gradient-to-r from-[#2a4c44] to-[#1e3630] text-white px-5 py-2.5 rounded-full hover:shadow-lg hover:from-[#3a6a5e] transition-all font-bold shadow-md transform hover:-translate-y-0.5 text-sm">
                            <User size={18} /><span>Login</span>
                        </button>
                    )}
                </div>
            </div>
        </header>
    );
};

const formatDuration = (minutes) => {
  if (!minutes) return "";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h > 0) return `${h}j ${m}m`;
  return `${m} Menit`;
};

const getCurrentUser = () => {
  try {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  } catch (err) {
    return null;
  }
};

const MovieRow = ({ movie, onSelect }) => (
  <button
    onClick={onSelect}
    className="group flex items-start gap-4 w-full p-4 bg-[#f5f1dc] rounded-xl shadow-md hover:shadow-xl hover:bg-white hover:scale-[1.01] transition-all duration-300 border border-transparent hover:border-amber-400"
  >
    <img 
      src={movie.poster_url || "https://placehold.co/100x150"} 
      alt={movie.title}
      className="w-16 h-24 object-cover rounded-lg shadow-sm bg-gray-300"
    />

    <div className="flex-1 text-left">
      <h3 className="text-lg font-black text-[#2a4c44] group-hover:text-amber-600 transition-colors line-clamp-1">
        {movie.title}
      </h3>
      
      <div className="flex items-center gap-3 mt-1.5">
        <span className="text-[10px] font-bold px-2 py-0.5 rounded text-white bg-[#2a4c44]">
            {movie.age_rating || "SU"}
        </span>

        {movie.duration && (
          <span className="text-xs font-semibold text-gray-500 flex items-center gap-1">
              <Clock size={12} className="text-amber-600" />
              {formatDuration(movie.duration)}
          </span>
        )}
      </div>
      
      {movie.description && (
        <p className="text-xs text-gray-500 mt-2 line-clamp-2 leading-relaxed">
            {movie.description}
        </p>
      )}
    </div>

    <div className="self-center bg-[#2a4c44]/10 p-2 rounded-full group-hover:bg-amber-400 group-hover:text-white transition-colors">
        <ChevronRight size={20} className="text-[#2a4c44] group-hover:text-white" />
    </div>
  </button>
);

export default function SearchPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const [user, setUser] = useState(getCurrentUser());

  const [debouncedQuery, setDebouncedQuery] = useState(query);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const fetchMovies = async () => {
      if (!debouncedQuery || debouncedQuery.length < 2) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const response = await axios.get(`${API_BASE_URL}/search`, {
          params: { query: debouncedQuery }
        });
        
        const data = response.data?.data || [];
        setResults(data);
      } catch (error) {
        console.error("Search error:", error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, [debouncedQuery]);

  const handleSelectMovie = (movie) => {
    navigate(`/detail/${movie.id_movie}`, { 
        state: { 
            movie: movie
        } 
    }); 
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#6a8e7f] flex flex-col">
      <SearchHeader user={user} onLogoutClick={handleLogout} />

      <main className="flex-grow w-full max-w-4xl mx-auto p-6 md:p-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
                <button 
                  onClick={() => navigate(-1)} 
                  className="group p-1 -ml-1 text-[#fff9e6]/80 hover:text-[#fff9e6] transition-colors rounded-full"
                  title="Kembali"
                >
                  <ArrowLeft size={32} className="group-hover:-translate-x-1 transition-transform" />
                </button>
                <h1 className="text-3xl font-black text-[#fff9e6] tracking-tight">Cari Film</h1>
            </div>
            <p className="text-gray-200 pl-1">Temukan film favoritmu yang sedang tayang.</p>
        </div>

        <div className="relative mb-8 group">
          <input
            type="text"
            placeholder="Judul yang ingin Anda temukan… (min. 2 huruf"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-14 pr-12 py-4 rounded-2xl bg-[#f5f1dc] text-[#2a4c44] placeholder-gray-400 font-semibold text-lg shadow-xl focus:outline-none focus:ring-4 focus:ring-amber-400/50 transition-all"
          />
          <Search
            size={28}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-amber-500 transition-colors"
          />
        </div>

        <div className="space-y-4 pb-20">
          {results.length > 0 ? (
            results.map((movie) => (
              <MovieRow
                key={movie.id_movie}
                movie={movie}
                onSelect={() => handleSelectMovie(movie)}
              />
            ))
          ) : (
            <div className="text-center py-20 bg-black/10 rounded-2xl border-2 border-dashed border-white/20">
                {isLoading ? (
                    <div className="flex flex-col items-center gap-2">
                        <Loader2 className="animate-spin text-[#fff9e6]" size={32} />
                        <p className="text-[#fff9e6] font-bold">Sedang mencari...</p>
                    </div>
                ) : debouncedQuery.length > 1 ? (
                    <>
                        <p className="text-[#fff9e6] font-bold text-lg">Film tidak ditemukan :(</p>
                        <p className="text-sm text-gray-300">Coba kata kunci lain atau cek ejaanmu.</p>
                    </>
                ) : (
                    <>
                        <Film size={48} className="text-[#fff9e6] opacity-50 mx-auto mb-2" />
                        <p className="text-[#fff9e6] font-bold text-lg">Siap Nonton Apa Hari Ini?</p>
                        <p className="text-sm text-gray-300">Mulai dengan memilih kolom pencarian</p>
                    </>
                )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}