import React, { useState, useEffect } from "react";
import { Film, Plus, Edit, Trash2, LogOut, Loader2 } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import AdminLogin from "../components/admin/AdminLogin";
import MovieFormModal from "../components/admin/MovieFormModal";

const API_BASE_URL = "https://cinix-be.vercel.app"; 

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0); 

  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    if (localStorage.getItem("admin_auth") === "true") setIsAdmin(true);
  }, []);

  useEffect(() => {
    if (!isAdmin) return;
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_BASE_URL}/movies`);
        setMovies(res.data.data || res.data); 
      } catch (err) { console.error("Gagal load movies"); } 
      finally { setLoading(false); }
    };
    fetchMovies();
  }, [isAdmin, refreshKey]);

  const handleLogout = () => {
    if (!window.confirm("Apakah Anda yakin ingin logout?")) return;
    
    axios.post(`${API_BASE_URL}/admin/logout`, {}, { withCredentials: true }).catch(()=>{});
    
    localStorage.removeItem("admin_auth");
    setIsAdmin(false);
    navigate('/admin/login');
  };

  const handleDelete = async (id) => {
    if (!confirm("Yakin hapus film ini?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/admin/deletemovie/${id}`, {
        withCredentials: true 
      });
      alert("Terhapus!");
      setRefreshKey(prev => prev + 1);
    } catch { alert("Gagal hapus."); }
  };

  const handleAdd = () => {
    setEditData(null); 
    setShowModal(true);
  };

  const handleEdit = (movie) => {
    setEditData(movie); 
    setShowModal(true);
  };

  if (!isAdmin) return <AdminLogin onLoginSuccess={() => setIsAdmin(true)} />;

  return (
    <div className="min-h-screen bg-[#f5f1dc] flex font-sans">
      <aside className="w-64 bg-[#2a4c44] text-white flex flex-col sticky h-full z-10 min-h-screen">
        <div className="p-6 border-b border-white/10">
          <h1 className="text-2xl font-black tracking-wider">CINIX <span className="text-amber-400 text-xs">ADMIN</span></h1>
        </div>
        <nav className="flex-1 p-4"><button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white/10 text-amber-400 font-bold"><Film size={20} /> Manajemen Film</button></nav>
        <div className="p-4 border-t border-white/10"><button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/20 text-red-300 hover:text-red-100 transition-all"><LogOut size={20} /> Logout</button></div>
      </aside>

      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <div><h2 className="text-3xl font-bold text-[#2a4c44]">Daftar Film</h2><p className="text-gray-500">Kelola database film Cinix di sini.</p></div>
          <button onClick={handleAdd} className="flex items-center gap-2 bg-[#2a4c44] text-white px-6 py-3 rounded-full font-bold hover:bg-[#1e3630] shadow-lg hover:shadow-xl transition-all active:scale-95"><Plus size={20} /> Tambah Film</button>
        </div>

        {loading ? <div className="text-center py-10"><Loader2 className="animate-spin mx-auto text-[#2a4c44]" /> Loading...</div> : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {movies.map((movie, idx) => (
                <div key={idx} className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all group">
                    <div className="relative h-64 overflow-hidden">
                        <img src={movie.poster_url || movie.poster} alt={movie.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" onError={(e) => e.target.src = "https://via.placeholder.com/300x450?text=No+Image"}/>
                        <div className="absolute top-2 right-2 bg-black/70 text-amber-400 px-2 py-1 rounded-lg text-xs font-bold">⭐ {movie.rating}</div>
                    </div>
                    <div className="p-5">
                        <h3 className="font-bold text-lg text-[#2a4c44] line-clamp-1 mb-1">{movie.title}</h3>
                        <p className="text-xs text-gray-500 mb-4">{movie.genre} • {movie.duration} min</p>
                        <div className="flex gap-2">
                            <button onClick={() => handleEdit(movie)} className="flex-1 flex items-center justify-center gap-1 bg-blue-50 text-blue-600 py-2 rounded-lg text-sm font-bold hover:bg-blue-100 transition"><Edit size={16} /> Edit</button>
                            <button onClick={() => handleDelete(movie.id_movie || movie.id)} className="flex-1 flex items-center justify-center gap-1 bg-red-50 text-red-600 py-2 rounded-lg text-sm font-bold hover:bg-red-100 transition"><Trash2 size={16} /> Hapus</button>
                        </div>
                    </div>
                </div>
            ))}
            </div>
        )}
      </main>

      <MovieFormModal show={showModal} onClose={() => setShowModal(false)} editData={editData} onSuccess={() => setRefreshKey(prev => prev + 1)}/>
    </div>
  );
}