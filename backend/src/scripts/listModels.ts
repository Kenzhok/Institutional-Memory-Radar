import { GoogleGenAI } from '@google/genai';
import 'dotenv/config';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function listModels() {
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`);
    const data = await response.json() as any;
    console.log("Available models:");
    data.models.forEach((m: any) => {
        if (m.name.includes("flash")) {
            console.log(m.name);
        }
    });
  } catch(e) {
    console.error(e);
  }
}
listModels();
