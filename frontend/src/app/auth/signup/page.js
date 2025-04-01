'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function SignupPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    try {
      await axios.post("http://localhost:3001/api/auth/signup", { username, email, password, confirmPassword });
      
      // sent otp to email
      const response = await axios.post("http://localhost:3001/api/auth/sendOTP", {email });
      console.log("API Response:", response.data); // Debugging line

      router.push(
        `/auth/signup/verify-account?email=${encodeURIComponent(email)}`
      );
      

    } catch (error) {
      alert(error.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="header-container">

      <h1 className="header-title">
        PEERPREP
      </h1>
      <h2 className="header-sub-title">Create Account</h2>

      <div className="form-container">
        <form onSubmit={handleSubmit} className="space-y-2">
          <label className="form-label">Username</label>
          <input
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="form-input"
            required
          />
          <label className="form-label">Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-input"
            required
          />
          <label className="form-label">Password</label>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-input"
            required
          />
          <label className="form-label">Confirm Password</label>
          <input
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="form-input"
            required
          />
          <button
            type="submit"
            className="button-submit mt-4"
          >
            SIGN UP
          </button>
        </form>
        <p className="footer-msg">
          Already a member? <a href="/auth/login" className="footer-ref">Sign In</a>
        </p>
      </div>
    </div>
  );
}
