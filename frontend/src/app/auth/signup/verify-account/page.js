"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";

export default function VerifyAccount() {
  const router = useRouter();
  const searchParams = useSearchParams(); 

  const email = searchParams.get("email");

  const [verificationCode, setVerificationCode] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3001/api/auth/verifyOTP", {
        email,
        verificationCode,
      });
      router.push("/admin");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to verify");
    }
  };

  return (
    <div className="header-container">
      <h1 className="header-title">PEERPREP</h1>
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
          <button type="submit" className="button-submit mt-4">
            Verify
          </button>
        </form>
        <p className="footer-msg">
          Already a member?{" "}
          <a href="/auth/login" className="footer-ref">Sign In</a>
        </p>
      </div>
    </div>
  );
}
