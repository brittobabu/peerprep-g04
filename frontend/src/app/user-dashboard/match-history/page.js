'use client';

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function MatchHistoryPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [userId, setUserId] = useState(null);

  const user = searchParams.get("user");
  const topic = searchParams.get("topic");
  const range = searchParams.get("range");

  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const userData = localStorage.getItem("user_data");
    if (userData) {
      const parsed = JSON.parse(userData);
      setUserId(parsed.data.username);
    } else {
      router.replace("/"); // not logged in
    }
  }, []);

  useEffect(() => {
    const fetchHistory = async () => {
      let query = `?`;
      if (topic) query += `topic=${encodeURIComponent(topic)}&`;

      const now = new Date();
      let from = null;
      if (range === "last_week") {
        from = new Date(now.setDate(now.getDate() - 7));
      } else if (range === "last_month") {
        from = new Date(now.setMonth(now.getMonth() - 1));
      }
      if (from) query += `from=${from.toISOString().split("T")[0]}&`;

      try {
        const res = await fetch(`http://localhost:5000/api/match-history/${user}${query}`);
        const data = await res.json();
        setMatches(data.data);
      } catch (err) {
        console.error("Failed to load match history", err);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchHistory();
  }, [user, topic, range]);

  return (

    <div className="min-h-screen bg-[#f5f5f5] font-sans">
        {/* Header */}
        <div className="bg-[#fdebd2] p-4 flex justify-between items-center shadow-md">
            <div>
                <h1 className="text-4xl font-bold text-[#1e1e1e]">PEERPREP</h1>
                <p className="text-sm text-gray-700">Practice coding interviews live with peers!</p>
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
        <div className="p-6 min-h-screen bg-gray-100">
            <div className="absolute top-8 mt-20 left-4">
                <button
                onClick={() => router.push("/user-dashboard")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow"
                >
                ⬅ Back to Dashboard
                </button>
            </div>
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold text-[#1e1e1e]">Match History</h1>
            </div>

            
            <table className="min-w-full border-collapse border border-gray-300 bg-white shadow-md">
            <thead className="bg-orange-100">
                <tr>
                <th className="border p-3 text-left">Partner</th>
                <th className="border p-3 text-left">Topic</th>
                <th className="border p-3 text-left">Difficulty</th>
                <th className="border p-3 text-left">Date</th>
                </tr>
            </thead>
            <tbody>
                {loading ? (
                    <tr>
                    <td colSpan="4" className="text-center p-4 text-gray-500">
                        Loading history...
                    </td>
                    </tr>
                ) : matches.length === 0 ? (
                    <tr>
                    <td colSpan="4" className="text-center p-4 text-gray-500">
                        No match records found.
                    </td>
                    </tr>
                ) : (
                    matches.map((match, idx) => (
                    <tr key={idx}>
                        <td className="border p-3">
                        {match.user1 === user ? match.user2 : match.user1}
                        </td>
                        <td className="border p-3">{match.topic}</td>
                        <td className="border p-3">{match.difficulty}</td>
                        <td className="border p-3">{new Date(match.matchedAt).toLocaleString()}</td>
                    </tr>
                    ))
                )}
            </tbody>
            </table>
        </div>
    </div>
  );
}
