"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, Loader } from "lucide-react";
import Link from "next/link";

import { toast } from "react-toastify";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok && data.token) {
      console.log(data);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user_id", data.user.id);
      setLoading(false);
      toast.success("Login successful", {
        style: {
          backgroundColor: "#1e2939",
        },
      });
      router.push("/");
    } else {
      setLoading(false);
      setError(data.error || "Login failed");
      toast.error("Login failed", {
        style: {
          backgroundColor: "#1e2939",
        },
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <div className="bg-gray-800 shadow-2xl rounded-2xl p-8 max-w-md w-full text-center animate-fadeIn">
        <h1 className="text-3xl font-bold text-white mb-1 flex items-center gap-2">
          Account login
        </h1>

        <p className="text-gray-300 mb-6 text-left">
          Enter your email and password below to log in
        </p>

        <form onSubmit={handleLogin} className="space-y-4 text-left">
          <div className="relative">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 py-2 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <div className="relative">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 py-2 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm"
                placeholder="Enter your password"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className={`w-full flex justify-center items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-medium transition-colors duration-200 text-sm ${
              loading ? "cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading && <Loader className="w-5 h-5 animate-spin" />}
            Sign in
          </button>
        </form>

        {error === "Invalid credentials" && (
          <p className="text-red-500 mt-5">
            Please provide correct email or password
          </p>
        )}

        <p className="mt-6 text-center text-sm text-gray-300">
          Haven&apos;t created an account?{" "}
          <Link
            href="/register"
            className="font-medium text-blue-600 hover:underline"
          >
            Click here
          </Link>
        </p>

        <p className="mt-5 text-gray-400 text-sm text-center">
          Admin account details, email: admin@example.com, password: Admin123!
        </p>

        <p className="mt-2.5 text-gray-400 text-sm text-center">
          Viewer account details, email: viewer@example.com, password:
          Viewer123!
        </p>
      </div>
    </div>
  );
}
