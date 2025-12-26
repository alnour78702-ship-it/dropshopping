
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const extractProductData = async (url: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `حلل هذا الرابط للمنتج: ${url}. قم باستخراج البيانات التالية للتجارة الإلكترونية (الدروبشيبينغ).
      يجب أن يكون العنوان والوصف باللغة العربية ومحسنين لمحركات البحث (SEO).
      إذا لم تستطع جلب البيانات الحية، قم بإنشاء بيانات افتراضية واقعية بناءً على محتوى الرابط المفترض.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            price: { type: Type.NUMBER },
            description: { type: Type.STRING },
            inventory: { type: Type.INTEGER },
            images: { type: Type.ARRAY, items: { type: Type.STRING } },
            category: { type: Type.STRING },
            suggestedRetailPrice: { type: Type.NUMBER },
            tags: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["title", "price", "description", "inventory", "images"]
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini Error:", error);
    return {
      title: "منتج تجريبي عالي الجودة",
      price: 29.99,
      description: "وصف منتج احترافي تم توليده آلياً للدروبشيبينغ.",
      inventory: 50,
      images: ["https://picsum.photos/600/600?random=import"],
      category: "عام",
      suggestedRetailPrice: 45.00,
      tags: ["ترند", "دروبشيبينغ"]
    };
  }
};

export const researchWinningProducts = async (niche: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `ابحث عن أفضل 3 منتجات رابحة حالياً في مجال "${niche}" للدروبشيبينغ. 
      قدم بيانات عن الطلب، الأرباح المتوقعة، وسبب اختيار كل منتج.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              productName: { type: Type.STRING },
              demandLevel: { type: Type.STRING, enum: ["high", "medium", "low"] },
              estimatedProfit: { type: Type.STRING },
              competitionLevel: { type: Type.STRING },
              reasoning: { type: Type.STRING }
            },
            required: ["productName", "demandLevel", "estimatedProfit", "competitionLevel", "reasoning"]
          }
        }
      }
    });
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Research Error:", error);
    return [];
  }
};
