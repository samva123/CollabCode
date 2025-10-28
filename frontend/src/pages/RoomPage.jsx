import React, { useState, useEffect, useRef } from "react";
import { useLocation , useParams } from "react-router-dom";
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
  AlertCircle,
} from "lucide-react";

const socket = io(import.meta.env.VITE_BACKEND_URL);


function RoomPage({  isDark , setIsDark }) {
  // ------------------ STATES ------------------
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState("// Write your code here\n");
  const [stdin, setStdin] = useState("");
  const [output, setOutput] = useState("");
  const location = useLocation();
  const { roomId: paramRoomId } = useParams();          // gets roomId from URL
  const { name: stateName } = location.state || {};     // gets name from navigate state

  const [roomId, setRoomId] = useState(paramRoomId || "");
  const [name, setName] = useState(stateName || "");

  const [joined, setJoined] = useState(false);
  const [usersCount, setUsersCount] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [copied, setCopied] = useState(false);
  const [hasError, setHasError] = useState(false);

  const [messages, setMessages] = useState([]);
  const [roomUsers, setRoomUsers] = useState([]); // array of user names

  const editorRef = useRef(null);
  const monacoRef = useRef(null);

  // ------------------ SOCKET EFFECT ------------------
  useEffect(() => {
    // Wire up server events
    socket.on("code-update", setCode);
    socket.on("language-update", setLanguage);

    // room-users can be an array (preferred) or sometimes something else;
    // we handle both shapes defensively
    socket.on("room-users", (payload) => {
      if (Array.isArray(payload)) {
        setRoomUsers(payload);
        setUsersCount(payload.length);
      } else if (payload && Array.isArray(payload.users)) {
        setRoomUsers(payload.users);
        setUsersCount(payload.users.length);
      } else if (typeof payload === "number") {
        // legacy: server might have emitted a count
        setUsersCount(payload);
      } else {
        // unknown shape — leave as-is
        console.warn("room-users payload shape unknown:", payload);
      }
    });

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

  // // If an entry page provided name and roomId, auto-join on mount
  // useEffect(() => {
  //   if (!joined && initialRoomId && initialName) {
  //     socket.emit("join-room", { roomId: initialRoomId, name: initialName });
  //     setJoined(true);
  //     // ensure local state mirrors props
  //     setRoomId(initialRoomId);
  //     setName(initialName);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [initialRoomId, initialName]);

  useEffect(() => {
  if (!joined && roomId && name) {
    socket.emit("join-room", { roomId, name });
    setJoined(true);
  }
}, [roomId, name, joined]);


  // ------------------ ERROR HANDLING ------------------
  const parseErrorLine = (errorText, language) => {
    const lines = errorText.split("\n");
    const errorLines = [];

    for (const line of lines) {
      let lineNumber = null;
      if (language === "javascript") {
        const match = line.match(/at.*:(\d+):\d+/);
        if (match) lineNumber = parseInt(match[1], 10);
      } else if (language === "python") {
        const match = line.match(/File ".*", line (\d+)/);
        if (match) lineNumber = parseInt(match[1], 10);
      } else if (language === "cpp") {
        const match = line.match(/main\.cpp:(\d+):\d+:/);
        if (match) lineNumber = parseInt(match[1], 10);
      } else if (language === "java") {
        const match = line.match(/Main\.java:(\d+):/);
        if (match) lineNumber = parseInt(match[1], 10);
      }
      if (lineNumber && !errorLines.includes(lineNumber)) errorLines.push(lineNumber);
    }
    return errorLines;
  };

  const addErrorDecorations = (errorLines) => {
    if (!editorRef.current || !monacoRef.current || errorLines.length === 0) return;

    const decorations = errorLines.map((lineNumber) => ({
      range: new monacoRef.current.Range(lineNumber, 1, lineNumber, 1),
      options: {
        isWholeLine: true,
        className: "error-line",
        glyphMarginClassName: "error-glyph",
      },
    }));

    editorRef.current.deltaDecorations([], decorations);

    if (!document.getElementById("error-styles")) {
      const style = document.createElement("style");
      style.id = "error-styles";
      style.textContent = `
        .error-line { border-bottom: 2px wavy red !important; }
        .error-glyph:after { content: "⚠"; color: red; position: absolute; left: 2px; }
      `;
      document.head.appendChild(style);
    }
  };

  const clearErrorDecorations = () => {
    if (editorRef.current) {
      try {
        const model = editorRef.current.getModel();
        if (model) {
          editorRef.current.deltaDecorations(editorRef.current.getModel().getAllDecorations(), []);
        }
      } catch (e) {
        // silent
      }
    }
    setHasError(false);
  };

  const updateMarkers = (errorLines) => {
    if (!monacoRef.current || !editorRef.current) return;

    const markers = errorLines.map((lineNumber) => ({
      startLineNumber: lineNumber,
      startColumn: 1,
      endLineNumber: lineNumber,
      endColumn: 1000,
      message: "Syntax/Error detected",
      severity: monacoRef.current.MarkerSeverity.Error,
    }));

    monacoRef.current.editor.setModelMarkers(editorRef.current.getModel(), "owner", markers);
  };

  // ------------------ EDITOR ------------------
  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
  };

  const handleCodeChange = (newCode) => {
    setCode(newCode);

    if (language === "javascript") {
      try {
        new Function(newCode);
        updateMarkers([]);
        setHasError(false);
      } catch (err) {
        const lineMatch = err?.stack?.match?.(/<anonymous>:(\d+):\d+/);
        if (lineMatch) updateMarkers([parseInt(lineMatch[1], 10)]);
        setHasError(true);
      }
    } else {
      clearErrorDecorations();
    }

    if (joined) socket.emit("code-change", { roomId, code: newCode });
  };

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setLanguage(newLang);
    clearErrorDecorations();
    if (joined) socket.emit("language-change", { roomId, language: newLang });
  };

  // ------------------ FILE HANDLING ------------------
  const uploadFile = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".js,.py,.cpp,.java,.txt";
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          setCode(reader.result);
          clearErrorDecorations();
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const downloadCode = () => {
    const extension = language === "cpp" ? "cpp" : language === "python" ? "py" : language === "java" ? "java" : "js";
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `code.${extension}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ------------------ CODE EXECUTION ------------------
  const runCode = async () => {
    setIsRunning(true);
    setOutput("Running...");
    clearErrorDecorations();

    try {
      const res = await axios.post("http://localhost:8000/api/execute", { language, code, stdin });
      const outputText = res.data.stdout || res.data.stderr || "No output";
      setOutput(outputText);

      if (res.data.stderr && res.data.stderr.trim()) {
        setHasError(true);
        const errorLines = parseErrorLine(res.data.stderr, language);
        if (errorLines.length) addErrorDecorations(errorLines);
      }
    } catch (err) {
      const errorMessage = `Error: ${err.message}`;
      setOutput(errorMessage);
      setHasError(true);

      if (err.response?.data?.stderr) {
        const errorLines = parseErrorLine(err.response.data.stderr, language);
        if (errorLines.length) addErrorDecorations(errorLines);
      }
    } finally {
      setIsRunning(false);
    }
  };

  // ------------------ OTHER ------------------
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  // NOTE: join controls are commented out in header UI (per your request),
  // but keep function to allow auto-join or manual join if needed:
  const joinRoom = () => {
    if (!roomId.trim() || !name.trim()) return;
    socket.emit("join-room", { roomId, name });
    setJoined(true);
  };

  // ------------------ THEMES ------------------
  const theme = {
    light: {
      bg: "bg-slate-50", headerBg: "bg-white", cardBg: "bg-white", border: "border-slate-200",
      text: "text-slate-900", textSecondary: "text-slate-600", inputBg: "bg-slate-50",
      outputBg: "bg-slate-900", outputText: "text-green-400",
    },
    dark: {
      bg: "bg-slate-900", headerBg: "bg-slate-800/90", cardBg: "bg-slate-800", border: "border-slate-700",
      text: "text-slate-100", textSecondary: "text-slate-400", inputBg: "bg-slate-900",
      outputBg: "bg-black", outputText: "text-green-400",
    },
  };
  //const currentTheme = initialDark ? theme.dark : theme.light;
  const currentTheme = isDark ? theme.dark : theme.light;


  const getColor = (name) => {
    // deterministic simple color selection
    const colors = ["#6366F1", "#EC4899", "#F97316", "#10B981", "#3B82F6", "#8B5CF6", "#F43F5E"];
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = (hash << 5) - hash + name.charCodeAt(i);
    return colors[Math.abs(hash) % colors.length];
  };

  // ------------------ JSX ------------------
  return (
    <div className={`h-screen w-screen flex flex-col ${currentTheme.bg} ${currentTheme.text}`}>
      {/* HEADER */}
      <header className={`${currentTheme.headerBg} ${currentTheme.border} border-b px-6 py-3 flex justify-between items-center`}>
        {/* Logo + Title */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Code className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              CollabCode
            </h1>
            <p className={`text-xs ${currentTheme.textSecondary}`}>Real-time collaborative editor</p>
          </div>
          {hasError && (
            <div className="flex items-center space-x-1 bg-red-100 text-red-700 px-2 py-1 rounded-md text-xs">
              <AlertCircle className="w-3 h-3" />
              <span>Errors detected</span>
            </div>
          )}
        </div>

        {/* Controls + User Avatars */}
        <div className="flex items-center space-x-2">
          {/* --- USER AVATARS (left of select) --- */}
          {/* --- USER AVATARS (left of select) --- */}
<div className="flex flex-wrap items-center space-x-2 max-w-xs">
  {roomUsers.length === 0 ? (
    <div className="text-xs text-slate-400 italic pr-2">No users</div>
  ) : (
    roomUsers.map((user, idx) => (
      <div key={idx} className="group relative m-1">
        <div
          title={user}
          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold cursor-pointer"
          style={{ backgroundColor: getColor(user) }}
        >
          {String(user || "?").charAt(0).toUpperCase()}
        </div>
        <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-8 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all bg-gray-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-50">
          {user}
        </div>
      </div>
    ))
  )}
</div>

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

          <button onClick={uploadFile} className={`p-2 rounded-lg ${currentTheme.inputBg} ${currentTheme.border} border`} title="Upload file">
            <Upload className="w-4 h-4" />
          </button>
          <button onClick={downloadCode} className={`p-2 rounded-lg ${currentTheme.inputBg} ${currentTheme.border} border`} title="Download code">
            <Download className="w-4 h-4" />
          </button>
          <button onClick={() => setIsDark(!isDark)} className={`p-2 rounded-lg ${currentTheme.inputBg} ${currentTheme.border} border`} title="Toggle theme">
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <button onClick={runCode} disabled={isRunning} className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-lg text-sm">
            <Play className="w-4 h-4 inline mr-2" />
            {isRunning ? "Running..." : "Run"}
          </button>
        </div>
      </header>

      {/* MAIN EDITOR + INPUT/OUTPUT */}
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 flex flex-col">
          <Editor
            height="100%"
            theme={isDark ? "vs-dark" : "light"}
            language={language}
            value={code}
            onChange={handleCodeChange}
            onMount={handleEditorDidMount}
            options={{
              fontSize: 14,
              minimap: { enabled: true },
              scrollBeyondLastLine: false,
              automaticLayout: true,
              glyphMargin: true,
              lineNumbers: "on",
              renderLineHighlight: "all",
            }}
          />
        </div>

        <div className={`w-96 flex flex-col ${currentTheme.cardBg} ${currentTheme.border} border-l`}>
          <div className="flex-1 flex flex-col">
            <div className={`px-4 py-2 ${currentTheme.border} border-b flex items-center space-x-2`}>
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

          <div className="flex-1 flex flex-col">
            <div className={`px-4 py-2 ${currentTheme.border} border-b flex justify-between items-center`}>
              <div className="flex items-center space-x-2">
                <Terminal className="w-4 h-4" />
                <span className="text-sm font-medium">Output</span>
                {hasError && <AlertCircle className="w-4 h-4 text-red-500" />}
              </div>
              {output && !isRunning && (
                <button onClick={copyToClipboard} className="p-1 rounded hover:bg-slate-700" title="Copy output">
                  {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </button>
              )}
            </div>
            <div className={`flex-1 p-3 font-mono text-sm overflow-auto whitespace-pre-wrap ${currentTheme.outputBg} ${hasError ? "text-red-400" : currentTheme.outputText}`}>
              {output || <span className="text-slate-500 italic">Program output will appear here...</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      {joined && (
        <div className="px-6 py-2 text-sm border-t">
          {messages.map((m, i) => <div key={i}>{m}</div>)}
        </div>
      )}
    </div>
  );
}

export default RoomPage;
