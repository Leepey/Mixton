export const apiService = {
  // ������� ����� ��� ��������
  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';
    
    const response = await fetch(\\, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(HTTP error! status: \);
    }

    return response.json();
  },

  // GET ������
  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  },

  // POST ������
  async post<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // PUT ������
  async put<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // DELETE ������
  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  },
};
