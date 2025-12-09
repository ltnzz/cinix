import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Home, ChevronLeft, Calendar, Loader2, X, Ticket, MapPin, Clock, Film, Receipt, Info, Timer, RefreshCw } from "lucide-react"; 
import { useNavigate, useLocation } from "react-router-dom";

const API_BASE_URL = "https://cinix-be.vercel.app"; 

const Seat = ({ seatNumber, status, onClick }) => {
  const baseStyle = "w-9 h-9 md:w-11 md:h-11 rounded-t-lg text-[10px] md:text-xs font-bold transition-all duration-200 flex items-center justify-center select-none shadow-sm";
  
  const styles = {
    available: "bg-white text-[#2a4c44] border border-gray-300 hover:bg-[#6a8e7f] hover:text-white hover:border-[#6a4c7] cursor-pointer hover:shadow-md hover:-translate-y-0.5",
    selected: "bg-[#6a8e7f] text-white shadow-lg transform scale-110 border border-[#6a8e7f] cursor-pointer ring-2 ring-[#6a8e7f]/30 z-10",
    taken: "bg-gray-300 text-gray-400 cursor-not-allowed border-transparent opacity-80",
    locked: "bg-amber-100 text-amber-600 border border-amber-300 cursor-not-allowed shadow-inner"
  };

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (status === 'available' || status === 'selected') {
      onClick(seatNumber);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={status === 'taken' || status === 'locked'}
      className={`${baseStyle} ${styles[status]}`}
      type="button"
    >
      {seatNumber}
      {status === 'locked' && <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" />}
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

const getCurrentUserDetail = (props) => {
    try {
        const userFromProps = props.user || props.stateFromNav?.user;
        if (userFromProps?.name) return userFromProps;
        const userStr = localStorage.getItem('user');
        if (userStr) return JSON.parse(userStr);
    } catch (e) { console.error(e); }
    return { name: 'Guest' };
};

export default function BookingPage(props) {
  const navigate = useNavigate();
  const location = useLocation();
  const stateFromNav = location.state || {};
  const userDetails = getCurrentUserDetail(props); 

  const movie = props.movie || stateFromNav.movie || { title: "Film", poster_url: "" };
  const cinema = props.cinema || stateFromNav.cinema || "Cinema XXI";
  const time = props.time || stateFromNav.time || "00:00";
  const selectedDate = props.date || stateFromNav.date || new Date().toISOString(); 
  
  const scheduleId = props.scheduleId || stateFromNav.scheduleId; 
  const StudioId = props.studioId || stateFromNav.studioId;
  const midtransClientKey = props.midtransClientKey || stateFromNav.midtransClientKey || "SB-Mid-client-a24K2aKsd8sdasd"; 

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [seatsData, setSeatsData] = useState([]); 
  const [selectedSeats, setSelectedSeats] = useState([]); 
  const [error, setError] = useState(null);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  const ticketPrice = props.ticketPrice || 50000;
  const adminFee = 3000;  
  const taxRate = 0.11;  
  const maxSeats = props.maxSeats || 8;

  const subTotal = selectedSeats.length * ticketPrice;
  const taxAmount = Math.round(subTotal * taxRate);
  const grandTotal = subTotal + taxAmount + (selectedSeats.length > 0 ? adminFee : 0);

  const snapLoadedRef = useRef(false);

  useEffect(() => {
    let timer;
    if (isLocked && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (isLocked && timeLeft === 0) {
      alert("Waktu pembayaran habis! Kursi dilepas kembali.");
      handleCancelCheckout(); 
    }
    return () => clearInterval(timer);
  }, [isLocked, timeLeft]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  useEffect(() => {
    if (!midtransClientKey || document.querySelector('script[data-midtrans-snap]')) {
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
    };
    script.onerror = () => console.error("Failed to load Snap");
    document.body.appendChild(script);
  }, [midtransClientKey]);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      setError(null);
      try {
        if (!StudioId) throw new Error("ID Studio tidak ditemukan. Mohon ulangi pemilihan jadwal.");

        const res = await axios.get(`${API_BASE_URL}/studios/${StudioId}/seats`, { withCredentials: true });
        const rawSeats = res.data?.data || res.data; 

        if (!rawSeats || rawSeats.length === 0) throw new Error("Data kursi tidak tersedia.");

        let currentScheduleBookings = [];
        if (scheduleId) {
            try {
                const localBookings = JSON.parse(localStorage.getItem('cinix_local_bookings') || '{}');
                currentScheduleBookings = localBookings[String(scheduleId)] || [];
            } catch (e) {
                console.error("Error reading local storage", e);
            }
        }

        const grouped = rawSeats.reduce((acc, seat) => {
          const row = seat.seat_number.charAt(0); 
          const num = parseInt(seat.seat_number.slice(1), 10);
          
          if (!acc[row]) acc[row] = [];
          
          const isTakenLocally = currentScheduleBookings.includes(seat.seat_number);

          acc[row].push({ 
            ...seat, 
            is_available: isTakenLocally ? false : seat.is_available,
            _num: num 
          });
          return acc;
        }, {});

        Object.keys(grouped).forEach(r => grouped[r].sort((a,b) => a._num - b._num));
        
        const processed = Object.keys(grouped).sort().map(r => ({ rowLabel: r, seats: grouped[r] }));
        setSeatsData(processed);

      } catch (err) {
        console.error(err);
        setError(err.message || "Gagal memuat kursi.");
      } finally {
        setTimeout(() => setIsLoading(false), 500);
      }
    };
    load();
  }, [StudioId, scheduleId]);

  const toggleSeat = (seatNumber) => {
    if (isLocked) return; 

    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(prev => prev.filter(s => s !== seatNumber));
    } else {
      if (selectedSeats.length >= maxSeats) return alert(`Max ${maxSeats} kursi.`);
      setSelectedSeats(prev => [...prev, seatNumber]);
    }
  };

  const handleInitialCheckout = () => {
    if (selectedSeats.length === 0) return;
    
    if (!window.snap) {
        alert("Sistem pembayaran sedang memuat, silakan tunggu beberapa detik dan coba lagi.");
        return;
    }

    setTimeLeft(300); 
    setIsLocked(true); 
    setShowConfirmModal(true); 
  };

  const handleCancelCheckout = () => {
    if (isSubmitting) return;
    setShowConfirmModal(false);
    setIsLocked(false); 
    setTimeLeft(0);
  };

  const executePayment = async () => {
    if (!scheduleId) {
        alert("Data jadwal tidak valid. Mohon refresh halaman.");
        return;
    }
    
    setIsSubmitting(true);
    const params = new URLSearchParams();
    params.append("schedule_id", scheduleId);
    params.append("seats", selectedSeats.join(",")); 
    params.append("amount", subTotal.toString());
    params.append("user_name", userDetails.name);

    try {
      const res = await axios.post(`${API_BASE_URL}/payment`, params.toString(), {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        withCredentials: true 
      });

      const data = res.data || {};
      const token = data.token || data.snap?.token;

      setShowConfirmModal(false); 

      if (token && window.snap) {
        window.snap.pay(token, {
          onSuccess: (result) => {
            try {
                const sId = String(scheduleId);
                const localBookings = JSON.parse(localStorage.getItem('cinix_local_bookings') || '{}');
                const existingScheduleBookings = localBookings[sId] || [];
                localBookings[sId] = [...new Set([...existingScheduleBookings, ...selectedSeats])];
                localStorage.setItem('cinix_local_bookings', JSON.stringify(localBookings));

                const storageUserName = userDetails.name || "guest"; 
                const ticketStorageKey = `tickets_${storageUserName}`;

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
                    total_amount: grandTotal,
                    status: "Lunas",
                    transaction_id: result.transaction_id || result.order_id,
                    schedule_id: scheduleId
                };

                const existingTickets = JSON.parse(localStorage.getItem(ticketStorageKey) || "[]");
                const updatedTickets = [newTicket, ...existingTickets];
                localStorage.setItem(ticketStorageKey, JSON.stringify(updatedTickets));
            } catch (err) {
                console.error("Gagal menyimpan data tiket/booking", err);
            }

            const updatedData = seatsData.map(row => ({
              ...row,
              seats: row.seats.map(seat => {
                if (selectedSeats.includes(seat.seat_number)) {
                  return { ...seat, is_available: false }; 
                }
                return seat;
              })
            }));

            setSeatsData(updatedData); 
            setSelectedSeats([]);      
            setIsLocked(false);        
            
            setTimeout(() => {
                alert("Pembayaran Berhasil! Tiket diterbitkan.");
                navigate("/mytickets");
            }, 500);
          },
          onPending: (result) => {
            alert("Menunggu Pembayaran.");
            navigate("/");
          },
          onError: (result) => {
            alert("Pembayaran Gagal.");
            setIsLocked(false);
          },
          onClose: () => {
            alert("Pembayaran dibatalkan.");
            setIsLocked(false);
          }
        });
      } else {
          alert("Terjadi kesalahan pada gateway pembayaran. Silakan refresh halaman.");
          setIsSubmitting(false);
          setIsLocked(false);
      }
    } catch (err) {
      console.error(err);
      alert("Gagal memproses pembayaran. Cek koneksi internet Anda.");
      setIsLocked(false); 
      setIsSubmitting(false);
    } 
  };

  if (isLoading) return (
    <div className="min-h-screen bg-[#6a8e7f] flex flex-col items-center justify-center gap-4">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-[#fff9e6]/30 border-t-[#fff9e6] rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Film size={20} className="text-[#fff9e6] opacity-80" />
          </div>
      </div>
        <p className="text-[#fff9e6] font-bold text-lg animate-pulse tracking-wide">
          Memuat Studio...
        </p>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex flex-col items-center justify-center text-[#2a4c44] gap-4 p-4 text-center bg-[#f5f1dc]">
        <div className="bg-red-100 p-4 rounded-full text-red-600"><X size={32}/></div>
        <h2 className="font-bold text-xl">Terjadi Kesalahan</h2>
        <p className="max-w-md text-gray-600">{error}</p>
        <button onClick={() => navigate('/')} className="px-6 py-2 bg-[#2a4c44] text-white rounded-lg font-bold">
            Kembali ke Beranda
        </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#6a8e7f] flex flex-col font-sans animate-in fade-in">
      <Header title={movie.title} subtitle={cinema} onBack={() => navigate(-1)} onHome={() => navigate('/')} />

      <div className="flex-grow flex flex-col lg:flex-row p-4 gap-6 max-w-7xl mx-auto w-full relative z-10">
        
        <div className="flex-grow bg-[#f5f1dc] p-4 rounded-3xl shadow-xl flex flex-col items-center relative border border-[#2a4c44]/10">
          <div className="flex justify-between w-full mb-6 items-center px-2">
            {isLocked && (
              <div className="flex items-center gap-2 text-amber-600 text-xs font-bold bg-amber-100 px-3 py-1 rounded-full animate-pulse border border-amber-200">
                  <Clock size={14} /> {formatTime(timeLeft)}
              </div>
            )}
          </div>

          <div className="w-full max-w-2xl h-3 bg-[#2a4c44] rounded-full shadow-lg mb-2 opacity-80" />
          <h2 className="text-xl font-black text-[#2a4c44] mb-4">Layar</h2>

          <div className="w-full overflow-x-auto pb-8 flex justify-center">
            <div className="flex flex-col gap-3 min-w-max px-4">
              {seatsData.map(row => (
                <div key={row.rowLabel} className="flex items-center gap-8 md:gap-14 justify-center">
                  {[row.seats.slice(0,6), row.seats.slice(6,12)].map((group, idx) => (
                    <div key={idx} className="flex gap-1 md:gap-1.5">
                      {group.map(seat => {
                        let status = 'available';
                        
                        if (!seat.is_available) status = 'taken';
                        else if (selectedSeats.includes(seat.seat_number)) {
                          status = isLocked ? 'locked' : 'selected';
                        }

                        return (
                          <Seat 
                            key={seat.id_seat} 
                            seatNumber={seat.seat_number} 
                            status={status} 
                            onClick={toggleSeat} 
                          />
                        );
                      })}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-4 mt-4 pt-4 border-t border-[#2a4c44]/10 w-full text-xs text-[#2a4c44]">
            <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-white border border-gray-300"></div> Avail</div>
            <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-[#6a8e7f]"></div> Selected</div>
            <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-amber-100 border border-amber-300"></div> Paying</div>
            <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-gray-300"></div> Sold</div>
          </div>
        </div>

        <div className="w-full lg:w-96 flex-shrink-0">
          <div className="bg-white p-6 rounded-3xl shadow-xl sticky top-24 border border-gray-100">
            <h2 className="text-xl font-black text-[#2a4c44] mb-6">Ringkasan</h2>

            <div className="flex gap-4 mb-6">
              <img src={movie.poster_url || "https://placehold.co/100x150"} className="w-20 h-28 object-cover rounded-xl shadow-md bg-gray-200" alt="poster"/>
              <div>
                <h3 className="font-bold text-[#2a4c44] line-clamp-2 leading-tight mb-1">{movie.title}</h3>
                <p className="text-xs text-gray-500 font-medium mb-2">{cinema}</p>
                <div className="inline-flex items-center gap-1 bg-amber-100 text-amber-700 text-[10px] px-2 py-1 rounded-md font-bold">
                  <Calendar size={12} /> {time} WIB
                </div>
                <div className="mt-1 text-xs text-gray-500 font-medium">
                    {new Date(selectedDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                </div>
              </div>
            </div>

            <div className="border-t border-dashed border-gray-300 py-4 space-y-3 text-sm">
              <div className="flex justify-between items-start">
                <span className="text-gray-500">Nomor Kursi ({selectedSeats.length})</span>
                <span className="font-bold text-[#2a4c44] text-right max-w-[150px] leading-snug">
                  {selectedSeats.join(", ") || "-"}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-500">Subtotal Tiket</span>
                <span className="font-medium">Rp {subTotal.toLocaleString('id-ID')}</span>
              </div>

              {selectedSeats.length > 0 && (
                <>
                    <div className="flex justify-between text-gray-500 text-xs">
                        <span>Pajak Hiburan (11%)</span>
                        <span>Rp {taxAmount.toLocaleString('id-ID')}</span>
                    </div>
                    <div className="flex justify-between text-gray-500 text-xs">
                        <span>Biaya Layanan</span>
                        <span>Rp {adminFee.toLocaleString('id-ID')}</span>
                    </div>
                </>
              )}
            </div>

            <div className="border-t border-gray-200 py-4 flex justify-between items-center mb-2">
              <div className="flex flex-col">
                <span className="text-lg font-bold text-[#2a4c44]">Total Bayar</span>
                <span className="text-[10px] text-gray-400">Termasuk pajak & fee</span>
              </div>
              <span className="text-2xl font-black text-amber-500">Rp {grandTotal.toLocaleString('id-ID')}</span>
            </div>

            <button 
              onClick={handleInitialCheckout} 
              disabled={selectedSeats.length === 0 || isLocked}
              className="w-full py-4 bg-[#2a4c44] text-white font-bold rounded-xl shadow-lg hover:bg-[#1e3630] disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLocked ? "Sedang Membayar..." : "Lanjut Bayar"}
            </button>

          </div>
        </div>

      </div>

      {showConfirmModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-4 bg-[#f5f1dc] flex justify-between items-center border-b border-[#2a4c44]/10">
              <h3 className="font-bold text-[#2a4c44] flex items-center gap-2"><Receipt size={18}/> Konfirmasi Pesanan</h3>
              <div className="flex items-center gap-1 bg-amber-100 text-amber-600 px-3 py-1 rounded-full text-xs font-bold animate-pulse">
                <Timer size={14}/> {formatTime(timeLeft)}
              </div>
            </div>

            <div className="p-6">
              <div className="flex gap-4 mb-6 bg-[#f8f9fa] p-3 rounded-2xl border border-gray-100">
                <img src={movie.poster_url || "https://placehold.co/100x150"} className="w-16 h-24 object-cover rounded-lg shadow-sm" alt="poster" />
                <div className="flex flex-col justify-center">
                  <h4 className="font-bold text-[#2a4c44] leading-tight text-sm mb-1">{movie.title}</h4>
                  <span className="text-xs text-gray-500">{cinema}</span>
                </div>
              </div>

              <div className="space-y-3 bg-[#fff9e6]/50 p-4 rounded-xl border border-[#fff9e6]">
                <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tiket x {selectedSeats.length}</span>
                    <span className="font-bold">Rp {subTotal.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                    <span>Pajak (11%)</span>
                    <span>Rp {taxAmount.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500 border-b border-gray-200 pb-2">
                    <span>Biaya Layanan</span>
                    <span>Rp {adminFee.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between text-lg font-black text-[#2a4c44] pt-1">
                    <span>Total</span>
                    <span>Rp {grandTotal.toLocaleString('id-ID')}</span>
                </div>
              </div>

              <div className="mt-4 flex items-start gap-2 bg-blue-50 p-3 rounded-lg text-blue-800 text-xs">
                <Info size={16} className="shrink-0 mt-0.5"/>
                <p>Selesaikan pembayaran dalam <span className="font-bold">{formatTime(timeLeft)}</span>. Tiket yang dibeli tidak dapat ditukar/dikembalikan.</p>
              </div>

              <div className="flex gap-3 mt-6">
                <button onClick={handleCancelCheckout} disabled={isSubmitting} className="flex-1 py-3 text-gray-600 font-bold bg-gray-100 rounded-xl hover:bg-gray-200">Batal</button>
                <button onClick={executePayment} disabled={isSubmitting} className="flex-1 py-3 bg-[#2a4c44] text-white font-bold rounded-xl hover:bg-[#1e3630] flex justify-center items-center gap-2">
                  {isSubmitting ? <Loader2 className="animate-spin" size={16}/> : "Bayar Sekarang"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}