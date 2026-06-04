// API Response wrapper types
export interface ApiErrorResponse {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export type ApiResult<T> = 
  | { ok: true; data: T }
  | { ok: false; error: ApiErrorResponse };