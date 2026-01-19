import React, { useState } from "react";
import { DoorOpen, PlusCircle } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

export default function EntryPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // Load user from state or localStorage
  const user =
    location.state?.user ||
    JSON.parse(localStorage.getItem("user")) || { name: "User" };

  const userInitial = user?.name?.charAt(0)?.toUpperCase() || "?";

  // UI State
  const [mode, setMode] = useState("create"); // "create" | "join"
  const [joinId, setJoinId] = useState("");
  const [generatedId, setGeneratedId] = useState("");
  const [showCreatePopup, setShowCreatePopup] = useState(false);
  const [showJoinPopup, setShowJoinPopup] = useState(false);

  const colors = {
    card: "bg-[rgba(20,20,20,0.55)] backdrop-blur-xl border border-[rgba(99,102,241,0.25)] shadow-xl",
    input:
      "bg-[rgba(25,25,25,0.85)] border border-[rgba(99,102,241,0.3)] text-white placeholder-slate-500 focus:border-purple-400 outline-none",
    btn: "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500",
  };

  // Create room
  const handleCreate = () => {
    const id = Math.random().toString(36).substring(2, 8);
    setGeneratedId(id);
    setShowCreatePopup(true);
  };

  // Join room click (open popup)
  const handleJoin = () => {
    setShowJoinPopup(true);
  };

  // Join room submit
  const joinRoom = () => {
    if (!joinId.trim()) return alert("Enter Room ID first");
    localStorage.setItem("user", JSON.stringify({ name: user.name }));
    navigate(`/room/${joinId}`, { state: { name: user.name } });
  };

  return (
    <div className="min-h-screen w-full relative bg-[#0a0a0a] text-white flex items-center justify-center">

      {/* GRID BACKGROUND */}
      <div className="absolute inset-0 opacity-[0.1] bg-[url('/grid.svg')] pointer-events-none"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40 pointer-events-none"></div>

      {/* HEADER */}
      <header
        className="
        fixed top-0 left-0 w-full z-50
        backdrop-blur-xl px-8 py-4
        bg-[rgba(10,10,10,0.6)]
        border-b border-[rgba(99,102,241,0.15)]
        flex justify-between items-center
      "
      >
        <div
          className="
          text-2xl font-bold cursor-default
          bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500
          bg-clip-text text-transparent tracking-tight
        "
        >
          CollabCode
        </div>

        {/* USER AVATAR */}
        <div className="relative group cursor-pointer">
          <div
            className="
            w-11 h-11 rounded-full
            bg-gradient-to-br from-blue-600 to-purple-600
            flex items-center justify-center
            shadow-[0_0_25px_rgba(99,102,241,0.4)]
            transition-all duration-300
            group-hover:w-44
          "
          >
            <span className="font-semibold group-hover:opacity-0 transition-opacity duration-300">
              {userInitial}
            </span>

            <span
              className="
              absolute opacity-0 group-hover:opacity-100
              transition-opacity duration-300 text-sm font-medium
            "
            >
              {user.name}
            </span>
          </div>
        </div>
      </header>

      {/* PAGE WRAPPER */}
      <div className="pt-32 pb-10 w-full max-w-5xl flex gap-10">

        {/* LEFT SIDEBAR (Toggle) */}
        <div
          className={`
          w-48 h-[340px] p-6 rounded-2xl
          ${colors.card}
          flex flex-col gap-6
          backdrop-blur-xl animate-fadeIn
        `}
        >
          <button
            onClick={() => setMode("create")}
            className={`
              text-left px-4 py-3 rounded-xl font-semibold
              transition-all
              ${
                mode === "create"
                  ? "bg-white/10 text-white shadow-md border border-white/20"
                  : "text-slate-400 hover:text-white"
              }
            `}
          >
            Create Room
          </button>

          <button
            onClick={() => setMode("join")}
            className={`
              text-left px-4 py-3 rounded-xl font-semibold
              transition-all
              ${
                mode === "join"
                  ? "bg-white/10 text-white shadow-md border border-white/20"
                  : "text-slate-400 hover:text-white"
              }
            `}
          >
            Join Room
          </button>
        </div>

        {/* MAIN PANEL */}
        <div
          className={`
          flex-1 p-10 rounded-3xl animate-slideUp
          ${colors.card}
        `}
        >
          {/* WELCOME BANNER */}
          <div className="text-center mb-10">
            <h1
              className="
              text-4xl font-bold
              text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]
            "
            >
              Welcome, {user.name.split(" ")[0]}
            </h1>
            <p className="text-slate-400 mt-2 tracking-wide">
              {mode === "create"
                ? "Create a new collaboration session"
                : "Join an existing collaboration room"}
            </p>
          </div>

          {/* Create Panel */}
          {mode === "create" && (
            <div className="w-full flex flex-col items-center gap-6">
              <PlusCircle className="w-14 h-14 text-purple-400 mb-2" />

              <button
                onClick={handleCreate}
                className={`w-64 py-3 rounded-xl font-semibold text-lg ${colors.btn}`}
              >
                Generate Room ID
              </button>
            </div>
          )}

          {/* Join Panel */}
          {mode === "join" && (
            <div className="w-full max-w-md mx-auto">
              <DoorOpen className="w-14 h-14 text-blue-400 mx-auto mb-6" />

              <input
                className={`w-full px-4 py-3 rounded-xl mb-4 ${colors.input}`}
                placeholder="Enter Room ID"
                value={joinId}
                onChange={(e) => setJoinId(e.target.value)}
              />

              <button
                onClick={joinRoom}
                className={`w-full py-3 rounded-xl text-lg font-semibold ${colors.btn}`}
              >
                Join Room
              </button>
            </div>
          )}
        </div>
      </div>

      {/* POPUPS */}
      {showCreatePopup && (
  <Popup onClose={() => setShowCreatePopup(false)}>
    <div className="space-y-5">

      {/* Title */}
      <h2 className="text-2xl font-bold text-white bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-lg tracking-wide">
        Room Created 
      </h2>

      {/* Generated ID box */}
      <div className="
        bg-[rgba(25,25,25,0.75)]
        border border-[rgba(99,102,241,0.35)]
        rounded-xl
        p-5
        text-center
        font-mono text-xl
        tracking-widest
        text-white
        shadow-[0_0_25px_rgba(99,102,100,0.2)]
        backdrop-blur-xl
      ">
        {generatedId}
      </div>

      {/* Copy Button */}
      <button
        className="
          w-full py-3 rounded-xl font-semibold
          bg-gradient-to-r from-blue-600 to-purple-600
          hover:from-blue-500 hover:to-purple-500
          shadow-[0_0_20px_rgba(99,102,241,0.35)]
          transition-all duration-300
        "
        onClick={() => {
          navigator.clipboard.writeText(generatedId);
        }}
      >
        Copy Room ID
      </button>

      {/* Enter Room */}
      <button
        className="
          w-full py-3 rounded-xl font-semibold
          bg-gradient-to-r from-blue-600 to-purple-600
          hover:from-blue-500 hover:to-purple-500
          shadow-[0_0_20px_rgba(99,102,241,0.35)]
          transition-all duration-300
        "
        onClick={() => {
        localStorage.setItem("user", JSON.stringify({ name: user.name }));
        navigate(`/room/${generatedId}`, { state: { name: user.name } });
    }}
      >
        Enter Room
      </button>
    </div>
  </Popup>
)}

      {/* {showJoinPopup && (
        <Popup onClose={() => setShowJoinPopup(false)}>
          <h2 className="text-xl font-semibold mb-4 text-white">
            Enter Room ID
          </h2>

          <input
            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white mb-4"
            placeholder="Room ID"
            value={joinId}
            onChange={(e) => setJoinId(e.target.value)}
          />

          <button
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700"
            onClick={joinRoom}
          >
            Join Room
          </button>
        </Popup>
      )} */}
    </div>
  );
}

/* Popup Component */
function Popup({ children, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 animate-fadeIn">
      <div className="relative bg-[rgba(20,20,20,0.9)] p-7 rounded-2xl border border-[rgba(99,102,241,0.25)] w-80 shadow-2xl text-center">
        {children}

        <button
          className="absolute top-3 right-4 text-slate-400 hover:text-white"
          onClick={onClose}
        >
          ✕
        </button>
      </div>
    </div>
  );
}
