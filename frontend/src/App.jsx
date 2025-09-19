import React, { useState } from "react";
import Editor from "@monaco-editor/react";
import axios from "axios";

function App() {
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState("// Write your code here\n");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const handleRun = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/execute", {
        language,
        code,
        stdin: input,
      });

      if (res.data.stdout) {
        setOutput(res.data.stdout);
      } else if (res.data.stderr) {
        setOutput(res.data.stderr);
      } else {
        setOutput("No output received");
      }
    } catch (err) {
      setOutput("Error: " + err.message);
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-gray-900 text-gray-100">
      {/* Header */}
      <header className="p-4 bg-gray-800 flex justify-between items-center shadow-md">
        <h1 className="text-xl font-bold">⚡ Collab Compiler</h1>
        <div className="flex items-center space-x-3">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="px-3 py-1 rounded bg-gray-700 border border-gray-600 text-sm"
          >
            <option value="javascript">JavaScript</option>
            <option value="cpp">C++</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
          </select>
          <button
            onClick={handleRun}
            className="bg-green-600 hover:bg-green-700 px-4 py-1 rounded font-semibold"
          >
            Run ▶
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Code Editor */}
        <div className="w-2/3 border-r border-gray-700">
          <Editor
            height="100%"
            theme="vs-dark"
            language={language}
            value={code}
            onChange={(value) => setCode(value)}
          />
        </div>

        {/* Input + Output */}
        <div className="w-1/3 flex flex-col bg-gray-800">
          <textarea
            placeholder="stdin input..."
            className="flex-1 p-3 bg-gray-900 border-b border-gray-700 text-sm outline-none resize-none"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />

          <div className="flex-1 p-3 bg-black text-green-400 font-mono text-sm overflow-auto">
            {output || "Program output will appear here..."}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
