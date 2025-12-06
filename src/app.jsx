import React, { useState, useEffect, useCallback } from "react";
import { BrowserRouter, Routes, Route, useNavigate, useLocation, Navigate, useParams } from "react-router-dom";
import { X, AlertCircle, Lock } from "lucide-react"; 

import HomePage from "./pages/HomePage"; 
import LoginPage from "./pages/LoginPage.jsx";
import SignUpPage from "./pages/SignUpPage";
import ForgotPasswordPage from "./pages/ForgotPw.jsx";
import SearchPage from "./pages/SearchPage.jsx";
import DetailPage from "./pages/DetMoviePage.jsx";
import BookingPage from "./pages/BookingPage.jsx";
import MyTicketsPage from "./pages/MyTicketsPage";
import WishlistPage from "./pages/WishlistPage";
import Footer from "./components/Footer";
import AdminGuard from "./components/auth/adminGuard";
import AdminLogin from "./components/admin/AdminLogin";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AboutDeveloperPage from "./components/biodata.jsx";
import ScrollToTop from "./components/adjustScroll.jsx";

const AuthGuard = ({ user, children }) => {
  const navigate = useNavigate();
  if (user) return children;
  return (
    <div className="min-h-screen bg-[#6a8e7f] flex items-center justify-center p-4">
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
        <div className="bg-white rounded-2xl p-8 w-full max-w-sm shadow-2xl relative animate-in zoom-in-95 duration-300 text-center mx-4">
          <button onClick={() => navigate('/login')} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"><X size={24} /></button>
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6"><Lock className="text-red-500 w-10 h-10" /></div>
          <h3 className="text-2xl font-black text-[#2a4c44] mb-2">Akses Dibatasi</h3>
          <p className="text-gray-500 font-medium mb-8 leading-relaxed">Ups! Halaman ini khusus buat member. <br/>Login dulu yuk buat akses fitur ini.</p>
          <div className="flex flex-col gap-3">
            <button onClick={() => navigate('/login')} className="w-full bg-[#2a4c44] text-white py-3.5 rounded-xl font-bold hover:bg-[#1e3630] transition shadow-lg transform active:scale-95">Login Sekarang</button>
            <button onClick={() => navigate('/')} className="w-full bg-gray-100 text-gray-600 py-3.5 rounded-xl font-bold hover:bg-gray-200 transition">Kembali ke Beranda</button>
          </div>
        </div>
      </div>
    </div>
  );
};

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
  
    const confirmLogout = useCallback(async () => {
      try {
          await axios.delete("https://cinix-be.vercel.app/logout", {
              withCredentials: true 
          });
      } catch (err) {
          console.error("Logout API error:", err);
      } finally {
          localStorage.removeItem("user");
          localStorage.removeItem("token");
          setCurrentUser(null);
          setShowLogoutModal(false);
          window.location.href = '/login'; 
      }
    }, []);
  
    useEffect(() => {
      if (!currentUser) return;
      const TIMEOUT_MS = 15 * 60 * 1000;
      let idleTimer;
      const handleIdle = () => { 
          alert("Sesi berakhir karena tidak ada aktivitas."); 
          confirmLogout(); 
      };
      const resetTimer = () => { 
          if (idleTimer) clearTimeout(idleTimer); 
          idleTimer = setTimeout(handleIdle, TIMEOUT_MS); 
      };
      const events = ["load", "mousemove", "mousedown", "click", "scroll", "keypress"];
      resetTimer();
      events.forEach((event) => window.addEventListener(event, resetTimer));
      return () => { 
        if (idleTimer) clearTimeout(idleTimer); 
        events.forEach((event) => window.removeEventListener(event, resetTimer)); 
    };
  }, [currentUser, confirmLogout]);
  
    const handleLoginSuccess = (userData) => { 
      setCurrentUser(userData); 
      localStorage.setItem("user", JSON.stringify(userData));
      navigate('/'); 
    };
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
        <Route path="/mytickets" element={<AuthGuard user={currentUser}><MyTicketsPage {...navProps} /></AuthGuard>} />
        <Route path="/wishlist" element={<AuthGuard user={currentUser}><WishlistPage {...navProps} /></AuthGuard>} />

        <Route path="/admin" element={<AdminGuard><AdminDashboardPage /></AdminGuard>} />
        <Route path="/admin/login" element={<AdminLogin />} />

        <Route path="/about-developer" element={<AboutDeveloperPage/>}/>
      </Routes>
      
      <Footer />

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
      <ScrollToTop />
      <CinixRoutes />
    </BrowserRouter>
  );
}