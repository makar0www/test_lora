import { useEffect, useState } from "react";
import { GenerateForm } from "../../../features/generate/ui";

const API_URL = "https://calculators-swaziland-coated-reported.trycloudflare.com";

// Тип для элемента ленты
interface ImageInfo {
  fileName: string;
}

export function FeedPage() {
  const [images, setImages] = useState<string[]>([]);

  // 📌 Загрузка списка изображений
  async function loadImages() {
    const res = await fetch(`${API_URL}/images-list`);
    const data: ImageInfo[] = await res.json(); // типизированный ответ

    const formatted = data.map((i) => `${API_URL}/images/${i.fileName}`);
    setImages(formatted.reverse());
  }

  // 📌 Загружаем изображения при входе
  useEffect(() => {
    async function init() {
      await loadImages();
    }
    init();
  }, []);

  // 📌 Когда изображение сгенерировано — обновляем ленту
  async function handleGenerated(url: string) {
    // локальное мгновенное добавление
    setImages((prev) => [`${API_URL}${url}`, ...prev]);

    // затем полный ресинк ленты
    await loadImages();
  }

  return (
    <div style={{ padding: 20, maxWidth: 600, margin: "0 auto" }}>
      <h1>Image Generator (shared feed)</h1>

      <GenerateForm onGenerated={handleGenerated} />

      <div style={{ marginTop: 20 }}>
        {images.map((src, index) => (
          <img
            key={index}
            src={src}
            alt="Generated"
            style={{
              width: "100%",
              marginBottom: 10,
              borderRadius: 8,
            }}
          />
        ))}
      </div>
    </div>
  );
}
