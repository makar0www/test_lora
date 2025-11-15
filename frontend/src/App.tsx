import { useState } from "react";

interface GenerateResponse {
  imageUrl: string;
}

function App() {
  const [prompt, setPrompt] = useState<string>("");
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  async function generateImage() {
    if (!prompt.trim()) return;

    setLoading(true);

    try {
      const response = await fetch("https://lovely-dodos-hunt.loca.lt/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      const data: GenerateResponse = await response.json();

      const url = "https://lovely-dodos-hunt.loca.lt" + data.imageUrl;

      // Добавить новую картинку в начало списка
      setImages((prev) => [url, ...prev]);
    } catch (error) {
      console.error("Ошибка запроса:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h1>Image Generator</h1>

      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Введите промпт..."
        style={{ width: "100%", padding: "10px" }}
      />

      <button
        onClick={generateImage}
        disabled={loading}
        style={{
          marginTop: "10px",
          padding: "10px 20px",
          cursor: "pointer",
          opacity: loading ? 0.7 : 1,
        }}
      >
        {loading ? "Generating..." : "Generate"}
      </button>

      <div style={{ marginTop: "20px" }}>
        {images.map((src, index) => (
          <img
            key={index}
            src={src}
            alt="Generated"
            style={{
              width: "100%",
              marginBottom: "10px",
              borderRadius: "8px",
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default App;