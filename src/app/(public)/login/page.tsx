"use client";

import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);

      // dummy login (nanti sambung ke API)
      await new Promise((res) => setTimeout(res, 1000));

      alert("Login success");
    } catch (err) {
      alert("Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white flex items-center justify-center px-6">
      
      <div className="w-full max-w-md">
        
        {/* Logo / Title */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold">EquityLens</h1>
          <p className="text-gray-400 mt-2">
            Sign in to access admin panel
          </p>
        </div>

        {/* Card */}
        <div className="bg-[#0B1220] border border-white/10 rounded-2xl p-6 shadow-lg">
          
          {/* Email */}
          <div className="mb-4">
            <label className="text-sm text-gray-400">Email</label>
            <input
              type="email"
              placeholder="admin@equitylens.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full px-4 py-3 rounded-xl bg-[#020617] border border-white/10 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Password */}
          <div className="mb-6">
            <label className="text-sm text-gray-400">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full px-4 py-3 rounded-xl bg-[#020617] border border-white/10 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Button */}
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 transition py-3 rounded-xl font-medium disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-1 h-px bg-white/10" />
            <span className="px-3 text-gray-500 text-sm">OR</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Optional: Google Login */}
          <button className="w-full border border-white/10 hover:border-white/20 transition py-3 rounded-xl">
            Continue with Google
          </button>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-500 text-sm mt-6">
          © {new Date().getFullYear()} EquityLens
        </p>
      </div>
    </div>
  );
}