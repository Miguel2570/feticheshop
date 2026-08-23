// lib/translate.ts
import * as deepl from "deepl-node";

const translator = new deepl.Translator(process.env.DEEPL_API_KEY!);

export async function translateToPT(text: string | null | undefined): Promise<string> {
  if (!text || text.trim() === "") {
    return "";
  }

  try {
    const result = await translator.translateText(text, "es", "pt-PT");
    return result.text;
  } catch (error) {
    console.error("Erro ao traduzir:", error);
    return text;
  }
}