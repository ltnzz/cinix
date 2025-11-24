import { useState } from "react";
import {
  Home,
  User,
  Ticket,
  Heart,
  ChevronLeft,
} from "lucide-react";

function PaymentHeader({
  onNavigateHome,
  onNavigateLogin,
  movieTitle,
  cinemaName,
}) {
  return (
    <header className="flex items-center justify-between px-8 py-4 bg-[#f5f1dc] shadow">
      <button
        onClick={onNavigateHome} 
        className="flex items-center gap-2 text-[#2a4c44] font-semibold"
      >
        <ChevronLeft size={24} />
      </button>

      <div className="flex flex-col items-center">
        <h1 className="text-xl font-bold text-[#2a4c44]">{movieTitle}</h1>
        <span className="text-sm text-gray-600">{cinemaName}</span>
      </div>

      <div className="flex gap-6 text-[#2a4c44] font-semibold">
        <button
          onClick={onNavigateHome}
          className="flex items-center gap-2 hover:opacity-70"
        >
          <Home className="text-[#2a4c44]" />
        </button>
        <button className="flex items-center gap-2 hover:opacity-70">
          <Ticket />
        </button>
        <button className="flex items-center gap-2 hover:opacity-70">
          <Heart />
        </button>
        <button
          onClick={onNavigateLogin}
          className="flex items-center gap-2 hover:opacity-70"
        >
          <User />
        </button>
      </div>
    </header>
  );
}

const Seat = ({ status = "available", id, onClick }) => {
  const getSeatClass = () => {
    switch (status) {
      case "selected":
        return "bg-[#6a8e7f] text-white"; 
      case "taken":
        return "bg-gray-400 cursor-not-allowed text-white";
      case "available":
      default:
        return "bg-white text-[#2a4c44] hover:bg-gray-200 border border-gray-300";
    }
  };

  return (
    <button
      onClick={() => onClick(id)}
      disabled={status === "taken"}
      className={`w-8 h-8 rounded-md text-xs font-semibold flex items-center justify-center transition-all ${getSeatClass()}`}
    >
      {id}
    </button>
  );
};

const LegendItem = ({ colorClass, text }) => (
  <div className="flex items-center gap-2">
    <div className={`w-5 h-5 rounded ${colorClass}`}></div>
    <span className="text-sm text-[#2a4c44]">{text}</span>
  </div>
);

const rows = ["K", "J", "I", "H", "G", "F", "E", "D", "C", "B", "A"]; 
const leftSeatNumbers = [15, 14, 13, 12, 11, 10, 9];
const rightSeatNumbers = [8, 7, 6, 5, 4, 3, 2, 1]; 

const createSeats = () => {
  const seats = [];
  rows.forEach((row) => {
    leftSeatNumbers.forEach((num) => {
      const id = `${row}${num}`;
      let status = "available";
      seats.push({ id, row, num, status, block: "left" });
    });
    rightSeatNumbers.forEach((num) => {
      const id = `${row}${num}`;
      let status = "available";
      seats.push({ id, row, num, status, block: "right" });
    });
  });
  return seats;
};

export default function PaymentPage({
  movie,
  cinema,
  time,
  onNavigateHome,
  onNavigateLogin,
}) {
  const [allSeats, setAllSeats] = useState(createSeats());
  const [selectedSeats, setSelectedSeats] = useState([]);
  // ini jg bakal nyambung ke database
  const ticketPrice = 50000;

  // ini jg
  const displayMovie = movie || {
    title: "TRON ARES (2025)",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8tq8lygfqv4hEIDsAjS88Rdh-z99CusKQyg&s",
  };
  const displayCinema = cinema || "AEON MALL TANJUNG BARAT XXI";
  const displayTime = time || "12:30";

  const toggleSeat = (id) => {
    const isSelected = selectedSeats.includes(id);
    let newSelectedSeats = [];
    if (isSelected) {
      newSelectedSeats = selectedSeats.filter((seatId) => seatId !== id);
    } else {
      newSelectedSeats = [...selectedSeats, id];
    }
    setSelectedSeats(newSelectedSeats);
  };

  const getSeatStatus = (id) => {
    if (selectedSeats.includes(id)) return "selected";
    const seat = allSeats.find((s) => s.id === id);
    return seat ? seat.status : "available";
  };

  const totalPrice = selectedSeats.length * ticketPrice;
  const formattedTotalPrice = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(totalPrice);

  return (
    <div className="min-h-screen bg-[#6a8e7f] flex flex-col">
      <PaymentHeader
        onNavigateHome={onNavigateHome}
        onNavigateLogin={onNavigateLogin}
        movieTitle={displayMovie.title}
        cinemaName={displayCinema}
      />

      <div className="flex-grow flex flex-col md:flex-row p-6 gap-6">
        
        <div className="flex-grow bg-[#f5f1dc] p-6 rounded-lg shadow-md text-[#2a4c44]">
          <h2 className="text-xl font-bold mb-4">
            Pilih Kursi Anda
          </h2>

          <div className="w-full h-10 bg-gray-300 rounded-md shadow-inner mb-20 flex items-center justify-center">
            <span className="text-lg font-semibold text-gray-600 tracking-widest">
              AREA LAYAR
            </span>
          </div>

          <div className="space-y-3">
            {rows.map((row) => {
              const seatsInRow = allSeats.filter((seat) => seat.row === row);
              const leftSeats = seatsInRow
                .filter((seat) => seat.block === "left")
                .sort((a, b) => b.num - a.num);
              const rightSeats = seatsInRow
                .filter((seat) => seat.block === "right")
                .sort((a, b) => b.num - a.num);

              return (
                <div
                  key={row}
                  className={`flex justify-center gap-3 ${
                    row === "E" ? "mt-8" : "" 
                  }`}
                >
                  <div className="flex gap-3">
                    {leftSeats.map((seat) => (
                      <Seat
                        key={seat.id}
                        id={seat.id}
                        status={getSeatStatus(seat.id)}
                        onClick={toggleSeat}
                      />
                    ))}
                  </div>

                  <div className="w-10 flex-shrink-0" />

                  <div className="flex gap-3">
                    {rightSeats.map((seat) => (
                      <Seat
                        key={seat.id}
                        id={seat.id}
                        status={getSeatStatus(seat.id)}
                        onClick={toggleSeat}
                      />
                    ))}
</div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-center gap-6 mt-8 pt-4 border-t border-gray-400">
            <LegendItem colorClass="bg-white border border-gray-300" text="Tersedia" />
            <LegendItem colorClass="bg-[#6a8e7f]" text="Pilihan Anda" />
            <LegendItem colorClass="bg-gray-400" text="Tidak Tersedia" />
          </div>
        </div>

        <div className="w-full md:w-80 lg:w-96 bg-[#f5f1dc] p-6 rounded-lg shadow-md flex-shrink-0 text-[#2a4c44]">
          <h2 className="text-xl font-bold mb-4">
            Ringkasan Pesanan
          </h2>
          <div className="space-y-4">
            <img
              src={displayMovie.img}
              alt={displayMovie.title}
              className="w-full h-48 object-cover rounded-lg"
            />
            <div>
              <h3 className="text-lg font-bold">{displayMovie.title}</h3>
              <p className="text-sm text-gray-600">{displayCinema}</p>
              <p className="text-sm text-gray-600">
                {displayTime} | {new Date().toLocaleDateString("id-ID", {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long'
                })}
              </p>
            </div>
            <div className="border-t border-gray-400 pt-4">
              <h4 className="font-semibold">Tiket Anda:</h4>
              {selectedSeats.length > 0 ? (
                <p className="text-gray-600">
                  {selectedSeats.length} Tiket (Kursi: {selectedSeats.join(", ")})
                </p>
              ) : (
                <p className="text-gray-500 italic">Pilih kursi Anda...</p>
              )}
            </div>
            <div className="border-t border-gray-400 pt-4 flex justify-between items-center">
              <span className="text-lg font-semibold">
                Total Bayar
              </span>
              <span className="text-2xl font-bold">
                {formattedTotalPrice}
              </span>
            </div>
            <button
              disabled={selectedSeats.length === 0}
              className="w-full py-3 bg-[#6a8e7f] text-white font-bold rounded-lg shadow-md hover:bg-emerald-700 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Bayar Sekarang
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}