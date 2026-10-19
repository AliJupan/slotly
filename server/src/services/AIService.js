import { GoogleGenAI } from "@google/genai";

class AIService {
  constructor(logger) {
    this.logger = logger;

    this.ai = process.env.GEMINI_API_KEY
      ? new GoogleGenAI({
          apiKey: process.env.GEMINI_API_KEY,
        })
      : null;
  }

  async generateBookingConfirmation(name, startsAt) {
    if (!this.ai) {
      this.logger.warn("Gemini API key is missing.");
      return null;
    }

    try {
      const date = new Date(startsAt);

      const response = await this.ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: `Write a short, friendly booking confirmation message for ${name}.
        The booking is scheduled for ${date.toISOString()}.
        Use no more than 35 words.
        Do not invent any booking details.
        Return only the message.`,
        config: {
          maxOutputTokens: 100,
          temperature: 0.7,
        },
      });

      return response.text?.trim() || null;
    } catch (error) {
      this.logger.error(
        `Failed to generate booking confirmation: ${error.message}`,
      );

      return null;
    }
  }
}

export default AIService;
