'use client';

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import {FullScreenLoader} from "../../../../../../utils/transition";

export default function ResetPasswordPage() {

    const router = useRouter();
    const searchParams = useSearchParams(); 
    const userId = searchParams.get("userId");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [loadingText, setLoadingText] = useState("Updating...");
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }
        setLoading(true);
        try {

            //update new password
            await axios.post("http://localhost:3001/api/auth/forgot-password/verification/reset-password", {id:userId, password, confirmPassword });

            
            //redirect to login page
            //set redirect path
            const redirect = router.push("/auth/login");
            //set delay
            const delay = new Promise((resolve) => setTimeout(resolve, 1000));
            // Wait for whichever finishes first
            await Promise.race([redirect, delay]);
            // If redirect isn't done yet, show redirecting
            setLoadingText("Redirecting...");
            await redirect;

        } catch (error) {
            console.log('error'+error);
            alert(error.response?.data?.message || "Failed to update password");
        } finally {
            setLoading(false);
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
            {loading && <FullScreenLoader text={loadingText}/>}
            </form>
            <p className="footer-msg">
            Already a member? <Link href="/auth/login" className="footer-ref">Sign In</Link>
            </p>
        </div>
        </div>
    );
}
