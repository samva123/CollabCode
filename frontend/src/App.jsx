// import React, { useState, useEffect } from "react";
// import { Sun, Moon, Play, Code, Terminal, Upload, Download, Copy, Check } from "lucide-react";

// function App() {
//   const [language, setLanguage] = useState("javascript");
//   const [code, setCode] = useState("// Write your code here\nconsole.log('Hello, World!');");
//   const [input, setInput] = useState("");
//   const [output, setOutput] = useState("");
//   const [isRunning, setIsRunning] = useState(false);
//   const [isDark, setIsDark] = useState(true);
//   const [copied, setCopied] = useState(false);

//   // Language configurations
//   const languages = [
//     { value: "javascript", label: "JavaScript", icon: "🟨" },
//     { value: "python", label: "Python", icon: "🐍" },
//     { value: "cpp", label: "C++", icon: "⚡" },
//     { value: "java", label: "Java", icon: "☕" }
//   ];

//   const handleRun = async () => {
//     setIsRunning(true);
//     setOutput("Running...");
    
//     try {
//       const response = await fetch("http://localhost:5000/api/execute", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           language,
//           code,
//           stdin: input,
//         }),
//       });

//       const res = await response.json();

//       if (res.stdout) {
//         setOutput(res.stdout);
//       } else if (res.stderr) {
//         setOutput(`Error:\n${res.stderr}`);
//       } else {
//         setOutput("No output received");
//       }
//     } catch (err) {
//       setOutput(`Connection Error: ${err.message}\nMake sure your backend server is running on port 5000.`);
//     } finally {
//       setIsRunning(false);
//     }
//   };

//   const copyToClipboard = async () => {
//     try {
//       await navigator.clipboard.writeText(output);
//       setCopied(true);
//       setTimeout(() => setCopied(false), 2000);
//     } catch (err) {
//       console.error('Failed to copy:', err);
//     }
//   };

//   const downloadCode = () => {
//     const extension = language === 'cpp' ? 'cpp' : language === 'python' ? 'py' : language === 'java' ? 'java' : 'js';
//     const blob = new Blob([code], { type: 'text/plain' });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = `code.${extension}`;
//     a.click();
//     URL.revokeObjectURL(url);
//   };

//   const uploadFile = () => {
//     const input = document.createElement('input');
//     input.type = 'file';
//     input.accept = '.js,.py,.cpp,.java,.txt';
//     input.onchange = (e) => {
//       const file = e.target.files[0];
//       if (file) {
//         const reader = new FileReader();
//         reader.onload = (e) => setCode(e.target.result);
//         reader.readAsText(file);
//       }
//     };
//     input.click();
//   };

//   // Theme configuration
//   const theme = {
//     light: {
//       bg: "bg-slate-50",
//       headerBg: "bg-white",
//       cardBg: "bg-white",
//       border: "border-slate-200",
//       text: "text-slate-900",
//       textSecondary: "text-slate-600",
//       inputBg: "bg-slate-50",
//       outputBg: "bg-slate-900",
//       outputText: "text-green-400",
//       shadow: "shadow-lg shadow-slate-200/50"
//     },
//     dark: {
//       bg: "bg-slate-900",
//       headerBg: "bg-slate-800/90",
//       cardBg: "bg-slate-800",
//       border: "border-slate-700",
//       text: "text-slate-100",
//       textSecondary: "text-slate-400",
//       inputBg: "bg-slate-900",
//       outputBg: "bg-black",
//       outputText: "text-green-400",
//       shadow: "shadow-lg shadow-black/25"
//     }
//   };

//   const currentTheme = isDark ? theme.dark : theme.light;

//   return (
//     <div className={`h-screen w-screen flex flex-col ${currentTheme.bg} ${currentTheme.text} transition-colors duration-300`}>
//       {/* Professional Header */}
//       <header className={`${currentTheme.headerBg} ${currentTheme.border} border-b backdrop-blur-sm ${currentTheme.shadow}`}>
//         <div className="px-6 py-4">
//           <div className="flex justify-between items-center">
//             {/* Logo and Title */}
//             <div className="flex items-center space-x-3">
//               <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
//                 <Code className="w-5 h-5 text-white" />
//               </div>
//               <div>
//                 <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
//                   CollabCode
//                 </h1>
//                 <p className={`text-xs ${currentTheme.textSecondary}`}>Real-time collaborative editor</p>
//               </div>
//             </div>

//             {/* Controls */}
//             <div className="flex items-center space-x-4">
//               {/* Language Selector */}
//               <div className="flex items-center space-x-2">
//                 <label className={`text-sm font-medium ${currentTheme.textSecondary}`}>Language:</label>
//                 <select
//                   value={language}
//                   onChange={(e) => setLanguage(e.target.value)}
//                   className={`px-3 py-2 rounded-lg ${currentTheme.inputBg} ${currentTheme.border} border text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
//                 >
//                   {languages.map((lang) => (
//                     <option key={lang.value} value={lang.value}>
//                       {lang.icon} {lang.label}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               {/* Action Buttons */}
//               <div className="flex items-center space-x-2">
//                 <button
//                   onClick={uploadFile}
//                   className={`p-2 rounded-lg ${currentTheme.inputBg} ${currentTheme.border} border hover:bg-slate-700 transition-colors`}
//                   title="Upload file"
//                 >
//                   <Upload className="w-4 h-4" />
//                 </button>
                
//                 <button
//                   onClick={downloadCode}
//                   className={`p-2 rounded-lg ${currentTheme.inputBg} ${currentTheme.border} border hover:bg-slate-700 transition-colors`}
//                   title="Download code"
//                 >
//                   <Download className="w-4 h-4" />
//                 </button>

//                 <button
//                   onClick={() => setIsDark(!isDark)}
//                   className={`p-2 rounded-lg ${currentTheme.inputBg} ${currentTheme.border} border hover:bg-slate-700 transition-all`}
//                   title="Toggle theme"
//                 >
//                   {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
//                 </button>

//                 <button
//                   onClick={handleRun}
//                   disabled={isRunning}
//                   className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 disabled:from-gray-500 disabled:to-gray-600 text-white px-6 py-2 rounded-lg font-semibold flex items-center space-x-2 transition-all transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
//                 >
//                   <Play className="w-4 h-4" />
//                   <span>{isRunning ? "Running..." : "Run Code"}</span>
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Main Content Area */}
//       <div className="flex flex-1 overflow-hidden">
//         {/* Code Editor Panel */}
//         <div className="flex-1 flex flex-col">
//           <div className={`${currentTheme.headerBg} px-4 py-2 ${currentTheme.border} border-b flex items-center justify-between`}>
//             <div className="flex items-center space-x-2">
//               <Code className="w-4 h-4" />
//               <span className="text-sm font-medium">Editor</span>
//               <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" title="Live collaboration"></div>
//             </div>
//           </div>
          
//           <div className="flex-1 relative">
//             {/* Monaco Editor Placeholder */}
//             <div className={`h-full ${isDark ? 'bg-slate-900' : 'bg-white'} relative border-2 border-dashed ${currentTheme.border} rounded-lg m-4`}>
//               <div className="absolute inset-0 flex items-center justify-center">
//                 <div className="text-center">
//                   <Code className="w-12 h-12 mx-auto mb-4 text-slate-400" />
//                   <p className="text-slate-400 font-medium">Monaco Editor</p>
//                   <p className="text-xs text-slate-500 mt-1">
//                     Replace this placeholder with Monaco Editor component
//                   </p>
//                 </div>
//               </div>
              
//               {/* Simulated code content */}
//               <div className={`absolute top-4 left-4 right-4 bottom-4 ${isDark ? 'bg-slate-800' : 'bg-slate-50'} rounded font-mono text-sm p-4 overflow-hidden`}>
//                 <div className="flex items-center space-x-2 mb-3 pb-2 border-b border-slate-600">
//                   <div className="w-3 h-3 bg-red-500 rounded-full"></div>
//                   <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
//                   <div className="w-3 h-3 bg-green-500 rounded-full"></div>
//                   <span className="ml-4 text-xs text-slate-400">code.{language === 'cpp' ? 'cpp' : language === 'python' ? 'py' : language === 'java' ? 'java' : 'js'}</span>
//                 </div>
//                 <textarea
//                   value={code}
//                   onChange={(e) => setCode(e.target.value)}
//                   className={`w-full h-full ${isDark ? 'bg-slate-800 text-slate-100' : 'bg-slate-50 text-slate-900'} resize-none outline-none font-mono text-sm`}
//                   placeholder="// Write your code here..."
//                 />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Input/Output Panel */}
//         <div className={`w-96 flex flex-col ${currentTheme.cardBg} ${currentTheme.border} border-l`}>
//           {/* Input Section */}
//           <div className="flex-1 flex flex-col">
//             <div className={`px-4 py-2 ${currentTheme.border} border-b flex items-center space-x-2`}>
//               <Terminal className="w-4 h-4" />
//               <span className="text-sm font-medium">Input (stdin)</span>
//             </div>
            
//             <textarea
//               placeholder="Enter input for your program here..."
//               className={`flex-1 p-4 ${currentTheme.inputBg} text-sm outline-none resize-none font-mono placeholder-slate-500`}
//               value={input}
//               onChange={(e) => setInput(e.target.value)}
//             />
//           </div>

//           {/* Output Section */}
//           <div className="flex-1 flex flex-col">
//             <div className={`px-4 py-2 ${currentTheme.border} border-b flex items-center justify-between`}>
//               <div className="flex items-center space-x-2">
//                 <Terminal className="w-4 h-4" />
//                 <span className="text-sm font-medium">Output</span>
//                 {isRunning && (
//                   <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
//                 )}
//               </div>
              
//               {output && !isRunning && (
//                 <button
//                   onClick={copyToClipboard}
//                   className={`p-1 rounded hover:bg-slate-700 transition-colors`}
//                   title="Copy output"
//                 >
//                   {copied ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
//                 </button>
//               )}
//             </div>
            
//             <div className={`flex-1 p-4 ${currentTheme.outputBg} ${currentTheme.outputText} font-mono text-sm overflow-auto whitespace-pre-wrap`}>
//               {output || (
//                 <span className="text-slate-500 italic">
//                   Program output will appear here...
//                   <br />
//                   <br />
//                   💡 Tip: Click "Run Code" to execute your program
//                 </span>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Status Bar */}
//       <footer className={`${currentTheme.headerBg} px-6 py-2 ${currentTheme.border} border-t flex items-center justify-between text-xs ${currentTheme.textSecondary}`}>
//         <div className="flex items-center space-x-4">
//           <span>Language: {languages.find(l => l.value === language)?.label}</span>
//           <span>•</span>
//           <span>Characters: {code.length}</span>
//           <span>•</span>
//           <span>Lines: {code.split('\n').length}</span>
//         </div>
        
//         <div className="flex items-center space-x-4">
//           <div className="flex items-center space-x-1">
//             <div className="w-2 h-2 bg-green-500 rounded-full"></div>
//             <span>Connected</span>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// }

// export default App;




































































import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import io from "socket.io-client";
import axios from "axios";
import {
  Sun,
  Moon,
  Play,
  Code,
  Terminal,
  Upload,
  Download,
  Copy,
  Check,
} from "lucide-react";

const socket = io("http://localhost:8000");

function App() {
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState("// Write your code here\n");
  const [stdin, setStdin] = useState("");
  const [output, setOutput] = useState("");
  const [roomId, setRoomId] = useState("");
  const [joined, setJoined] = useState(false);
  const [usersCount, setUsersCount] = useState(1);
  const [isDark, setIsDark] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [copied, setCopied] = useState(false);

  // ✅ new state for name
  const [name, setName] = useState("");
  const [messages, setMessages] = useState([]);

  // ---- Socket listeners ----
  useEffect(() => {
    socket.on("code-update", (newCode) => setCode(newCode));
    socket.on("language-update", (newLang) => setLanguage(newLang));
    socket.on("room-users", (count) => setUsersCount(count));

    // ✅ listen for join/leave messages
    socket.on("user-joined", (userName) => {
      setMessages((prev) => [...prev, `${userName} joined`]);
    });
    socket.on("user-left", (userName) => {
      setMessages((prev) => [...prev, `${userName} left`]);
    });

    return () => {
      socket.off("code-update");
      socket.off("language-update");
      socket.off("room-users");
      socket.off("user-joined");
      socket.off("user-left");
    };
  }, []);

  // ---- Handle code changes ----
  const handleCodeChange = (newCode) => {
    setCode(newCode);
    if (joined) {
      socket.emit("code-change", { roomId, code: newCode });
    }
  };

  // ---- Handle language change ----
  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setLanguage(newLang);
    if (joined) {
      socket.emit("language-change", { roomId, language: newLang });
    }
  };

  // ---- Run Code ----
  const runCode = async () => {
    setIsRunning(true);
    setOutput("Running...");

    try {

      const res = await axios.post("http://localhost:8000/api/execute", {
        language,
        code,
        stdin,

      

      });
      setOutput(res.data.stdout || res.data.stderr || "No output");
    } catch (err) {
      setOutput(`Error: ${err.message}`);



    } finally {
      setIsRunning(false);
    }
  };

  // ---- Copy output ----
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  // ---- File download ----
  const downloadCode = () => {
    const extension =
      language === "cpp"
        ? "cpp"
        : language === "python"
        ? "py"
        : language === "java"
        ? "java"
        : "js";
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `code.${extension}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ---- File upload ----
  const uploadFile = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".js,.py,.cpp,.java,.txt";
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => setCode(e.target.result);
        reader.readAsText(file);
      }
    };
    input.click();
  };

  // ---- Join Room ----
  const joinRoom = () => {
    if (roomId.trim() === "" || name.trim() === "") return;
    socket.emit("join-room", { roomId, name }); // ✅ send name also
    setJoined(true);
  };

  // ---- Theme config ----
  const theme = {
    light: {
      bg: "bg-slate-50",
      headerBg: "bg-white",
      cardBg: "bg-white",
      border: "border-slate-200",
      text: "text-slate-900",
      textSecondary: "text-slate-600",
      inputBg: "bg-slate-50",
      outputBg: "bg-slate-900",
      outputText: "text-green-400",
      shadow: "shadow-lg shadow-slate-200/50",
    },
    dark: {
      bg: "bg-slate-900",
      headerBg: "bg-slate-800/90",
      cardBg: "bg-slate-800",
      border: "border-slate-700",
      text: "text-slate-100",
      textSecondary: "text-slate-400",
      inputBg: "bg-slate-900",
      outputBg: "bg-black",
      outputText: "text-green-400",
      shadow: "shadow-lg shadow-black/25",
    },
  };
  const currentTheme = isDark ? theme.dark : theme.light;

  return (
    <div
      className={`h-screen w-screen flex flex-col ${currentTheme.bg} ${currentTheme.text}`}
    >
      {/* ---- Header ---- */}
      <header
        className={`${currentTheme.headerBg} ${currentTheme.border} border-b px-6 py-3 flex justify-between items-center`}
      >
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Code className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              CollabCode
            </h1>
            <p className={`text-xs ${currentTheme.textSecondary}`}>
              Real-time collaborative editor
            </p>
          </div>
        </div>

        {/* Room Controls */}
        <div className="flex items-center space-x-3">
          {/* ✅ Name input */}
          {!joined && (
            <input
              type="text"
              placeholder="Enter your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`px-3 py-2 rounded-lg text-sm ${currentTheme.inputBg} ${currentTheme.border} border`}
            />
          )}
          <input
            type="text"
            placeholder="Enter Room ID"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            disabled={joined}
            className={`px-3 py-2 rounded-lg text-sm ${currentTheme.inputBg} ${currentTheme.border} border`}
          />
          <button
            onClick={joinRoom}
            disabled={joined}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
          >
            {joined ? "Joined" : "Join"}
          </button>
          {joined && (
            <span className={`text-sm ${currentTheme.textSecondary}`}>
              Users: {usersCount}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          {/* Language Dropdown */}
          <select
            value={language}
            onChange={handleLanguageChange}
            className={`px-2 py-1 rounded-lg text-sm ${currentTheme.inputBg} ${currentTheme.border} border`}
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="cpp">C++</option>
            <option value="java">Java</option>
          </select>

          <button
            onClick={uploadFile}
            className={`p-2 rounded-lg ${currentTheme.inputBg} ${currentTheme.border} border`}
            title="Upload file"
          >
            <Upload className="w-4 h-4" />
          </button>
          <button
            onClick={downloadCode}
            className={`p-2 rounded-lg ${currentTheme.inputBg} ${currentTheme.border} border`}
            title="Download code"
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsDark(!isDark)}
            className={`p-2 rounded-lg ${currentTheme.inputBg} ${currentTheme.border} border`}
            title="Toggle theme"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <button
            onClick={runCode}
            disabled={isRunning}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-lg text-sm"
          >
            <Play className="w-4 h-4 inline mr-2" />
            {isRunning ? "Running..." : "Run"}
          </button>
        </div>
      </header>

      {/* ---- Main Area ---- */}
      <div className="flex flex-1 overflow-hidden">
        {/* Code Editor */}
        <div className="flex-1 flex flex-col">
          <Editor
            height="100%"
            theme={isDark ? "vs-dark" : "light"}
            language={language}
            value={code}
            onChange={handleCodeChange}
            options={{
              fontSize: 14,
              minimap: { enabled: false },
            }}
          />
        </div>

        {/* Input / Output */}
        <div
          className={`w-96 flex flex-col ${currentTheme.cardBg} ${currentTheme.border} border-l`}
        >
          {/* Input */}
          <div className="flex-1 flex flex-col">
            <div
              className={`px-4 py-2 ${currentTheme.border} border-b flex items-center space-x-2`}
            >
              <Terminal className="w-4 h-4" />
              <span className="text-sm font-medium">Input (stdin)</span>
            </div>
            <textarea
              value={stdin}
              onChange={(e) => setStdin(e.target.value)}
              placeholder="Enter input here..."
              className={`flex-1 p-3 ${currentTheme.inputBg} text-sm font-mono outline-none resize-none`}
            />
          </div>

          {/* Output */}
          <div className="flex-1 flex flex-col">
            <div
              className={`px-4 py-2 ${currentTheme.border} border-b flex justify-between items-center`}
            >
              <div className="flex items-center space-x-2">
                <Terminal className="w-4 h-4" />
                <span className="text-sm font-medium">Output</span>
              </div>
              {output && !isRunning && (
                <button
                  onClick={copyToClipboard}
                  className="p-1 rounded hover:bg-slate-700"
                  title="Copy output"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              )}
            </div>
            <div
              className={`flex-1 p-3 font-mono text-sm overflow-auto whitespace-pre-wrap ${currentTheme.outputBg} ${currentTheme.outputText}`}
            >
              {output || (
                <span className="text-slate-500 italic">
                  Program output will appear here...
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ✅ Show join/leave messages */}
      {joined && (
        <div className="px-6 py-2 text-sm border-t">
          {messages.map((m, i) => (
            <div key={i}>{m}</div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;











