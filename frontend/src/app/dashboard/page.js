'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {

  const [userId, setUserId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem("user_data");
    if (userData) {
      const parsed = JSON.parse(userData);
      setUserId(parsed.data.username);
      if (!parsed.data?.isAdmin) {
        router.replace("/user-dashboard"); // redirect non-admin
      }
    } else {
      router.replace("/"); // not logged in
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      {/* Header */}
      <div className="bg-[#fbe7d0] p-4 flex justify-between items-center shadow-md">
        <div>
          <h1 className="text-4xl font-bold text-[#1e1e1e]">PEERPREP Admin</h1>
          <p className="text-sm">Manage coding questions and categories</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="bg-white p-2 rounded-full shadow">
            <span role="img" aria-label="user">👤</span>
          </div>
          <p className="font-medium">{userId ?? 'Your name'}</p>
          <button
            onClick={() => {
                localStorage.removeItem("user_data"); // Clear any session storage
                router.push("/"); // Redirect to landing/login page
          }}
            className="ml-4 px-4 py-1 bg-[#e67e22] text-white rounded-lg shadow hover:bg-[#cf711c]"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Button Container */}
      <div className="flex justify-center mt-20">
        <div className="bg-[#fcebd5] border-2 border-blue-400 rounded-xl p-6 w-96 shadow-lg text-center space-y-4">
          <h2 className="text-2xl font-bold text-[#1e1e1e] mb-2">Admin Actions</h2>

          <Link
            href="/admin"
            className="block w-full bg-[#e67e22] hover:bg-[#cf711c] text-white py-2 rounded-md font-semibold transition"
          >
            📋 View All Questions
          </Link>

          <Link
            href="/admin/question"
            className="block w-full bg-[#e67e22] hover:bg-[#cf711c] text-white py-2 rounded-md font-semibold transition"
          >
            ➕ Add New Question
          </Link>

          <Link
            href="/user-dashboard"
            className="block w-full bg-[#e67e22] hover:bg-[#cf711c] text-white py-2 rounded-md font-semibold transition"
          >
            👤 Go to User Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
