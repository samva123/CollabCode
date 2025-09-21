// TestCases.js
import { useState } from "react";

export default function TestCases({ language, code }) {
  const [testCases, setTestCases] = useState([{ id: 1, input: "", output: "" }]);
  const [isTesting, setIsTesting] = useState(false);

  const runAllTests = async () => {
    setIsTesting(true);
    const results = [];
    for (const tc of testCases) {
      try {
        const response = await fetch("http://localhost:8000/api/execute", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ language, code, stdin: tc.input }),
        });
        const res = await response.json();
        results.push({ ...tc, output: res.stdout || res.stderr || "No output" });
      } catch (err) {
        results.push({ ...tc, output: `Error: ${err.message}` });
      }
    }
    setTestCases(results);
    setIsTesting(false);
  };

  return (
    <div className="p-4 space-y-4">
      <div className="space-y-2">
        {testCases.map((tc, idx) => (
          <div key={tc.id} className="flex space-x-2">
            <textarea
              value={tc.input}
              onChange={(e) => {
                const newCases = [...testCases];
                newCases[idx].input = e.target.value;
                setTestCases(newCases);
              }}
              placeholder={`Test case #${idx + 1}`}
              className="flex-1 p-2 text-sm border rounded font-mono"
            />
          </div>
        ))}
        <button
          onClick={() =>
            setTestCases([...testCases, { id: Date.now(), input: "", output: "" }])
          }
          className="text-blue-600 text-sm mt-1"
        >
          + Add test case
        </button>
      </div>

      <table className="w-full text-sm font-mono border-t">
        <thead className="bg-slate-800 text-slate-200">
          <tr>
            <th className="px-2 py-1 text-left">#</th>
            <th className="px-2 py-1 text-left">Input</th>
            <th className="px-2 py-1 text-left">Output</th>
          </tr>
        </thead>
        <tbody>
          {testCases.map((tc, idx) => (
            <tr key={tc.id} className="border-t border-slate-700">
              <td className="px-2 py-1">{idx + 1}</td>
              <td className="px-2 py-1 whitespace-pre-wrap">{tc.input}</td>
              <td className="px-2 py-1 whitespace-pre-wrap">{tc.output}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        onClick={runAllTests}
        disabled={isTesting}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold"
      >
        {isTesting ? "Running tests..." : "Run All Tests"}
      </button>
    </div>
  );
}

