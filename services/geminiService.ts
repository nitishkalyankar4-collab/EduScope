
import { GoogleGenAI, Type } from "@google/genai";

const API_KEY = process.env.API_KEY;

export type AssistantMode = 'NORMAL' | 'THINKING' | 'SEARCH';

export class GeminiService {
  private static ai = new GoogleGenAI({ apiKey: API_KEY! });

  /**
   * Unified streaming assistant that handles different intelligence modes.
   */
  static async *streamAssistant(prompt: string, mode: AssistantMode = 'NORMAL', context?: string) {
    try {
      let modelName = 'gemini-3-flash-preview';
      let config: any = {
        systemInstruction: "You are EduScope AI, an expert academic assistant. Provide clear, step-by-step educational support. Use Markdown for formatting.",
      };

      if (mode === 'THINKING') {
        modelName = 'gemini-3-pro-preview';
        config.thinkingConfig = { thinkingBudget: 16000 };
        config.systemInstruction += " Use deep reasoning to solve this complex problem. Break down your logic clearly.";
      } else if (mode === 'SEARCH') {
        config.tools = [{ googleSearch: {} }];
        config.systemInstruction += " Use Google Search to provide up-to-date and accurate information. Cite your sources.";
      }

      const response = await this.ai.models.generateContentStream({
        model: modelName,
        contents: `${context ? `Context: ${context}\n\n` : ''}User: ${prompt}`,
        config,
      });

      for await (const chunk of response) {
        yield chunk.text;
      }
    } catch (error) {
      console.error("Gemini Stream Error:", error);
      yield "I'm sorry, I encountered an error while generating a response. Please try again.";
    }
  }

  /**
   * Generates a comprehensive lesson plan for teachers.
   */
  static async generateLessonPlan(subject: string, topic: string, grade: string) {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Create a detailed 60-minute lesson plan for ${subject}, Topic: ${topic}, Grade Level: ${grade}. Include Objectives, Materials Needed, a Step-by-Step Procedure (Introduction, Core Activity, Conclusion), and an Assessment idea.`,
        config: {
          thinkingConfig: { thinkingBudget: 16000 },
          systemInstruction: "You are an expert pedagogical consultant. Provide highly structured and creative lesson plans that follow modern educational standards."
        }
      });
      return response.text;
    } catch (error) {
      console.error("Lesson Plan Error:", error);
      throw error;
    }
  }

  /**
   * Generates flashcards for a specific topic or material content.
   */
  static async generateFlashcards(topic: string) {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Generate 5 high-quality flashcards for the educational topic: "${topic}".`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                front: { type: Type.STRING, description: "Question or term on the front" },
                back: { type: Type.STRING, description: "Answer or definition on the back" }
              },
              required: ["front", "back"]
            }
          }
        }
      });
      return JSON.parse(response.text);
    } catch (error) {
      console.error("Flashcards Error:", error);
      throw error;
    }
  }

  /**
   * Generates a structured quiz from a topic using JSON schema.
   */
  static async generateQuiz(topic: string, count: number = 5) {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Generate a multiple choice quiz about "${topic}" with ${count} questions. Focus on educational accuracy and clear explanations.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING },
                options: { type: Type.ARRAY, items: { type: Type.STRING } },
                correctIndex: { type: Type.INTEGER },
                explanation: { type: Type.STRING }
              },
              required: ["question", "options", "correctIndex", "explanation"]
            }
          }
        }
      });
      return JSON.parse(response.text);
    } catch (error) {
      console.error("Quiz Generation Error:", error);
      throw error;
    }
  }

  /**
   * Predictive intelligence insights for teachers.
   */
  static async getPredictiveInsights(classDataSummary: string) {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Analyze class data: \n\n ${classDataSummary}`,
        config: {
          thinkingConfig: { thinkingBudget: 16000 },
          systemInstruction: "You are a senior education analyst. Provide professional, data-driven insights. Focus on trends and interventions.",
        }
      });
      return response.text;
    } catch (error) {
      return "AI analysis unavailable at this time.";
    }
  }

  /**
   * Image analysis for homework help.
   */
  static async analyzeImage(base64Image: string, prompt: string) {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: {
          parts: [
            { inlineData: { mimeType: 'image/png', data: base64Image } },
            { text: prompt || "Explain what is in this image and solve any problems shown." }
          ]
        },
      });
      return response.text;
    } catch (error) {
      console.error("Image Analysis Error:", error);
      return "I couldn't analyze the image.";
    }
  }

  /**
   * Generate a custom banner for a classroom.
   */
  static async generateClassBanner(subject: string, topic: string) {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [{ text: `A professional classroom banner for ${subject} themed around ${topic}. Modern, educational, minimalist design.` }]
        },
        config: { imageConfig: { aspectRatio: "16:9" } }
      });

      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
      }
      throw new Error("No image data");
    } catch (error) {
      console.error("Banner Generation Error:", error);
      throw error;
    }
  }
}
