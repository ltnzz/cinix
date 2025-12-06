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
    const footer = document.querySelector('footer');
    if (footer) {
        footer.style.display = 'none';
    }
    
    return () => {
        if (footer) {
            footer.style.display = '';
        }
    };
  }, []);

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
      } catch (err) { 
        console.error("Gagal load movies"); 
      } finally { 
        setLoading(false); 
      }
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
    <div className="min-h-screen bg-[#f5f1dc] font-sans">
      
      <aside className="fixed top-0 left-0 h-screen w-64 bg-[#2a4c44] text-white flex flex-col z-30 shadow-2xl">
        <div className="p-6 border-b border-white/10">
          <h1 className="text-2xl font-black tracking-wider">CINIX <span className="text-amber-400 text-xs">ADMIN</span></h1>
        </div>
        
        <nav className="flex-1 p-4 overflow-y-auto">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white/10 text-amber-400 font-bold mb-2">
            <Film size={20} /> Manajemen Film
          </button>
        </nav>

        <div className="p-4 border-t border-white/10 bg-[#234039]">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/20 text-red-300 hover:text-red-100 transition-all font-bold">
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>

      <main className="ml-64 p-8 min-h-screen">
        <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-2xl shadow-sm border border-[#2a4c44]/10">
          <div>
            <h2 className="text-3xl font-bold text-[#2a4c44]">Daftar Film</h2>
            <p className="text-gray-500 mt-1">Kelola database film Cinix di sini.</p>
          </div>
          <button onClick={handleAdd} className="flex items-center gap-2 bg-[#2a4c44] text-white px-6 py-3 rounded-full font-bold hover:bg-[#1e3630] shadow-lg hover:shadow-xl transition-all active:scale-95 transform hover:-translate-y-0.5">
            <Plus size={20} /> Tambah Film
          </button>
        </div>

        {loading ? (
          <div className="text-center py-20 flex flex-col items-center justify-center h-64">
            <Loader2 className="animate-spin text-[#2a4c44] mb-4" size={40} /> 
            <p className="text-gray-500 font-medium">Sedang memuat data film...</p>
          </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-10">
            {movies.map((movie, idx) => (
                <div key={idx} className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 group border border-transparent hover:border-[#2a4c44]/20 flex flex-col">
                    <div className="relative h-64 overflow-hidden bg-gray-200">
                        <img 
                          src={movie.poster_url || movie.poster} 
                          alt={movie.title} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                          onError={(e) => e.target.src = "https://via.placeholder.com/300x450?text=No+Image"}
                        />
                        <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-amber-400 px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 shadow-lg">
                          ⭐ {movie.rating}
                        </div>
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <button onClick={() => handleEdit(movie)} className="bg-white/90 p-3 rounded-full text-blue-600 hover:scale-110 transition"><Edit size={20} /></button>
                          <button onClick={() => handleDelete(movie.id_movie || movie.id)} className="bg-white/90 p-3 rounded-full text-red-600 hover:scale-110 transition"><Trash2 size={20} /></button>
                        </div>
                    </div>
                    <div className="p-5 flex-1 flex flex-col">
                        <h3 className="font-bold text-lg text-[#2a4c44] line-clamp-1 mb-1" title={movie.title}>{movie.title}</h3>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                          <span className="bg-gray-100 px-2 py-0.5 rounded">{movie.genre || "N/A"}</span>
                          <span>•</span>
                          <span>{movie.duration} min</span>
                        </div>
                        
                        <div className="mt-auto flex gap-2 pt-4 border-t border-gray-100">
                            <button onClick={() => handleEdit(movie)} className="flex-1 flex items-center justify-center gap-1.5 bg-blue-50 text-blue-600 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-100 transition border border-blue-100">
                              <Edit size={16} /> Edit
                            </button>
                            <button onClick={() => handleDelete(movie.id_movie || movie.id)} className="flex-1 flex items-center justify-center gap-1.5 bg-red-50 text-red-600 py-2.5 rounded-xl text-sm font-bold hover:bg-red-100 transition border border-red-100">
                              <Trash2 size={16} /> Hapus
                            </button>
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