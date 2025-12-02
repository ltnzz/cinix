import React, { useState, useEffect, useCallback } from "react";
import { BrowserRouter, Routes, Route, useNavigate, useLocation, Navigate, useParams } from "react-router-dom";
import { X, AlertCircle } from "lucide-react"; 

import HomePage from "./pages/HomePage"; 
import LoginPage from "./pages/LoginPage.jsx";
import SignUpPage from "./pages/SignUpPage";
import ForgotPasswordPage from "./pages/ForgotPw.jsx";
import SearchPage from "./pages/SearchPage.jsx";
import DetailPage from "./pages/DetMoviePage.jsx";
import BookingPage from "./pages/BookingPage.jsx";
import MyTicketsPage from "./pages/MyTicketsPage";
import WishlistPage from "./pages/WishlistPage";
import CinemaDetailPage from "./pages/CinemaDetailPage";

const DetailWrapper = ({ baseProps }) => {
  const { id_movie } = useParams();
  const location = useLocation();
  const movie = location.state?.movie; 
  if (!movie) return <Navigate to="/" replace />;
  return <DetailPage {...baseProps} movie={movie} movieId={id_movie}/>;
};

const BookingWrapper = ({ baseProps }) => {
  const location = useLocation();
  const { movie, cinema, time } = location.state || {};
  
  if (!movie) return <Navigate to="/" replace />;
  return <BookingPage {...baseProps} movie={movie} cinema={cinema} time={time} />;
};

function CinixRoutes() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
  
    useEffect(() => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) { try { setCurrentUser(JSON.parse(storedUser)); } catch (e) { localStorage.removeItem("user"); } }
    }, []);
  
    const confirmLogout = useCallback(() => {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      setCurrentUser(null);
      setShowLogoutModal(false);
      navigate('/'); 
    }, [navigate]);
  
    useEffect(() => {
      if (!currentUser) return;
      const TIMEOUT_MS = 5 * 60 * 1000;
      let idleTimer;
      const handleIdle = () => { alert("Sesi berakhir."); confirmLogout(); };
      const resetTimer = () => { if (idleTimer) clearTimeout(idleTimer); idleTimer = setTimeout(handleIdle, TIMEOUT_MS); };
      const events = ["load", "mousemove", "mousedown", "click", "scroll", "keypress"];
      resetTimer();
      events.forEach((event) => window.addEventListener(event, resetTimer));
      return () => { if (idleTimer) clearTimeout(idleTimer); events.forEach((event) => window.removeEventListener(event, resetTimer)); };
    }, [currentUser, confirmLogout]);
  
    const handleLoginSuccess = (userData) => { setCurrentUser(userData); navigate('/'); };
    const handleLogoutClick = () => setShowLogoutModal(true);
    const cancelLogout = () => setShowLogoutModal(false);

  const navProps = {
    onNavigateHome: () => navigate('/'),
    onNavigateSearch: () => navigate('/search'),
    onNavigateLogin: () => navigate('/login'),
    onNavigateRegister: () => navigate('/register'),
    onNavigateForgotPassword: () => navigate('/forgot-password'),
    onNavigateTickets: () => navigate('/mytickets'),
    onNavigateWishlist: () => navigate('/wishlist'),
    onNavigateDetail: (movie) => navigate(`/detail/${movie.id_movie}`, { state: { movie } }),
    onNavigateBooking: (movie, cinema, time) => {navigate('/booking', { state: { movie, cinema, time } }); },
    user: currentUser,
    onLogoutClick: handleLogoutClick,
    onLoginSuccess: handleLoginSuccess
  };

return (
    <>
      <Routes>
        <Route path="/" element={<HomePage {...navProps} />} />
        <Route path="/search" element={<SearchPage {...navProps} />} />
        <Route path="/login" element={<LoginPage {...navProps} />} />
        <Route path="/register" element={<SignUpPage {...navProps} />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage {...navProps} />} />
        <Route path="/detail/:id_movie" element={<DetailWrapper baseProps={navProps} />} />
        <Route path="/booking" element={<BookingWrapper baseProps={navProps} />} />
        <Route path="/mytickets" element={<MyTicketsPage user={currentUser} />} />
        <Route path="/wishlist" element={<WishlistPage {...navProps} />} />
        <Route path="/cinema/:id" element={<CinemaDetailPage {...navProps} />} />
      </Routes>

      {showLogoutModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-96 p-6 transform transition-all scale-100 animate-in zoom-in-95 duration-200 relative">
            <button onClick={cancelLogout} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X size={20} /></button>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4"><AlertCircle className="text-red-500 w-8 h-8" /></div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Konfirmasi Logout</h3>
              <p className="text-gray-500 text-sm mb-6">Apakah Anda yakin ingin keluar dari akun?</p>
            </div>
            <div className="flex gap-3">
              <button onClick={cancelLogout} className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors">Batal</button>
              <button onClick={confirmLogout} className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors shadow-lg shadow-red-500/30">Ya, Keluar</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <CinixRoutes />
    </BrowserRouter>
  );
}