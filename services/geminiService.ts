import { GoogleGenAI } from "@google/genai";
import { CategoryType } from "../types";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API_KEY is missing from environment variables.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const getMotivationalTip = async (category: CategoryType, currentStreak: number): Promise<string> => {
  const ai = getClient();
  if (!ai) return "Mantenha o foco! (Configure sua API Key para dicas personalizadas)";

  const prompt = `
    Você é um treinador de alta performance estoico e energético.
    O usuário está construindo um hábito na categoria: "${category}".
    A sequência atual (streak) dele é de ${currentStreak} dias.
    
    Forneça uma dica curta, poderosa e acionável (máximo 2 frases) para motivá-lo a continuar hoje.
    Se o streak for 0, seja encorajador para começar. Se for alto, desafie-o a manter a consistência.
    Responda em Português do Brasil.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "Continue firme no seu propósito!";
  } catch (error) {
    console.error("Error fetching motivation:", error);
    return "A consistência é a chave para o sucesso. Continue!";
  }
};