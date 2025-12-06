import React, { useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Lock, Eye, EyeOff, Loader2, CheckCircle, ArrowLeft } from "lucide-react";

// --- KONFIGURASI URL ---
const API_BASE_URL = "http://localhost:2000"; 

// --- INTERNAL COMPONENTS (Styling Konsisten) ---

const AuthHeader = () => (
  <header className="absolute top-0 left-0 w-full p-6 z-10 flex justify-between items-center">
    <div className="text-3xl font-black text-white tracking-tighter cursor-pointer">
      CINIX<span className="text-amber-500">.</span>
    </div>
  </header>
);

// Komponen Input Password Khusus (Ada Toggle Eye)
const PasswordInput = ({ id, label, placeholder, value, onChange, showPassword, toggleShow }) => (
  <div className="mb-5">
    <label htmlFor={id} className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2 ml-1">
      {label}
    </label>
    <div className="relative group">
      {/* Icon Kiri (Lock) */}
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-amber-400 transition-colors">
        <Lock size={18} />
      </div>
      
      {/* Input Field */}
      <input
        id={id}
        type={showPassword ? "text" : "password"}
        className="w-full pl-11 pr-12 py-3.5 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all shadow-sm backdrop-blur-sm"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required
      />

      {/* Tombol Toggle Mata (Kanan) */}
      <button
        type="button"
        onClick={toggleShow}
        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-amber-400 transition-colors focus:outline-none"
      >
        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  </div>
);

// --- MAIN PAGE ---
export default function ResetPasswordPage() {
    const { token } = useParams();
    const navigate = useNavigate();
    const backgroundImageUrl = "https://i.imgur.com/Mvn8b2b.png";

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({ type: "", message: "" });

    const handleReset = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
        setStatus({ type: "error", message: "Konfirmasi password tidak cocok." });
        return;
    }

    setLoading(true);
    setStatus({ type: "", message: "" });

    try {
        const response = await axios.post(`${API_BASE_URL}/reset-password/${token}`, {
            password  
        });

        setStatus({ type: "success", message: "Password berhasil diubah! Mengalihkan..." });
        
        setTimeout(() => {
            navigate("/login");
        }, 3000);

    } catch (err) {
        console.error(err);
        const msg = err.response?.data?.message || "Gagal mereset password. Token mungkin kadaluarsa.";
        setStatus({ type: "error", message: msg });
    } finally {
        setLoading(false);
    }
};

return (
    <div className="flex flex-col min-h-screen relative bg-gray-900">
        <AuthHeader />

        <main
            className="flex-grow w-full flex items-center justify-center p-4"
            style={{
            backgroundImage: `url(${backgroundImageUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            }}
        >
        
        <div className="absolute inset-0 bg-black/50"></div>

        <div className="w-full max-w-md bg-gray-900/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 text-white relative border border-white/10">

        <div className="text-center mb-8">
            <h2 className="text-3xl font-black mb-2 tracking-tight text-white">Reset Password</h2>
            <p className="text-gray-400 text-sm leading-relaxed">
                Silakan masukkan kata sandi baru untuk akun Anda.
            </p>
        </div>

        {status.message && (
            <div className={`mb-6 p-4 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2 border ${
            status.type === 'success' 
                ? 'bg-green-500/20 border-green-500/50 text-green-100' 
                : 'bg-red-500/20 border-red-500/50 text-red-100'
            }`}>
            <CheckCircle className={`shrink-0 mt-0.5 ${status.type === 'success' ? 'text-green-400' : 'text-red-400'}`} size={18} />
            <p className="text-sm font-medium">{status.message}</p>
            </div>
        )}

        <form onSubmit={handleReset}>
            <PasswordInput 
                id="new-password"
                label="Password Baru"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                showPassword={showPassword}
                toggleShow={() => setShowPassword(!showPassword)}
            />

            <PasswordInput 
                id="confirm-password"
                label="Konfirmasi Password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                showPassword={showPassword}
                toggleShow={() => setShowPassword(!showPassword)}
            />

            <button
                type="submit"
                disabled={loading || !password || !confirmPassword}
                className={`w-full font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-amber-500/20 mt-4 ${
                loading 
                    ? "bg-gray-700 cursor-not-allowed text-gray-400" 
                    : "bg-amber-500 hover:bg-amber-400 text-black transform hover:-translate-y-0.5 active:translate-y-0"
            }`}
            >
                {loading ? (
                    <div className="flex items-center justify-center gap-2">
                        <Loader2 className="animate-spin" size={20}/>
                        <span>Memproses...</span>
                    </div>
            ) : "Simpan Password Baru"}
            </button>
        </form>

        <div className="mt-8 text-center border-t border-gray-700/50 pt-6">
            <button
            onClick={() => navigate('/login')}
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm font-bold group"
            >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform"/>
            Batal & Kembali Login
            </button>
        </div>
        </div>
    </main>
    </div>
);
}