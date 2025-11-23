import { GoogleGenAI } from "@google/genai";
import { ElementType } from "../types";
import { STATIC_WORDS, BOSS_DIALOGUE_STATIC } from "../constants";

// Using env variable as requested. 
// If it fails, we gracefully degrade to static data.
const apiKey = process.env.API_KEY || '';

let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
}

export const generateLevelContent = async (element: ElementType, difficulty: number) => {
  if (!ai) {
    console.warn("No API Key found, using static content.");
    return getStaticContent(element);
  }

  try {
    const prompt = `
      You are a game master for a Chinese Wuxia typing game.
      Current Level Element: ${element}.
      Difficulty: ${difficulty} (1 is simple 2-character words, 5 is complex 4-character idioms).
      
      Task:
      1. Generate a threatening intro sentence for a demon boss of this element (max 20 chars).
      2. Generate 15 Traditional Chinese words/idioms related to this element.
         - Difficulty 1: Common 2-char words.
         - Difficulty 3: 4-char idioms.
         - Difficulty 5: Rare/Complex 4-char idioms.
      
      Output strictly in JSON format:
      {
        "intro": "string",
        "words": ["string", "string", ...]
      }
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const text = response.text;
    if (!text) throw new Error("Empty response from AI");
    
    const data = JSON.parse(text);
    return {
      words: data.words,
      intro: data.intro
    };

  } catch (error) {
    console.error("Gemini API Error:", error);
    return getStaticContent(element);
  }
};

const getStaticContent = (element: ElementType) => {
  return {
    words: STATIC_WORDS[element],
    intro: BOSS_DIALOGUE_STATIC[element]
  };
};
