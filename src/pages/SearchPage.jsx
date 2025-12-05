import React, { useState, useMemo } from "react";
import { Search, ChevronRight, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import MainHeader from "../components/MainHeader";

const CINEMA_DATABASE = [
  { id: 1, city: "JAKARTA", name: "AEON MALL TANJUNG BARAT XXI", brand: "XXI" },
  { id: 2, city: "JAKARTA", name: "GRAND INDONESIA CGV", brand: "CGV" },
  { id: 3, city: "JAKARTA", name: "PLAZA SENAYAN XXI", brand: "XXI" },
  { id: 4, city: "JAKARTA", name: "GANDARIA CITY XXI", brand: "XXI" },
  { id: 5, city: "JAKARTA", name: "KOTA KASABLANKA XXI", brand: "XXI" },
  { id: 6, city: "JAKARTA", name: "PONDOK INDAH 2 XXI", brand: "XXI" },
  { id: 11, city: "BOGOR", name: "BOTANI SQUARE XXI", brand: "XXI" },
  { id: 12, city: "BOGOR", name: "AEON MALL SENTUL CITY XXI", brand: "XXI" },
  { id: 13, city: "BOGOR", name: "CIBINONG CITY MALL XXI", brand: "XXI" },
  { id: 14, city: "BOGOR", name: "TRANSMART BOGOR CGV", brand: "CGV" },
  { id: 15, city: "BOGOR", name: "BOXIES 123 MALL CINEPOLIS", brand: "CINEPOLIS" },
  { id: 21, city: "DEPOK", name: "MARGO CITY XXI", brand: "XXI" },
  { id: 22, city: "DEPOK", name: "PESONA SQUARE XXI", brand: "XXI" },
  { id: 23, city: "DEPOK", name: "D'MALL CGV", brand: "CGV" },
  { id: 24, city: "DEPOK", name: "THE PARK SAWANGAN XXI", brand: "XXI" },
  { id: 25, city: "DEPOK", name: "CINERE BELLEVUE XXI", brand: "XXI" },
  { id: 31, city: "TANGERANG", name: "AEON MALL BSD CITY XXI", brand: "XXI" },
  { id: 32, city: "TANGERANG", name: "SUMMARECON MALL SERPONG XXI", brand: "XXI" },
  { id: 33, city: "TANGERANG", name: "THE BREEZE BSD CITY XXI", brand: "XXI" },
  { id: 34, city: "TANGERANG", name: "SUPERMAL KARAWACI XXI", brand: "XXI" },
  { id: 35, city: "TANGERANG", name: "TERASKOTA CGV", brand: "CGV" },
  { id: 41, city: "BEKASI", name: "SUMMARECON MALL BEKASI XXI", brand: "XXI" },
  { id: 42, city: "BEKASI", name: "GRAND METROPOLITAN XXI", brand: "XXI" },
  { id: 43, city: "BEKASI", name: "MEGA BEKASI XXI", brand: "XXI" },
  { id: 44, city: "BEKASI", name: "GRAND GALAXY PARK CGV", brand: "CGV" },
  { id: 45, city: "BEKASI", name: "CIPUTRA CIBUBUR XXI", brand: "XXI" },
];

const CITIES = ["JAKARTA", "BOGOR", "DEPOK", "TANGERANG", "BEKASI"];

const CityChip = ({ city, isActive, onClick }) => (
  <button
    onClick={() => onClick(city)}
    className={`px-6 py-2 rounded-full font-bold text-sm transition-all shadow-sm ${
      isActive
        ? "bg-[#f5f1dc] text-[#2a4c44] scale-105 shadow-md"
        : "bg-[#2a4c44]/30 text-white hover:bg-[#2a4c44]/50 border border-white/10"
    }`}
  >
    {city}
  </button>
);

const CinemaRow = ({ name, brand, onSelect }) => (
  <button
    onClick={onSelect}
    className="group flex items-center justify-between w-full p-5 bg-[#f5f1dc] rounded-xl shadow-lg hover:shadow-2xl hover:bg-white hover:scale-[1.01] transition-all duration-300 border border-transparent hover:border-amber-400"
  >
    <div className="flex flex-col items-start gap-1">
      <h3 className="text-lg font-black text-[#2a4c44] group-hover:text-amber-600 transition-colors text-left">
        {name}
      </h3>
      <div className="flex items-center gap-2">
         <span className={`text-[10px] font-bold px-2 py-0.5 rounded text-white ${
             brand === 'XXI' ? 'bg-[#2a4c44]' : brand === 'CGV' ? 'bg-red-600' : 'bg-blue-600'
         }`}>
            {brand}
         </span>
         <span className="text-xs font-semibold text-gray-400 flex items-center gap-1">
            <MapPin size={10} /> 2.4 km
         </span>
      </div>
    </div>
    <div className="bg-[#2a4c44]/10 p-2 rounded-full group-hover:bg-amber-400 group-hover:text-white transition-colors">
        <ChevronRight size={20} className="text-[#2a4c44] group-hover:text-white" />
    </div>
  </button>
);

export default function SearchPage() {
  const navigate = useNavigate();
  const [activeCity, setActiveCity] = useState("JAKARTA");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCinemas = useMemo(() => {
    return CINEMA_DATABASE.filter((cinema) => {
      const isCityMatch = cinema.city === activeCity;
      const isSearchMatch = cinema.name.toLowerCase().includes(searchQuery.toLowerCase());
      return isCityMatch && isSearchMatch;
    });
  }, [activeCity, searchQuery]);

  const handleSelectCinema = (cinema) => {
      navigate(`/cinema/${cinema.id}`, { 
          state: { cinemaData: cinema } 
      });
  };

  return (
    <div className="min-h-screen bg-[#6a8e7f] flex flex-col">
      <MainHeader />

      <main className="flex-grow w-full max-w-4xl mx-auto p-6 md:p-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        <div className="mb-8">
            <h1 className="text-3xl font-black text-[#fff9e6] mb-2 tracking-tight">Cari Bioskop</h1>
            <p className="text-gray-200">Temukan bioskop terdekat di kotamu.</p>
        </div>

        <div className="relative mb-8 group">
          <input
            type="text"
            placeholder="Ketik nama mall atau bioskop..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-14 pr-4 py-4 rounded-2xl bg-[#f5f1dc] text-[#2a4c44] placeholder-gray-400 font-semibold text-lg shadow-xl focus:outline-none focus:ring-4 focus:ring-amber-400/50 transition-all"
          />
          <Search
            size={28}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-amber-500 transition-colors"
          />
        </div>

        <div className="flex flex-wrap gap-3 mb-8">
          {CITIES.map((city) => (
            <CityChip
              key={city}
              city={city}
              isActive={activeCity === city}
              onClick={setActiveCity}
            />
          ))}
        </div>

        <div className="space-y-4 pb-20">
          {filteredCinemas.length > 0 ? (
            filteredCinemas.map((cinema) => (
              <CinemaRow
                key={cinema.id}
                name={cinema.name}
                brand={cinema.brand}
                onSelect={() => handleSelectCinema(cinema)}
              />
            ))
          ) : (
            <div className="text-center py-20 bg-black/10 rounded-2xl border-2 border-dashed border-white/20">
                <p className="text-[#fff9e6] font-bold text-lg">Bioskop tidak ditemukan :(</p>
                <p className="text-sm text-gray-300">Coba cari dengan kata kunci lain.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}