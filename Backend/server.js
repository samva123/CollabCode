// const express = require("express");
// const cors = require("cors");
// const bodyParser = require("body-parser");
// const { exec } = require("child_process");
// const fs = require("fs");

// const app = express();
// app.use(cors());
// app.use(bodyParser.json());

// app.post("/api/execute", (req, res) => {
//   const { language, code, stdin } = req.body;

//   let file, cmd;
//   switch (language) {
//     case "javascript":
//       file = "Main.js";
//       fs.writeFileSync(file, code);
//       cmd = `node ${file}`;
//       break;

//     case "python":
//       file = "Main.py";
//       fs.writeFileSync(file, code);
//       cmd = `python ${file}`;
//       break;

//     case "cpp":
//       file = "main.cpp";
//       fs.writeFileSync(file, code);
//       if (process.platform === "win32") {
//         cmd = `g++ ${file} -o main && main.exe`; // ✅ Windows
//       } else {
//         cmd = `g++ ${file} -o main && ./main`;   // ✅ Linux / Mac
//       }
//       break;

//     case "java":
//       file = "Main.java";
//       fs.writeFileSync(file, code);
//       cmd = `javac Main.java && java Main`;
//       break;

//     default:
//       return res.status(400).json({ stderr: "Unsupported language" });
//   }

//   const child = exec(cmd, (error, stdout, stderr) => {
//     if (error) {
//       console.error("Execution error:", error.message);
//       return res.status(500).json({ stderr: stderr || error.message });
//     }
//     res.json({ stdout, stderr });
//   });

//   if (stdin && child.stdin) {
//     child.stdin.write(stdin + "\n");
//     child.stdin.end();
//   }

//   child.on("error", (err) => {
//     console.error("Child process error:", err);
//   });
// });

// app.listen(5000, () => {
//   console.log("Server running on http://localhost:5000");
// });














const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const JUDGE0_URL = "https://judge0-ce.p.rapidapi.com/submissions";
const JUDGE0_HEADERS = {
  "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
  "X-RapidAPI-Key": "2e6dd3f663msh9d5b0202fbaa75fp1f956djsn7e9c8a113562", // Replace with your RapidAPI key
  "Content-Type": "application/json",
};

const languageMap = {
  javascript: 63, // Node.js
  python: 71,     // Python 3
  cpp: 54,        // C++ (G++)
  java: 62,       // Java
};

app.post("/api/execute", async (req, res) => {
  const { language, code, stdin } = req.body;

  const language_id = languageMap[language];
  if (!language_id) return res.status(400).json({ stderr: "Unsupported language" });

  try {
    // 1. Create submission
    const submission = await axios.post(
      `${JUDGE0_URL}?base64_encoded=false&wait=true`,
      {
        source_code: code,
        stdin: stdin || "",
        language_id,
      },
      { headers: JUDGE0_HEADERS }
    );

    const { stdout, stderr, compile_output } = submission.data;

    res.json({
      stdout: stdout || "",
      stderr: stderr || compile_output || "",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ stderr: err.message });
  }
});

app.listen(8000, () => {
  console.log("Server running on http://localhost:8000");
});



// const axios = require("axios");

// axios.get("https://judge0-ce.p.rapidapi.com/about", {
//   headers: {
//     "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
//     "X-RapidAPI-Key": "2e6dd3f663msh9d5b0202fbaa75fp1f956djsn7e9c8a113562"
//   }
// })
// .then(res => console.log(res.data))
// .catch(err => console.error(err));
