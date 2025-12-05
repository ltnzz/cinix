import React, { useState, useEffect } from "react";
import { Clock, Filter, Search, PlayCircle, Lock, X, Heart, ChevronLeft, Share2, User, Film } from "lucide-react"; 
import { useNavigate, useParams, useLocation } from "react-router-dom";
import axios from "axios"; 
import MainHeader from "../components/MainHeader";

const formatDuration = (minutes) => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h ${m}m`;
};

const detectCity = (theaterName) => {
  const name = theaterName.toUpperCase();
  if (name.includes("BANDUNG")) return "BANDUNG";
  if (name.includes("SURABAYA")) return "SURABAYA";
  return "JAKARTA";
};

const getNext7Days = () => {
  const days = ['SUN', 'MON', 'TUE', 'WED', 'THR', 'FRI', 'SAT'];
  const dates = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    dates.push({
      day: days[d.getDay()],
      date: d.getDate().toString().padStart(2, '0'),
      fullDateStr: d.toISOString().split('T')[0] 
    });
  }
  return dates;
};

const DateChip = ({ day, date, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center justify-center w-16 h-20 rounded-2xl transition-all duration-300 border-2 ${
      isActive
        ? "bg-[#f5f1dc] text-[#2a4c44] border-[#f5f1dc] shadow-lg scale-105"
        : "bg-transparent text-[#f5f1dc] border-white/20 hover:border-amber-400/50 hover:bg-white/5"
    }`}
  >
    <span className="text-xs font-medium opacity-80">{day}</span>
    <span className="font-black text-2xl">{date}</span>
  </button>
);

const CityChip = ({ city, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`px-5 py-2 rounded-full text-xs font-bold transition-all duration-300 ${
      isActive
        ? "bg-amber-400 text-[#2a4c44] shadow-lg shadow-amber-400/20 scale-105"
        : "bg-[#2a4c44]/40 border border-white/20 text-white hover:bg-[#2a4c44] hover:border-amber-400"
    }`}
  >
    {city}
  </button>
);

export default function DetailPage({ onNavigateHome, onNavigateLogin, onNavigateBooking, user }) {
  const navigate = useNavigate();
  const { id_movie } = useParams();
  const location = useLocation(); 

  const [movie, setMovie] = useState(location.state?.movie || null);
  const [loading, setLoading] = useState(true);

  const [citiesData, setCitiesData] = useState({});
  const [availableCities, setAvailableCities] = useState([]);
  
  const [activeTab, setActiveTab] = useState("jadwal");
  
  const [dates] = useState(getNext7Days());
  const [activeDate, setActiveDate] = useState(dates[0].fullDateStr);
  
  const [activeCity, setActiveCity] = useState("");
  
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const response = await axios.get(`https://cinix-be.vercel.app/movies/${id_movie}`, 
          { withCredentials: true }
        );
        const data = response.data.movie;
        setMovie(data);

        const processedData = {};
        const foundCities = new Set();
        const jadwalList = data.schedules || [];

        jadwalList.forEach(schedule => {
            const theaterName = schedule.theater?.name || "Unknown Theater";
            const studioName = schedule.studio?.name || "Regular";
            const cityName = detectCity(theaterName);
            foundCities.add(cityName);

            if (!processedData[cityName]) processedData[cityName] = {};
            if (!processedData[cityName][theaterName]) {
                processedData[cityName][theaterName] = { brand: "Cinema XXI", schedules: [] };
            }

            processedData[cityName][theaterName].schedules.push({
                id_schedule: schedule.id_schedule,
                time: new Date(schedule.show_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                price: schedule.price,
                studio: studioName,
                id_studio: schedule.studio?.id_studio || schedule.id_studio
            });
        });

        Object.keys(processedData).forEach(city => {
            Object.keys(processedData[city]).forEach(theater => {
                processedData[city][theater].schedules.sort((a, b) => a.time.localeCompare(b.time));
            });
        });

        setCitiesData(processedData);
        const cityList = Array.from(foundCities);
        setAvailableCities(cityList);
        if (cityList.length > 0 && !activeCity) setActiveCity(cityList[0]);

      } catch (error) {
        console.error("Error fetching movie:", error);
      } finally {
        setTimeout(() => {
            setLoading(false);
        }, 800);
      }
    };

    if (id_movie) fetchMovie();
  }, [id_movie]);

  useEffect(() => {
    if (user && id_movie) {
        const wishlistKey = `wishlist_${user.email || user.uid || user.id}`;
        const storedWishlist = localStorage.getItem(wishlistKey);
        
        if (storedWishlist) {
            const wishlist = JSON.parse(storedWishlist);
            const found = wishlist.some(item => item.id == id_movie);
            setIsWishlisted(found);
        }
    }
  }, [user, id_movie]);

  const handleToggleWishlist = () => {
    if (!user) {
        setShowLoginModal(true);
        return;
    }

    const wishlistKey = `wishlist_${user.email || user.uid || user.id}`;
    let currentWishlist = [];
    const storedData = localStorage.getItem(wishlistKey);
    
    if (storedData) {
        currentWishlist = JSON.parse(storedData);
    }

    if (isWishlisted) {
        const updatedWishlist = currentWishlist.filter(item => item.id != (movie.id || id_movie));
        localStorage.setItem(wishlistKey, JSON.stringify(updatedWishlist));
        setIsWishlisted(false);
    } else {
        let finalDate = movie.release_date || movie.date;
        if (!finalDate && movie.schedules && movie.schedules.length > 0) {
            finalDate = movie.schedules[0].show_time;
        }
        if (!finalDate) {
            finalDate = new Date().toISOString();
        }

        const movieDataToSave = {
            id: movie.id || id_movie,
            title: movie.title,
            poster_path: movie.poster_url || movie.poster_path, 
            release_date: finalDate, 
            vote_average: movie.age_rating
        };

        currentWishlist.push(movieDataToSave);
        localStorage.setItem(wishlistKey, JSON.stringify(currentWishlist));
        setIsWishlisted(true);
    }
  };


  const handleBook = (theaterName, schedule) => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }

    navigate("/booking", {
      state: {
        movie,
        cinema: theaterName,
        time: schedule.time,
        date: activeDate,  
        scheduleId: schedule.id_schedule,
        studioId: schedule.id_studio, 
        ticketPrice: schedule.price,
      }
    });
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
                Memuat Detail Film...
            </p>
        </div>
    );
  }

  if (!movie) return <div className="min-h-screen flex items-center justify-center bg-[#6a8e7f] text-white">Movie Not Found</div>;

  return (
    <div className="min-h-screen bg-[#6a8e7f] relative animate-in fade-in duration-500">
      <MainHeader />

      {showLoginModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl p-6 w-80 shadow-2xl relative animate-in zoom-in-95 duration-200 text-center mx-4">
            <button onClick={() => setShowLoginModal(false)} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors">
              <X size={20} />
            </button>
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="text-red-500 w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-[#2a4c44] mb-2">Akses Dibatasi</h3>
            <p className="text-gray-500 text-sm mb-6 leading-relaxed">Login dulu untuk simpan wishlist atau pesan tiket!</p>
            <div className="flex flex-col gap-3">
              <button onClick={onNavigateLogin} className="w-full bg-[#2a4c44] text-white py-2.5 rounded-lg font-bold hover:bg-[#1e3630] transition shadow-lg">Login Sekarang</button>
            </div>
          </div>
        </div>
      )}

      <main className="px-6 md:px-10 py-10 text-[#f5f1dc]">
        <div className="max-w-5xl mx-auto">
          
          <div className="flex flex-col md:flex-row gap-8 items-start relative animate-in slide-in-from-bottom-8 duration-700">
            <div className="relative w-full md:w-64 aspect-[2/3] flex-shrink-0">
                <img
                  src={movie.poster_url}
                  alt={movie.title}
                  className="w-full h-full object-cover rounded-xl shadow-2xl border-2 border-white/10"
                  onError={(e) => {e.target.onerror = null; e.target.src = "https://via.placeholder.com/300x450?text=No+Image";}}
                />
                
                <button
                    onClick={handleToggleWishlist}
                    className="absolute top-3 right-3 p-3 bg-white/20 backdrop-blur-md rounded-full shadow-lg transition-all hover:scale-110 active:scale-95 border border-white/30 group"
                    title={isWishlisted ? "Hapus dari Wishlist" : "Simpan ke Wishlist"}
                >
                    <Heart 
                        size={24} 
                        className={`transition-all duration-300 ${isWishlisted ? "fill-red-500 text-red-500" : "text-white group-hover:text-red-300"}`} 
                    />
                </button>
            </div>

            <div className="flex flex-col">
              <span className="text-lg font-medium text-amber-300">
                Release : {new Date(movie.release_date || new Date()).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
              <h1 className="text-4xl md:text-5xl font-black my-2 leading-tight">{movie.title}</h1>
              <span className="text-lg text-gray-200">{movie.genre}</span>
              
              <span className="text-lg mt-2 flex items-center gap-2 font-semibold">
                <Clock size={20} className="text-amber-400"/>
                {formatDuration(movie.duration)}
              </span>

              <button className="flex items-center gap-3 mt-8 bg-white/10 hover:bg-white/20 w-max px-6 py-3 rounded-full transition-all group border border-white/20">
                  <PlayCircle size={32} className="text-amber-400 group-hover:scale-110 transition-transform"/>
                  <span className="text-lg font-bold">Lihat Trailer</span>
              </button>
            </div>
          </div>

          <div className="mt-12 animate-in fade-in delay-200 duration-700">
            <div className="flex gap-8 border-b-2 border-white/20">
              {["jadwal", "detail"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`text-xl font-bold pb-3 capitalize transition-colors ${
                    activeTab === tab ? "border-b-4 border-amber-400 text-amber-400 -mb-0.5" : "text-gray-400 hover:text-white"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {activeTab === "jadwal" && (
              <div className="py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex gap-3 overflow-x-auto py-2 pb-4 scrollbar-hide">
                  {dates.map((d) => (
                    <DateChip
                      key={d.fullDateStr}
                      day={d.day}
                      date={d.date}
                      isActive={activeDate === d.fullDateStr}
                      onClick={() => setActiveDate(d.fullDateStr)}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-4 my-6 bg-[#2a4c44]/30 p-3 rounded-xl backdrop-blur-sm border border-white/5">
                  <button className="p-2 rounded-lg bg-[#2a4c44] hover:bg-[#3a6a5e] text-white transition"><Filter size={20} /></button>
                  <div className="text-white font-bold px-2">Filter Bioskop</div>
                  <div className="flex-grow h-px bg-white/10 mx-2"></div>
                  <button className="p-2 rounded-lg bg-[#2a4c44] hover:bg-[#3a6a5e] text-white transition"><Search size={20} /></button>
                </div>

                <div className="flex flex-wrap gap-2 mb-8">
                  {availableCities.length === 0 ? (
                      <span className="text-white/50 text-sm px-2">Tidak ada kota tersedia</span>
                  ) : (
                      availableCities.map((city) => (
                        <CityChip 
                            key={city} 
                            city={city} 
                            isActive={activeCity === city} 
                            onClick={() => setActiveCity(city)} 
                        />
                      ))
                  )}
                </div>

                <div className="flex flex-col gap-4">
                    {!citiesData[activeCity] ? (
                        <div className="text-center py-10 bg-white/5 rounded-xl border border-white/10">
                            <p className="text-xl font-bold opacity-70">
                                {availableCities.length === 0 ? "Belum ada jadwal tayang." : "Pilih kota untuk melihat jadwal."}
                            </p>
                        </div>
                    ) : (
                        Object.entries(citiesData[activeCity]).map(([theaterName, data]) => (
                            <div key={theaterName} className="bg-[#f5f1dc] rounded-2xl p-6 shadow-xl text-[#2d3e50] animate-in zoom-in-95 duration-300">
                                <div className="mb-4 border-b border-gray-300 pb-2">
                                    <h3 className="text-xl font-black text-[#2a4c44]">{theaterName}</h3>
                                    <div className="mt-1 flex gap-2 items-center">
                                        <span className="bg-gray-200 px-2 py-0.5 rounded text-xs font-bold text-gray-600 uppercase tracking-wide">
                                            {data.brand}
                                        </span>
                                    </div>
                                </div>
            
                                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                                    {data.schedules.map((schedule, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => handleBook(theaterName, schedule)}
                                            className="group relative py-2 px-1 border-2 border-[#2a4c44]/20 text-[#2a4c44] font-bold rounded-lg hover:bg-[#2a4c44] hover:text-white hover:border-[#2a4c44] transition-all duration-200 active:scale-95 text-sm flex flex-col items-center justify-center min-h-[60px]"
                                        >
                                            <span className="text-lg">{schedule.time}</span>
                                            
                                            <span className="text-[10px] font-medium opacity-60 group-hover:text-amber-300 uppercase mt-1">
                                                {schedule.studio}
                                            </span>

                                            <span className="absolute -top-8 bg-black text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                                Rp {schedule.price.toLocaleString()}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))
                    )}
                </div>
              </div>
            )}
            {activeTab === "detail" && (
              <div className="py-8 text-lg leading-relaxed text-white/80 animate-in fade-in duration-300">
                <p>{movie.description || "Tidak ada deskripsi tersedia untuk film ini."}</p>
                <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <span className="block opacity-60">Bahasa</span>
                        <span className="font-bold text-xl text-white">{movie.language}</span>
                    </div>
                    <div>
                        <span className="block opacity-60">Rating Usia</span>
                        <span className="font-bold text-xl text-white">{movie.age_rating}+</span>
                    </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}