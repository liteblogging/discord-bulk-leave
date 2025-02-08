"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import toast from "react-hot-toast";

interface Server {
  id: string;
  name: string;
  icon: string;
  muted: boolean;
}

export default function ServerList() {
  const { data: session } = useSession();
  const [servers, setServers] = useState<Server[]>([]);
  const [selectedServers, setSelectedServers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServers();
  }, []);

  const fetchServers = async () => {
    try {
      const response = await axios.get("/api/servers");
      setServers(response.data);
      setLoading(false);
    } catch (error) {
      toast.error("Failed to fetch servers");
      setLoading(false);
    }
  };

  const handleSelectAll = () => {
    if (selectedServers.length === servers.length) {
      setSelectedServers([]);
    } else {
      setSelectedServers(servers.map((server) => server.id));
    }
  };

  const handleServerSelect = (serverId: string) => {
    setSelectedServers((prev) =>
      prev.includes(serverId)
        ? prev.filter((id) => id !== serverId)
        : [...prev, serverId]
    );
  };

  const handleLeaveServers = async () => {
    try {
      await axios.post("/api/leave-servers", { serverIds: selectedServers });
      toast.success("Successfully left selected servers");
      fetchServers();
      setSelectedServers([]);
    } catch (error) {
      toast.error("Failed to leave servers");
    }
  };

  const handleMuteServers = async () => {
    try {
      await axios.post("/api/mute-servers", { serverIds: selectedServers });
      toast.success("Successfully muted selected servers");
      fetchServers();
    } catch (error) {
      toast.error("Failed to mute servers");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between mb-6">
        <div className="space-x-4">
          <button
            onClick={handleSelectAll}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
          >
            {selectedServers.length === servers.length
              ? "Deselect All"
              : "Select All"}
          </button>
          {selectedServers.length > 0 && (
            <>
              <button
                onClick={handleLeaveServers}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
              >
                Leave Selected
              </button>
              <button
                onClick={handleMuteServers}
                className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 transition-colors"
              >
                Mute Selected
              </button>
            </>
          )}
        </div>
        <p className="text-gray-600">
          Selected: {selectedServers.length} / {servers.length}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {servers.map((server) => (
          <div
            key={server.id}
            className={`bg-white p-4 rounded-lg shadow-md cursor-pointer transition-all ${
              selectedServers.includes(server.id)
                ? "ring-2 ring-blue-500"
                : "hover:shadow-lg"
            }`}
            onClick={() => handleServerSelect(server.id)}
          >
            <div className="flex items-center space-x-3">
              {server.icon ? (
                <img
                  src={`https://cdn.discordapp.com/icons/${server.id}/${server.icon}.png`}
                  alt={server.name}
                  className="w-12 h-12 rounded-full"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                  {server.name.charAt(0)}
                </div>
              )}
              <div>
                <h3 className="font-medium text-gray-900">{server.name}</h3>
                <p className="text-sm text-gray-500">
                  {server.muted ? "Muted" : "Not Muted"}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 