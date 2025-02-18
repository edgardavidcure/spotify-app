'use client'
import { signIn, signOut } from "next-auth/react";
import Image from "next/image";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ProfileCard({ session, spotifyProfile }: any) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-r from-[#1DB954] to-[#191414]">
        {session ? (
          <div className="w-[22rem] bg-[#121212] rounded-2xl shadow-lg border border-gray-700 p-6 flex flex-col items-center gap-6 text-white">
            <Image
              className="rounded-full border-4 border-green-400 shadow-md"
              src={
                session?.user?.image ||
                "https://spotiy-playlist-retriever-experimental.vercel.app/_next/static/media/user_img.6db01878.svg"
              }
              width={120}
              height={120}
              alt="User image"
            />
            <div className="text-center">
              <h2 className="text-xl font-semibold">Signed in as</h2>
              <p className="text-lg font-medium">{session?.user?.name}</p>
              <p className="text-sm text-gray-400">{session?.user?.email}</p>
            </div>
            {spotifyProfile && (
              <div className="bg-gray-800 p-4 rounded-lg shadow-sm w-full text-center">
                <h3 className="text-green-400 font-semibold mb-2">Spotify Profile</h3>
                <p>Name: {session.user.name}</p>
                <p>Email: {session.user.email}</p>
              </div>
            )}
            <button
              onClick={() => signOut()}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2 rounded-lg transition-transform active:scale-95"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <div className="w-[22rem] bg-[#121212] rounded-2xl shadow-lg border border-gray-700 p-6 flex flex-col items-center gap-6 text-white">
            <Image
              src="https://spotiy-playlist-retriever-experimental.vercel.app/_next/static/media/sad_emoji.41405e6f.svg"
              width={120}
              height={120}
              alt="Sad emoji"
            />
            <button
              onClick={() => signIn()}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 rounded-lg transition-transform active:scale-95"
            >
              Sign In
            </button>
          </div>
        )}
      </div>
    );
  }