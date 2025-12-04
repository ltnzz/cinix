import React, { useState, useEffect } from "react";
import { X, Save, Loader2, Image as ImageIcon, PlayCircle, Eye } from "lucide-react";
import axios from "axios";

const API_BASE_URL = "https://cinix-be.vercel.app";

const InputField = ({ label, type = "text", value, onChange, required = true, placeholder }) => (
  <div>
    <label className="text-xs font-bold text-gray-500 uppercase">{label}</label>
    <input
      required={required}
      type={type}
      placeholder={placeholder}
      className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-[#2a4c44] outline-none transition-all"
      value={value}
      onChange={onChange}
    />
  </div>
);

export default function MovieFormModal({ show, onClose, editData, onSuccess }) {
  const [loading, setLoading] = useState(false);
  
  const [previewPoster, setPreviewPoster] = useState(null);

  const initialForm = {
    title: "", description: "", genre: "", language: "",
    age_rating: "", duration: "", rating: "", trailer_url: "",
    release_date: "", poster: null
  };
  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    if (editData) {
      setFormData({
        title: editData.title || "",
        description: editData.description || "",
        genre: editData.genre || "",
        language: editData.language || "",
        age_rating: editData.age_rating || "",
        duration: editData.duration || "",
        rating: editData.rating || "",
        trailer_url: editData.trailer_url || "",
        release_date: editData.release_date ? editData.release_date.split('T')[0] : "",
        poster: null 
      });
      setPreviewPoster(editData.poster_url || editData.poster || null); 
    } else {
      setFormData(initialForm);
      setPreviewPoster(null);
    }
  }, [editData, show]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, poster: file });
      setPreviewPoster(URL.createObjectURL(file));
    }
  };

  if (!show) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("admin_token");

      if (!token) {
        alert("Token Admin hilang. Mohon login ulang.");
        window.location.reload();
        return;
      }

      const data = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null && formData[key] !== "") {
          data.append(key, formData[key]);
        }
      });
      const config = {
        withCredentials: true
      };

      if (editData) {
        await axios.put(`${API_BASE_URL}/admin/updatemovie/${editData.id_movie || editData.id}`, data, config);
        alert("Berhasil! Film telah diperbarui.");
      } else {
        await axios.post(`${API_BASE_URL}/admin/addmovie`, data, config);
        alert("Berhasil! Film baru telah ditambahkan.");
      }

      onSuccess();
      onClose();

    } catch (error) {
      console.error("Submit Error:", error);

      let errorMsg = "Gagal menyimpan data.";
      if (error.response) {
        if (error.response.status === 401) {
          alert("Sesi Admin berakhir. Silakan Login Ulang.");
          localStorage.removeItem("admin_token");
          window.location.reload();
          return;
        }
        errorMsg = error.response.data?.message || error.response.statusText;
      } else {
        errorMsg = error.message;
      }

      alert(`GAGAL: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in zoom-in-95 duration-200">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
        <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white z-10">
          <h3 className="text-2xl font-black text-[#2a4c44]">{editData ? "Edit Data Film" : "Tambah Film Baru"}</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition"><X size={24} className="text-gray-500" /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <InputField 
                label="Judul Film" 
                value={formData.title} 
                onChange={e => setFormData({ ...formData, title: e.target.value })} 
              />
              <InputField 
                label="Genre" 
                value={formData.genre} 
                onChange={e => setFormData({ ...formData, genre: e.target.value })} 
              />
              <div className="grid grid-cols-2 gap-4">
                <InputField 
                    label="Durasi (Menit)" 
                    type="number" 
                    value={formData.duration} 
                    onChange={e => setFormData({ ...formData, duration: e.target.value })} 
                />
                <InputField 
                    label="Rating (0-10)" 
                    type="number" 
                    value={formData.rating} 
                    onChange={e => setFormData({ ...formData, rating: e.target.value })} 
                />
              </div>
              <InputField 
                label="Tanggal Rilis" 
                type="date" 
                value={formData.release_date} 
                onChange={e => setFormData({ ...formData, release_date: e.target.value })} 
              />
              
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Deskripsi / Sinopsis (Opsional)</label>
                <textarea 
                  rows="4" 
                  className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-[#2a4c44] outline-none mt-1"
                  value={formData.description} 
                  onChange={e => setFormData({ ...formData, description: e.target.value })}>
                </textarea>
              </div>
            </div>

            <div className="space-y-4">
              <InputField 
                label="Bahasa" 
                value={formData.language} 
                onChange={e => setFormData({ ...formData, language: e.target.value })} 
              />
              <InputField 
                label="Age Rating" 
                value={formData.age_rating} 
                onChange={e => setFormData({ ...formData, age_rating: e.target.value })} 
              />
              
              <div>
                <InputField 
                    label="Trailer URL" 
                    value={formData.trailer_url} 
                    placeholder="https://youtube.com/..."
                    onChange={e => setFormData({ ...formData, trailer_url: e.target.value })} 
                    required={false}
                  />
                  {formData.trailer_url && (
                    <a href={formData.trailer_url} target="_blank" rel="noopener noreferrer" className="mt-2 text-xs flex items-center gap-1 text-blue-600 hover:underline">
                        <PlayCircle size={14} /> Tes Link Trailer
                    </a>
                  )}
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Upload Poster</label>
                
                {previewPoster && (
                    <div className="mb-3 relative w-full h-48 bg-gray-100 rounded-xl overflow-hidden group">
                        <img src={previewPoster} alt="Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 hidden group-hover:flex items-center justify-center text-white text-sm">
                            Ganti Gambar di bawah
                        </div>
                    </div>
                )}

                <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:bg-gray-50 transition cursor-pointer relative">
                  <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={handleImageChange}
                    required={!editData} 
                  />
                  <ImageIcon className="mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500 truncate px-2">
                    {formData.poster ? formData.poster.name : "Klik untuk upload gambar"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4 border-t">
            <button type="button" onClick={onClose} className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition">Batal</button>
            <button type="submit" disabled={loading} className="px-8 py-3 bg-[#2a4c44] text-white rounded-xl font-bold hover:bg-[#1e3630] shadow-lg transition flex items-center gap-2">
              {loading ? <Loader2 className="animate-spin" /> : <><Save size={20} /> Simpan Data</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}