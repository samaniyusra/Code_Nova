import axios from "axios";

export async function generateAISteps(code) {
  try {
    const res = await axios.post("http://localhost:11434/api/generate", {
      model: "llama3",
      prompt: `
Convert this code into JSON steps.

Rules:
- Only JSON array
- Track variables
- Max 10 steps

Code:
${code}
      `,
      stream: false,
    });

    return JSON.parse(res.data.response);
  } catch {
    return [];
  }
}