import React, { useState, useEffect } from "react";
import { Home, ChevronLeft, Calendar, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

// --- 1. MOCK DATA GENERATOR ---
const generateMockData = () => {
  const rows = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K"];
  
  // DAFTAR KURSI YANG SUDAH TERISI
  const soldSeats = [
      "A5", "A6", 
      "C3", "C4", 
      "G10", "G11", 
      "F1", "F2", 
      "H5", "H6", "H7",
      "K1", "K2", "K11", "K12"
  ];

  const data = [];
  
  rows.forEach(row => {
    for (let i = 1; i <= 12; i++) {
      const seatId = `${row}${i}`;
      const isTaken = soldSeats.includes(seatId);

      data.push({
        seat_number: seatId,
        seat_type: "regular",
        is_available: !isTaken 
      });
    }
  });
  
  return {
    message: "Data kursi berhasil diambil",
    data: data
  };
};

// --- 2. COMPONENT: SEAT ---
const Seat = ({ id, status, onClick, label }) => {
  const baseStyle = "w-9 h-9 md:w-11 md:h-11 rounded-t-lg text-[10px] md:text-xs font-bold transition-all duration-200 flex items-center justify-center select-none shadow-sm";
  
  const styles = {
    available: "bg-white text-[#2a4c44] border border-gray-300 hover:bg-[#6a8e7f] hover:text-white hover:border-[#6a8e7f] cursor-pointer hover:shadow-md hover:-translate-y-0.5",
    selected: "bg-[#6a8e7f] text-white shadow-lg transform scale-110 border border-[#6a8e7f] cursor-pointer ring-2 ring-[#6a8e7f]/30 z-10",
    taken: "bg-gray-300 text-gray-400 cursor-not-allowed border-transparent opacity-80"
  };

  return (
    <button
      onClick={() => status !== 'taken' && onClick(id)}
      disabled={status === 'taken'}
      className={`${baseStyle} ${styles[status]}`}
    >
      {label}
    </button>
  );
};

// --- 3. COMPONENT: HEADER ---
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

// --- 4. MAIN PAGE ---
export default function BookingPage({ movie, cinema, time }) {
  const navigate = useNavigate();
  
  // State
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false); // State untuk loading saat bayar
  const [seatsData, setSeatsData] = useState([]); 
  const [selectedSeats, setSelectedSeats] = useState([]);
  
  // Fallback Data
  const displayMovie = movie || { 
    title: "TRON: ARES (2025)", 
    poster_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8tq8lygfqv4hEIDsAjS88Rdh-z99CusKQyg&s" 
  };
  const ticketPrice = 50000;

  // --- FETCH & PROCESS SEAT DATA ---
  useEffect(() => {
    const timer = setTimeout(() => {
      const apiResponse = generateMockData(); 
      const rawData = apiResponse.data;

      // Grouping Data Flat menjadi Per-Row
      const grouped = rawData.reduce((acc, seat) => {
        const rowChar = seat.seat_number.charAt(0);
        const seatNum = parseInt(seat.seat_number.substring(1));

        if (!acc[rowChar]) acc[rowChar] = [];
        acc[rowChar].push({ ...seat, _num: seatNum });
        return acc;
      }, {});

      Object.keys(grouped).forEach(row => {
        grouped[row].sort((a, b) => a._num - b._num);
      });

      const processed = Object.keys(grouped).sort().map(row => ({
        rowLabel: row,
        seats: grouped[row]
      }));

      setSeatsData(processed);
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  // --- LOGIC KLIK KURSI ---
  const toggleSeat = (id) => {
    if (selectedSeats.includes(id)) {
      setSelectedSeats(prev => prev.filter(seatId => seatId !== id));
    } else {
      if (selectedSeats.length >= 8) {
        alert("Maksimal 8 kursi per transaksi.");
        return;
      }
      setSelectedSeats(prev => [...prev, id]);
    }
  };

  // --- LOGIC PEMBAYARAN (API INTEGRATION) ---
  const handleProceedToPayment = async () => {
    if (selectedSeats.length === 0) return;

    setIsSubmitting(true);
    const totalAmount = selectedSeats.length * ticketPrice;

    // Menyiapkan data body x-www-form-urlencoded
    const formData = new URLSearchParams();
    
    // PERHATIAN: Ganti ID ini dengan data user/schedule yang real dari props atau context
    formData.append("user_id", "0203acdc-31da-4f79-a3d8-804c9f2ef1e2"); 
    formData.append("schedule_id", "02c0037c-3b6e-40f0-939a-b6ac42cd086e");
    
    // Menggabungkan kursi menjadi string dipisah koma (contoh: "A1,A2")
    formData.append("seats", selectedSeats.join(",")); 
    formData.append("amount", totalAmount.toString());

    try {
      const response = await fetch("https://cinix-be.vercel.app/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        credentials: "include",
        body: formData.toString()
      });

      const result = await response.json();

      if (response.ok) {
        // SUKSES
        console.log("Payment Success:", result);
        alert(`Pembayaran Berhasil!\nSeats: ${selectedSeats.join(", ")}\nTotal: Rp ${totalAmount.toLocaleString()}`);
        // Redirect atau reset state disini
        navigate('/'); 
      } else {
        // GAGAL
        console.error("Payment Failed:", result);
        alert(`Pembayaran Gagal: ${result.message || "Terjadi kesalahan pada server."}`);
      }

    } catch (error) {
      console.error("Network Error:", error);
      alert("Terjadi kesalahan jaringan. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f5f1dc] flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-[#2a4c44] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-[#2a4c44] font-semibold animate-pulse">Menyiapkan Denah...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#6a8e7f] flex flex-col font-sans">
      <Header 
        title={displayMovie.title} 
        subtitle={cinema || "AEON MALL TANJUNG BARAT XXI"} 
        onBack={() => navigate(-1)} 
        onHome={() => navigate('/')}
      />

      <div className="flex-grow flex flex-col lg:flex-row p-4 md:p-6 gap-6 max-w-7xl mx-auto w-full">
        
        {/* === AREA KIRI: LAYAR & KURSI === */}
        <div className="flex-grow bg-[#f5f1dc] p-4 md:p-8 rounded-3xl shadow-xl flex flex-col items-center overflow-hidden relative">
          
          <h2 className="text-xl font-black text-[#2a4c44] mb-6 self-start">Pilih Kursi</h2>

          {/* LAYAR BIOSKOP */}
          <div className="w-full max-w-2xl mb-12 relative flex justify-center">
             <div className="w-full h-4 bg-[#2a4c44] rounded-full shadow-[0_20px_60px_-10px_rgba(42,76,68,0.6)]"></div>
             <div className="absolute top-7 text-[10px] font-bold text-gray-400 tracking-[0.4em]">LAYAR</div>
             <div className="absolute top-0 w-[80%] h-24 bg-gradient-to-b from-[#2a4c44]/15 to-transparent blur-xl pointer-events-none"></div>
          </div>

          {/* GRID KURSI SCROLLABLE */}
          <div className="w-full overflow-x-auto pb-8 flex justify-center">
            <div className="flex flex-col gap-3 min-w-max px-4">
              {seatsData.map((row) => (
                <div key={row.rowLabel} className="flex items-center gap-8 md:gap-14 justify-center">
                  
                  {/* BLOK KIRI (1-6) */}
                  <div className="flex gap-1 md:gap-1.5">
                    {row.seats.slice(0, 6).map((seat) => (
                      <Seat 
                        key={seat.seat_number}
                        id={seat.seat_number}
                        label={seat.seat_number}
                        status={
                          !seat.is_available ? 'taken' : 
                          selectedSeats.includes(seat.seat_number) ? 'selected' : 
                          'available'
                        }
                        onClick={toggleSeat}
                      />
                    ))}
                  </div>

                  {/* BLOK KANAN (7-12) */}
                  <div className="flex gap-1 md:gap-1.5">
                    {row.seats.slice(6, 12).map((seat) => (
                      <Seat 
                        key={seat.seat_number}
                        id={seat.seat_number}
                        label={seat.seat_number}
                        status={
                          !seat.is_available ? 'taken' : 
                          selectedSeats.includes(seat.seat_number) ? 'selected' : 
                          'available'
                        }
                        onClick={toggleSeat}
                      />
                    ))}
                  </div>

                </div>
              ))}
            </div>
          </div>

          {/* LEGEND */}
          <div className="flex flex-wrap justify-center gap-6 mt-4 pt-6 border-t border-[#2a4c44]/10 w-full text-sm text-[#2a4c44]">
            <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-white border border-gray-300"></div> Tersedia</div>
            <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-[#6a8e7f] border border-[#6a8e7f]"></div> Dipilih</div>
            <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-gray-300 opacity-80"></div> Terisi (Sold)</div>
          </div>
        </div>

        {/* === AREA KANAN: RINGKASAN ORDER === */}
        <div className="w-full lg:w-96 flex-shrink-0">
            <div className="bg-white p-6 rounded-3xl shadow-xl sticky top-24">
                <h2 className="text-xl font-black text-[#2a4c44] mb-6">Ringkasan</h2>
                
                <div className="flex gap-4 mb-6">
                    <img src={displayMovie.poster_url} alt="Poster" className="w-20 h-28 object-cover rounded-xl shadow-md bg-gray-200" />
                    <div>
                        <h3 className="font-bold text-[#2a4c44] line-clamp-2 leading-tight mb-1">{displayMovie.title}</h3>
                        <p className="text-xs text-gray-500 font-medium mb-2">{cinema || "XXI Cinema"}</p>
                        <div className="inline-flex items-center gap-1 bg-amber-100 text-amber-700 text-[10px] px-2 py-1 rounded-md font-bold">
                              <Calendar size={12} /> {time || "14:30"} WIB
                        </div>
                    </div>
                </div>

                <div className="border-t border-dashed border-gray-300 py-4 space-y-3 text-sm">
                    <div className="flex justify-between items-start">
                        <span className="text-gray-500">Nomor Kursi</span>
                        <span className="font-bold text-[#2a4c44] text-right max-w-[150px] leading-snug">
                            {selectedSeats.length > 0 
                              ? selectedSeats.sort((a,b) => a.localeCompare(b, undefined, {numeric: true})).join(", ") 
                              : "-"}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-500">Harga Satuan</span>
                        <span className="font-medium">Rp {ticketPrice.toLocaleString('id-ID')}</span>
                    </div>
                </div>

                <div className="border-t border-gray-200 py-4 flex justify-between items-center mb-2">
                    <span className="text-lg font-bold text-[#2a4c44]">Total</span>
                    <span className="text-2xl font-black text-amber-500">
                        Rp {(selectedSeats.length * ticketPrice).toLocaleString('id-ID')}
                    </span>
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