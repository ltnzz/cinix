import { useState } from "react";
import {
  Home,
  User,
  MapPin,
  Ticket,
  Heart,
  ChevronRight,
  PlayCircle,
  Filter,
  Search,
  Clock, 
} from "lucide-react";

function DetailHeader({ onNavigateHome, onNavigateLogin }) {
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

const DateChip = ({ day, date, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center px-4 py-2 rounded-lg transition-all ${
      isActive
        ? "bg-[#f5f1dc] text-[#2d3e50]"
        : "bg-transparent text-[#f5f1dc] hover:bg-opacity-20 hover:bg-white"
    }`}
  >
    <span className="text-xs">{day}</span>
    <span className="font-bold text-lg">{date}</span>
  </button>
);

const CityChip = ({ city, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-1 rounded-full text-xs font-semibold shadow-md transition-all ${
      isActive
        ? "bg-[#f5f1dc] text-[#2d3e50]"
        : "bg-transparent border border-[#f5f1dc] text-[#f5f1dc] hover:bg-opacity-80"
    }`}
  >
    {city}
  </button>
);

export default function DetailPage({
  movie,
  onNavigateHome,
  onNavigateLogin,
  onNavigatePayment, 
}) {
  const [activeTab, setActiveTab] = useState("jadwal");
  const [activeDate, setActiveDate] = useState("11");
  const [activeCity, setActiveCity] = useState("JAKARTA");

  // ini bakal nyambung ke database
  const dates = [
    { day: "SUN", date: "09" },
    { day: "MON", date: "10" },
    { day: "TUE", date: "11" },
    { day: "WED", date: "12" },
    { day: "THR", date: "13" },
    { day: "FRI", date: "14" },
  ];

  // ini jg
  const cities = ["JAKARTA", "BOGOR", "DEPOK", "TANGERANG", "BEKASI"];


  // ini jg
  const displayMovie =
    movie || {
      title: "TRON ARES (2025)",
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8tq8lygfqv4hEIDsAjS88Rdh-z99CusKQyg&s",
      release: "10 oktober",
      genres: "Sci-fi, Action",
      duration: "2h 10m",
    };


  // ini jg
  const cinemaToShow = {
    name: "AEON MALL TANJUNG BARAT XXI",
    brand: "Cinema XXI",
    times: ["12:30", "14:30", "16:40", "18:50"],
  };

  const handleBook = (time) => {
    if (typeof onNavigatePayment === "function") {
      onNavigatePayment(displayMovie, cinemaToShow.name, time);
    } else {
      console.error(
        "onNavigatePayment is not a function. Pastikan prop ini diteruskan dari Cinix.jsx",
        onNavigatePayment
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#6a8e7f]">
      <DetailHeader
        onNavigateHome={onNavigateHome}
        onNavigateLogin={onNavigateLogin}
      />

      <main className="px-6 md:px-10 py-10 text-[#f5f1dc]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold mb-6">Detail Film</h2>
          <div className="flex flex-col md:flex-row gap-8">
            <img
              src={displayMovie.img}
              alt={displayMovie.title}
              className="w-full md:w-64 h-96 object-cover rounded-xl shadow-lg flex-shrink-0"
            />
            <div className="flex flex-col">
              <span className="text-lg">
                Tayang : {displayMovie.release}
              </span>
              <h1 className="text-5xl font-bold my-2">{displayMovie.title}</h1>
              <span className="text-lg">{displayMovie.genres}</span>

              {displayMovie.duration && (
                <span className="text-lg mt-2 flex items-center gap-2">
                  <Clock size={18} />
                  Durasi: {displayMovie.duration}
                </span>
              )}

              <button className="flex items-center gap-3 mt-6 text-xl font-semibold hover:opacity-80 transition-opacity">
                  <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwmGwFce3dRjF77R93jk7MfpCUbXmsyXIZTQVmcwKJbwAenizvE8dOh36T56qL12hy-a8&usqp=CAU" alt="Play" className="w-12 h-12" />
                Lihat trailer
              </button>
            </div>
          </div>
          <div className="mt-12">
            <div className="flex gap-8 border-b-2 border-gray-500">
              <button
                onClick={() => setActiveTab("jadwal")}
                className={`text-xl font-semibold pb-2 ${
                  activeTab === "jadwal"
                    ? "border-b-4 border-[#f5f1dc] text-white"
                    : "text-gray-400"
                }`}
              >
                Jadwal
              </button>
              <button
                onClick={() => setActiveTab("detail")}
                className={`text-xl font-semibold pb-2 ${
                  activeTab === "detail"
                    ? "border-b-4 border-[#f5f1dc] text-white"
                    : "text-gray-400"
                }`}
              >
                Detail
              </button>
            </div>

            {activeTab === "jadwal" && (
              <div className="py-6">
                <div className="flex gap-2 overflow-x-auto py-2">
                  {dates.map((d) => (
                    <DateChip
                      key={d.date}
                      day={d.day}
                      date={d.date}
                      isActive={activeDate === d.date}
                      onClick={() => setActiveDate(d.date)}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-4 my-6">
                  <button className="p-2 rounded-full bg-gray-700 hover:bg-gray-600">
                    <Filter size={20} />
                  </button>
                  <div className="text-red-600 text-3xl font-bold italic">
                    CGV<span className="text-red-400">*</span>
                  </div>
                  <div className="flex-grow h-px bg-gray-600"></div>
                  <button className="p-2 rounded-full bg-gray-700 hover:bg-gray-600">
                    <Search size={20} />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mb-6">
                  {cities.map((c) => (
                    <CityChip
                      key={c}
                      city={c}
                      isActive={activeCity === c}
                      onClick={() => setActiveCity(c)}
                    />
                  ))}
                </div>

                <div className="bg-[#f5f1dc] rounded-xl p-4 shadow-lg">
                  <div>
                    <h3 className="text-lg font-bold text-[#2d3e50]">
                      {cinemaToShow.name}
                    </h3>
                    <div className="mt-2 border border-gray-500 px-3 py-1 text-gray-700 text-sm font-medium w-max">
                      {cinemaToShow.brand}
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-3 mt-4">
                    {cinemaToShow.times.map((time) => (
                      <button
                        key={time}
                        onClick={() => handleBook(time)} 
                        className="p-2 border border-green-700 text-green-700 font-semibold rounded-lg hover:bg-green-700 hover:text-white transition"
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "detail" && (
              <div className="py-6">
                <p>Informasi detail film akan ditampilkan di sini.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}