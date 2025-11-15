import { API_URL } from "../../../shared/api/config";

export async function generateImage(prompt: string) {
  const res = await fetch(`${API_URL}/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });

  return res.json();
}
