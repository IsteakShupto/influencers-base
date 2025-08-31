"use client";

import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const seeded = localStorage.getItem("dbSeeded");
    const token = localStorage.getItem("token");
    const user_id = localStorage.getItem("user_id");

    if (seeded && token && user_id) {
      setLoading(false);
      router.push("/influencers");
      return;
    }

    const seedDatabase = async () => {
      try {
        const res = await fetch("/api/seed/", { method: "GET" });
        if (res.ok) {
          localStorage.setItem("dbSeeded", "true");
          setLoading(false);
          if (token && user_id) router.push("/influencers");
          else router.push("/login");
        } else {
          console.error("Seeding failed");
        }
      } catch (error) {
        console.log(`Error seeding:`, error);
      }
    };

    seedDatabase();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white p-4">
        <div className="flex flex-col items-center text-center space-y-4">
          <Loader className="w-10 h-10 animate-spin text-blue-400" />
          <h1 className="text-xl md:text-2xl font-semibold">
            Seeding in progress
          </h1>
          <p className="text-sm md:text-base text-gray-400 max-w-sm">
            Please wait while we complete the data seeding...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white p-4"></div>
  );
}
