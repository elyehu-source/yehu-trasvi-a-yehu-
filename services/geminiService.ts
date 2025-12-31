
import { GoogleGenAI, Type } from "@google/genai";
import { WorkoutRoutine, GenerationConfig } from "../types";

export const generateWorkoutRoutine = async (config: GenerationConfig): Promise<WorkoutRoutine> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
  
  const prompt = `Crea una rutina de ejercicio completa y profesional para un usuario que busca mejorar en: ${config.goals.join(', ')}. 
  La intensidad deseada es ${config.intensity} y la duración total es de ${config.duration} minutos.
  
  INSTRUCCIONES ESPECIALES:
  - Si se incluyen objetivos como "Cervicales", "Lumbar" o "Dorsalgia", prioriza ejercicios de movilidad controlada, estiramientos específicos y fortalecimiento de la musculatura estabilizadora profunda.
  
  Estructura la respuesta obligatoriamente en JSON con tres secciones: warmUp, mainWorkout y coolDown.
  Para cada ejercicio, incluye un "imagePrompt" muy descriptivo en inglés centrado en el movimiento anatómico.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          totalDurationMinutes: { type: Type.NUMBER },
          warmUp: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              exercises: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    duration: { type: Type.STRING },
                    description: { type: Type.STRING },
                    tips: { type: Type.STRING },
                    imagePrompt: { type: Type.STRING }
                  },
                  required: ["name", "duration", "description", "tips", "imagePrompt"]
                }
              }
            },
            required: ["title", "description", "exercises"]
          },
          mainWorkout: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              exercises: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    duration: { type: Type.STRING },
                    reps: { type: Type.STRING },
                    sets: { type: Type.STRING },
                    description: { type: Type.STRING },
                    tips: { type: Type.STRING },
                    imagePrompt: { type: Type.STRING }
                  },
                  required: ["name", "duration", "description", "tips", "imagePrompt"]
                }
              }
            },
            required: ["title", "description", "exercises"]
          },
          coolDown: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              exercises: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    duration: { type: Type.STRING },
                    description: { type: Type.STRING },
                    tips: { type: Type.STRING },
                    imagePrompt: { type: Type.STRING }
                  },
                  required: ["name", "duration", "description", "tips", "imagePrompt"]
                }
              }
            },
            required: ["title", "description", "exercises"]
          },
          overallAdvice: { type: Type.STRING }
        },
        required: ["name", "totalDurationMinutes", "warmUp", "mainWorkout", "coolDown", "overallAdvice"]
      }
    }
  });

  const data = JSON.parse(response.text || "{}");
  return {
    ...data,
    id: Math.random().toString(36).substr(2, 9),
    goal: config.goals,
    createdAt: new Date().toISOString()
  };
};

export const generateImageForExercise = async (imagePrompt: string): Promise<string | null> => {
  if (!imagePrompt) return null;
  
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: `High-quality medical illustration of a person performing: ${imagePrompt}. Clean white background, professional clinical style, high resolution, 4k, realistic anatomy.`,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: "16:9"
        },
      },
    });

    // Verificación de seguridad de candidatos y partes
    const candidate = response.candidates?.[0];
    if (!candidate?.content?.parts) return null;

    for (const part of candidate.content.parts) {
      if (part.inlineData?.data) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Critical error in image generation:", error);
    return null;
  }
};
