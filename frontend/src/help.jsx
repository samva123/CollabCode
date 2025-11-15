import React, { useState } from "react";
import Editor from "@monaco-editor/react";
import { Sun, Moon, Play, Code, Terminal, Upload, Download, Copy, Check } from "lucide-react";
import TestCases from "./TestCases.jsx";

function App() {
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState("// Write your code here\nconsole.log('Hello, World!');");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [copied, setCopied] = useState(false);

  const languages = [
    { value: "javascript", label: "JavaScript", icon: "🟨" },
    { value: "python", label: "Python", icon: "🐍" },
    { value: "cpp", label: "C++", icon: "⚡" },
    { value: "java", label: "Java", icon: "☕" },
  ];

  const handleRun = async () => {
    setIsRunning(true);
    setOutput("Running...");
    try {
      const response = await fetch("http://localhost:8000/api/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language, code, stdin: input }),
      });
      const res = await response.json();
      if (res.stdout) setOutput(res.stdout);
      else if (res.stderr) setOutput(`Error:\n${res.stderr}`);
      else setOutput("No output received");
    } catch (err) {
      setOutput(`Connection Error: ${err.message}\nMake sure your backend server is running on port 8000.`);
    } finally {
      setIsRunning(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const downloadCode = () => {
    const extension =
      language === "cpp" ? "cpp" : language === "python" ? "py" : language === "java" ? "java" : "js";
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `code.${extension}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const uploadFile = () => {
    const inputEl = document.createElement("input");
    inputEl.type = "file";
    inputEl.accept = ".js,.py,.cpp,.java,.txt";
    inputEl.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => setCode(e.target.result);
        reader.readAsText(file);
      }
    };
    inputEl.click();
  };

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
    <div className={`h-screen w-screen flex flex-col ${currentTheme.bg} ${currentTheme.text} transition-colors duration-300`}>
      {/* Header */}
      <header className={`${currentTheme.headerBg} ${currentTheme.border} border-b backdrop-blur-sm ${currentTheme.shadow}`}>
        <div className="px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Code className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">CollabCode</h1>
              <p className={`text-xs ${currentTheme.textSecondary}`}>Real-time collaborative editor</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <label className={`text-sm font-medium ${currentTheme.textSecondary}`}>Language:</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className={`px-3 py-2 rounded-lg ${currentTheme.inputBg} ${currentTheme.border} border text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              >
                {languages.map((lang) => (
                  <option key={lang.value} value={lang.value}>
                    {lang.icon} {lang.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <button onClick={uploadFile} className={`p-2 rounded-lg ${currentTheme.inputBg} ${currentTheme.border} border hover:bg-slate-700`} title="Upload file">
                <Upload className="w-4 h-4" />
              </button>
              <button onClick={downloadCode} className={`p-2 rounded-lg ${currentTheme.inputBg} ${currentTheme.border} border hover:bg-slate-700`} title="Download code">
                <Download className="w-4 h-4" />
              </button>
              <button onClick={() => setIsDark(!isDark)} className={`p-2 rounded-lg ${currentTheme.inputBg} ${currentTheme.border} border hover:bg-slate-700`} title="Toggle theme">
                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
              <button
                onClick={handleRun}
                disabled={isRunning}
                className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 disabled:from-gray-500 disabled:to-gray-600 text-white px-6 py-2 rounded-lg font-semibold flex items-center space-x-2"
              >
                <Play className="w-4 h-4" />
                <span>{isRunning ? "Running..." : "Run Code"}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <div className="flex flex-1 overflow-hidden">
        {/* Editor */}
        <div className="flex-1 flex flex-col">
          <div className={`${currentTheme.headerBg} px-4 py-2 ${currentTheme.border} border-b flex items-center space-x-2`}>
            <Code className="w-4 h-4" />
            <span className="text-sm font-medium">Editor</span>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" title="Live collaboration"></div>
          </div>

          <div className="flex-1 relative m-4 border-2 border-dashed rounded-lg overflow-hidden">
            <Editor
              height="100%"
              language={language === "cpp" ? "cpp" : language}
              value={code}
              theme={isDark ? "vs-dark" : "light"}
              onChange={(val) => setCode(val || "")}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                scrollBeyondLastLine: false,
                automaticLayout: true,
              }}
            />
          </div>
        </div>

        {/* TestCases / Input/Output */}
        <div className={`w-96 flex flex-col ${currentTheme.cardBg} ${currentTheme.border} border-l`}>
          <TestCases language={language} code={code} />
        </div>
      </div>
    </div>
  );
}

export default App;
