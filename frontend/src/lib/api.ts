import { 
  User, 
  MedicalDocument, 
  DocumentSummary, 
  DocumentListResponse, 
  ChatConversation, 
  ChatMessage, 
  UserPreference 
} from '../types';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

class ApiClient {
  private getToken(): string | null {
    return localStorage.getItem('medimind_token');
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = this.getToken();
    const headers: Record<string, string> = {
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    if (!(options.body instanceof FormData) && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('medimind_token');
      localStorage.removeItem('medimind_user');
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
        window.location.href = '/login';
      }
    }

    if (!response.ok) {
      let errorMessage = 'An unexpected error occurred.';
      try {
        const errorData = await response.json();
        errorMessage = errorData.detail || errorData.message || errorMessage;
      } catch {
        errorMessage = `HTTP Error ${response.status}: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    return response.json();
  }

  // --- Auth & Profile ---
  async register(data: any): Promise<{ access_token: string; user: User }> {
    return this.request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async login(data: any): Promise<{ access_token: string; user: User }> {
    return this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async logout(): Promise<void> {
    try {
      await this.request('/api/auth/logout', { method: 'POST' });
    } finally {
      localStorage.removeItem('medimind_token');
      localStorage.removeItem('medimind_user');
    }
  }

  async getMe(): Promise<User> {
    return this.request('/api/auth/me');
  }

  async updateProfile(data: { full_name?: string; age?: number; gender?: string; blood_group?: string }): Promise<User> {
    return this.request('/api/users/me', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async updatePreferences(data: Partial<UserPreference>): Promise<UserPreference> {
    return this.request('/api/users/me/preferences', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteAccount(): Promise<void> {
    await this.request('/api/users/me', { method: 'DELETE' });
    localStorage.removeItem('medimind_token');
    localStorage.removeItem('medimind_user');
  }

  // --- Documents ---
  async uploadDocument(file: File): Promise<MedicalDocument> {
    const formData = new FormData();
    formData.append('file', file);
    return this.request('/api/documents/upload', {
      method: 'POST',
      body: formData,
    });
  }

  async listDocuments(params: {
    search?: string;
    status?: string;
    document_type?: string;
    sort_by?: string;
    order?: string;
    page?: number;
    limit?: number;
  } = {}): Promise<DocumentListResponse> {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.status) query.append('status', params.status);
    if (params.document_type) query.append('document_type', params.document_type);
    if (params.sort_by) query.append('sort_by', params.sort_by);
    if (params.order) query.append('order', params.order);
    if (params.page) query.append('page', params.page.toString());
    if (params.limit) query.append('limit', params.limit.toString());

    return this.request(`/api/documents?${query.toString()}`);
  }

  async getDocument(id: string): Promise<MedicalDocument> {
    return this.request(`/api/documents/${id}`);
  }

  async getDocumentStatus(id: string): Promise<{ id: string; status: string; error_message?: string; updated_at: string }> {
    return this.request(`/api/documents/${id}/status`);
  }

  async getDocumentContent(id: string): Promise<{ id: string; original_filename: string; extracted_text: string; page_count: number }> {
    return this.request(`/api/documents/${id}/content`);
  }

  async deleteDocument(id: string): Promise<void> {
    return this.request(`/api/documents/${id}`, { method: 'DELETE' });
  }

  async retryDocument(id: string): Promise<{ id: string; status: string }> {
    return this.request(`/api/documents/${id}/retry`, { method: 'POST' });
  }

  getDownloadUrl(id: string): string {
    const token = this.getToken();
    return `${BASE_URL}/api/documents/${id}/download?token=${token || ''}`;
  }

  // --- AI Summaries ---
  async generateSummary(documentId: string, language: string = 'en', forceRefresh: boolean = false): Promise<DocumentSummary> {
    return this.request(`/api/ai/documents/${documentId}/summarize`, {
      method: 'POST',
      body: JSON.stringify({ language, force_refresh: forceRefresh }),
    });
  }

  async getSummary(documentId: string): Promise<DocumentSummary> {
    return this.request(`/api/ai/documents/${documentId}/summary`);
  }

  // --- AI Chat ---
  async createConversation(data: { title?: string; selected_document_id?: string }): Promise<ChatConversation> {
    return this.request('/api/chat/conversations', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async listConversations(): Promise<ChatConversation[]> {
    return this.request('/api/chat/conversations');
  }

  async getConversation(id: string): Promise<ChatConversation> {
    return this.request(`/api/chat/conversations/${id}`);
  }

  async sendMessage(conversationId: string, content: string, language: string = 'en', selectedDocumentIds: string[] = []): Promise<ChatMessage> {
    return this.request(`/api/chat/conversations/${conversationId}/messages`, {
      method: 'POST',
      body: JSON.stringify({
        content,
        language,
        selected_document_ids: selectedDocumentIds,
      }),
    });
  }

  async deleteConversation(id: string): Promise<void> {
    return this.request(`/api/chat/conversations/${id}`, { method: 'DELETE' });
  }

  // --- Health ---
  async checkHealth(): Promise<{ status: string; service: string }> {
    return this.request('/api/health');
  }

  async checkReady(): Promise<any> {
    return this.request('/api/ready');
  }
}

export const api = new ApiClient();
