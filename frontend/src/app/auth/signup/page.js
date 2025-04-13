'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {FullScreenLoader, FullScreenSuccess} from "../../../../utils/transition";

export default function SignupPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("Sending OTP...");
  const [success, setSuccess] = useState(false);
  const [successText, setSuccessText] = useState("OTP Sent");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    setLoading(true);
    try {     
      
      // sent otp to email
      const response = await axios.post("http://localhost:3000/api/auth/sendOTP", {email });

      if(!response.data?.success){
        alert("Failed to send OTP");
        setLoading(false);
        return;
      }      

      setSuccess(true);
      await new Promise((resolve) => setTimeout(resolve, 2000));      

      //set redirect path
      const redirect = router.push(
        `/auth/signup/verify-account?email=${encodeURIComponent(email)}&username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}&confirmPassword=${encodeURIComponent(confirmPassword)}`
      );
      //set delay
      const delay = new Promise((resolve) => setTimeout(resolve, 1000));
      // Wait for whichever finishes first
      await Promise.race([redirect, delay]);
      // If redirect isn't done yet, show redirecting
      setLoadingText("Redirecting...");
      await redirect;
      

    } catch (error) {
      alert(error.response?.data?.message || "Signup failed");
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
          {loading && <FullScreenLoader text={loadingText}/>}
          {success && <FullScreenSuccess text={successText}/>}
        </form>
        <p className="footer-msg">
          Already a member? <a href="/auth/login" className="footer-ref">Sign In</a>
        </p>
      </div>
    </div>
  );
}
