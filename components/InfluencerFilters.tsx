"use client";

import { Platform } from "@prisma/client";
import { useState } from "react";

interface FiltersProps {
  onApply: (filters: {
    search?: string;
    platform?: Platform;
    country?: string;
    minFollowers?: number;
    maxFollowers?: number;
    sortBy?: string;
    order?: string;
  }) => void;
}

export default function InfluencerFilters({ onApply }: FiltersProps) {
  const [search, setSearch] = useState("");
  const [platform, setPlatform] = useState<Platform | "">("");
  const [country, setCountry] = useState("");
  const [minFollowers, setMinFollowers] = useState<number | "">("");
  const [maxFollowers, setMaxFollowers] = useState<number | "">("");
  const [sortBy, setSortBy] = useState("followers");
  const [order, setOrder] = useState<"asc" | "desc">("desc");

  const handleApply = () => {
    onApply({
      search: search || undefined,
      platform: platform || undefined,
      country: country || undefined,
      minFollowers: minFollowers === "" ? undefined : Number(minFollowers),
      maxFollowers: maxFollowers === "" ? undefined : Number(maxFollowers),
      sortBy,
      order,
    });
  };

  const handleReset = () => {
    setSearch("");
    setPlatform("");
    setCountry("");
    setMinFollowers("");
    setMaxFollowers("");
    setSortBy("followers");
    setOrder("desc");
    onApply({});
  };

  return (
    <div className="bg-gray-800 p-4 rounded-2xl mb-6 shadow-lg flex flex-col md:flex-row flex-wrap gap-4 items-end justify-start">
      <input
        type="text"
        placeholder="Search by name, username, email"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="flex-1 min-w-[200px] px-4 py-2 rounded-xl bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow duration-200 shadow-sm"
      />

      <select
        value={platform}
        onChange={(e) => setPlatform(e.target.value as Platform)}
        className="px-4 py-2 rounded-xl bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow duration-200 shadow-sm"
      >
        <option value="">All Platforms</option>
        <option value="INSTAGRAM">Instagram</option>
        <option value="TIKTOK">TikTok</option>
        <option value="YOUTUBE">YouTube</option>
        <option value="X">X</option>
      </select>

      <input
        type="text"
        placeholder="Country"
        value={country}
        onChange={(e) => setCountry(e.target.value)}
        className="px-4 py-2 rounded-xl bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow duration-200 shadow-sm"
      />

      <input
        type="number"
        placeholder="Min Followers"
        value={minFollowers}
        onChange={(e) => setMinFollowers(Number(e.target.value))}
        className="w-32 px-4 py-2 rounded-xl bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow duration-200 shadow-sm"
      />

      <input
        type="number"
        placeholder="Max Followers"
        value={maxFollowers}
        onChange={(e) => setMaxFollowers(Number(e.target.value))}
        className="w-32 px-4 py-2 rounded-xl bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow duration-200 shadow-sm"
      />

      <select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
        className="px-4 py-2 rounded-xl bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow duration-200 shadow-sm"
      >
        <option value="followers">Followers</option>
        <option value="engagement_rate">Engagement Rate</option>
        <option value="created_at">Created At</option>
      </select>

      <select
        value={order}
        onChange={(e) => setOrder(e.target.value as "asc" | "desc")}
        className="px-4 py-2 rounded-xl bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow duration-200 shadow-sm"
      >
        <option value="desc">Descending</option>
        <option value="asc">Ascending</option>
      </select>

      <div className="flex gap-2 mt-2 md:mt-0">
        <button
          onClick={handleApply}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-xl text-white font-medium shadow-md transition-all duration-200 hover:scale-105"
        >
          Apply
        </button>
        <button
          onClick={handleReset}
          className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-xl text-white font-medium shadow-md transition-all duration-200 hover:scale-105"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
