"use client";

import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { useRouter, useSearchParams } from "next/navigation";
export default function TopItemsSelector() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const numItems = searchParams.get("limit") || "5";

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLimit = e.target.value;
    router.push(`/?limit=${newLimit}`, { scroll: false });
  };

  return (
    <div className="relative mt-6 w-full max-w-xs">
      <div className="relative">
        <select
          value={numItems}
          onChange={handleChange}
          className="appearance-none w-full bg-[#1DB954] text-white text-lg font-medium px-5 py-3 rounded-lg 
                     border border-transparent focus:border-white focus:ring-2 focus:ring-white transition 
                     hover:bg-[#17a74c] cursor-pointer outline-none"
        >
          <option value="5">Top 5</option>
          <option value="10">Top 10</option>
          <option value="20">Top 20</option>
        </select>
        <ChevronDownIcon className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white pointer-events-none size-4" />
      </div>
    </div>
  );
}
