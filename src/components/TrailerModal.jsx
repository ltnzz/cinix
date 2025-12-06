import React from 'react';
import { X } from "lucide-react";

const TrailerModal = ({ show, onClose, trailerUrl }) => {
    if (!show) return null;

    const getYoutubeId = (url) => {
        if (!url) return null;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const videoId = getYoutubeId(trailerUrl);

    return (
        <div 
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200" 
        onClick={onClose}
        >
        <div 
            className="relative w-full max-w-4xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/20 animate-in zoom-in-95 duration-300" 
            onClick={e => e.stopPropagation()}
        >
            <button 
            onClick={onClose} 
            className="absolute top-4 right-4 z-20 p-2 bg-black/60 hover:bg-red-600 text-white rounded-full transition-all backdrop-blur-md group border border-white/10"
            >
            <X size={20} className="group-hover:scale-110 transition-transform"/>
            </button>

            {videoId ? (
            <iframe 
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
                title="Movie Trailer"
                allow="autoplay; encrypted-media; picture-in-picture" 
                allowFullScreen
            ></iframe>
            ) : (
            <div className="flex items-center justify-center h-full text-white/50 flex-col gap-2">
                <span className="text-4xl">☹️</span>
                <p>Video tidak dapat dimuat</p>
            </div>
            )}
        </div>
        </div>
    );
};

export default TrailerModal;