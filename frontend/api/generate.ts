import type { ApiRequest, ApiResponse } from "../types/vercel";

const BACKEND =
  "https://calculators-swaziland-coated-reported.trycloudflare.com";

interface GenerateResponse {
  imageUrl: string;
}

interface GenerateBody {
  prompt: string;
}

export default async function handler(
  req: ApiRequest<GenerateBody>,
  res: ApiResponse<GenerateResponse>
) {
  const response = await fetch(`${BACKEND}/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req.body),
  });

  const data: GenerateResponse = await response.json();
  res.status(200).json(data);
}
