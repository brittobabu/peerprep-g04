"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import {FullScreenLoader} from "../../../../../utils/transition";

export default function VerifyAccount() {
  const router = useRouter();
  const searchParams = useSearchParams(); 

  const email = searchParams.get("email");

  const [verificationCode, setVerificationCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("Verifying OTP...");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("http://localhost:3000/api/auth/verifyOTP", {
        email,
        verificationCode,
      });


      //set redirect path
      const redirect = router.push("/admin");
      //set delay
      const delay = new Promise((resolve) => setTimeout(resolve, 1000));
      // Wait for whichever finishes first
      await Promise.race([redirect, delay]);
      // If redirect isn't done yet, show redirecting
      setLoadingText("Redirecting...");
      await redirect;
    } catch (error) {
      alert(error.response?.data?.message || "Failed to verify");
    } finally {
      setLoading(false);
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
          {loading && <FullScreenLoader text={loadingText}/>}
        </form>
        <p className="footer-msg">
          Already a member?{" "}
          <Link href="/auth/login" className="footer-ref">Sign In</Link>
        </p>
      </div>
    </div>
  );
}
