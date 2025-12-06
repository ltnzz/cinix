import React, { useState } from "react";
import axios from "axios";
import { Mail, ArrowLeft, Loader2, CheckCircle } from "lucide-react";
import AuthHeader from "../components/AuthHeader";
import FormInput from "../components/FormInput";

const API_BASE_URL = "https://cinix-be.vercel.app"

export default function ForgotPasswordPage({ onNavigateLogin }) {
  const backgroundImageUrl = "https://i.imgur.com/Mvn8b2b.png";
  
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null); 
  const [error, setError] = useState(null);     

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const response = await axios.post(`${API_BASE_URL}/forgot-password`, {
        email: email
      });

      setMessage(response.data.message || "Link reset password telah dikirim ke email Anda.");
      setEmail("");  

    } catch (err) {
      const errMsg = err.response?.data?.message || "Terjadi kesalahan server."
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen relative">
      <AuthHeader />

      <main
        className="flex-grow w-full flex items-center justify-center p-4"
        style={{
          backgroundImage: `url(${backgroundImageUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="w-full max-w-md bg-gray-900/60 backdrop-blur-lg rounded-2xl shadow-2xl p-8 text-white relative">
          
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">Forgot Password?</h2>
            <p className="text-gray-300 text-sm">
              Jangan khawatir. Masukkan email Anda di bawah ini dan kami akan mengirimkan instruksi reset password.
            </p>
          </div>

          {message && (
            <div className="mb-6 p-4 bg-green-500/20 border border-green-500 rounded-lg flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
              <CheckCircle className="text-green-400 shrink-0" size={20} />
              <p className="text-sm text-green-100">{message}</p>
            </div>
          )}

          {error && (
            <div className="mb-6 p-3 bg-red-500/50 border border-red-500 rounded-lg text-sm text-center animate-pulse">
              {error}
            </div>
          )}

          <form onSubmit={handleResetPassword}>
            <FormInput 
                id="email" 
                type="email" 
                label="Email Address" 
                placeholder="ex: nama@email.com" 
                icon={Mail} 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
            />

            <button
              type="submit"
              disabled={loading}
              className={`w-full font-bold py-3 rounded-xl transition-all shadow-lg hover:shadow-xl ${
                loading 
                  ? "bg-[#1e3630] cursor-not-allowed text-gray-400" 
                  : "bg-[#2a4c44] hover:bg-[#3a6a5e] text-white hover:scale-[1.02]"
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                    <Loader2 className="animate-spin" size={20}/>
                    <span>Sending...</span>
                </div>
              ) : "Send Reset Link"}
            </button>
          </form>

          <div className="mt-8 text-center">
            <button
              onClick={onNavigateLogin}
              className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm font-medium group"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform"/>
              Back to Login
            </button>
          </div>

        </div>
      </main>
    </div>
  );
}