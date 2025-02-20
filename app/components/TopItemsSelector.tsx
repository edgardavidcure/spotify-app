"use client";

import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const options = [
  { value: "5", label: "Top 5" },
  { value: "10", label: "Top 10" },
  { value: "20", label: "Top 20" },
];

export default function TopItemsSelector() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentLimit = searchParams.get("limit") || "5";

  // Local state to update UI instantly
  const [selectedLimit, setSelectedLimit] = useState(currentLimit);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Sync local state with search params when URL changes
  useEffect(() => {
    setSelectedLimit(currentLimit);
  }, [currentLimit]);

  // Handle selection (update state immediately, update URL in background)
  const handleSelect = (value: string) => {
    setIsOpen(false);
    setSelectedLimit(value); // Instantly update UI
    router.push(`/?limit=${value}`, { scroll: false }); // Update URL
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-fit z-20" ref={dropdownRef}>
      {/* Filter Button */}
      <button
        className="flex items-center justify-center w-full bg-[#1DB954] text-white text-lg font-medium px-2 py-3 rounded-lg
                   border border-transparent focus:ring-2 focus:ring-white transition hover:bg-[#17a74c] cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <ChevronDownIcon
          className={`transition-transform size-4 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.ul
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full right-0 w-max mt-2 bg-gray-800 text-white rounded-lg shadow-lg overflow-hidden"
          >
            {options.map((option) => (
              <li
                key={option.value}
                onClick={() => handleSelect(option.value)}
                className={`px-5 py-3 hover:bg-gray-700 cursor-pointer transition ${
                  option.value === selectedLimit ? "bg-gray-700" : ""
                }`}
              >
                {option.label}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
