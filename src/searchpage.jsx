import React, { useState } from "react";
import {
  Home,
  User,
  MapPin,
  Search,
  Ticket,
  Heart,
  ChevronRight,
} from "lucide-react";

const CityChip = ({ city, isActive, onClick }) => (
  <button
    onClick={() => onClick(city)}
    className={`px-6 py-2 rounded-full font-semibold transition-all ${
      isActive
        ? "bg-[#f5f1dc] text-[#2a4c44]" 
        : "bg-[#8fb0a2] text-white" 
    }`}
  >
    {city}
  </button>
);

const CinemaRow = ({ name, logoUrl, onSelect }) => (
  <button
    onClick={onSelect}
    className="flex items-center justify-between w-full p-4 bg-[#f5f1dc] rounded-lg shadow-md hover:bg-gray-200 transition"
  >
    <div className="flex flex-col items-start">
      <h3 className="text-lg font-bold text-[#2a4c44]">{name}</h3>
      <span className="text-sm font-semibold text-[#2a4c44] opacity-70">
        CINIX
      </span>
    </div>
    <ChevronRight size={24} className="text-[#2a4c44]" />
  </button>
);

function SearchHeader({ onNavigateHome, onNavigateLogin }) {
  return (
    <header className="flex items-center justify-between px-8 py-4 bg-[#f5f1dc] shadow">
      <div className="flex items-center gap-4">
        <div className="text-3xl font-bold text-[#2a4c44]">CINIX</div>
        <div className="flex items-center gap-1 ml-4 bg-[#e6ddba] px-3 py-1 rounded-full text-sm">
          <MapPin size={16} />
          <span>Jabodetabek</span>
        </div>
      </div>
      <div className="flex gap-6 text-[#2a4c44] font-semibold">
        <button
          onClick={onNavigateHome}
          className="flex items-center gap-2 hover:opacity-70"
        >
          <Home className="text-[#2a4c44]" />
          <span>Home</span>
        </button>
        <button className="flex items-center gap-2 hover:opacity-70">
          <Ticket />
          <span>Tickets</span>
        </button>
        <button className="flex items-center gap-2 hover:opacity-70">
          <Heart />
          <span>Wishlist</span>
        </button>
        <button
          onClick={onNavigateLogin}
          className="flex items-center gap-2 hover:opacity-70"
        >
          <User />
          <span>Profile</span>
        </button>
      </div>
    </header>
  );
}

export default function SearchPage({ onNavigateHome, onNavigateLogin }) {
  //bakal ada logic untuk search bar
  const [activeCity, setActiveCity] = useState("JAKARTA");
  const cities = ["JAKARTA", "BOGOR", "DEPOK", "TANGERANG", "BEKASI"];

  const cinemas = [
    { id: 1, name: "AEON MALL TANJUNG BARAT XXI" },
    { id: 2, name: "FX SUDIRMAN CGV" },
    { id: 3, name: "GANDARIA CITY XXI" },
  ];

  return (
    <div className="min-h-screen bg-[#6a8e7f]">
      <SearchHeader
        onNavigateHome={onNavigateHome}
        onNavigateLogin={onNavigateLogin}
      />
      <main className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold text-white mb-4">BIOSKOP / CINEMA</h1>

        <div className="relative mb-6">
          <input
            type="text"
            placeholder="Cari bioskop..."
            className="w-full pl-12 pr-4 py-3 rounded-lg bg-[#f5f1dc] text-[#2a4c44] placeholder-gray-500"
          />
          <Search
            size={24}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
          />
        </div>

        <div className="flex flex-wrap gap-4 mb-6">
          {cities.map((city) => (
            <CityChip
              key={city}
              city={city}
              isActive={activeCity === city}
              onClick={setActiveCity}
            />
          ))}
        </div>

        <div className="space-y-4">
          {cinemas.map((cinema) => (
            <CinemaRow
              key={cinema.id}
              name={cinema.name}
              onSelect={() =>
                console.log(`Navigasi ke bioskop ${cinema.name}`)
              }
            />
          ))}
        </div>
      </main>
    </div>
  );
}