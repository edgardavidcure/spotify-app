"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import { TopTabProps } from "../../types";
import TopArtistsCard from "./TopArtistsCard";
import TopItemsSelector from "./TopItemsSelector";
import TopSongsCard from "./TopSongsCard";

const tabs = [
  { id: "topSongs", label: "Top Songs" },
  { id: "topArtists", label: "Top Artists" },
];

export default function TopTab({ topArtists, topSongs }: TopTabProps) {
  const [activeTab, setActiveTab] = useState<string>("topSongs");

  const activeStyles = useMemo(() => "text-white shadow-lg", []);
  const inactiveStyles = useMemo(() => " text-gray-300 hover:bg-gray-600", []);

  return (
    <div className="flex flex-col justify-center items-center mt-4">
      {/* Tab Buttons */}
      <div className="flex items-center justify-around w-full">
        <div
          role="tablist"
          className="flex space-x-4 rounded-lg bg-gray-800 p-2 w-fit relative"
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              className={`relative px-4 py-2 z-10 rounded-lg transition-colors duration-300 focus:outline-none ${
                activeTab === tab.id ? activeStyles : inactiveStyles
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
          {/* Animated Active Tab Indicator */}
          <motion.div
            layoutId="activeTab"
            className="absolute bottom-0 left-0 right-0 h-full bg-green-500 rounded-lg"
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            style={{
              width: activeTab === "topSongs" ? "50%" : "50%",
              left: activeTab === "topSongs" ? "0%" : "50%",
              marginLeft: 0,
            }}
          />
        </div>
        <div className="h-full">
          <TopItemsSelector />
        </div>
      </div>

      {/* Tab Content with Smooth Transitions */}
      <div className="mt-8 relative w-full">
        <AnimatePresence mode="wait">
          {activeTab === "topArtists" && (
            <motion.div
              key="topArtists"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-6"
            >
              <TopArtistsCard topArtists={{ items: topArtists.items }} />
            </motion.div>
          )}

          {activeTab === "topSongs" && (
            <motion.div
              key="topSongs"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col  gap-6"
            >
              <TopSongsCard topSongs={{ items: topSongs.items }} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
