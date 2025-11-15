import { useState, useEffect } from "react";

interface GenerateResponse {
  imageUrl: string;
}

const API_URL = "https://calculators-swaziland-coated-reported.trycloudflare.com";

function App() {
  const [prompt, setPrompt] = useState<string>("");
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // 📌 Загружаем список всех изображений при входе
  async function loadImages() {
    try {
      const res = await fetch(`${API_URL}/images-list`);
      const data: string[] = await res.json();

      // Преобразуем пути в абсолютные ссылки
      const formatted = data.map((path) => `${API_URL}${path}`);

      setImages(formatted.reverse()); // последние сверху
    } catch (err) {
      console.error("Ошибка загрузки ленты:", err);
    }
  }

  useEffect(() => {
    loadImages();
  }, []);

  // 📌 Генерация изображения
  async function generateImage() {
    if (!prompt.trim()) return;

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      const data: GenerateResponse = await response.json();

      const url = `${API_URL}${data.imageUrl}`;

      // 1) Мгновенно показываем картинку
      setImages((prev) => [url, ...prev]);

      // 2) И обновляем ленту полностью
      fetch(`${API_URL}/images-list`)
        .then((r) => r.json())
        .then((list) => {
          const updated = list.map((item: string) => `${API_URL}${item}`);
          setImages(updated.reverse());
        });

    } catch (error) {
      console.error("Ошибка запроса:", error);
    } finally {
      setLoading(false);
      setPrompt("");
    }
  }

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h1>Image Generator (shared feed)</h1>

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
