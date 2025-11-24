import { useState } from "react";
import {
  Home,
  User,
  MapPin,
  Search,
  Ticket,
  Heart,
  Eye,
  EyeOff,
  Lock,
  Mail,
} from "lucide-react";

function SignUpHeader({ onNavigateHome }) {
  return (
    <header className="flex items-center justify-between px-8 py-4 bg-[#f5f1dc] shadow">
      <div className="flex items-center gap-4">
        <div className="text-3xl font-bold text-[#2a4c44]">CINIX</div>
        <div className="flex items-center gap-1 ml-4 bg-[#e6ddba] px-3 py-1 rounded-full text-sm text-[#2a4c44]">
          <MapPin size={16} />
          <span>Jabodetabek</span>
        </div>
      </div>
      <div className="flex gap-6 text-[#2a4c44] font-semibold">
        <button
          onClick={onNavigateHome}
          className="flex items-center gap-2 hover:opacity-70"
        >
          <Home />
          <span>Home</span>
        </button>
        <button className="flex items-center gap-2 hover:opacity-70">
          <Ticket />
          <span>Tickets</span>
        </button>
        <button className="flex items-center gap-2 hover:opacity-70">
          <Heart />
          <span>Wishlist</span>
        </button>
      </div>
    </header>
  );
}

const GoogleIcon = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 48 48"
    width="48px"
    height="48px"
  >
    <path
      fill="#FFC107"
      d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
    />
    <path
      fill="#FF3D00"
      d="M6.306,14.691c2.661-5.223,7.85-8.64,13.694-8.64c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C30.046,0.053,25.268,0,20,0C8.955,0,0,8.955,0,20s8.955,20,20,20c3.059,0,5.842-1.154,7.961-3.039l5.657-5.657C30.046,33.947,25.268,36,20,36c-6.627,0-12-5.373-12-12c0-1.649,0.329-3.204,0.925-4.664L6.306,14.691z"
    />
    <path
      fill="#4CAF50"
      d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-6.19C29.211,35.637,26.714,36,24,36c-5.202,0-9.619-3.357-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
    />
    <path
      fill="#1976D2"
      d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
    />
  </svg>
);

const FacebookIcon = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 48 48"
    width="48px"
    height="48px"
  >
    <path fill="#039be5" d="M24 4C12.95 4 4 12.95 4 24s8.95 20 20 20s20-8.95 20-20S35.05 4 24 4z" />
    <path
      fill="#fff"
      d="M26.706 36V24h4.167l.62-4.857h-4.787v-3.102c0-1.408.39-2.368 2.41-2.368l2.576 0V9.07c-.446-.06-1.975-.19-3.754-.19c-3.714 0-6.25 2.266-6.25 6.425v3.55h-4.177V24h4.177v12h4.99z"
    />
  </svg>
);


// ada beberapa revisi terkait inputan di halaman signup ini
export default function SignUpPage({ onNavigateHome, onNavigateLogin }) {
  const [showPassword, setShowPassword] = useState(false);
  const backgroundImageUrl = "https://i.imgur.com/Mvn8b2b.png";

  return (
    <div className="flex flex-col min-h-screen">
      <SignUpHeader onNavigateHome={onNavigateHome} />

      <main
        className="flex-grow w-full flex items-center justify-center p-4"
        style={{
          backgroundImage: `url(${backgroundImageUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="w-full max-w-md bg-gray-900/60 backdrop-blur-lg rounded-2xl shadow-2xl p-8 text-white">
          <h2 className="text-3xl font-bold text-center mb-8">Sign Up</h2>

          <form onSubmit={(e) => e.preventDefault()}>
            <div className="relative mb-6">
              <label
                htmlFor="email"
                className="absolute -top-2.5 left-3 px-1 text-xs text-gray-300 bg-[#5A746B]"
              >
                Enter Email
              </label>
              <input
                id="email"
                type="email"
                className="w-full px-4 py-3 bg-transparent border-2 border-gray-500 rounded-lg focus:outline-none focus:border-blue-400"
                placeholder="you@example.com"
              />
              <Mail
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
            </div>
            <div className="relative mb-6">
              <label
                htmlFor="password"
                className="absolute -top-2.5 left-3 px-1 text-xs text-gray-300 bg-[#5A746B]"
              >
                Enter new password
              </label>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                className="w-full px-4 py-3 bg-transparent border-2 border-gray-500 rounded-lg focus:outline-none focus:border-blue-400"
                placeholder="••••••••"
              />
              <Lock
                className="absolute right-12 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <button
              type="submit"
              className="w-full bg-[#2a4c44] hover:bg-[#3a6a5e] text-white font-bold py-3 rounded-lg transition-colors mb-6"
            >
              Create Account
            </button>

            <div className="flex items-center my-6">
              <div className="flex-grow border-t border-gray-600"></div>
              <span className="mx-4 text-xs text-gray-400">
                Or Sign Up With
              </span>
              <div className="flex-grow border-t border-gray-600"></div>
            </div>

            <div className="flex justify-center gap-4 mb-6">
              <button
                type="button"
                className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:opacity-80 transition-opacity"
                aria-label="Sign up with Google"
              >
                <GoogleIcon className="w-6 h-6" />
              </button>
              <button
                type="button"
                className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:opacity-80 transition-opacity"
                aria-label="Sign up with Facebook"
              >
                <FacebookIcon className="w-6 h-6" />
              </button>
            </div>

            <div className="text-center text-xs">
              <span className="text-gray-400">Already have an account? </span>
              <button
                onClick={onNavigateLogin}
                className="font-semibold hover:underline text-blue-400 bg-transparent border-none p-0"
              >
                Login
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}