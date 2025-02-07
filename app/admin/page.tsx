"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (email === "mz5532006@gmail.com" && password === "51214") {
      localStorage.setItem("isLoggedIn", "true");
      router.push("/admin/dashboard");
    } else {
      alert("Invalid email or password");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-sm w-full">
        <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">
          Admin Login
        </h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-gray-600 text-sm font-medium mb-1">
              Email Address
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-gray-600 text-sm font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600 transition-all duration-300 shadow-md"
          >
            Login
          </button>
        </form>
        <p className="text-center text-gray-500 text-sm mt-4">
          Forgot password? <a href="#" className="text-red-500">Reset here</a>
        </p>
      </div>
    </div>
  );
}
