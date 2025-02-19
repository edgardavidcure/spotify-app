import { MusicalNoteIcon } from "@heroicons/react/24/solid"; // Modern music icon from Lucide
import { signIn } from "next-auth/react";
export default function LoggedOutCard() {
  return (
    <div className="flex flex-col items-center justify-center bg-[#121212] p-6 rounded-2xl shadow-xl border border-gray-700 w-[24rem] text-white">
      {/* Animated Music Icon */}
      <div className="bg-green-500 p-5 rounded-full animate-pulse shadow-md">
        <MusicalNoteIcon className="w-12 h-12 text-white-500" />
      </div>

      {/* Header Message */}
      <h2 className="text-xl font-semibold mt-4">Your Music Awaits 🎵</h2>
      <p className="text-gray-400 text-center px-6">
        Connect your Spotify account to see your top artists, tracks, and more!
      </p>

      {/* Sign In Button */}
      <button
        onClick={() => signIn()}
        className="w-full mt-4 bg-green-500 hover:bg-green-600 text-white font-medium py-2 rounded-lg transition-all transform hover:scale-105 active:scale-95 shadow-md"
      >
        Get Started
      </button>
    </div>
  );
}
