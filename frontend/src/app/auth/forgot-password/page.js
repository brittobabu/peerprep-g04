'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [userIdentity, setUserIdentity] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      
      const response = await axios.post("http://localhost:3000/api/auth/sendOTP", { userIdentity });

      console.log("API Response:", response.data); // Debugging line

      router.push("/auth/forgot-password/verification");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to send verification code");
    }
  };

  return (
    <div className="header-container">
      
      <h1 className="header-title">
        PEERPREP
      </h1>
      <h2 className="header-sub-title">Forgot Password</h2>

      <div className="form-container">
        <form onSubmit={handleSubmit} className="space-y-2">
          <label className="form-label">Username or Email</label>
          <input
            type="text"
            placeholder="Enter your username or email"
            value={userIdentity}
            onChange={(e) => setUserIdentity(e.target.value)}
            className="form-input"
            required
          />
          <button
            type="submit"
            className="button-submit mt-4"
          >
            Get Verification Code
          </button>
        </form>
        <p className="footer-msg">
          Already a member? <Link href="/auth/login" className="footer-ref">Sign In</Link>
        </p>
      </div>
    </div>
  );
}
