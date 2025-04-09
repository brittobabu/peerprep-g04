'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import {FullScreenLoader, FullScreenSuccess} from "../../../../utils/transition";


export default function ForgotPasswordPage() {
  const [email, setemail] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("Sending OTP...");
  const [success, setSuccess] = useState(false);
  const [successText, setSuccessText] = useState("OTP Sent");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {

      //#1 check if the email is registered/exist in system database
      const response = await axios.get(`http://localhost:3000/api/auth/findUserByEmail?email=${encodeURIComponent(email)}`);
      if (!response.data?.data) {
        alert("Invalid Email");
        setLoading(false);
        return;
      }
      //get user id for reset password use
      const userId = response.data.data.id;

      //#2 sent otp to email
      const otpResponse = await axios.post("http://localhost:3000/api/auth/sendOTP", {email });

      if(!otpResponse.data?.success){
        alert("Failed to send OTP");
        setLoading(false);
        return;
      }

      setSuccess(true);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      //#3 direct to verification page
      //set redirect path
      const redirect = router.push(`/auth/forgot-password/verification?email=${encodeURIComponent(email)}&userId=${userId}`);
      //set delay
      const delay = new Promise((resolve) => setTimeout(resolve, 1000));
      // Wait for whichever finishes first
      await Promise.race([redirect, delay]);
      // If redirect isn't done yet, show redirecting
      setLoadingText("Redirecting...");
      await redirect;
    } catch (error) {
      alert(error.response?.data?.message || "Failed to send verification code");
    } finally {
      setLoading(false);
      setSuccess(false);
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
          <label className="form-label">Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setemail(e.target.value)}
            className="form-input"
            required
          />
          <button
            type="submit"
            className="button-submit mt-4"
          >
            Get Verification Code
          </button>
          {loading && <FullScreenLoader text={loadingText}/>}
          {success && <FullScreenSuccess text={successText}/>}
        </form>
        <p className="footer-msg">
          Already a member? <Link href="/auth/login" className="footer-ref">Sign In</Link>
        </p>
      </div>
    </div>
  );
}
