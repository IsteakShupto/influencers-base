"use client";

import {
  X,
  Loader,
  User,
  AtSign,
  Mail,
  Globe,
  Users,
  Percent,
  List,
  Hash,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Platform } from "@prisma/client";

interface Influencer {
  id: string;
  name: string;
  platform: Platform;
  username: string;
  followers: number;
  engagement_rate: number;
  country: string;
  categories: string[];
  email?: string;
}

interface EditInfluencerModalProps {
  influencer?: Influencer;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedData: Partial<Influencer>, isNew?: boolean) => void;
}

export default function EditInfluencerModal({
  influencer,
  isOpen,
  onClose,
  onSave,
}: EditInfluencerModalProps) {
  const [formData, setFormData] = useState<Partial<Influencer>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (influencer) {
      setFormData({ ...influencer });
    }
  }, [influencer]);

  const handleSave = async () => {
    setLoading(true);
    try {
      await onSave(formData, !influencer);
      setLoading(false);
      onClose();
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg p-6 relative flex flex-col gap-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
          <Hash className="w-6 h-6 text-blue-400" />
          Add or edit influencer
        </h2>

        <div className="flex flex-col gap-3">
          <div className="flex items-center w-full rounded-xl bg-gray-700 px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500 shadow-sm">
            <User className="text-gray-400 mr-2 w-5 h-5" />
            <input
              type="text"
              placeholder="Enter name"
              value={formData.name || ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              className="w-full bg-transparent text-white placeholder-gray-400 focus:outline-none"
            />
          </div>

          <div className="flex items-center space-x-2 bg-gray-700 rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
            <AtSign className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Username"
              value={formData.username || ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, username: e.target.value }))
              }
              className="flex-1 bg-transparent outline-none text-white placeholder-gray-400"
            />
          </div>

          <div className="flex items-center gap-2 bg-gray-700 px-3 py-2 rounded-xl focus-within:ring-2 focus-within:ring-blue-500">
            <Mail className="text-gray-400 w-5 h-5" />
            <input
              type="email"
              placeholder="Email"
              value={formData.email || ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: e.target.value }))
              }
              className="bg-transparent flex-1 text-white placeholder-gray-400 focus:outline-none"
            />
          </div>

          <select
            value={formData.platform || ""}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                platform: e.target.value as Platform,
              }))
            }
            className="px-3 py-2 rounded-xl bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Platform</option>
            <option value="INSTAGRAM">Instagram</option>
            <option value="YOUTUBE">YouTube</option>
            <option value="TIKTOK">TikTok</option>
            <option value="X">X</option>
          </select>

          <div className="relative w-full">
            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Country"
              value={formData.country || ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, country: e.target.value }))
              }
              className="pl-10 pr-3 py-2 w-full rounded-xl bg-gray-700 text-white 
               focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="relative w-full">
            <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="number"
              placeholder="Followers"
              value={formData.followers || 0}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  followers: Number(e.target.value),
                }))
              }
              className="pl-10 pr-3 py-2 w-full rounded-xl bg-gray-700 text-white 
               focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="relative w-full">
            <Percent className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="number"
              placeholder="Engagement Rate (%)"
              value={formData.engagement_rate || 0}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  engagement_rate: Number(e.target.value),
                }))
              }
              className="pl-10 pr-3 py-2 w-full rounded-xl bg-gray-700 text-white 
               focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="relative w-full">
            <List className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Categories (comma separated)"
              value={formData.categories?.join(", ") || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  categories: e.target.value.split(",").map((c) => c.trim()),
                }))
              }
              className="pl-10 pr-3 py-2 w-full rounded-xl bg-gray-700 text-white
               focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-xl text-white transition-all duration-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-xl text-white font-medium transition-all duration-200 hover:scale-105 flex items-center gap-2"
            disabled={loading}
          >
            {loading && <Loader className="w-4 h-4 animate-spin" />}
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
