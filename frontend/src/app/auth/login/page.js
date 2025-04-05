'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";

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
    <div className="header-container">
      <h1 className="header-title">
        PEERPREP
      </h1>
      <h2 className="header-sub-title">Welcome</h2>

      <div className="form-container">
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="form-label">Username</label>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="form-input"
            required
          />

          <label className="form-label">Your password</label>
          <input
            type="password"
            placeholder="Your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-input"
            required
          />

          <div className="text-right">
            <Link href="/auth/forgot-password" className="text-blue-500 text-sm hover:underline">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            className="button-submit"
          >
            SIGN IN
          </button>
        </form>

        <p className="footer-msg">
          Don’t have an account?{" "}
          <Link href="/auth/signup" className="footer-ref">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}