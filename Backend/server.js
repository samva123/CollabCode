require('dotenv').config();
const express = require("express");
const cors = require("cors");
// const bodyParser = require("body-parser");
const axios = require("axios");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// ----------------- Middleware -----------------
app.use(cors());
app.use(express.json());

// ----------------- Judge0 Setup -----------------
const JUDGE0_URL = "https://judge0-ce.p.rapidapi.com/submissions";
const JUDGE0_HEADERS = {
  "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
  "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
  "Content-Type": "application/json",
};

const languageMap = { javascript: 63, python: 71, cpp: 54, java: 62 };

// ----------------- Helper: Preprocess Code -----------------
const preprocessCode = (language, code) => {
  let processedCode = code;

  switch (language) {
    case "java": {
      const match = code.match(/public\s+class\s+(\w+)/i);
      if (match && match[1] !== "Main") {
        const className = match[1];
        processedCode = code
          .replace(new RegExp(`public\\s+class\\s+${className}\\b`, "g"), "public class Main")
          .replace(new RegExp(`\\b${className}\\s*\\(`, "g"), "Main(");
      }
      break;
    }
    case "cpp": {
      if (!processedCode.includes("#include <iostream>") && /cout|cin/.test(processedCode)) {
        processedCode = "#include <iostream>\n" + processedCode;
      }
      if (!processedCode.includes("using namespace std") && /cout|cin/.test(processedCode)) {
        processedCode = "using namespace std;\n" + processedCode;
      }
      break;
    }
    case "python": {
      processedCode = processedCode.replace(/print\s+([^(])/g, "print($1");
      processedCode = processedCode.replace(/raw_input\s*\(/g, "input(");
      if (/math\.|sqrt/.test(processedCode) && !processedCode.includes("import math")) {
        processedCode = "import math\n" + processedCode;
      }
      if (/random\.|randint/.test(processedCode) && !processedCode.includes("import random")) {
        processedCode = "import random\n" + processedCode;
      }
      if (/sys\./.test(processedCode) && !processedCode.includes("import sys")) {
        processedCode = "import sys\n" + processedCode;
      }
      break;
    }
    case "javascript": {
      if ((processedCode.includes("prompt(") || processedCode.includes("input")) && !processedCode.includes("readline-sync")) {
        processedCode = 'const readlineSync = require("readline-sync");\n' +
                        processedCode.replace(/prompt\s*\(/g, "readlineSync.question(");
      }
      break;
    }
  }

  return processedCode;
};

// ----------------- API: Execute Code -----------------
app.post("/api/execute", async (req, res) => {
  const { language, code, stdin } = req.body;
  const language_id = languageMap[language];
  if (!language_id) return res.status(400).json({ stderr: "Unsupported language" });

  try {
    const processedCode = preprocessCode(language, code);
    const submission = await axios.post(
      `${JUDGE0_URL}?base64_encoded=false&wait=true`,
      { source_code: processedCode, stdin: stdin || "", language_id },
      { headers: JUDGE0_HEADERS }
    );

    const { stdout, stderr, compile_output, status } = submission.data;
    let errorOutput = compile_output || stderr || (status?.id > 3 ? status.description : "");
    
    res.json({
      stdout: stdout || "",
      stderr: errorOutput || "",
      hasError: !!errorOutput,
      status: status?.description || "Completed"
    });
  } catch (err) {
    console.error("Judge0 API Error:", err);
    res.status(500).json({ stdout: "", stderr: err.message || "Unknown error", hasError: true });
  }
});

// ----------------- Socket.IO: Collaboration -----------------
const rooms = {}; // roomId -> { socketId -> username }
const roomCode = {}; // roomId -> latest code
const roomLanguage = {}; // roomId -> latest language

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

socket.on("join-room", ({ roomId, name }) => {
  if (!rooms[roomId]) rooms[roomId] = {};
  rooms[roomId][socket.id] = name || `Guest-${socket.id.slice(0, 5)}`;
  socket.join(roomId);

  // Send existing code and language to new user
  if (roomCode[roomId]) {
    socket.emit("code-update", roomCode[roomId]);
  }
  if (roomLanguage[roomId]) {
    socket.emit("language-update", roomLanguage[roomId]);
  }

  // Emit updated users list to all clients in room
  io.to(roomId).emit("room-users", Object.values(rooms[roomId]));
});


socket.on("code-change", ({ roomId, code }) => {
  roomCode[roomId] = code; // store latest code
  socket.to(roomId).emit("code-update", code);
});

socket.on("language-change", ({ roomId, language }) => {
  roomLanguage[roomId] = language; // store latest language
  socket.to(roomId).emit("language-update", language);
});


  socket.on("disconnect", () => {
    for (const roomId in rooms) {
      if (rooms[roomId][socket.id]) {
        delete rooms[roomId][socket.id];
        io.to(roomId).emit("room-users", Object.values(rooms[roomId]));
      }
    }
    console.log("User disconnected:", socket.id);
  });
});

// ----------------- Start Server -----------------
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
