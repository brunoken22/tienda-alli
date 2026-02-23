const API_BASE_URL = process.env.NEXT_PUBLIC_API || "http://localhost:3000";

type ResponseData = {
  data: any;
  success: boolean;
  message?: string;
};
async function request<T>(endpoint: string, options?: RequestInit): Promise<ResponseData> {
  const url = `${API_BASE_URL}/api${endpoint}`;

  const isFormData = options?.body instanceof FormData;

  const response = await fetch(url, {
    ...options,
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...options?.headers,
    },
  });

  if (!response.ok) {
    console.error(`API Error: ${response.status} ${response.statusText} - ${url}`);
    throw new Error(`API Error: ${response.statusText}`);
  }

  return (await response.json()) as ResponseData;
}

export const api = {
  get: <T>(endpoint: string) => request<T>(endpoint, { method: "GET" }),

  post: <T>(endpoint: string, data?: unknown) =>
    request<T>(endpoint, {
      method: "POST",
      body: data instanceof FormData ? data : data ? JSON.stringify(data) : undefined,
    }),

  patch: <T>(endpoint: string, data?: unknown) =>
    request<T>(endpoint, {
      method: "PATCH",
      body: data instanceof FormData ? data : data ? JSON.stringify(data) : undefined,
    }),

  delete: <T>(endpoint: string) => request<T>(endpoint, { method: "DELETE" }),
};
