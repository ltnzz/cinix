import React, { useState } from "react";
import axios from "axios";
import { Mail, Lock, Eye, EyeOff, Loader2, Film } from "lucide-react";
import { useNavigate } from "react-router-dom"; 

// --- 1. KOMPONEN INTERNAL ---

const AuthHeader = () => (
  <header className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-10">
    <div className="flex items-center gap-2 text-white font-bold text-xl tracking-wider">
      <div className="w-8 h-8 bg-[#2a4c44] rounded-lg flex items-center justify-center shadow-lg border border-white/20">
        <Film size={18} className="text-white" />
      </div>
      <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
        CINIX
      </span>
    </div>
  </header>
);

const FormInput = ({ id, label, type, placeholder, value, onChange, icon: Icon, rightElement }) => (
  <div className="mb-4">
    <label htmlFor={id} className="block text-xs font-semibold text-gray-400 mb-1.5 ml-1">
      {label}
    </label>
    <div className="relative group">
      {Icon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-amber-400 transition-colors">
          <Icon size={18} />
        </div>
      )}
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`w-full bg-gray-800/50 border border-gray-600 text-white text-sm rounded-xl py-3 ${Icon ? "pl-10" : "pl-4"} ${rightElement ? "pr-12" : "pr-4"} focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all placeholder-gray-500`}
      />
      {rightElement && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          {rightElement}
        </div>
      )}
    </div>
  </div>
);

// --- 2. ICONS ---
const GoogleIcon = (props) => (<svg {...props} viewBox="0 0 48 48"><path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.2 8 3l5.7-5.7C34 6 29.3 4 24 4 13 4 4 13 4 24s9 20 20 20c11 0 20-9 20-20 0-1.3-.1-2.7-.4-3.9z"/><path fill="#FF3D00" d="M6.3 14.7C9 9.5 14.1 6 20 6c3 0 5.8 1.2 8 3l5.7-5.7C30 0 25.3 0 20 0 9 0 0 9 0 20c0 1.6.3 3.2.9 4.7l5.4-10z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-6.2C29.2 35.6 26.7 36 24 36c-5.2 0-9.6-3.4-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-1.7 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.2 8 3l5.7-5.7C34 6 29.3 4 24 4 13 4 4 13 4 24s9 20 20 20c11 0 20-9 20-20 0-1.3-.1-2.7-.4-3.9z"/></svg>);
const FacebookIcon = (props) => (<svg {...props} viewBox="0 0 48 48"><path fill="#039be5" d="M24 4C13 4 4 13 4 24s9 20 20 20 20-9 20-20S35 4 24 4z"/><path fill="#fff" d="M26.7 36V24h4.2l.6-4.9h-4.8v-3.1c0-1.4.4-2.4 2.4-2.4l2.6 0V9.1c-.5-.1-2-.2-3.8-.2-3.7 0-6.3 2.3-6.3 6.4v3.6h-4.2V24h4.2v12h5z"/></svg>);

// --- 3. HALAMAN LOGIN (FINAL FIX) ---
export default function LoginPage({ onNavigateRegister, onNavigateForgotPassword }) {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const backgroundImageUrl = "https://i.imgur.com/Mvn8b2b.png";

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [userName, setUserName] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      const endpoint = "https://cinix-be.vercel.app/login"; 
      
      // --- PERBAIKAN DI SINI ---
      // Mengubah format JSON menjadi x-www-form-urlencoded
      // Agar sesuai dengan format yang diminta backend (seperti endpoint payment sebelumnya)
      const formBody = new URLSearchParams();
      formBody.append('email', formData.email);
      formBody.append('password', formData.password);

      const response = await axios.post(endpoint, formBody, {
        headers: { 
          'Content-Type': 'application/x-www-form-urlencoded' // Header disesuaikan
        },
        withCredentials: true 
      });

      if (response.status === 200) {
        // Ambil objek user dari backend
        const backendUser = response.data.user || {};
        
        // Logika penentuan nama user
        const displayName = backendUser.name || backendUser.username || formData.email.split('@')[0];

        // Simpan User Profile di LocalStorage
        const userToSave = {
            id: backendUser.id || response.data.user_id,
            email: backendUser.email || formData.email,
            name: displayName,
            role: backendUser.role || 'user'
        };
        
        localStorage.setItem("user", JSON.stringify(userToSave));
        
        setUserName(displayName);
        setLoginSuccess(true);

        setTimeout(() => {
             navigate('/'); 
        }, 1500);

      } else {
          setErrorMessage("Login gagal. Coba lagi.");
          setLoading(false);
      }

    } catch (error) {
      console.error("Login Error:", error);
      if (error.response) {
        setErrorMessage(error.response.data.message || "Email atau password salah.");
      } else if (error.request) {
        setErrorMessage("Akses Login Gagal (CORS Error). Pastikan Backend sudah di-deploy dengan settingan yang benar.");
      } else {
        setErrorMessage("Terjadi kesalahan aplikasi.");
      }
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen font-sans">
      <AuthHeader />

      <main
        className="flex-grow w-full flex items-center justify-center p-4"
        style={{
          backgroundImage: `url(${backgroundImageUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="w-full max-w-md bg-gray-900/60 backdrop-blur-lg rounded-2xl shadow-2xl p-8 text-white relative overflow-hidden">
          
          {loginSuccess && (
            <div className="absolute inset-0 z-50 bg-[#2a4c44] flex flex-col items-center justify-center animate-in fade-in duration-300">
              <div className="animate-bounce mb-4 text-6xl">✅</div>
              <h2 className="text-2xl font-bold text-white mb-2">Login Berhasil!</h2>
              <p className="text-gray-300 text-sm">Selamat datang,</p>
              <p className="text-amber-300 font-semibold text-lg mt-1">{userName}</p>
              <div className="mt-8 flex items-center gap-2 text-xs text-gray-400">
                 <Loader2 className="animate-spin" size={16} />
                 <span className="font-bold">MENGALIHKAN KE BERANDA...</span>
              </div>
            </div>
          )}

          <h2 className="text-3xl font-bold text-center mb-8">Login</h2>

          {errorMessage && (
            <div className="mb-6 p-3 bg-red-500/50 border border-red-500 rounded-lg text-sm text-center animate-pulse">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <FormInput 
                id="email" 
                type="email" 
                label="Email" 
                placeholder="you@example.com" 
                value={formData.email} 
                onChange={handleChange} 
                icon={Mail}
            />

            <FormInput 
                id="password" 
                type={showPassword ? "text" : "password"} 
                label="Password" 
                placeholder="••••••••" 
                value={formData.password} 
                onChange={handleChange}
                rightElement={
                    <div className="flex items-center gap-2 text-gray-400">
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="hover:text-white transition-colors">
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                        <Lock size={20} />
                    </div>
                }
            />

            <div className="flex justify-between items-center text-xs mb-6 text-gray-300">
              <div className="flex items-center gap-2">
                <input type="checkbox" id="remember" className="w-4 h-4 rounded text-amber-500 bg-gray-700 border-gray-600 focus:ring-amber-500"/>
                <label htmlFor="remember" className="cursor-pointer select-none">Remember me</label>
              </div>
              
              <button 
                type="button" 
                onClick={onNavigateForgotPassword} 
                className="hover:underline text-amber-400 hover:text-amber-300 transition-colors"
              >
                Forgot Password?
              </button>
            </div>

            <button type="submit" disabled={loading || loginSuccess} className={`w-full font-bold py-3 rounded-xl transition-all shadow-lg ${loading ? "bg-[#1e3630] cursor-not-allowed text-gray-400" : "bg-[#2a4c44] hover:bg-[#3a6a5e] text-white hover:scale-[1.02]"}`}>
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="animate-spin" size={18} /> Memproses...
                </span>
              ) : "Login"}
            </button>

            <div className="flex items-center my-6">
              <div className="flex-grow border-t border-gray-600"></div>
              <span className="mx-4 text-xs text-gray-400">Or Sign In With</span>
              <div className="flex-grow border-t border-gray-600"></div>
            </div>

            <div className="flex justify-center gap-4 mb-6">
              <button type="button" className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:opacity-80 transition-all hover:scale-110">
                <GoogleIcon className="w-6 h-6" />
              </button>
              <button type="button" className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:opacity-80 transition-all hover:scale-110">
                <FacebookIcon className="w-6 h-6" />
              </button>
            </div>

            <div className="text-center text-xs">
              <span className="text-gray-400">Don't have an account? </span>
              <button type="button" onClick={onNavigateRegister} className="font-semibold hover:underline text-blue-400 bg-transparent border-none p-0">Register</button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}