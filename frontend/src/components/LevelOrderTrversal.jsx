import React, { useState, useEffect } from "react";
import { DndContext, useDraggable } from "@dnd-kit/core";

// Draggable node using dnd-kit
function DraggableNode({ id, children, x, y, onMove }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });

  const style = {
    position: "absolute",
    left: x,
    top: y,
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    cursor: "grab",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onMouseUp={() => {
        if (transform) onMove(id, x + transform.x, y + transform.y);
      }}
    >
      {children}
    </div>
  );
}

const LevelOrderTraversalAnimated = () => {
  const initialNodes = [
    { id: 1, label: "A", left: 1, right: 2, x: 0, y: 0 },
    { id: 2, label: "B", left: 3, right: 4, x: -100, y: 100 },
    { id: 3, label: "C", left: null, right: null, x: 100, y: 100 },
    { id: 4, label: "D", left: null, right: null, x: -150, y: 200 },
    { id: 5, label: "E", left: null, right: null, x: -50, y: 200 },
  ];

  const [nodes, setNodes] = useState(initialNodes);
  const [visited, setVisited] = useState([]);
  const [queue, setQueue] = useState([0]);

  // BFS Animation
  useEffect(() => {
    if (!queue.length) return;
    const timer = setTimeout(() => {
      const idx = queue[0];
      const current = nodes[idx];
      setVisited((prev) => [...prev, current.id]);
      const nextQueue = [...queue.slice(1)];
      if (current.left !== null) nextQueue.push(current.left);
      if (current.right !== null) nextQueue.push(current.right);
      setQueue(nextQueue);
    }, 1000);
    return () => clearTimeout(timer);
  }, [queue, nodes]);

  const reset = () => {
    setVisited([]);
    setQueue([0]);
    setNodes(initialNodes);
  };

  const updatePosition = (id, x, y) => {
    setNodes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, x, y } : n))
    );
  };

  return (
    <div className="bg-gray-900 rounded-xl p-4 border border-gray-700 w-full relative h-96">
      {/* Demo Badge */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 px-4 py-1 bg-yellow-500 text-black rounded-full font-bold z-20">
        Demo
      </div>

      {/* Edges */}
      <svg className="absolute inset-0 w-full h-full">
        {nodes.map((parent) => {
          const lines = [];
          ["left", "right"].forEach((dir) => {
            const childIndex = parent[dir];
            if (childIndex !== null) {
              const child = nodes[childIndex];
              const isVisited =
                visited.includes(parent.id) && visited.includes(child.id);
              lines.push(
                <line
                  key={`${parent.id}-${child.id}`}
                  x1={parent.x + 150}
                  y1={parent.y + 50}
                  x2={child.x + 150}
                  y2={child.y + 50}
                  stroke={isVisited ? "#06b6d4" : "#555"}
                  strokeWidth="2"
                  strokeDasharray={isVisited ? "0" : "4"}
                />
              );
            }
          });
          return lines;
        })}
      </svg>

      {/* Nodes */}
      <DndContext>
        {nodes.map((node) => (
          <DraggableNode
            key={node.id}
            id={node.id}
            x={node.x + 150}
            y={node.y + 50}
            onMove={updatePosition}
          >
            <div
              className={`w-14 h-14 rounded-full flex items-center justify-center font-bold border-2 cursor-move transition-all ${
                visited.includes(node.id)
                  ? "bg-cyan-500 border-cyan-400 text-black"
                  : "bg-gray-800 border-gray-600 text-gray-400"
              }`}
            >
              {node.label}
            </div>
          </DraggableNode>
        ))}
      </DndContext>

      {/* Queue */}
      <div className="mt-4 relative z-10">
        <h4 className="text-gray-300 mb-1">Queue:</h4>
        <div className="flex gap-2 flex-wrap">
          {queue.map((i) => (
            <div
              key={nodes[i].id}
              className="px-3 py-1 bg-gray-700 text-white rounded-md font-mono"
            >
              {nodes[i].label}
            </div>
          ))}
        </div>
      </div>

      {/* Reset Button */}
      <div className="flex justify-center mt-4">
        <button
          onClick={reset}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default LevelOrderTraversalAnimated;