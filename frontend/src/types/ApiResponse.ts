// src/types/ApiResponse.ts
export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}
