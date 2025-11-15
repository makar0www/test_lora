const API_URL = "https://blackjack-proved-limited-street.trycloudflare.com";

export async function generateImage(prompt: string) {
  const res = await fetch(`${API_URL}/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });

  if (!res.ok) throw new Error("Ошибка генерации");
  return res.json();
}
