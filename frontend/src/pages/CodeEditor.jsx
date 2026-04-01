import React, { useState, useRef, useEffect } from "react";
import Editor from "@monaco-editor/react";
import * as d3 from "d3";

const CodeEditor = () => {
  const [code, setCode] = useState("console.log([5,2,8].sort());");
  const [language, setLanguage] = useState("javascript");
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const intervalRef = useRef(null);

  // ================= RUN =================
  const runCode = async () => {
    const res = await fetch("http://localhost:5000/run", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ code, language }),
    });

    const data = await res.json();
    setOutput(data.output);
  };

  // ================= PLAY =================
  const playSteps = (stepsArr) => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    let i = 0;
    setCurrentStep(0);

    intervalRef.current = setInterval(() => {
      i++;
      if (i >= stepsArr.length) {
        clearInterval(intervalRef.current);
        return;
      }
      setCurrentStep(i);
    }, 800);
  };

  // ================= ANIMATE =================
  const animateCode = async () => {
    if (loading) return;
    setLoading(true);

    const res = await fetch("http://localhost:5000/animate", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ code }),
    });

    const data = await res.json();

    try {
      const parsed = JSON.parse(data.text);
      setSteps(parsed);
      playSteps(parsed);
    } catch {
      console.error("Parse error");
    }

    setLoading(false);
  };

  // ================= VISUALS =================

  const ArrayView = ({ data }) => (
    <div className="flex items-end gap-2">
      {data.map((v, i) => (
        <div key={i} className="text-center text-slate-200">
          <div style={{ height: v * 20 }} className="w-8 bg-blue-500 rounded"/>
          <div className="text-sm mt-1">{v}</div>
        </div>
      ))}
    </div>
  );

  const LinkedListView = ({ data }) => (
    <div className="flex items-center gap-2 text-slate-200">
      {data.map((n, i) => (
        <div key={i} className="flex items-center">
          <div className="bg-slate-600 px-3 py-2 rounded">
            {n.value}
          </div>
          {n.next !== null && <span className="mx-2">→</span>}
        </div>
      ))}
    </div>
  );

  const TreeView = ({ data }) => {
    const ref = useRef();

    useEffect(() => {
      const svg = d3.select(ref.current);
      svg.selectAll("*").remove();

      const root = d3.hierarchy(data);
      const treeLayout = d3.tree().size([300, 200]);
      treeLayout(root);

      svg.selectAll("line")
        .data(root.links())
        .enter()
        .append("line")
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y)
        .attr("stroke", "#94a3b8");

      svg.selectAll("circle")
        .data(root.descendants())
        .enter()
        .append("circle")
        .attr("cx", d => d.x)
        .attr("cy", d => d.y)
        .attr("r", 10)
        .attr("fill", "#3b82f6");

    }, [data]);

    return <svg ref={ref} width={400} height={300}></svg>;
  };

  // ================= RENDER =================

  const renderVisual = () => {
    const vars = steps[currentStep]?.variables || {};

    return Object.entries(vars).map(([name, val]) => {
      if (val.type === "array") return <ArrayView key={name} data={val.value}/>;
      if (val.type === "linkedlist") return <LinkedListView key={name} data={val.value}/>;
      if (val.type === "tree") return <TreeView key={name} data={val.value}/>;

      return (
        <div key={name} className="bg-slate-600 p-2 rounded text-slate-200">
          {name}: {JSON.stringify(val.value)}
        </div>
      );
    });
  };

  return (
    <div className="flex h-screen bg-slate-800 text-slate-100">

      {/* LEFT PANEL */}
      <div className="w-1/2 p-6 border-r border-slate-600 flex flex-col">

        <h2 className="text-xl font-semibold mb-4">
          Visualization
        </h2>

        <div className="bg-slate-700 rounded-xl p-4 flex-1 overflow-auto border border-slate-600">
          {steps.length > 0 ? (
            <>
              {renderVisual()}

              <div className="mt-4 p-3 bg-slate-600 rounded text-sm">
                {steps[currentStep]?.explanation}
              </div>
            </>
          ) : (
            <p className="text-slate-400">Click Animate to visualize</p>
          )}
        </div>

        <div className="mt-4">
          <input
            type="range"
            min="0"
            max={steps.length - 1 || 0}
            value={currentStep}
            onChange={(e) => setCurrentStep(Number(e.target.value))}
            className="w-full"
          />

          <div className="flex gap-3 mt-2">
            <button
              onClick={() => setCurrentStep(0)}
              className="bg-slate-600 px-3 py-1 rounded"
            >
              ⏮
            </button>

            <button
              onClick={() => playSteps(steps)}
              className="bg-blue-500 px-4 py-1 rounded text-white"
            >
              ▶ Play
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="w-1/2 p-6 flex flex-col">

        {/* LANGUAGE SELECT */}
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="mb-3 px-3 py-2 rounded bg-slate-700 border border-slate-600 text-sm"
        >
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="cpp">C++</option>
          <option value="java">Java</option>
        </select>

        {/* BUTTONS */}
        <div className="flex gap-4 mb-4">
          <button
            onClick={runCode}
            className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-lg"
          >
            ▶ Run Code
          </button>

          <button
            onClick={animateCode}
            className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-lg"
          >
            🎬 {loading ? "Animating..." : "Animate"}
          </button>
        </div>

        {/* EDITOR */}
        <div className="flex-1 border border-slate-600 rounded-xl overflow-hidden">
          <Editor
            height="100%"
            language={language}
            theme="vs-dark"
            value={code}
            onChange={(v) => setCode(v)}
          />
        </div>

        {/* OUTPUT */}
        <div className="mt-3 bg-slate-700 border border-slate-600 p-3 rounded">
          <b>Output:</b> {output}
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;