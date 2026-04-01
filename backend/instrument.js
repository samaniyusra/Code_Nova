import express from "express";
import axios from "axios";
import detectType from "../utils/detectType.js";

const router = express.Router();

const languageMap = {
  javascript: 63,
  python: 71,
  cpp: 54,
};

router.post("/run", async (req, res) => {
  const { code, language } = req.body;

  try {
    const response = await axios.post(
      "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true",
      {
        source_code: code,
        language_id: languageMap[language],
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-RapidAPI-Key": "YOUR_API_KEY",
          "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
        },
      }
    );

    const output = response.data.stdout || response.data.stderr;

    const type = detectType(code);

    res.json({
      output,
      type,
      steps: generateFakeSteps(type), // basic animation steps
    });

  } catch (err) {
    res.json({ output: "Execution Error", steps: [] });
  }
});

// 🔥 fake steps generator (for visualization)
function generateFakeSteps(type) {
  if (type === "array") {
    return [
      { arr: [1, 2, 3] },
      { arr: [1, 3, 2] },
      { arr: [3, 2, 1] },
    ];
  }

  if (type === "linkedlist") {
    return [
      { prev: null, curr: { val: 1, next: { val: 2 } } },
      { prev: { val: 1 }, curr: { val: 2 } },
    ];
  }

  return [];
}

export default router;