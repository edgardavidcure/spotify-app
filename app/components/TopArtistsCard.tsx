"use client";

import { formatNumber } from "@/utils/userHelpers";
import { AnimatePresence, motion } from "framer-motion";

interface Artist {
  id: string;
  name: string;
  images: { url: string }[];
  followers: { total: number };
}

interface TopArtistsCardProps {
  topArtists: {
    items: Artist[];
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function TopArtistsCard({ topArtists }: TopArtistsCardProps) {
  return (
    <motion.div
      layout
      className="w-[22rem] bg-[#121212] rounded-2xl shadow-lg border border-gray-700 p-6 text-white"
    >
      {/* Title */}
      <h2 className="text-xl font-bold text-center mb-4">🎤 Top Artists</h2>

      {/* Artist List */}
      {topArtists && topArtists.items.length > 0 ? (
        <ul className="space-y-4">
          <AnimatePresence>
            {topArtists.items.map((artist: Artist, index: number) => (
              <motion.li
                key={artist.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="flex gap-4 items-center p-2 rounded-lg hover:bg-[#1DB954]/30 transition"
              >
                {`${index + 1}.`}
                {/* Artist Image */}
                <img
                  src={artist.images[0]?.url || "/placeholder.jpg"}
                  alt={artist.name}
                  className="w-12 h-12 rounded-full"
                />
                <div className="flex flex-col">
                  {/* Artist Name */}
                  <span className="text-sm font-medium truncate">
                    {artist.name}
                  </span>
                  <span className="text-sm truncate font-medium text-gray-400">
                    Followers: {formatNumber(artist.followers.total)}
                  </span>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      ) : (
        <p className="text-gray-400 text-center">No top artists found.</p>
      )}
    </motion.div>
  );
}
