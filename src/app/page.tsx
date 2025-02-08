"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { FaDiscord } from "react-icons/fa";
import ServerList from "@/components/ServerList";

export default function Home() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status !== "loading") {
      setLoading(false);
    }
  }, [status]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">Discord Manager</h1>
            </div>
            <div className="flex items-center">
              {session ? (
                <button
                  onClick={() => signOut()}
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
                >
                  Sign Out
                </button>
              ) : (
                <button
                  onClick={() => signIn("discord")}
                  className="flex items-center space-x-2 bg-[#5865F2] text-white px-4 py-2 rounded-md hover:bg-[#4752C4] transition-colors"
                >
                  <FaDiscord className="text-xl" />
                  <span>Sign in with Discord</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {session && <ServerList />}
    </main>
  );
} 