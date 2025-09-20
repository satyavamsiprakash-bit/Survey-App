import { GoogleGenAI } from "@google/genai";
import type { VercelRequest, VercelResponse } from '@vercel/node';

// This is a Vercel Serverless Function, which runs in a Node.js environment.
// It will be accessible at the endpoint /api/suggest

export default async function handler(request: VercelRequest, response: VercelResponse) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method Not Allowed' });
  }

  const { profession, challenges } = request.body;

  if (!profession || !challenges) {
    return response.status(400).json({ error: 'Missing required fields: profession and challenges.' });
  }

  if (!process.env.API_KEY) {
    console.error('API_KEY is not set.');
    return response.status(500).json({ error: 'Internal Server Error: API key not configured.' });
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `
      An attendee at DS Digital solutions Connect has registered with the following details:
      - Profession: ${profession}
      - Key Business Challenge: "${challenges}"

      Based on this information, generate a short, encouraging, and helpful message for them. The message should suggest 2-3 fictional, but relevant, summit topics or networking opportunities they might find valuable. Format the suggestions as a bulleted list. Keep the entire response under 100 words.
      
      Example output:
      "Welcome! Based on your interest in ${profession}, you might enjoy these sessions:
      - 'Scaling Solutions: From Local to Global'
      - 'The Future of [Relevant Field]'
      We also recommend connecting with peers at the 'Innovation in your Industry' networking lunch!"
    `;

    const geminiResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        temperature: 0.7,
        topP: 1,
        topK: 32,
        maxOutputTokens: 150,
        thinkingConfig: { thinkingBudget: 30 },
      }
    });

    const suggestions = geminiResponse.text;
    response.status(200).json({ suggestions });

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    response.status(500).json({ error: 'Failed to generate suggestions.' });
  }
}