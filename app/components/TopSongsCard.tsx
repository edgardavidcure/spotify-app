"use client";

import { AnimatePresence, motion } from "framer-motion";

interface Song {
  id: string;
  name: string;
  album: {
    images: { url: string }[];
  };
  artists: { name: string }[];
}

interface TopSongsCardProps {
  topSongs: {
    items: Song[];
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function TopSongsCard({ topSongs }: TopSongsCardProps) {
  return (
    <motion.div
      layout // Enables smooth height transition
      className="w-[22rem] bg-[#121212] rounded-2xl shadow-lg border border-gray-700 p-6 text-white"
    >
      {/* Title */}
      <h2 className="text-xl font-bold text-center mb-4">🎵 Top Songs</h2>

      {/* Song List */}
      <ul className="space-y-4">
        <AnimatePresence>
          {topSongs.items.map((song: Song, index: number) => (
            <motion.li
              key={song.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#1DB954]/30 transition"
            >
              {`${index + 1}.`}
              {/* Album Cover */}
              <img
                src={song.album.images[0].url}
                alt={song.name}
                className="w-12 h-12 rounded-md"
              />

              {/* Song Details */}
              <div className="flex flex-col truncate">
                <span className="font-semibold truncate">{song.name}</span>
                <span className="text-sm text-gray-400">
                  {song.artists[0].name}
                </span>
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </motion.div>
  );
}
