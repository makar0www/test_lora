import { useState } from "react";
import { generateImage } from "../api/generateImage";

export function useGenerateImage() {
  const [loading, setLoading] = useState(false);

  async function create(prompt: string) {
    setLoading(true);

    try {
      const data = await generateImage(prompt);
      return data.imageUrl; // "/images/..."
    } catch (e) {
      console.error("Ошибка:", e);
      return null;
    } finally {
      setLoading(false);
    }
  }

  return { create, loading };
}
