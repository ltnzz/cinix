import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

const API_BASE_URL = "https://cinix-be.vercel.app"; 

export default function ResetPasswordPage() {
const { token } = useParams();
const navigate = useNavigate();

const [password, setPassword] = useState('');
const [confirmPassword, setConfirmPassword] = useState('');
const [showPassword, setShowPassword] = useState(false);

const [isLoading, setIsLoading] = useState(false);
const [status, setStatus] = useState({ type: '', message: '' }); // type: 'success' | 'error'

const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
        setStatus({ type: 'error', message: 'Password konfirmasi tidak cocok.' });
        return;
    }

    setIsLoading(true);
    setStatus({ type: '', message: '' });

    try {
        const response = await axios.post(`${API_BASE_URL}/reset-password`, {
            token,
            password
        });

        setStatus({ type: 'success', message: 'Password berhasil diubah! Mengalihkan ke login...' });
        
        setTimeout(() => {
            navigate('/login');
        }, 3000);
    } catch (err) {
        console.error(err);
        const msg = err.response?.data?.message || 'Gagal mereset password. Link mungkin sudah kadaluarsa atau tidak valid.';
        setStatus({ type: 'error', message: msg });
    } finally {
        setIsLoading(false);
    }
};

return (
    <div className="min-h-screen bg-[#6a8e7f] flex items-center justify-center p-4 font-sans">
        <div className="bg-[#f5f1dc] w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
            
            <div className="bg-[#2a4c44] p-8 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-amber-400 to-amber-600"></div>
            <h1 className="text-2xl font-black text-[#fff9e6] tracking-wide mb-1">RESET PASSWORD</h1>
            <p className="text-[#fff9e6]/80 text-sm">Buat kata sandi baru untuk akunmu</p>
            </div>

            <div className="p-8">
            {status.message && (
                <div className={`mb-6 p-4 rounded-xl flex items-start gap-3 text-sm font-bold animate-in slide-in-from-top-2 ${
                status.type === 'success' 
                    ? 'bg-green-100 text-green-800 border border-green-200' 
                    : 'bg-red-100 text-red-800 border border-red-200'
                }`}>
                {status.type === 'success' ? <CheckCircle size={20} className="shrink-0"/> : <AlertCircle size={20} className="shrink-0"/>}
                <p>{status.message}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                
                <div className="space-y-1">
                <label className="text-xs font-bold text-[#2a4c44] uppercase tracking-wider ml-1">Password Baru</label>
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#2a4c44] transition-colors">
                    <Lock size={18} />
                    </div>
                    <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-12 py-3.5 bg-white border-2 border-transparent focus:border-[#2a4c44]/20 rounded-xl text-[#2a4c44] placeholder-gray-400 outline-none transition-all shadow-sm focus:shadow-md font-bold"
                    placeholder="••••••••"
                    required
                    />
                    <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-[#2a4c44] transition-colors"
                    >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>
                </div>

                <div className="space-y-1">
                <label className="text-xs font-bold text-[#2a4c44] uppercase tracking-wider ml-1">Konfirmasi Password</label>
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#2a4c44] transition-colors">
                    <Lock size={18} />
                    </div>
                    <input
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`w-full pl-11 pr-4 py-3.5 bg-white border-2 rounded-xl text-[#2a4c44] placeholder-gray-400 outline-none transition-all shadow-sm focus:shadow-md font-bold ${
                        confirmPassword && password !== confirmPassword 
                        ? 'border-red-300 focus:border-red-400 text-red-600' 
                        : 'border-transparent focus:border-[#2a4c44]/20'
                    }`}
                    placeholder="••••••••"
                    required
                    />
                </div>
                {confirmPassword && password !== confirmPassword && (
                    <p className="text-[10px] text-red-500 font-bold ml-1 mt-1 animate-pulse">Password tidak cocok</p>
                )}
                </div>

                <button
                type="submit"
                disabled={isLoading || !password || !confirmPassword || password !== confirmPassword}
                className="w-full bg-[#2a4c44] text-[#fff9e6] py-4 rounded-xl font-black text-lg hover:bg-[#1e3630] hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-y-0 flex items-center justify-center gap-2 mt-4"
                >
                {isLoading ? <Loader2 className="animate-spin" /> : "UBAH PASSWORD"}
                </button>

            </form>
            </div>
            
            <div className="bg-[#2a4c44]/5 p-4 text-center">
                <button onClick={() => navigate('/login')} className="text-xs font-bold text-[#2a4c44]/70 hover:text-[#2a4c44] hover:underline">
                    Kembali ke Login
                </button>
            </div>
        </div>
        </div>
    );
}