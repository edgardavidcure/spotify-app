"use client";
import { signOut } from "next-auth/react";
import Image from "next/image";
import { generateColor, getInitials } from "../utils/userHelpers"; // Import utilities
import LoggedOutCard from "./LoggedOutCard";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ProfileCard({ session, spotifyProfile }: any) {
  const userName = session?.user?.name || "Guest";
  const userImage = spotifyProfile?.images?.[0];
  const initials = getInitials(userName);
  const bgColor = generateColor(userName);

  return (
    <div className="w-[24rem] bg-[#121212] rounded-2xl shadow-xl border border-gray-700 p-6 flex flex-col items-center gap-6 text-white">
      {session ? (
        <>
          {/* Conditional Image Rendering */}
          {userImage ? (
            <Image
              className="rounded-full border-4 border-green-400 shadow-md"
              src={userImage}
              width={120}
              height={120}
              alt="User image"
            />
          ) : (
            // If no image, display initials inside a colored circle
            <div
              className={`w-28 h-28 ${bgColor} flex items-center justify-center rounded-full text-3xl font-bold border-4 border-green-400 shadow-md`}
            >
              {initials}
            </div>
          )}

          {/* User Details */}
          <div className="text-center">
            <h2 className="text-xl font-semibold">Welcome,</h2>
            <p className="text-lg font-medium">{userName}</p>
            <p className="text-sm text-gray-400">{session?.user?.email}</p>
          </div>

          {/* Spotify Profile Section */}
          {/* {spotifyProfile && (
            <div className="bg-gray-800 p-4 rounded-lg shadow-md w-full text-center">
              <h3 className="text-green-400 font-semibold mb-2">Spotify Profile</h3>
              <p className="text-sm text-gray-300">
                <span className="font-semibold">Name:</span> {userName}
              </p>
              <p className="text-sm text-gray-300">
                <span className="font-semibold">Email:</span> {session.user.email}
              </p>
            </div>
          )} */}

          {/* Sign Out Button */}
          <button
            onClick={() => signOut()}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2 rounded-lg transition-all transform hover:scale-105 active:scale-95"
          >
            Sign Out
          </button>
        </>
      ) : (
        <>
          {/* Placeholder Image for Logged Out State */}
          <LoggedOutCard />
        </>
      )}
    </div>
  );
}
