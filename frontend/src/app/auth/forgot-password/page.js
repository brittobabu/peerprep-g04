'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function ForgotPasswordPage() {
  const [userIdentity, setUserIdentity] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data=  await axios.post("http://localhost:3001/api/auth/forgot-password",{userIdentity});
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
          Already a member? <a href="/auth/login" className="footer-ref">Sign In</a>
        </p>
      </div>
    </div>
  );
}
