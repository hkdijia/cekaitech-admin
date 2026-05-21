export interface ApiResponse<T> {
  data: T;
  success: boolean;
  code: string;
  msg: string;
  timestamp: number;
  reqId: string;
}

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? '';

export async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers ?? {})
    }
  });
  const body = (await response.json()) as Partial<ApiResponse<T>>;

  if (!response.ok || body.success === false) {
    throw new Error(body.msg || `请求失败：${response.status}`);
  }
  return body.data as T;
}
