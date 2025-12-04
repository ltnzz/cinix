import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { isAdminAuthenticated, setAdminAuth } from "../../utils/auth";
import img from "../../assets/img/image.png"

const API_BASE_URL = "https://cinix-be.vercel.app"; 

export default function AdminLogin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ 
    email: "admin@cinix.com", 
    password: "admin123" 
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if(isAdminAuthenticated()) {
      navigate('/admin');
    }
  }, [navigate])

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const params = new URLSearchParams();
      params.append('email', formData.email.trim());
      params.append('password', formData.password.trim());

      const response = await axios.post(`${API_BASE_URL}/admin/login`, params, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        withCredentials: true 
      });
      
      const token = response.data.token || response.data.data?.token;
      
      setAdminAuth(token);

      navigate('/admin');

    } catch (error) {
      console.error("Login Gagal:", error);
      const msg = error.response?.data?.message || "Cek email/password atau koneksi backend.";
      alert(`Gagal Login: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${img})`}}>
      <div className="bg-[#f5f1dc] p-8 rounded-3xl shadow-2xl w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-[#2a4c44]">CINIX ADMIN</h1>
          <p className="text-gray-600">Ini adalah wilayah kekuasaan Atmin</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-[#2a4c44] mb-2">Email Admin</label>
            <input type="email" required className="w-full px-4 py-3 rounded-xl border-2 border-[#2a4c44]/20 focus:border-[#2a4c44] bg-white outline-none" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-bold text-[#2a4c44] mb-2">Password</label>
            <input type="password" required className="w-full px-4 py-3 rounded-xl border-2 border-[#2a4c44]/20 focus:border-[#2a4c44] bg-white outline-none" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} />
          </div>
          <button type="submit" disabled={loading} className="w-full py-3 bg-[#2a4c44] text-white font-bold rounded-xl hover:bg-[#1e3630] transition-all flex justify-center">
            {loading ? <Loader2 className="animate-spin" /> : "Masuk Dashboard"}
          </button>
        </form>
      </div>
    </div>
  );
}