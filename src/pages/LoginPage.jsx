import React, { useState } from "react";
import axios from "axios";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import AuthHeader from "../components/AuthHeader";
import FormInput from "../components/FormInput";

const GoogleIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" /><path fill="#FF3D00" d="M6.306,14.691c2.661-5.223,7.85-8.64,13.694-8.64c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C30.046,0.053,25.268,0,20,0C8.955,0,0,8.955,0,20s8.955,20,20,20c3.059,0,5.842-1.154,7.961-3.039l5.657-5.657C30.046,33.947,25.268,36,20,36c-6.627,0-12-5.373-12-12c0-1.649,0.329-3.204,0.925-4.664L6.306,14.691z" /><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-6.19C29.211,35.637,26.714,36,24,36c-5.202,0-9.619-3.357-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" /><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" /></svg>
);
const FacebookIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><path fill="#039be5" d="M24 4C12.95 4 4 12.95 4 24s8.95 20 20 20s20-8.95 20-20S35.05 4 24 4z" /><path fill="#fff" d="M26.706 36V24h4.167l.62-4.857h-4.787v-3.102c0-1.408.39-2.368 2.41-2.368l2.576 0V9.07c-.446-.06-1.975-.19-3.754-.19c-3.714 0-6.25 2.266-6.25 6.425v3.55h-4.177V24h4.177v12h4.99z" /></svg>
);

export default function LoginPage({ onNavigateRegister, onNavigateForgotPassword }) {
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
      const response = await axios.post(endpoint, formData, {
        withCredentials: true,
        headers: {
        'Content-Type': 'application/json'
        }
      });

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        
        let userData = response.data.user;
        if (!userData) {
            const fakeName = formData.email.split('@')[0];
            userData = { name: fakeName, email: formData.email };
        }
        localStorage.setItem("user", JSON.stringify(userData));
        
        setUserName(userData.name);
        setLoginSuccess(true);

        setTimeout(() => {
            window.location.href = "/"; 
        }, 2000);
      } else {
          setErrorMessage("Token tidak valid.");
          setLoading(false);
      }
    } catch (error) {
      let specificMessage = null;
      const responseData = error.response?.data;

      if (responseData && responseData.errors && Array.isArray(responseData.errors)) {
        specificMessage = responseData.errors
            .map(err => {
                const fieldName = err.field.charAt(0).toUpperCase() + err.field.slice(1);
                return `• ${fieldName}: ${err.messages}`;
            })
            .join('\n');
      } else if (responseData) {
        specificMessage = responseData.message || responseData.error;
      }
      if (specificMessage) {
        setErrorMessage(specificMessage); 
      } else {
        setErrorMessage("Validasi gagal. Terjadi kesalahan server atau format respons tidak terduga.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
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
                  <span className="animate-pulse font-bold">MENGALIHKAN KE BERANDA...</span>
              </div>
            </div>
          )}

          <h2 className="text-3xl font-bold text-center mb-8">Login</h2>

          {errorMessage && (
            <div className="mb-4 p-4 bg-red-500/50 border border-red-500 rounded text-sm text-center animate-pulse text-left">
              <p className="font-bold">Validasi gagal</p>
              <p className="text-sm whitespace-pre-wrap leading-relaxed">{errorMessage}</p>
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
              {loading ? "Memproses..." : "Login"}
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