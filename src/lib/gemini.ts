import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface DiarizationSegment {
  speaker: "Arabic" | "Translation" | "Tafseer";
  text: string;
  startTime: string;
  endTime: string;
}

export async function diarizeAudio(base64Data: string, mimeType: string): Promise<DiarizationSegment[]> {
  const prompt = `
    You are an expert in Quranic studies and audio diarization. 
    Analyze the provided audio which contains Quran Tafseer with three distinct speakers:
    1. Speaker 1: Arabic Recitation of the Quran.
    2. Speaker 2: Translation of the verses.
    3. Speaker 3: Tafseer/Explanation/Commentary.

    Transcribe the audio and identify which speaker is talking at any given time.
    Provide the output as a JSON array of segments, each with:
    - speaker: One of "Arabic", "Translation", or "Tafseer".
    - text: The transcribed text for that segment.
    - startTime: The start time in "MM:SS" format.
    - endTime: The end time in "MM:SS" format.

    Be precise with the speaker identification.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-1.5-pro",
      contents: [
        {
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType,
                data: base64Data,
              },
            },
          ],
        },
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              speaker: { type: Type.STRING, enum: ["Arabic", "Translation", "Tafseer"] },
              text: { type: Type.STRING },
              startTime: { type: Type.STRING },
              endTime: { type: Type.STRING },
            },
            required: ["speaker", "text", "startTime", "endTime"],
          },
        },
      },
    });

    const result = JSON.parse(response.text || "[]");
    return result;
  } catch (error) {
    console.error("Diarization error:", error);
    throw error;
  }
}
