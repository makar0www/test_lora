export interface ApiRequest<T = unknown> {
  method?: string;
  body?: T;
}

export interface ApiResponse<T = unknown> {
  status: (code: number) => ApiResponse<T>;
  json: (data: T) => void;
}
