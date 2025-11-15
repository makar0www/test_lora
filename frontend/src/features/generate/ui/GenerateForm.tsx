import { useState } from "react";
import { useGenerateImage } from "../model/useGenerateImage";

interface Props {
  onGenerated: (url: string) => void; // передаём URL в родителя
}

export function GenerateForm({ onGenerated }: Props) {
  const [prompt, setPrompt] = useState("");
  const { create, loading } = useGenerateImage();

  async function submit() {
    if (!prompt.trim()) return;

    const url = await create(prompt);
    if (url) onGenerated(url);

    setPrompt("");
  }

  return (
    <div>
      <input
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Введите промпт..."
        style={{ width: "100%", padding: 10 }}
      />

      <button
        onClick={submit}
        disabled={loading}
        style={{ marginTop: 10, padding: "10px 20px" }}
      >
        {loading ? "Generating..." : "Generate"}
      </button>
    </div>
  );
}
