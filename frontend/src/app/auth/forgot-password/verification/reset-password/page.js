'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";

export default function ResetPasswordPage() {
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
            await axios.post("http://localhost:3001/api/auth/forgot-password/verification/reset-password", { password, confirmPassword });
            router.push("/auth/login");
        } catch (error) {
            alert(error.response?.data?.message || "Failed to update password");
        }
    };

    return (
        <div className="header-container">
        
        <h1 className="header-title">
            PEERPREP
        </h1>
        <h2 className="header-sub-title">Set new password</h2>

        <div className="form-container">
            <form onSubmit={handleSubmit} className="space-y-2">
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
                Update Password
            </button>
            </form>
            <p className="footer-msg">
            Already a member? <Link href="/auth/login" className="footer-ref">Sign In</Link>
            </p>
        </div>
        </div>
    );
}
