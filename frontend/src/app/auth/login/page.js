'use client';

import { useState, useEffect  } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import {FullScreenLoader} from "../../../../utils/transition";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("Loading...");
  const router = useRouter();

  useEffect(() => {
    const seedAdmin = async () => {
      try {
        const response = await axios.post("http://localhost:3000/api/auth/seed");
        console.log("Seed response:", response.data.message);

        const questionRes = await axios.post("http://localhost:3000/admin/question/seed");
        console.log("Question seed response:", questionRes.data.message);
      } catch (error) {
        console.log(error);
        console.log("Seeding failed Error:", error.response?.data?.message || error.message);
      }
    };

    seedAdmin();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    try {

      const { data } = await axios.post("http://localhost:3000/api/auth/login", { username, password });

      //set redirect path
      localStorage.setItem("user_data", JSON.stringify(data));
      const redirect = router.push("/user-dashboard");
      //set delay
      const delay = new Promise((resolve) => setTimeout(resolve, 1000));
      // Wait for whichever finishes first
      await Promise.race([redirect, delay]);
      // If redirect isn't done yet, show redirecting
      setLoadingText("Redirecting...");
      await redirect;

    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
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
          {loading && <FullScreenLoader text={loadingText}/>}
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