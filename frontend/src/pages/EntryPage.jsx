import React, { useState } from "react";
import { Code, Sun, Moon } from "lucide-react";
import { useNavigate } from "react-router-dom";

//function EntryPage({ onJoin }) {
function EntryPage({ isDark, setIsDark }) {

  const [name, setName] = useState("");
  const [roomId, setRoomId] = useState("");
  //const [isDark, setIsDark] = useState(true);
  const navigate = useNavigate();

  const theme = {
    light: {
      bg: "bg-slate-50",
      text: "text-slate-900",
      inputBg: "bg-white",
      inputBorder: "border-slate-300",
      btnBg: "bg-blue-600 hover:bg-blue-700",
      btnText: "text-white",
    },
    dark: {
      bg: "bg-slate-900",
      text: "text-slate-100",
      inputBg: "bg-slate-800",
      inputBorder: "border-slate-700",
      btnBg: "bg-blue-600 hover:bg-blue-700",
      btnText: "text-white",
    },
  };

  const currentTheme = isDark ? theme.dark : theme.light;

  // const handleJoin = () => {
  //   if (name.trim() && roomId.trim()) {
  //     onJoin({ name, roomId });
  //   }
  // };
   const handleJoin = () => {
    if (!name.trim()) return alert("Enter your name");
    const id = roomId.trim() || Math.random().toString(36).substring(2, 8);
    navigate(`/room/${id}`, { state: { name } });
  };

  return (
    <div
      className={`h-screen w-screen flex items-center justify-center ${currentTheme.bg} ${currentTheme.text} transition-colors duration-500`}
    >
      <div className="w-full max-w-md px-8 py-12 rounded-3xl shadow-2xl border border-gray-700 bg-opacity-80 backdrop-blur-lg">
        {/* Branding */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-3 shadow-lg">
            <Code className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 bg-clip-text text-transparent mb-2 text-center">
            CodeCollab
          </h1>
          <p className="text-sm text-center text-slate-400">
            Real-time collaborative coding with impact
          </p>
        </div>

        {/* Form Inputs */}
        <div className="flex flex-col space-y-4">
          <input
            type="text"
            placeholder="Enter Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`px-4 py-3 rounded-xl text-sm outline-none border ${currentTheme.inputBorder} ${currentTheme.inputBg} text-slate-100 placeholder-slate-400`}
          />
          <input
            type="text"
            placeholder="Enter Room ID"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            className={`px-4 py-3 rounded-xl text-sm outline-none border ${currentTheme.inputBorder} ${currentTheme.inputBg} text-slate-100 placeholder-slate-400`}
          />
          <button
            onClick={handleJoin}
            className={`w-full py-3 rounded-xl font-semibold ${currentTheme.btnBg} ${currentTheme.btnText} transition-all duration-300 transform hover:scale-105`}
          >
            Join Room
          </button>
        </div>

        {/* Footer / Theme toggle */}
        <div className="flex justify-center mt-6">
          <button
            onClick={() => setIsDark(!isDark)}
            className="p-2 rounded-full border border-gray-500 hover:bg-gray-700 transition-all"
            title="Toggle theme"
          >
            {isDark ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-blue-400" />}
          </button>
        </div>
      </div>
    </div>
  );
}

export default EntryPage;
