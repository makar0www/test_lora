import type { ApiRequest, ApiResponse } from '../types/vercel';
import type { ImageInfo } from "../types/images";

const BACKEND =
  "https://calculators-swaziland-coated-reported.trycloudflare.com";

export default async function handler(
  req: ApiRequest,
  res: ApiResponse<ImageInfo[]>
) {
  const response = await fetch(`${BACKEND}/images-list`);
  const data: ImageInfo[] = await response.json();
  res.status(200).json(data);
}
