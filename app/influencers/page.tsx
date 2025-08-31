"use client";

import EditInfluencerModal from "@/components/EditInfluencerModal";
import InfluencerFilters from "@/components/InfluencerFilters";
import { Platform } from "@prisma/client";
import {
  Loader,
  ShieldAlert,
  Edit,
  Trash2,
  UserPlus,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import "@/styles/custom-table.css";
import { toast } from "react-toastify";

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
  createdById?: string | null;
  created_at: string;
  updated_at: string;
}

export default function Influencers() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [influencers, setInfluencers] = useState<Influencer[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [fetchingData, setFetchingData] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingInfluencer, setEditingInfluencer] = useState<Influencer | null>(
    null
  );
  const [isEditOpen, setIsEditOpen] = useState(false);

  const [filters, setFilters] = useState<Record<string, unknown>>({});

  const router = useRouter();

  const handleEditClick = (inf: Influencer) => {
    setEditingInfluencer(inf);
    setIsEditOpen(true);
  };

  const handleCreate = async (newData: Partial<Influencer>) => {
    try {
      newData = {
        ...newData,
        createdById: localStorage.getItem("user_id") || null,
      };
      const token = localStorage.getItem("token");
      const res = await fetch("/api/influencers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token!}`,
        },
        body: JSON.stringify(newData),
      });

      if (res.ok) {
        const created = await res.json();
        setInfluencers((prev) => [created, ...prev]);
        setIsCreateOpen(false);
        toast.info("Influencer created successfully", {
          style: {
            backgroundColor: "#1e2939",
          },
        });
      } else {
        console.error("Creation failed");
        toast.error("Influencer creation failed", {
          style: {
            backgroundColor: "#1e2939",
          },
        });
      }
    } catch (err) {
      console.error(err);
      toast.error("Influencer creation failed", {
        style: {
          backgroundColor: "#1e2939",
        },
      });
    }
  };

  const handleSave = async (updatedData: Partial<Influencer>) => {
    if (!editingInfluencer) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/influencers/${editingInfluencer.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      });

      if (res.ok) {
        let updatedInf = await res.json();
        updatedInf = {
          ...updatedInf,
          engagement_rate: Number(updatedInf.engagement_rate),
          platform: updatedInf.platform as Platform,
        };

        setInfluencers((prev) =>
          prev.map((inf) => (inf.id === updatedInf.id ? updatedInf : inf))
        );
        setIsEditOpen(false);
        toast.info("Influencer details updated successfully", {
          style: {
            backgroundColor: "#1e2939",
          },
        });
      } else {
        console.error("Update failed");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this influencer?")) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/influencers/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token!}` },
      });

      if (res.ok) {
        setInfluencers((prev) => prev.filter((inf) => inf.id !== id));
        toast.info("Influencer profile deleted", {
          style: {
            backgroundColor: "#1e2939",
          },
        });
      } else {
        console.error("Delete failed");
        toast.error("Influencer profile deletion failed", {
          style: {
            backgroundColor: "#1e2939",
          },
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsAuthenticated(false);
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const data = await res.json();
          setIsAdmin(data.user.role === "ADMIN");
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem("token");
          setIsAuthenticated(false);
          setIsAdmin(false);
        }
      } catch {
        localStorage.removeItem("token");
        setIsAuthenticated(false);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;
    fetchInfluencers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const fetchInfluencers = async (pageNum = page, appliedFilters = filters) => {
    setFetchingData(true);
    try {
      const token = localStorage.getItem("token");
      const query = new URLSearchParams({
        page: pageNum.toString(),
        limit: limit.toString(),
        ...Object.fromEntries(
          Object.entries(appliedFilters).filter(([, v]) => v !== undefined)
        ),
      }).toString();

      const res = await fetch(`/api/influencers?${query}`, {
        headers: { Authorization: `Bearer ${token!}` },
      });

      if (res.ok) {
        const data = await res.json();
        setInfluencers(data.data);
        setTotalPages(data.meta.totalPages);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setFetchingData(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white p-4">
        <div className="flex flex-col items-center text-center space-y-4">
          <Loader className="w-10 h-10 animate-spin text-blue-400" />
          <h1 className="text-xl md:text-2xl font-semibold">Please wait!</h1>
          <p className="text-sm md:text-base text-gray-400 max-w-sm">
            Loading your user data...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white p-4">
        <div className="flex flex-col items-center text-center space-y-4">
          <ShieldAlert className="w-10 h-10 animate-bounce text-blue-400" />
          <h1 className="text-xl md:text-2xl font-semibold">
            Seems like you are not logged in!
          </h1>
          <p className="text-sm md:text-base text-gray-400 max-w-sm">
            <Link
              href="/login/"
              className="text-blue-400 underline underline-offset-2"
            >
              Click here
            </Link>{" "}
            to login.
          </p>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
    toast.success("Logout successful", {
      style: {
        backgroundColor: "#1e2939",
      },
    });
    router.push("/login");
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-900 p-6">
      <div className="w-full flex justify-between items-center mb-6">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-md shadow-md transition-all duration-200 hover:scale-105"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>

      <div className="relative bg-gray-800 shadow-2xl rounded-2xl p-6 w-full">
        {isAdmin && (
          <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1.5 rounded-md text-sm font-medium shadow-md">
            Admin
          </div>
        )}

        <h1 className="text-3xl font-bold text-white mb-6">Influencers</h1>

        <InfluencerFilters
          onApply={(filters) => {
            setFilters(filters);
            setPage(1);
            fetchInfluencers(1, filters);
          }}
        />

        {isAdmin && (
          <button
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md shadow-md transition-all duration-200 hover:scale-105 mb-6"
            onClick={() => setIsCreateOpen(true)}
          >
            <UserPlus className="w-5 h-5" />
            Add User
          </button>
        )}

        <div className="overflow-x-auto custom-table-slider">
          {fetchingData ? (
            <div className="flex items-center justify-center py-10">
              <Loader className="w-8 h-8 animate-spin text-blue-400" />
            </div>
          ) : (
            <table className="min-w-full text-left table-auto border-collapse">
              <thead className="bg-gray-700 border-b-2 border-gray-600 text-gray-200 sticky top-0 z-10">
                <tr>
                  <th className="px-3 py-3 text-sm font-semibold tracking-wide w-[60px]">
                    #
                  </th>
                  <th className="px-3 py-3 text-sm font-semibold tracking-wide w-[150px]">
                    Name
                  </th>
                  <th className="px-3 py-3 text-sm font-semibold tracking-wide w-[150px]">
                    Platform
                  </th>
                  <th className="px-3 py-3 text-sm font-semibold tracking-wide w-[150px]">
                    Username
                  </th>
                  <th className="px-3 py-3 text-sm font-semibold tracking-wide w-[120px]">
                    Followers
                  </th>
                  <th className="px-3 py-3 text-sm font-semibold tracking-wide w-[120px]">
                    Engagement
                  </th>
                  <th className="px-3 py-3 text-sm font-semibold tracking-wide w-[80px]">
                    Country
                  </th>
                  <th className="px-3 py-3 text-sm font-semibold tracking-wide min-w-[180px]">
                    Categories
                  </th>
                  <th className="px-3 py-3 text-sm font-semibold tracking-wide min-w-[200px]">
                    Email
                  </th>
                  {isAdmin && (
                    <th className="px-3 py-3 text-sm font-semibold tracking-wide w-[140px]">
                      Actions
                    </th>
                  )}
                  <th className="px-3 py-3 text-sm font-semibold tracking-wide w-[120px]">
                    Created
                  </th>
                  <th className="px-3 py-3 text-sm font-semibold tracking-wide w-[120px]">
                    Updated
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700 text-gray-200">
                {influencers.map((inf, idx) => (
                  <tr
                    key={inf.id}
                    className={`${
                      idx % 2 === 0
                        ? "bg-gray-800 hover:bg-gray-700"
                        : "bg-gray-700 hover:bg-gray-600"
                    }`}
                  >
                    <td className="px-3 py-3 whitespace-nowrap font-medium">
                      {(page - 1) * limit + idx + 1}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap font-medium">
                      {inf.name}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap">
                      {inf.platform}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap">
                      {inf.username}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap">
                      {inf.followers.toLocaleString()}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap">
                      {inf.engagement_rate}%
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap">
                      {inf.country}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap">
                      {inf.categories.join(", ")}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap">
                      {inf.email || "-"}
                    </td>
                    {isAdmin && (
                      <td className="px-3 py-3 whitespace-nowrap flex gap-2">
                        <button
                          className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1.5 rounded-lg"
                          onClick={() => handleEditClick(inf)}
                        >
                          <Edit className="w-4 h-4" /> Edit
                        </button>
                        <button
                          className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-1.5 rounded-lg"
                          onClick={() => handleDelete(inf.id)}
                        >
                          <Trash2 className="w-4 h-4" /> Delete
                        </button>
                      </td>
                    )}
                    <td className="px-3 py-3 whitespace-nowrap">
                      {new Date(inf.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap">
                      {new Date(inf.updated_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="flex justify-center mt-6 gap-2">
          <button
            disabled={page === 1}
            onClick={() => {
              const newPage = page - 1;
              setPage(newPage);
              fetchInfluencers(newPage);
            }}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-500 rounded-md disabled:opacity-50 text-white"
          >
            Prev
          </button>
          <span className="px-3 py-1 text-gray-300">
            {page} / {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => {
              const newPage = page + 1;
              setPage(newPage);
              fetchInfluencers(newPage);
            }}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-500 rounded-md disabled:opacity-50 text-white"
          >
            Next
          </button>
        </div>
      </div>

      <EditInfluencerModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSave={handleCreate}
      />

      <EditInfluencerModal
        influencer={editingInfluencer!}
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
}
