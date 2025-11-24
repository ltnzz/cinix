import React, { useState } from "react";
import {
  Home,
  Star,
  List,
  User,
  MapPin,
  ArrowLeft,
  ArrowRight,
  Search,
  Glasses,
  Film,
  Ticket,
  Heart,
} from "lucide-react";

import SearchPage from "./searchpage.jsx";
import DetailPage from "./detailmovie.jsx";
import LoginPage from "./loginpage.jsx";
import SignUpPage from "./signup.jsx";
import PaymentPage from "./payment.jsx";

function MainHeader({ onNavigateHome, onNavigateLogin, onNavigateSearch }) {
  return (
    <header className="flex items-center justify-between px-8 py-4 bg-[#f5f1dc] shadow">
      <div className="flex items-center gap-4">
        <div className="text-3xl font-bold text-[#2a4c44]">CINIX</div>
        <div className="flex items-center gap-1 ml-4 bg-[#e6ddba] px-3 py-1 rounded-full text-sm">
          <MapPin size={16} />
          <span>Jabodetabek</span>
        </div>
      </div>
      <div className="flex gap-6 text-gray-700">
        <Home
          className="text-[#2a4c44] cursor-pointer"
          onClick={onNavigateHome}
        />
        <Star className="cursor-pointer" />
        <List className="cursor-pointer" />
        <User className="cursor-pointer" onClick={onNavigateLogin} />
      </div>
    </header>
  );
}

function HomePage({
  onNavigateHome,
  onNavigateLogin,
  onNavigateSearch,
  onNavigateDetail,
}) {
  // ini nanti bakal nyambung ke database
  const originalMovies = [
    {
      title: "Stollen Girl",
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSW0trXZ0E9GJ7bFXfr98f0UOGcMWJneYrDLw&s",
      genre: "Action, Thriller",
      duration: "2j 15m",
      release: "10 Oktober 2025"
    },
    {
      title: "Tron Ares (2025)",
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8tq8lygfqv4hEIDsAjS88Rdh-z99CusKQyg&s",
      genre: "Sci-fi, Action",
      duration: "2j 30m",
      release: "10 Oktober 2025"
    },
    {
      title: "Chainsaw Man",
      img: "https://m.media-amazon.com/images/M/MV5BNDQzMjc2ZDQtMjY2NS00M2UxLTg2OTktNWVjZmY5YjA4MzVhXkEyXkFqcGc@._V1_.jpg",
      genre: "Anime, Action",
      duration: "1j 45m",
      release: "10 Oktober 2025"
    },
    {
      title: "Black Phone 2",
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ0XQBg8-xS-u8bh5ntG5eolzWzRU8TMs4HDQ&s",
      genre: "Horror, Thriller",
      duration: "2j 05m",
      release: "10 Oktober 2025"
    },
  ];

  const moviesWithClones = [
    ...originalMovies,
    ...originalMovies,
    ...originalMovies,
  ];
  const initialSlide = originalMovies.length;
  const [currentSlide, setCurrentSlide] = useState(initialSlide);
  const [transitionEnabled, setTransitionEnabled] = useState(true);
  const slideDistance = 21.5;

  const nextSlide = () => {
    setTransitionEnabled(true);
    setCurrentSlide((prev) => prev + 1);
  };

  const prevSlide = () => {
    setTransitionEnabled(true);
    setCurrentSlide((prev) => prev - 1);
  };

  const handleTransitionEnd = () => {
    if (currentSlide === originalMovies.length * 2) {
      setTransitionEnabled(false);
      setCurrentSlide(originalMovies.length);
    }
    if (currentSlide === originalMovies.length - 1) {
      setTransitionEnabled(false);
      setCurrentSlide(originalMovies.length * 2 - 1);
    }
  };

  const dotIndex = (currentSlide - originalMovies.length) % originalMovies.length;
  const transitionClass = transitionEnabled
    ? "transition-transform duration-500 ease-in-out"
    : "";

  return (
    <div className="min-h-screen bg-[#6a8e7f] text-gray-900 font-sans">
      <MainHeader
        onNavigateHome={onNavigateHome}
        onNavigateLogin={onNavigateLogin}
        onNavigateSearch={onNavigateSearch}
      />

      <div className="bg-[#2d3e50] text-[#fff9e6] py-10 flex justify-center items-center gap-4 md:gap-8 relative">
        <Glasses size={64} className="text-orange-400 -rotate-12" />
        <span
          className="text-7xl md:text-8xl font-bold tracking-widest"
          style={{ fontFamily: 'Arial, "Helvetica Neue", Helvetica, sans-serif' }}
        >
          Promo & Iklan
        </span>
        <Film size={64} className="text-yellow-300 rotate-12" />
      </div>

      <section className="py-10 px-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="bg-amber-600 p-3 text-xl font-semibold text-[#fff9e6]">
            Sedang tayang di cinema!
          </h2>
          <Search
            size={24}
            className="text-[#fff9e6] cursor-pointer"
            onClick={onNavigateSearch}
          />
        </div>

        <div className="overflow-hidden">
          <div
            className={`flex gap-6 ${transitionClass}`}
            style={{
              transform: `translateX(-${currentSlide * slideDistance}rem)`,
            }}
            onTransitionEnd={handleTransitionEnd}
          >
            {moviesWithClones.map((movie, index) => (
              <div
                key={index}
                className="flex-shrink-0 cursor-pointer"
                onClick={() => onNavigateDetail(movie)} // Poster dapat diklik
              >
                <img
                  src={movie.img}
                  alt={movie.title}
                  className="w-80 h-112 object-cover rounded-xl shadow-lg"
                />
                <p className="mt-2 text-[#fff9e6] text-center">{movie.title}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center mt-6 text-[#fff9e6]">
          <button
            onClick={prevSlide}
            className="p-2 bg-[#fff9e6] rounded-full shadow hover:bg-gray-200 transition"
          >
            <ArrowLeft size={20} className="text-[#2a4c44]" />
          </button>
          <div className="flex gap-1.5">
            {originalMovies.map((_, i) => (
              <div
                key={i}
                className={`w-2.5 h-2.5 rounded-full ${
                  i === dotIndex ? "bg-[#fff9e6]" : "bg-gray-400"
                }`}
              ></div>
            ))}
          </div>
          <button
            onClick={nextSlide}
            className="p-2 bg-[#fff9e6] rounded-full shadow hover:bg-gray-200 transition"
          >
            <ArrowRight size={20} className="text-[#2a4c44]" />
          </button>
        </div>
      </section>
    </div>
  );
}

export default function Cinix() {
  const [currentPage, setCurrentPage] = useState("home");
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedCinema, setSelectedCinema] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  const handleNavigateHome = () => setCurrentPage("home");
  const handleNavigateSearch = () => setCurrentPage("search");
  const handleNavigateLogin = () => setCurrentPage("login");
  const handleNavigateRegister = () => setCurrentPage("register");

  const handleNavigateDetail = (movie) => {
    setSelectedMovie(movie);
    setCurrentPage("detail");
  };

  const handleNavigatePayment = (movie, cinema, time) => {
    setSelectedMovie(movie);
    setSelectedCinema(cinema);
    setSelectedTime(time);
    setCurrentPage("payment");
  };

  const navProps = {
    onNavigateHome: handleNavigateHome,
    onNavigateSearch: handleNavigateSearch,
    onNavigateLogin: handleNavigateLogin,
    onNavigateRegister: handleNavigateRegister,
    onNavigateDetail: handleNavigateDetail,
    onNavigatePayment: handleNavigatePayment,
  };

  switch (currentPage) {
    case "search":
      return <SearchPage {...navProps} />;
    case "detail":
      return <DetailPage {...navProps} movie={selectedMovie} />;
    case "login":
      return <LoginPage {...navProps} />;
    case "register":
      return <SignUpPage {...navProps} />;
    case "payment":
      return (
        <PaymentPage
          {...navProps}
          movie={selectedMovie}
          cinema={selectedCinema}
          time={selectedTime}
        />
      );
    case "home":
    default:
      return <HomePage {...navProps} />;
  }
}