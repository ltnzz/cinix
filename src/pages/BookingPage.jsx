import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Home, ChevronLeft, Calendar, Loader2 } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

// --- Seat component ---
const Seat = ({ id, status, onClick, label }) => {
  const baseStyle = "w-9 h-9 md:w-11 md:h-11 rounded-t-lg text-[10px] md:text-xs font-bold transition-all duration-200 flex items-center justify-center select-none shadow-sm";
  const styles = {
    available: "bg-white text-[#2a4c44] border border-gray-300 hover:bg-[#6a8e7f] hover:text-white hover:border-[#6a4c7] cursor-pointer hover:shadow-md hover:-translate-y-0.5",
    selected: "bg-[#6a8e7f] text-white shadow-lg transform scale-110 border border-[#6a8e7f] cursor-pointer ring-2 ring-[#6a8e7f]/30 z-10",
    taken: "bg-gray-300 text-gray-400 cursor-not-allowed border-transparent opacity-80"
  };

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (status !== 'taken') {
      onClick(id);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={status === 'taken'}
      className={`${baseStyle} ${styles[status]}`}
      type="button"
    >
      {label}
    </button>
  );
};

const Header = ({ title, subtitle, onBack, onHome }) => (
  <header className="flex items-center justify-between px-6 py-4 bg-[#f5f1dc] shadow-sm sticky top-0 z-50">
    <button onClick={onBack} className="p-2 -ml-2 text-[#2a4c44] hover:bg-black/5 rounded-full transition">
      <ChevronLeft size={24} />
    </button>
    <div className="text-center">
      <h1 className="text-lg font-bold text-[#2a4c44] line-clamp-1">{title}</h1>
      <p className="text-xs text-gray-600 max-w-[200px] truncate mx-auto">{subtitle}</p>
    </div>
    <button onClick={onHome} className="p-2 text-[#2a4c44] hover:bg-black/5 rounded-full transition">
      <Home size={22} />
    </button>
  </header>
);

export default function BookingPage(props) {
  const navigate = useNavigate();
  const location = useLocation();
  const stateFromNav = location.state || {};

  // Props or navigation state fallback
  const movie = props.movie || stateFromNav.movie || { title: "TRON: ARES (2025)", poster_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8tq8lygfqv4hEIDsAjS88Rdh-z99CusKQyg&s" };
  const cinema = props.cinema || stateFromNav.cinema || "AEON MALL TANJUNG BARAT XXI";
  
  // TANGKAP TANGGAL & WAKTU DARI STATE
  const time = props.time || stateFromNav.time || "14:30";
  // Gunakan tanggal yang dipilih user, atau fallback ke hari ini jika null
  const selectedDate = props.date || stateFromNav.date || new Date().toISOString(); 

  const scheduleId = props.scheduleId || stateFromNav.scheduleId || "default-schedule-id"; 
  const studioId = props.studioId || stateFromNav.studioId || "6cf13e1f-105d-4cc9-b76e-6f4b6db93f61";
  
  // Get userId from props/state, or fetch from auth
  let userId = props.userId || stateFromNav.userId;
  
  if (!userId) {
    try {
      const userFromStorage = localStorage.getItem('user');
      if (userFromStorage) {
        const user = JSON.parse(userFromStorage);
        userId = user.id_user || user.id || user.userId || user.email; 
      }
    } catch (e) {
      console.error("Failed to get user from storage:", e);
    }
  }
  
  const midtransClientKey = props.midtransClientKey || stateFromNav.midtransClientKey || "SB-Mid-client-a24K2aKsd8sdasd"; 

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [seatsData, setSeatsData] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [error, setError] = useState(null);

  const ticketPrice = props.ticketPrice || 50000;
  const maxSeats = props.maxSeats || 8;

  const snapLoadedRef = useRef(false);

  // Load Midtrans Snap script
  useEffect(() => {
    if (!midtransClientKey) {
      console.warn("Midtrans client key not provided. Snap.js will not be loaded.");
      return;
    }

    if (document.querySelector('script[data-midtrans-snap]')) {
      snapLoadedRef.current = !!window.snap;
      return;
    }

    const script = document.createElement("script");
    script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
    script.async = true;
    script.setAttribute("data-client-key", midtransClientKey);
    script.setAttribute("data-midtrans-snap", "true");
    script.onload = () => {
      snapLoadedRef.current = !!window.snap;
      console.log("Midtrans Snap loaded", snapLoadedRef.current);
    };
    script.onerror = () => {
      console.error("Failed to load Midtrans Snap.js");
    };

    document.body.appendChild(script);
  }, [midtransClientKey]);

  // Fetch seats
  useEffect(() => {
    const load = async () => {
      let currentStudioId = studioId;

      if (!currentStudioId && scheduleId) {
        try {
          const scheduleRes = await axios.get(`https://cinix-be.vercel.app/schedules/${scheduleId}`, {
            withCredentials: true
          });
          currentStudioId = scheduleRes.data?.studio_id || scheduleRes.data?.data?.studio_id;
        } catch (err) {
          console.error("Failed to fetch schedule:", err);
        }
      }

      if (!currentStudioId) {
        setError("Studio ID tidak tersedia. Pastikan data dikirim dari halaman sebelumnya.");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const res = await axios.get(`https://cinix-be.vercel.app/studios/${currentStudioId}/seats`, { 
          withCredentials: true 
        });
        const raw = res.data?.data || res.data;

        if (!raw || raw.length === 0) {
          setError("Tidak ada data kursi tersedia");
          setIsLoading(false);
          return;
        }

        const grouped = raw.reduce((acc, seat) => {
          const row = seat.seat_number.charAt(0);
          const num = parseInt(seat.seat_number.slice(1), 10);
          if (!acc[row]) acc[row] = [];
          
          acc[row].push({ 
            ...seat, 
            id_seat: seat.seat_number, 
            _num: num 
          });
          return acc;
        }, {});

        Object.keys(grouped).forEach(r => grouped[r].sort((a,b) => a._num - b._num));

        const processed = Object.keys(grouped).sort().map(r => ({ 
          rowLabel: r, 
          seats: grouped[r] 
        }));
        
        setSeatsData(processed);
      } catch (err) {
        console.error(err);
        setError("Gagal memuat data kursi. Periksa koneksi atau server.");
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [studioId]);

  // Toggle seat selection
  const toggleSeat = (seatId) => {
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(prev => prev.filter(s => s !== seatId));
      return;
    }
    if (selectedSeats.length >= maxSeats) {
      alert(`Maksimal ${maxSeats} kursi per transaksi.`);
      return;
    }
    setSelectedSeats(prev => [...prev, seatId]);
  };

  const displaySeats = seatsData
    .flatMap(row => row.seats)
    .filter(seat => selectedSeats.includes(seat.id_seat))
    .map(seat => seat.seat_number)
    .sort((a,b) => a.localeCompare(b, undefined, {numeric: true}))
    .join(", ");

  // Proceed to payment
  const handleProceedToPayment = async () => {
    if (selectedSeats.length === 0) return;
    
    if (!scheduleId) {
      alert("Schedule tidak lengkap.");
      return;
    }

    setIsSubmitting(true);

    const totalAmount = selectedSeats.length * ticketPrice;
    const params = new URLSearchParams();
    params.append("schedule_id", scheduleId);
    params.append("seats", selectedSeats.join(","));
    params.append("amount", totalAmount.toString());

    try {
      const res = await axios.post("https://cinix-be.vercel.app/payment", params.toString(), {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        withCredentials: true 
      });

      const data = res.data || {};
      const token = data.token || data.snap?.token || data.snap_token || data.transactionToken || null;
      const redirectUrl = data.redirect_url || data.payment_url || null;

      if (token) {
        if (!window.snap) {
          alert("Gagal memuat Midtrans Snap. Silakan refresh halaman.");
          setIsSubmitting(false);
          return;
        }

        window.snap.pay(token, {
          onSuccess: function(result){
            console.log("Midtrans success", result);
            
            try {
                const storageUserId = userId || "guest_user"; 
                const storageKey = `tickets_${storageUserId}`;
                
                const newTicket = {
                    id: Date.now(), 
                    movie_title: movie.title,
                    movie_poster: movie.poster_url,
                    cinema_name: cinema,
                    showtime: time,
                    watch_date: selectedDate, 
                    booking_date: new Date().toISOString(),
                    seats: selectedSeats, 
                    quantity: selectedSeats.length,
                    total_amount: totalAmount,
                    status: "Lunas",
                    transaction_id: result.transaction_id || result.order_id
                };

                const existingTickets = JSON.parse(localStorage.getItem(storageKey) || "[]");
                const updatedTickets = [newTicket, ...existingTickets];
                
                localStorage.setItem(storageKey, JSON.stringify(updatedTickets));
                console.log(`Tiket berhasil disimpan ke ${storageKey}`);

            } catch (err) {
                console.error("Gagal menyimpan tiket lokal:", err);
            }

            alert("Pembayaran sukses! Tiket Anda telah diterbitkan.");
            
            navigate("/mytickets"); 
          },
          onPending: function(result){
            console.log("Midtrans pending", result);
            alert("Pembayaran pending. Silakan selesaikan pembayaran Anda.");
            navigate("/"); 
          },
          onError: function(result){
            console.error("Midtrans error", result);
            alert("Terjadi kesalahan pembayaran. Silakan coba lagi.");
            setIsSubmitting(false);
          },
          onClose: function(){
            console.log("Midtrans popup closed");
            setIsSubmitting(false);
          }
        });

      } else if (redirectUrl) {
        window.location.href = redirectUrl;
      } else {
        alert("Response pembayaran tidak valid.");
        setIsSubmitting(false);
      }

    } catch (err) {
      console.error(err);
      alert("Gagal memproses pembayaran. Silakan coba lagi.");
      setIsSubmitting(false);
    }
  };

  if (isLoading) return (
    <div className="min-h-screen bg-[#f5f1dc] flex flex-col items-center justify-center gap-4">
      <div className="w-12 h-12 border-4 border-[#2a4c44] border-t-transparent rounded-full animate-spin"></div>
      <p className="text-[#2a4c44] font-semibold animate-pulse">Memuat Data Kursi...</p>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-[#f5f1dc] flex flex-col items-center justify-center gap-4 p-6">
      <div className="text-red-600 text-6xl">⚠️</div>
      <h2 className="text-xl font-bold text-[#2a4c44]">Terjadi Kesalahan</h2>
      <p className="text-gray-600 text-center max-w-md">{error}</p>
      <button onClick={() => window.location.reload()} className="mt-4 px-6 py-3 bg-[#2a4c44] text-white font-bold rounded-xl hover:bg-[#1e3630] transition">Coba Lagi</button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#6a8e7f] flex flex-col font-sans">
      <Header 
        title={movie.title} 
        subtitle={cinema || "AEON MALL TANJUNG BARAT XXI"} 
        onBack={() => navigate(-1)} 
        onHome={() => navigate('/')} 
      />

      <div className="flex-grow flex flex-col lg:flex-row p-4 md:p-6 gap-6 max-w-7xl mx-auto w-full">
        <div className="flex-grow bg-[#f5f1dc] p-4 md:p-8 rounded-3xl shadow-xl flex flex-col items-center overflow-hidden relative">
          <h2 className="text-xl font-black text-[#2a4c44] mb-6 self-start">Pilih Kursi</h2>

          <div className="w-full max-w-2xl mb-12 relative flex justify-center">
            <div className="w-full h-4 bg-[#2a4c44] rounded-full shadow-[0_20px_60px_-10px_rgba(42,76,68,0.6)]"></div>
            <div className="absolute top-7 text-[10px] font-bold text-gray-400 tracking-[0.4em]">LAYAR</div>
          </div>

          <div className="w-full overflow-x-auto pb-8 flex justify-center">
            <div className="flex flex-col gap-3 min-w-max px-4">
              {seatsData.map(row => (
                <div key={row.rowLabel} className="flex items-center gap-8 md:gap-14 justify-center">
                  <div className="flex gap-1 md:gap-1.5">
                    {row.seats.slice(0,6).map(seat => (
                      <Seat 
                        key={seat.id_seat}
                        id={seat.id_seat}
                        label={seat.seat_number}
                        status={!seat.is_available ? 'taken' : selectedSeats.includes(seat.id_seat) ? 'selected' : 'available'}
                        onClick={toggleSeat} 
                      />
                    ))}
                  </div>
                  <div className="flex gap-1 md:gap-1.5">
                    {row.seats.slice(6,12).map(seat => (
                      <Seat 
                        key={seat.id_seat}
                        id={seat.id_seat}
                        label={seat.seat_number}
                        status={!seat.is_available ? 'taken' : selectedSeats.includes(seat.id_seat) ? 'selected' : 'available'}
                        onClick={toggleSeat} 
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-6 mt-4 pt-6 border-t border-[#2a4c44]/10 w-full text-sm text-[#2a4c44]">
            <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-white border border-gray-300"></div> Tersedia</div>
            <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-[#6a8e7f] border border-[#6a8e7f]"></div> Dipilih</div>
            <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-gray-300 opacity-80"></div> Terisi (Sold)</div>
          </div>
        </div>

        <div className="w-full lg:w-96 flex-shrink-0">
          <div className="bg-white p-6 rounded-3xl shadow-xl sticky top-24">
            <h2 className="text-xl font-black text-[#2a4c44] mb-6">Ringkasan</h2>

            <div className="flex gap-4 mb-6">
              <img src={movie.poster_url} alt="Poster" className="w-20 h-28 object-cover rounded-xl shadow-md bg-gray-200" />
              <div>
                <h3 className="font-bold text-[#2a4c44] line-clamp-2 leading-tight mb-1">{movie.title}</h3>
                <p className="text-xs text-gray-500 font-medium mb-2">{cinema || "XXI Cinema"}</p>
                <div className="inline-flex items-center gap-1 bg-amber-100 text-amber-700 text-[10px] px-2 py-1 rounded-md font-bold">
                  <Calendar size={12} /> {time || "14:30"} WIB
                </div>
                <div className="mt-1 text-xs text-gray-500 font-medium">
                    {new Date(selectedDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                </div>
              </div>
            </div>

            <div className="border-t border-dashed border-gray-300 py-4 space-y-3 text-sm">
              <div className="flex justify-between items-start">
                <span className="text-gray-500">Nomor Kursi</span>
                <span className="font-bold text-[#2a4c44] text-right max-w-[150px] leading-snug">
                  {displaySeats || "-"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Harga Satuan</span>
                <span className="font-medium">Rp {ticketPrice.toLocaleString('id-ID')}</span>
              </div>
            </div>

            <div className="border-t border-gray-200 py-4 flex justify-between items-center mb-2">
              <span className="text-lg font-bold text-[#2a4c44]">Total</span>
              <span className="text-2xl font-black text-amber-500">Rp {(selectedSeats.length * ticketPrice).toLocaleString('id-ID')}</span>
            </div>

            <button 
              onClick={handleProceedToPayment} 
              disabled={selectedSeats.length === 0 || isSubmitting}
              className="w-full py-4 bg-[#2a4c44] text-white font-bold rounded-xl shadow-lg hover:bg-[#1e3630] hover:shadow-xl hover:-translate-y-1 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-y-0 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" size={20} /> 
                  Memproses...
                </>
              ) : (
                `Lanjut Pembayaran (${selectedSeats.length})`
              )}
            </button>

          </div>
        </div>

      </div>
    </div>
  );
}