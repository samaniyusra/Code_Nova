import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI('AIzaSyBNRNrPW-sZo2uH09h3yU4g5SNWZnOeWGI');

export const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash"
});