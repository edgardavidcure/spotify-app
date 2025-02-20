"use client";

import { formatNumber } from "@/utils/userHelpers";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";

// Common interface for both artists and songs
interface Item {
  id: string;
  name: string;
  images: { url: string }[];
  followers?: { total: number }; // only for artists
  artists?: { name: string }[]; // only for songs
  album?: { images: { url: string }[] }; // only for songs
}

interface TopItemsCardProps {
  title: string;
  items: Item[];
  type: "artists" | "songs"; // Type to differentiate between artists and songs
}

export default function TopItemsCard({
  title,
  items,
  type,
}: TopItemsCardProps) {
  return (
    <motion.div
      layout
      className="w-[22rem] bg-[#121212] rounded-2xl shadow-lg border border-gray-700 p-6 text-white"
    >
      {/* Title */}
      <h2 className="text-xl font-bold text-center mb-4">{title}</h2>

      {/* Item List */}
      {items.length > 0 ? (
        <ul className="space-y-4">
          <AnimatePresence>
            {items.map((item, index) => (
              <motion.li
                key={item.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="flex gap-4 items-center p-2 rounded-lg hover:bg-[#1DB954]/30 transition"
              >
                {`${index + 1}.`}
                {/* Conditionally render image and details */}
                {type === "artists" && item.images[0] && (
                  <Image
                    src={item.images[0]?.url || "/placeholder.jpg"}
                    alt={item.name}
                    className="w-12 h-12 rounded-full"
                    width={48}
                    height={48}
                  />
                )}
                {type === "songs" && item.album?.images[0] && (
                  <Image
                    src={item.album.images[0]?.url}
                    alt={item.name}
                    className="w-12 h-12 rounded-md"
                    width={48}
                    height={48}
                  />
                )}

                {/* Item Details */}
                <div className="flex flex-col">
                  <span className="text-sm font-medium truncate">
                    {item.name}
                  </span>
                  {type === "artists" && item.followers && (
                    <span className="text-sm truncate font-medium text-gray-400">
                      Followers: {formatNumber(item.followers.total)}
                    </span>
                  )}
                  {type === "songs" &&
                    item.artists &&
                    item.artists[0]?.name && (
                      <span className="text-sm truncate font-medium text-gray-400">
                        {item.artists[0]?.name}
                      </span>
                    )}
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      ) : (
        <p className="text-gray-400 text-center">
          No {type === "artists" ? "top artists" : "top songs"} found.
        </p>
      )}
    </motion.div>
  );
}
