import { GoogleGenAI } from '@google/genai';

export default () => {
  const key = process.env.GEMINI_API_KEY;

  const ai = new GoogleGenAI({ apiKey: key });

  return ai;
};
