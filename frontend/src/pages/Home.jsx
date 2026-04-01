import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

/* ================== Typing ================== */
const Typing = ({ strings, speed = 80 }) => {
  const [text, setText] = useState("");
  const [strIndex, setStrIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [forward, setForward] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      if (forward) {
        if (charIndex < strings[strIndex].length) {
          setText((prev) => prev + strings[strIndex][charIndex]);
          setCharIndex((prev) => prev + 1);
        } else setForward(false);
      } else {
        if (charIndex > 0) {
          setText(strings[strIndex].slice(0, charIndex - 1));
          setCharIndex((prev) => prev - 1);
        } else {
          setForward(true);
          setStrIndex((prev) => (prev + 1) % strings.length);
        }
      }
    }, speed);
    return () => clearInterval(interval);
  }, [charIndex, forward, strings, strIndex, speed]);

  return <span className="text-indigo-400">{text}</span>;
};

/* ================== Demo Card ================== */
const DemoBoxCard = ({ title, nodes, type }) => {
  const [visited, setVisited] = useState([]);
  const [queue, setQueue] = useState(
    type === "BFS" || type === "Queue" ? [0] : [],
  );
  const [stack, setStack] = useState(
    type === "DFS" || type === "Stack" ? [0] : [],
  );

  const idToIndex = {};
  nodes.forEach((node, idx) => (idToIndex[node.id] = idx));

  useEffect(() => {
    let timer;

    if ((type === "BFS" || type === "Queue") && queue.length) {
      timer = setTimeout(() => {
        const idx = queue[0];
        const current = nodes[idx];
        setVisited((prev) => [...prev, current.id]);

        const next = [...queue.slice(1)];
        if (current.left) next.push(idToIndex[current.left]);
        if (current.right) next.push(idToIndex[current.right]);
        if (current.next) next.push(idToIndex[current.next]);

        setQueue(next);
      }, 800);
    }

    if ((type === "DFS" || type === "Stack") && stack.length) {
      timer = setTimeout(() => {
        const idx = stack[stack.length - 1];
        const current = nodes[idx];
        setVisited((prev) => [...prev, current.id]);

        const next = [...stack.slice(0, -1)];
        if (current.right) next.push(idToIndex[current.right]);
        if (current.left) next.push(idToIndex[current.left]);
        if (current.next) next.push(idToIndex[current.next]);

        setStack(next);
      }, 800);
    }

    return () => clearTimeout(timer);
  }, [queue, stack, nodes, type]);

  const reset = () => {
    setVisited([]);
    setQueue(type === "BFS" || type === "Queue" ? [0] : []);
    setStack(type === "DFS" || type === "Stack" ? [0] : []);
  };

  const nodeColor = {
    BFS: "bg-indigo-500 border-indigo-300",
    DFS: "bg-yellow-400 border-yellow-300",
    Queue: "bg-green-500 border-green-300",
    Stack: "bg-pink-500 border-pink-300",
  };

  return (
    <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-5 shadow-xl hover:scale-[1.03] transition-all">
      <h3 className="text-white font-semibold text-lg mb-3 text-center border-b border-white/10 pb-2">
        {title}
      </h3>

      <div className="relative h-56 bg-black/40 rounded-lg border border-white/10 p-2 overflow-hidden">
        <svg className="absolute inset-0 w-full h-full">
          {nodes.map((parent) =>
            ["left", "right", "next"].map((dir) => {
              const childId = parent[dir];
              if (!childId) return null;
              const child = nodes[idToIndex[childId]];
              const active =
                visited.includes(parent.id) && visited.includes(child.id);

              return (
                <line
                  key={`${parent.id}-${child.id}`}
                  x1={parent.x + 20}
                  y1={parent.y + 20}
                  x2={child.x + 20}
                  y2={child.y + 20}
                  stroke={active ? "#6366F1" : "#555"}
                  strokeWidth="2"
                />
              );
            }),
          )}
        </svg>

        {nodes.map((node) => (
          <div
            key={node.id}
            style={{ position: "absolute", left: node.x, top: node.y }}
            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 text-white text-sm ${
              visited.includes(node.id)
                ? nodeColor[type]
                : "bg-gray-700 border-gray-500"
            }`}
          >
            {node.label}
          </div>
        ))}
      </div>

      <div className="mt-3 text-gray-300 text-sm text-center font-mono">
        {(type === "BFS" || type === "Queue") && (
          <span>Queue: {queue.map((i) => nodes[i].label).join(" → ")}</span>
        )}
        {(type === "DFS" || type === "Stack") && (
          <span>Stack: {stack.map((i) => nodes[i].label).join(" → ")}</span>
        )}
      </div>

      <div className="flex justify-center mt-3">
        <button
          onClick={reset}
          className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-md text-white text-sm"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

/* ================== MAIN PAGE ================== */
const HomePage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setIsLoggedIn(true);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    navigate("/auth");
  };

  const binaryTreeNodes = [
    { id: 1, label: "A", left: 2, right: 3, x: 100, y: 0 },
    { id: 2, label: "B", left: 4, right: 5, x: 0, y: 100 },
    { id: 3, label: "C", x: 200, y: 100 },
    { id: 4, label: "D", x: -50, y: 200 },
    { id: 5, label: "E", x: 50, y: 200 },
  ];

  const graphNodes = [
    { id: 1, label: "1", left: 2, right: 3, x: 100, y: 0 },
    { id: 2, label: "2", left: 4, x: 0, y: 100 },
    { id: 3, label: "3", right: 5, x: 200, y: 100 },
    { id: 4, label: "4", x: -50, y: 200 },
    { id: 5, label: "5", x: 250, y: 200 },
  ];

  const queueNodes = [
    { id: 1, label: "Q1", next: 2, x: 20, y: 20 },
    { id: 2, label: "Q2", next: 3, x: 80, y: 20 },
    { id: 3, label: "Q3", next: 4, x: 140, y: 20 },
    { id: 4, label: "Q4", next: 5, x: 200, y: 20 },
    { id: 5, label: "Q5", x: 260, y: 20 },
  ];

  const stackNodes = [
    { id: 1, label: "S1", next: 2, x: 20, y: 20 },
    { id: 2, label: "S2", next: 3, x: 20, y: 80 },
    { id: 3, label: "S3", next: 4, x: 20, y: 140 },
    { id: 4, label: "S4", next: 5, x: 20, y: 200 },
    { id: 5, label: "S5", x: 20, y: 260 },
  ];

  return (
    <div className="bg-[#0B0F19] min-h-screen text-gray-200">
      {/* HEADER */}

      <header className="fixed top-0 w-full bg-[#f8fafc] border-b border-gray-400 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          {/* Logo */}
          <h1 className="text-lg font-semibold text-gray-800">CodeNova</h1>

          {/* Nav */}
          <nav className="hidden md:flex gap-8 text-sm text-gray-600">
            <nav-link
              className="hover:text-gray-900 cursor-pointer"
              onClick={() => navigate("/")}
            >
              Home
            </nav-link>
            <nav-link
              className="hover:text-gray-900 cursor-pointer"
              onClick={() => navigate("/features")}
            >
              Features
            </nav-link>
            <nav-link
              className="hover:text-gray-900 cursor-pointer"
              onClick={() => navigate("/code")}
            >
              Explore
            </nav-link>
            <nav-link
              className="hover:text-gray-900 cursor-pointer"
              onClick={() => navigate("/contact")}
            >
              Contact
            </nav-link>
          </nav>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={() => navigate("/login")}
              className="px-4 py-2 text-gray-600 hover:text-gray-900 text-sm"
            >
              Login
            </button>

            <button
              onClick={() => navigate("/login")}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg shadow-sm"
            >
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="pt-28 pb-20 px-6 bg-[#f8fafc]">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          {/* LEFT */}
          <div>
            <h1 className="text-4xl md:text-5xl font-semibold text-gray-900 leading-tight">
              Learn DSA <br />
              the simple way
            </h1>

            <p className="mt-5 text-gray-600 max-w-md text-base">
              Visualize algorithms step by step and understand concepts clearly
              with interactive learning.
            </p>

            <div className="mt-8 flex gap-4">
              <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm shadow-sm">
                Start Learning
              </button>

              <button className="px-6 py-3 border border-gray-300 hover:bg-gray-100 text-gray-700 rounded-lg text-sm">
                View Demo
              </button>
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex justify-center">
            <div className="w-[520px] h-[320px] bg-white border border-gray-200 rounded-2xl shadow-sm flex items-center justify-center">
              <img src="https://media.istockphoto.com/id/1456192902/photo/close-up-photo-of-woman-hands-typing-business-report-on-a-laptop-keyboard-in-the-cafe.jpg?s=2048x2048&w=is&k=20&c=StjR8v-uio9-Y9g3LE6fhwE6OYukyS25mSqj1b-N8_E=" alt="DSA Visualizer" className="w-full h-full object-cover rounded-2xl
              " />
            </div>
          </div>
        </div>
      </section>

      {/* DEMO SECTION (UNCHANGED FUNCTIONALITY) */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-4xl font-bold text-center mb-12">
          Interactive Visualizations
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <DemoBoxCard
            title="Binary Tree (BFS)"
            nodes={binaryTreeNodes}
            type="BFS"
          />
          <DemoBoxCard title="Graph (DFS)" nodes={graphNodes} type="DFS" />
          <DemoBoxCard title="Queue" nodes={queueNodes} type="Queue" />
          <DemoBoxCard title="Stack" nodes={stackNodes} type="Stack" />
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-6 py-12">
          {/* TOP GRID */}
          <div className="grid md:grid-cols-4 gap-10">
            {/* BRAND */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800">CodeNova</h2>
              <p className="mt-3 text-sm text-gray-500">
                Learn Data Structures & Algorithms visually with interactive
                experiences designed for better understanding.
              </p>
            </div>

            {/* LINKS */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                Product
              </h3>
              <ul className="space-y-2 text-sm text-gray-500">
                <li className="hover:text-gray-800 cursor-pointer">Features</li>
                <li className="hover:text-gray-800 cursor-pointer">
                  Visualize
                </li>
                <li className="hover:text-gray-800 cursor-pointer">Pricing</li>
              </ul>
            </div>

            {/* COMPANY */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                Company
              </h3>
              <ul className="space-y-2 text-sm text-gray-500">
                <li className="hover:text-gray-800 cursor-pointer">About</li>
                <li className="hover:text-gray-800 cursor-pointer">Careers</li>
                <li className="hover:text-gray-800 cursor-pointer">Contact</li>
              </ul>
            </div>

            {/* CONTACT */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                Contact
              </h3>
              <p className="text-sm text-gray-500">support@codenova.dev</p>
              <p className="text-sm text-gray-500 mt-2">Mumbai, India</p>
            </div>
          </div>

          {/* BOTTOM */}
          <div className="mt-10 pt-6 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
            <p>© {new Date().getFullYear()} CodeNova. All rights reserved.</p>

            <div className="flex gap-6 mt-4 md:mt-0">
              <span className="hover:text-gray-800 cursor-pointer">
                Privacy
              </span>
              <span className="hover:text-gray-800 cursor-pointer">Terms</span>
              <span className="hover:text-gray-800 cursor-pointer">Help</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
