// import React, { useState } from "react";
// import RoomPage from "./pages/RoomPage.jsx";

// function App() {
//   const [joined, setJoined] = useState(false);
//   const [roomId, setRoomId] = useState("");
//   const [name, setName] = useState("");
//   const [isDark, setIsDark] = useState(true);

//   const joinRoom = () => {
//     if (roomId.trim() && name.trim()) {
//       setJoined(true);
//     }
//   };

//   if (!joined) {
//     return (
//       <div
//         className={`h-screen w-screen flex items-center justify-center ${
//           isDark ? "bg-slate-900 text-slate-100" : "bg-slate-50 text-slate-900"
//         }`}
//       >
//         <div className="w-full max-w-md px-8 py-12 rounded-3xl shadow-2xl border border-gray-700 bg-opacity-80 backdrop-blur-lg">
//           <div className="flex flex-col items-center mb-10">
//             <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
//               <span className="text-2xl font-bold text-white">CC</span>
//             </div>
//             <h1 className="mt-4 text-3xl font-extrabold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
//               CollabCode
//             </h1>
//             <p className="text-sm text-slate-400 mt-2">Real-time code collaboration</p>
//           </div>

//           <input
//             type="text"
//             placeholder="Enter your Name"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             className="w-full px-4 py-3 rounded-lg border border-slate-600 bg-slate-800 text-slate-100 mb-4"
//           />
//           <input
//             type="text"
//             placeholder="Enter Room ID"
//             value={roomId}
//             onChange={(e) => setRoomId(e.target.value)}
//             className="w-full px-4 py-3 rounded-lg border border-slate-600 bg-slate-800 text-slate-100 mb-6"
//           />
//           <button
//             onClick={joinRoom}
//             className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-semibold"
//           >
//             Join Room
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // once joined → go to RoomPage
//   return <RoomPage roomId={roomId} name={name} isDark={isDark} setIsDark={setIsDark} />;
// }

// export default App;



















import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import EntryPage from "./pages/EntryPage.jsx";
import RoomPage from "./pages/RoomPage.jsx";
import LandingPage from "./pages/LandingPage.jsx";

function App() {
  const [isDark, setIsDark] = useState(true);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage isDark={isDark} setIsDark={setIsDark} />} />
        <Route path="/entrypage" element={<EntryPage isDark={isDark} setIsDark={setIsDark} />} />
        <Route path="/room/:roomId" element={<RoomPage isDark={isDark} setIsDark={setIsDark} />} />
      </Routes>
    </Router>
  );
}

export default App;
