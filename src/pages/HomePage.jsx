import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Search, Star, PlayCircle, Clock, Calendar, ArrowLeft, ArrowRight, Sparkles, Film } from "lucide-react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';
import MainHeader from "../components/MainHeader";

const API_BASE_URL = "https://cinix-be.vercel.app";

const formatDuration = (minutes) => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h ${m}m`;
};

export default function HomePage({ onNavigateHome, onNavigateLogin, onNavigateSearch, onNavigateDetail, onNavigateTickets, onNavigateWishlist, user, onLogoutClick }) {
  const [movies, setMovies] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const sliderRef = useRef(null);

  const promoBanners = [
    { id: 1, image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=2000&auto=format&fit=crop", title: "CINEMA WEEKEND DEAL", subtitle: "Diskon 50% Tiket Kedua", tag: "Limited Offer" },
    { id: 2, image: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=2000&auto=format&fit=crop", title: "PREMIERE EXCLUSIVE", subtitle: "Nonton Lebih Awal, Lebih Eksklusif", tag: "Coming Soon" },
    { id: 3, image: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2000&auto=format&fit=crop", title: "MOVIE MARATHON", subtitle: "Beli Paket Popcorn Gratis Minuman", tag: "Bundle Hemat" }
  ];

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/movies`);
        const data = res.data.data || res.data;
        if (Array.isArray(data)) {
            setMovies(data);
        }
      } catch (err) {
        console.error("Gagal ambil movies:", err);
      }
    };

    const fetchRecommendations = async () => {
      if (!user) {
        setRecommendations([]);
        return;
      }
      
      try {
        const url = `${API_BASE_URL}/recommendations`;
        const config = {
            withCredentials: true,
        };
        const res = await axios.get(url, config);
        const data = res.data.recommendations || res.data.data || res.data;
        if (Array.isArray(data)) {
          setRecommendations(data);
        } else {
          setRecommendations([]);
        }
      } catch (err) {
        console.error("Gagal ambil recommendations:", err);
        setRecommendations([]);
      }
    };

    setLoading(true);

    Promise.allSettled([fetchMovies(), fetchRecommendations()]).then(() => {
      setTimeout(() => {
        setLoading(false);
      }, 1000); 
    });

  }, [user]); 

  const moviesForSwiper = movies.length > 0 && movies.length < 8 ? [...movies, ...movies, ...movies] : movies;

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
                Sedang Memuat Bioskop...
            </p>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#6a8e7f] text-gray-900 font-sans selection:bg-amber-500 selection:text-black animate-in fade-in duration-700">
      <MainHeader 
        onNavigateHome={onNavigateHome} 
        onNavigateLogin={onNavigateLogin} 
        onNavigateTickets={onNavigateTickets} 
        onNavigateWishlist={onNavigateWishlist} 
        user={user} 
        onLogoutClick={onLogoutClick} 
      />
      
      <div className="w-full h-[380px] md:h-[600px] bg-black relative shadow-2xl">
        <Swiper 
            spaceBetween={0} 
            effect={'fade'} 
            centeredSlides={true} 
            autoplay={{ delay: 5000, disableOnInteraction: false }} 
            pagination={{ clickable: true, dynamicBullets: true }} 
            navigation={true} 
            modules={[Autoplay, Pagination, Navigation, EffectFade]} 
            className="w-full h-full hero-swiper"
        >
          {promoBanners.map((banner) => (
            <SwiperSlide key={banner.id}>
              <div className="relative w-full h-full">
                <img src={banner.image} alt={banner.title} className="w-full h-full object-cover opacity-85" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a2c38] via-transparent to-black/40"></div>
                <div className="absolute bottom-20 left-6 md:left-16 max-w-3xl text-white drop-shadow-2xl animate-in slide-in-from-bottom-10 duration-1000">
                  <span className="bg-amber-500 text-black text-xs md:text-sm font-extrabold px-4 py-1.5 rounded-full uppercase tracking-wider mb-4 inline-block shadow-lg">{banner.tag}</span>
                  <h1 className="text-4xl md:text-7xl font-black mb-3 leading-tight tracking-tight">{banner.title}</h1>
                  <p className="text-lg md:text-2xl text-gray-100 font-medium mb-8">{banner.subtitle}</p>
                  <button className="bg-white text-black px-8 py-4 rounded-full font-extrabold flex items-center gap-3 hover:bg-amber-400 transition-all shadow-lg hover:shadow-amber-400/50 hover:scale-105 active:scale-95">
                    <PlayCircle size={24} fill="currentColor" />LIHAT PROMO
                  </button>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      
      <section className="pt-16 pb-8 px-4 md:px-8 bg-gradient-to-b from-[#6a8e7f] to-[#5a7e6f]">
        <div className="w-full flex justify-between items-end mb-10">
          <div>
            <h2 className="text-4xl font-black text-[#fff9e6] tracking-tight mb-2 drop-shadow-lg">Sedang Tayang</h2>
            <div className="h-2 w-24 bg-amber-500 rounded-full"></div>
          </div>
          <div 
            className="flex items-center gap-3 text-[#fff9e6] bg-black/20 px-6 py-3 rounded-full hover:bg-amber-500 hover:text-black cursor-pointer transition-all duration-300 group backdrop-blur-sm" 
            onClick={onNavigateSearch}
          >
            <span className="font-bold text-lg hidden md:inline group-hover:tracking-wide transition-all">Cari Film</span>
            <Search size={28} className="group-hover:scale-110 transition-transform"/>
          </div>
        </div>
        
        <div className="py-4 px-2">
          <Swiper 
            onBeforeInit={(swiper) => { sliderRef.current = swiper; }} 
            modules={[Navigation, Autoplay]} 
            spaceBetween={30} 
            slidesPerView={1} 
            loop={true} 
            autoplay={{ delay: 3000, disableOnInteraction: false }} 
            breakpoints={{ 
                640: { slidesPerView: 2 }, 
                768: { slidesPerView: 3 }, 
                1024: { slidesPerView: 4 }, 
                1280: { slidesPerView: 5 }, 
            }} 
            className="w-full"
          >
            {moviesForSwiper.map((movie, index) => (
              <SwiperSlide key={index}>
                <div className="cursor-pointer group perspective w-full" onClick={() => onNavigateDetail(movie)}>
                  <div className="rounded-3xl overflow-hidden bg-gradient-to-br from-[#1a2c38] to-[#0f172a] shadow-xl hover:shadow-2xl hover:shadow-amber-500/20 transition-all duration-500 border border-white/10 group-hover:border-amber-500/50 relative transform-gpu group-hover:-translate-y-2">
                      <div className="h-[420px] relative overflow-hidden">
                        <div className="absolute inset-0 bg-black/0 transition-all duration-500 group-hover:bg-black/20 z-10"></div>
                        <img 
                            src={movie.poster_url} 
                            alt={movie.title} 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                            onError={(e) => {e.target.onerror = null; e.target.src = "https://via.placeholder.com/320x450?text=No+Image";}} 
                        />
                        <div className="absolute top-4 right-4 z-20 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-xl text-amber-400 font-extrabold flex items-center gap-1.5 border border-amber-500/30 shadow-lg">
                            <Star size={16} fill="#fbbf24" /> {movie.rating ? movie.rating + "/10" : "N/A"}
                        </div>
                      </div>
                      <div className="p-5 relative z-20 bg-gradient-to-t from-[#0f172a] via-[#1a2c38] to-transparent -mt-10 pt-12 text-center">
                        <h3 className="font-black text-xl text-white truncate px-1 mb-2 group-hover:text-amber-400 transition-colors duration-300">{movie.title}</h3>
                        <p className="text-sm text-gray-300 font-medium mb-3 px-4 truncate">{movie.genre}</p>
                        <div className="flex justify-center items-center gap-4 text-xs text-gray-400 font-semibold border-t border-white/10 pt-3 mx-4">
                            <div className="flex items-center gap-1.5"><Clock size={14} className="text-amber-500"/><span>{formatDuration(movie.duration)}</span></div>
                            <div className="flex items-center gap-1.5"><Calendar size={14} className="text-amber-500"/><span>Tayang</span></div>
                        </div>
                      </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        
        <div className="flex justify-center items-center gap-6 mt-8 text-[#fff9e6] w-full">
            <button onClick={() => sliderRef.current?.slidePrev()} className="p-4 bg-[#fff9e6] rounded-full shadow-lg text-[#2a4c44] hover:bg-amber-400 hover:text-black hover:scale-110 transition-all active:scale-95">
                <ArrowLeft size={28} strokeWidth={3} />
            </button>
            <button onClick={() => sliderRef.current?.slideNext()} className="p-4 bg-[#fff9e6] rounded-full shadow-lg text-[#2a4c44] hover:bg-amber-400 hover:text-black hover:scale-110 transition-all active:scale-95">
                <ArrowRight size={28} strokeWidth={3} />
            </button>
        </div>
      </section>
      
      <section className="py-16 px-4 md:px-12 bg-[#5a7e6f]">
        <div className="mb-10 flex items-center gap-3">
            <div className="bg-amber-500 p-2 rounded-lg text-black shadow-lg">
                <Sparkles size={32} />
            </div>
            <div>
                <h2 className="text-3xl md:text-4xl font-black text-[#fff9e6] tracking-tight drop-shadow-md">Rekomendasi Untukmu</h2>
                <p className="text-[#dbece5] font-medium mt-1">
                    {user ? `Pilihan spesial buat nemenin ${user.name} minggu ini!` : "Film pilihan terbaik minggu ini."}
                </p>
            </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 md:gap-8">
            {recommendations.length > 0 ? (
                recommendations.map((movie, index) => (
                    <div 
                        key={index} 
                        className="group cursor-pointer bg-[#2a4c44] rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-amber-500/20 transition-all duration-300 transform hover:-translate-y-2 border border-white/5" 
                        onClick={() => onNavigateDetail(movie)}
                    >
                        <div className="relative overflow-hidden aspect-[2/3]">
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 z-10"></div>
                            <img 
                                src={movie.poster_url} 
                                alt={movie.title} 
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                                onError={(e) => {e.target.onerror = null; e.target.src = "https://via.placeholder.com/320x450?text=No+Image";}} 
                            />
                            <div className="absolute top-3 left-3 z-20 bg-amber-500/90 backdrop-blur-sm px-2 py-1 rounded-md text-black text-xs font-bold shadow-md">REKOMENDASI</div>
                        </div>
                        <div className="p-4">
                            <h3 className="font-bold text-lg text-white truncate mb-1 group-hover:text-amber-400 transition-colors">{movie.title}</h3>
                            <div className="flex items-center justify-between text-xs text-gray-300">
                                <span className="truncate max-w-[80px]">{movie.genre?.split(',')[0]}</span>
                                <div className="flex items-center gap-1 text-amber-400 font-bold"><Star size={12} fill="currentColor" />{movie.rating || "-"}</div>
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <div className="col-span-full text-center py-10 text-white/50 bg-black/10 rounded-xl flex flex-col items-center gap-2">
                    <p>Belum ada rekomendasi untuk saat ini.</p>
                </div>
            )}
        </div>
      </section>
    </div>
  );
}