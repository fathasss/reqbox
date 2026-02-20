import axios from 'axios';

interface RequestConfig {
  url: string;
  method: string;
  headers: Record<string, string>;
  params: Record<string, string>;
  body: any;
  timeout?: number;
}

export interface ApiResponse {
  status: number;
  data: any;
  headers: any;
  duration: number;
  ok: boolean;
  error?: string;
}

export const executeRequest = async (config: RequestConfig): Promise<ApiResponse> => {
  const { url, method, headers, params, body, timeout = 10000 } = config;

  const startTime = Date.now();

  try {
    const response = await axios({
      url,
      method: method as any,
      headers,
      params,
      data: body,
      timeout,
      // Disable automatic validation of status codes to handle all responses
      validateStatus: () => true,
    });

    const endTime = Date.now();
    const duration = endTime - startTime;

    return {
      status: response.status,
      data: response.data,
      headers: response.headers,
      duration,
      ok: response.status >= 200 && response.status < 300,
    };
  } catch (error: any) {
    const endTime = Date.now();
    const duration = endTime - startTime;

    return {
      status: error.response?.status || 0,
      data: error.response?.data || error.message,
      headers: error.response?.headers || {},
      duration,
      ok: false,
      error: error.message,
    };
  }
};
