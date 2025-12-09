import React, { useState, useEffect } from "react";
import { Film, Plus, Edit, Trash2, LogOut, Loader2, Search } from "lucide-react";
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
  const [searchTerm, setSearchTerm] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    const footer = document.querySelector('footer');
    if (footer) footer.style.display = 'none';
    return () => { if (footer) footer.style.display = ''; };
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
        setMovies(res.data.data || res.data || []); 
      } catch (err) { 
        console.error("Gagal load movies", err); 
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
    if (!confirm("Yakin hapus film ini? Tindakan ini tidak bisa dibatalkan.")) return;
    try {
      await axios.delete(`${API_BASE_URL}/admin/deletemovie/${id}`, {
        withCredentials: true 
      });
      alert("Film berhasil dihapus!");
      setRefreshKey(prev => prev + 1);
    } catch (error) { 
      console.error(error);
      alert("Gagal menghapus film."); 
    }
  };

  const handleAdd = () => {
    setEditData(null); 
    setShowModal(true);
  };

  const handleEdit = (movie) => {
    setEditData(movie); 
    setShowModal(true);
  };

  const filteredMovies = movies.filter(m => 
    m.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isAdmin) return <AdminLogin onLoginSuccess={() => setIsAdmin(true)} />;

  return (
    <div className="min-h-screen bg-[#f5f1dc] font-sans flex">
      
      <aside className="fixed top-0 left-0 h-screen w-64 bg-[#2a4c44] text-white flex flex-col z-30 shadow-2xl">
        <div className="p-8 border-b border-white/10">
          <h1 className="text-3xl font-black tracking-wider flex flex-col leading-none">
            CINIX <span className="text-amber-400 text-xs tracking-[0.3em] font-medium mt-1">DASHBOARD</span>
          </h1>
        </div>
        
        <nav className="flex-1 p-4 overflow-y-auto mt-4">
          <button className="w-full flex items-center gap-3 px-6 py-4 rounded-2xl bg-white/10 text-amber-400 font-bold mb-2 transition-all shadow-inner">
            <Film size={20} /> Manajemen Film
          </button>
        </nav>

        <div className="p-6 border-t border-white/10 bg-[#234039]">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/20 text-red-300 hover:text-red-100 transition-all font-bold group">
            <LogOut size={20} className="group-hover:-translate-x-1 transition-transform"/> Logout
          </button>
        </div>
      </aside>

      <main className="ml-64 flex-1 p-8 lg:p-12 min-h-screen">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h2 className="text-4xl font-bold text-[#2a4c44]">Daftar Film</h2>
            <p className="text-gray-500 mt-2 font-medium">Kelola database film yang tayang di Cinix.</p>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative group w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#2a4c44]" size={18}/>
                <input 
                    type="text" 
                    placeholder="Cari judul film..." 
                    className="w-full pl-10 pr-4 py-3 rounded-full border border-gray-200 focus:border-[#2a4c44] outline-none transition-all shadow-sm focus:shadow-md bg-white"
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <button 
                onClick={handleAdd} 
                className="flex items-center gap-2 bg-[#2a4c44] text-white px-6 py-3 rounded-full font-bold hover:bg-[#1e3630] shadow-lg hover:shadow-[#2a4c44]/40 transition-all active:scale-95 transform hover:-translate-y-0.5 whitespace-nowrap"
            >
              <Plus size={20} /> <span className="hidden md:inline">Tambah Film</span>
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-32 flex flex-col items-center justify-center">
            <Loader2 className="animate-spin text-[#2a4c44] mb-4" size={48} /> 
            <p className="text-gray-500 font-medium text-lg">Mengambil data film...</p>
          </div>
        ) : filteredMovies.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
            <Film size={48} className="text-gray-300 mx-auto mb-4"/>
            <p className="text-gray-400 font-medium">Tidak ada film ditemukan.</p>
          </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 pb-10">
            {filteredMovies.map((movie, idx) => (
                <div key={idx} className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-[#2a4c44]/10 transition-all duration-300 group border border-gray-100 flex flex-col h-full">
                    
                    <div className="relative aspect-[2/3] overflow-hidden bg-gray-100">
                        <img 
                          src={movie.poster_url || movie.poster} 
                          alt={movie.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                          onError={(e) => e.target.src = "https://via.placeholder.com/300x450?text=No+Image"}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                        
                        <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-md border border-white/30 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                          ⭐ {movie.rating}
                        </div>
                        
                        <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/40 backdrop-blur-[2px]">
                          <button onClick={() => handleEdit(movie)} className="bg-white text-[#2a4c44] p-3.5 rounded-full hover:scale-110 hover:bg-amber-400 transition-all shadow-xl" title="Edit">
                              <Edit size={22} />
                          </button>
                          <button onClick={() => handleDelete(movie.id_movie || movie.id)} className="bg-white text-red-500 p-3.5 rounded-full hover:scale-110 hover:bg-red-500 hover:text-white transition-all shadow-xl" title="Hapus">
                              <Trash2 size={22} />
                          </button>
                        </div>
                    </div>

                    <div className="p-5 flex-1 flex flex-col">
                        <h3 className="font-bold text-xl text-[#2a4c44] line-clamp-1 mb-1" title={movie.title}>{movie.title}</h3>
                        
                        <div className="flex items-center flex-wrap gap-2 text-xs text-gray-500 mb-4 mt-1">
                          <span className="bg-[#f5f1dc] text-[#2a4c44] px-2.5 py-1 rounded-md font-semibold">{movie.genre || "Umum"}</span>
                          <span>•</span>
                          <span>{movie.duration} min</span>
                        </div>

                        <div className="mt-auto pt-4 border-t border-gray-100 lg:hidden flex gap-2">
                          <button onClick={() => handleEdit(movie)} className="flex-1 py-2 text-sm font-bold text-blue-600 bg-blue-50 rounded-lg">Edit</button>
                          <button onClick={() => handleDelete(movie.id_movie || movie.id)} className="flex-1 py-2 text-sm font-bold text-red-600 bg-red-50 rounded-lg">Hapus</button>
                        </div>
                    </div>
                </div>
            ))}
            </div>
        )}
      </main>

      <MovieFormModal 
        show={showModal} 
        onClose={() => setShowModal(false)} 
        editData={editData} 
        onSuccess={() => setRefreshKey(prev => prev + 1)}
      />
      
    </div>
  );
}