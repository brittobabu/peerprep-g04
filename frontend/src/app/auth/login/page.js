'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("http://localhost:3001/api/auth/login", { username, password });
      router.push("/dashboard");
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-orange-100">
      <h1 className="text-5xl font-bold text-black mb-2" style={{ fontFamily: "'Fredoka One', cursive" }}>
        PEERPREP
      </h1>
      <h2 className="text-2xl font-semibold text-black mb-6">Welcome</h2>

      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-gray-700">Username</label>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-3 border rounded-full outline-none focus:ring-2 focus:ring-blue-400 bg-orange-50"
            required
          />

          <label className="block text-gray-700">Your password</label>
          <input
            type="password"
            placeholder="Your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border rounded-full outline-none focus:ring-2 focus:ring-blue-400 bg-orange-50"
            required
          />

          <div className="text-right">
            <a href="/auth/forgot-password" className="text-blue-500 text-sm hover:underline">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            className="w-full bg-orange-500 text-white font-bold py-3 rounded-full shadow-md hover:bg-orange-600 transition-all"
          >
            SIGN IN
          </button>
        </form>

        <p className="mt-4 text-center text-gray-700">
          Don’t have an account?{" "}
          <a href="/auth/signup" className="text-blue-500 font-semibold hover:underline">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
}
