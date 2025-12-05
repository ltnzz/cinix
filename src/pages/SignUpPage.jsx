import React, { useState } from "react";
import axios from "axios";
import { User, Mail, Phone, Lock, Eye, EyeOff, CheckCircle } from "lucide-react";
import AuthHeader from "../components/AuthHeader";
import FormInput from "../components/FormInput";

const GoogleIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" /><path fill="#FF3D00" d="M6.306,14.691c2.661-5.223,7.85-8.64,13.694-8.64c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C30.046,0.053,25.268,0,20,0C8.955,0,0,8.955,0,20s8.955,20,20,20c3.059,0,5.842-1.154,7.961-3.039l5.657-5.657C30.046,33.947,25.268,36,20,36c-6.627,0-12-5.373-12-12c0-1.649,0.329-3.204,0.925-4.664L6.306,14.691z" /><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-6.19C29.211,35.637,26.714,36,24,36c-5.202,0-9.619-3.357-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" /><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" /></svg>
);
const FacebookIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><path fill="#039be5" d="M24 4C12.95 4 4 12.95 4 24s8.95 20 20 20s20-8.95 20-20S35.05 4 24 4z" /><path fill="#fff" d="M26.706 36V24h4.167l.62-4.857h-4.787v-3.102c0-1.408.39-2.368 2.41-2.368l2.576 0V9.07c-.446-.06-1.975-.19-3.754-.19c-3.714 0-6.25 2.266-6.25 6.425v3.55h-4.177V24h4.177v12h4.99z" /></svg>
);

export default function SignUpPage({ onNavigateLogin }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formData, setFormData] = useState({ name: "", email: "", phone: "", password: "", confirm_password: "" });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.id]: e.target.value });

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    if (formData.password !== formData.confirm_password) {
      setErrorMessage("Password dan Confirm Password tidak sama!");
      setLoading(false);
      return;
    }

    try {
      const endpoint = "https://cinix-be.vercel.app/register"; 
      await axios.post(endpoint, formData);
      setShowSuccessModal(true);

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
    <div className="flex flex-col min-h-screen relative">
      <AuthHeader />

      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full mx-4 shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <CheckCircle className="text-green-600 w-12 h-12" strokeWidth={3} />
              </div>
              <h3 className="text-2xl font-bold text-[#2a4c44] mb-2">Registration Successful!</h3>
              <p className="text-gray-600 mb-8">Selamat! Akun Anda berhasil dibuat. Silakan login untuk memesan tiket.</p>
              <button
                onClick={() => { setShowSuccessModal(false); onNavigateLogin(); }}
                className="w-full bg-[#2a4c44] text-white font-bold py-3 rounded-xl hover:bg-[#3a6a5e] transition-colors shadow-lg active:scale-95"
              >
                Login Sekarang
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="flex-grow w-full flex items-center justify-center p-4 bg-cover bg-center" style={{ backgroundImage: `url(https://i.imgur.com/Mvn8b2b.png)` }}>
        <div className="w-full max-w-md bg-gray-900/60 backdrop-blur-lg rounded-2xl shadow-2xl p-8 text-white">
          <h2 className="text-3xl font-bold text-center mb-8">Sign Up</h2>
          
          {errorMessage && (
            <div className="mb-4 p-4 bg-red-500/50 border border-red-500 rounded text-sm text-center animate-pulse text-left">
              <p className="font-bold">Validasi gagal</p>
              <p className="text-sm whitespace-pre-wrap leading-relaxed">{errorMessage}</p>
            </div>
          )}

          <form onSubmit={handleRegister}>
            <FormInput id="name" label="Full Name" placeholder="Your Name" icon={User} value={formData.name} onChange={handleChange} />
            <FormInput id="email" type="email" label="Email Address" placeholder="you@example.com" icon={Mail} value={formData.email} onChange={handleChange} />
            <FormInput id="phone" type="tel" label="Phone Number" placeholder="0812..." icon={Phone} value={formData.phone} onChange={handleChange} />
            
            <FormInput 
              id="password" 
              type={showPassword ? "text" : "password"} 
              label="Create Password" 
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

            <FormInput 
              id="confirm_password" 
              type={showConfirmPassword ? "text" : "password"} 
              label="Confirm Password" 
              placeholder="••••••••" 
              value={formData.confirm_password} 
              onChange={handleChange}
              rightElement={
                <div className="flex items-center gap-2 text-gray-400">
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="hover:text-white transition-colors">
                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                    <Lock size={20} />
                </div>
              }
            />
            
            <button
              type="submit"
              disabled={loading}
              className={`w-full font-bold py-3 rounded-lg transition-all mb-6 text-white shadow-lg ${
                loading ? "bg-gray-500 cursor-not-allowed" : "bg-[#2a4c44] hover:bg-[#3a6a5e] hover:scale-[1.02]"
              }`}
            >
              {loading ? "Processing..." : "Create Account"}
            </button>

            <div className="flex items-center my-6">
              <div className="flex-grow border-t border-gray-600"></div>
              <span className="mx-4 text-xs text-gray-400">Or Sign Up With</span>
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
              <span className="text-gray-400">Already have an account? </span>
              <button type="button" onClick={onNavigateLogin} className="font-semibold hover:underline text-blue-400 bg-transparent border-none p-0">
                Login
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}