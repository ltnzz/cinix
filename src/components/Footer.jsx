import React from 'react';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-[#0f172a] text-gray-300 border-t border-white/10 pt-16 pb-8 font-sans">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            
            <div>
                <h2 className="text-3xl font-black text-[#fff9e6] tracking-tighter mb-4">
                CINIX<span className="text-amber-500">.</span>
                </h2>
                <p className="text-sm leading-relaxed text-gray-400 mb-6">
                Platform pemesanan tiket bioskop termudah dan tercepat. 
                Nikmati pengalaman menonton film terbaik bersama kami.
                </p>
                <div className="flex items-center gap-4">
                <SocialIcon icon={<Instagram size={20} />} />
                <SocialIcon icon={<Twitter size={20} />} />
                <SocialIcon icon={<Facebook size={20} />} />
                <SocialIcon icon={<Youtube size={20} />} />
                </div>
            </div>

            <div>
                <h3 className="text-white font-bold text-lg mb-6">Menu Cepat</h3>
                <ul className="space-y-3 text-sm">
                <FooterLink>Sedang Tayang</FooterLink>
                <FooterLink>Akan Datang</FooterLink>
                <FooterLink>Bioskop Terdekat</FooterLink>
                <FooterLink>Promo & Diskon</FooterLink>
                <FooterLink>Cek Tiket</FooterLink>
                </ul>
            </div>

            <div>
                <h3 className="text-white font-bold text-lg mb-6">Bantuan</h3>
                <ul className="space-y-3 text-sm">
                <FooterLink>FAQ</FooterLink>
                <FooterLink>Syarat & Ketentuan</FooterLink>
                <FooterLink>Kebijakan Privasi</FooterLink>
                <FooterLink>Hubungi Kami</FooterLink>
                <FooterLink>Karir</FooterLink>
                </ul>
            </div>

            <div>
                <h3 className="text-white font-bold text-lg mb-6">Kontak</h3>
                <ul className="space-y-4 text-sm">
                <li className="flex items-start gap-3">
                    <MapPin size={18} className="text-amber-500 mt-0.5 shrink-0" />
                    <span>Jl. R.S Fatmawati No. 1, Cilandak, Jakarta Selatan 12450</span>
                </li>
                <li className="flex items-center gap-3">
                    <Phone size={18} className="text-amber-500 shrink-0" />
                    <span>(021) 555-0123</span>
                </li>
                <li className="flex items-center gap-3">
                    <Mail size={18} className="text-amber-500 shrink-0" />
                    <span>support@cinix.com</span>
                </li>
                </ul>
            </div>

            </div>

            <div className="border-t border-white/10 pt-8 text-center text-xs text-gray-500">
            <p>&copy; {new Date().getFullYear()} Cinix Cinema. All rights reserved.</p>
            </div>
        </div>
        </footer>
    );
};

const SocialIcon = ({ icon }) => (
    <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-amber-500 hover:text-black transition-all duration-300">
        {icon}
    </a>
);

const FooterLink = ({ children }) => (
    <li>
        <a href="#" className="hover:text-amber-500 transition-colors duration-200 block">
        {children}
        </a>
    </li>
);

export default Footer;