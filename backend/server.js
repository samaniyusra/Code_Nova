import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./lib/db.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import userRoutes from "./routes/userRouter.js";
import { exec } from "child_process";
import fs from "fs";
import path from "path";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI('AIzaSyBNRNrPW-sZo2uH09h3yU4g5SNWZnOeWGI');

const model = genAI.getGenerativeModel({
  model: "gemini-3-flash-preview",
});

// cache
const cache = new Map();

// RUN CODE
app.post("/run", async (req, res) => {
  const { code, language } = req.body;

  const tempDir = "./temp";
  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

  let filePath, command;

  try {
    // ===== JAVASCRIPT =====
    if (language === "javascript") {
      filePath = path.join(tempDir, "code.js");
      fs.writeFileSync(filePath, code);

      command = `node ${filePath}`;
    }

    // ===== PYTHON =====
    else if (language === "python") {
      filePath = path.join(tempDir, "code.py");
      fs.writeFileSync(filePath, code);

      command = `python ${filePath}`;
    }

    // ===== C++ =====
    else if (language === "cpp") {
      filePath = path.join(tempDir, "code.cpp");
      const exePath = path.join(tempDir, "code.exe");

      fs.writeFileSync(filePath, code);

      command = `g++ ${filePath} -o ${exePath} && ${exePath}`;
    }

    // ===== JAVA =====
    else if (language === "java") {
      filePath = path.join(tempDir, "Main.java");

      fs.writeFileSync(filePath, code);

      command = `javac ${filePath} && java -cp ${tempDir} Main`;
    }

    else {
      return res.json({ output: "Unsupported language" });
    }

    exec(command, (error, stdout, stderr) => {
      if (error) {
        return res.json({ output: stderr || error.message });
      }
      res.json({ output: stdout });
    });

  } catch (err) {
    res.json({ output: "Execution failed" });
  }
});

// ANIMATE
app.post("/animate", async (req, res) => {
  const { code } = req.body;

  const MAX_RETRIES = 3;

  const fallback = [
    {
      step: 1,
      line: 1,
      variables: {},
      explanation: "AI unavailable. Try again.",
    },
  ];

  try {
    // ✅ cache check
    if (cache.has(code)) {
      return res.json({ text: cache.get(code) });
    }

    let attempt = 0;
    let result;

    while (attempt < MAX_RETRIES) {
      try {
        result = await model.generateContent(`YOUR PROMPT HERE`);
        break;
      } catch (err) {
        if (err.status === 503) {
          attempt++;
          console.log(`Retry ${attempt}...`);

          await new Promise(r => setTimeout(r, 1500));
        } else {
          throw err;
        }
      }
    }

    // ❌ still failed
    if (!result) {
      return res.json({ text: JSON.stringify(fallback) });
    }

    let text = result.response.text();

    text = text.replace(/```json/g, "").replace(/```/g, "").trim();

    try {
      JSON.parse(text);
    } catch {
      return res.json({ text: JSON.stringify(fallback) });
    }

    cache.set(code, text);

    res.json({ text });

  } catch (err) {
    console.error(err);

    res.json({
      text: JSON.stringify(fallback),
    });
  }
});
app.use("/api/users", userRoutes);

app.listen(5000, () => {
  console.log("Server running");
  connectDB();
});