"use client";
import { signOut } from "next-auth/react";
import Image from "next/image";
import { ReactSVG } from "react-svg";
import LoggedOutCard from "./LoggedOutCard";

// Dynamically import ReactSVG correctly, using default import

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ProfileCard({ session, profile }: any) {
  const userName = profile.username;
  const userImage = profile?.profilePicture;
  console.log(userImage);
  const userEmail = profile.email;

  if (session.id === profile.spotifyId) {
    return (
      <div className="w-[24rem] bg-[#121212] rounded-2xl shadow-xl border border-gray-700 p-6 flex flex-col items-center gap-6 text-white">
        {session ? (
          <>
            {/* Conditional Image Rendering */}
            {typeof userImage === "string" && userImage.startsWith("<svg") ? (
              // If SVG is stored as a string, render it using ReactSVG
              <div className="w-28 h-28 rounded-full border-4 border-green-400 shadow-md">
                <ReactSVG
                  src={`data:image/svg+xml;utf8,${encodeURIComponent(
                    userImage
                  )}`}
                />
              </div>
            ) : (
              // Default to Image component for regular image URLs
              <Image
                className="rounded-full border-4 border-green-400 shadow-md"
                src={userImage}
                width={120}
                height={120}
                alt="User"
              />
            )}

            {/* User Details */}
            <div className="text-center">
              <h2 className="text-xl font-semibold">Welcome,</h2>
              <p className="text-lg font-medium">{userName}</p>
              <p className="text-sm text-gray-400">{userEmail}</p>
            </div>

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

  // Check if userImage exists and is a string before trying to call startsWith
}
