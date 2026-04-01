import { exec } from "child_process";
import fs from "fs";
import path from "path";
const filePath = path.join(process.cwd(), "temp.js");
export const handleRun = async () => {
 const { code, language } = req.body;

  try {
    if (language === "javascript") {
      fs.writeFileSync(filePath, code);

      exec("node " + filePath, (err, stdout, stderr) => {
        if (err) return res.json({ output: stderr || err.message });
        res.json({ output: stdout || "No Output" });
      });
    }

    else if (language === "python") {
      fs.writeFileSync("temp.py", code);

      exec("python temp.py", (err, stdout, stderr) => {
        if (err) return res.json({ output: stderr || err.message });
        res.json({ output: stdout || "No Output" });
      });
    }

    else {
      res.json({ output: "Language not supported yet" });
    }

  } catch (err) {
    res.json({ output: err.message });
  }
};
