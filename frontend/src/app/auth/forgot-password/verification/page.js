'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function SignupPage() {
  const [verificationCode, setVerificationCode] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3001/api/auth/verifyOTP", { verificationCode });
      router.push("/auth/forgot-password/verification/reset-password");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to verified");
    }
  };

  return (
    <div className="header-container">
      
      <h1 className="header-title">
        PEERPREP
      </h1>
      <h2 className="header-sub-title">Verification</h2>

      <div className="form-container">
        <form onSubmit={handleSubmit} className="space-y-2">
          <label className="form-label">Verification Code</label>
          <input
            type="text"
            placeholder="Verification Code"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            className="form-input"
            required
          />
          <button
            type="submit"
            className="button-submit mt-4"
          >
            Verify
          </button>
        </form>
        <p className="footer-msg">
          Already a member? <a href="/auth/login" className="footer-ref">Sign In</a>
        </p>
      </div>
    </div>
  );
}
