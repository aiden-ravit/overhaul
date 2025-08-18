// API 클라이언트
import { getEnvironmentConfig } from '../../config/environments';

const API_BASE_URL = process.env.API_BASE_URL || getEnvironmentConfig().API_BASE_URL;

interface ApiResponse<T = any> {
  success?: boolean;
  error?: string;
  data?: T;
}

interface User {
  id: string;
  email: string;
  name: string;
}

interface LoginRequest {
  id: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  token: string;
  user: User;
}

interface DashboardStats {
  totalUsers: number;
  activeSessions: number;
  systemStatus: 'healthy' | 'warning' | 'error';
  databaseStatus: {
    connected: boolean;
    responseTime: number;
  };
  recentActivity?: Array<{
    id: string;
    type: string;
    description: string;
    timestamp: string;
  }>;
}

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;
  private onSessionExpired?: () => void;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;

    // 로컬스토리지에서 토큰 로드
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth-token');
    }
  }

  // 세션 만료 콜백 설정
  setSessionExpiredCallback(callback: () => void) {
    this.onSessionExpired = callback;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // 인증 토큰 추가
    if (this.token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${this.token}`,
      };
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json() as any;

      if (!response.ok) {
        // 401 Unauthorized - 세션 만료 또는 인증 실패
        if (response.status === 401) {
          // 토큰 제거
          this.setToken(null);

          // 클라이언트 사이드에서만 처리
          if (typeof window !== 'undefined') {
            // 세션 만료 콜백 호출
            if (this.onSessionExpired) {
              this.onSessionExpired();
            } else {
              // 폴백으로 직접 리다이렉션
              window.location.href = '/login';
            }
            return Promise.reject(new Error('세션 만료'));
          }
        }

        throw new Error(data.error || `HTTP ${response.status}`);
      }

      return data as T;
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  // 토큰 설정
  setToken(token: string | null) {
    this.token = token;
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('auth-token', token);
      } else {
        localStorage.removeItem('auth-token');
      }
    }
  }

  // 로그인
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await this.request<LoginResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    if (response.success && response.token) {
      this.setToken(response.token);
    }

    return response;
  }

  // 로그아웃
  async logout() {
    try {
      // 서버에 로그아웃 요청
      if (this.token) {
        await this.request('/api/auth/logout', {
          method: 'POST',
        });
      }
    } catch (error) {
      console.error('서버 로그아웃 실패:', error);
      // 에러가 나도 클라이언트 토큰은 제거
    } finally {
      // 클라이언트 토큰 제거
      this.setToken(null);
    }
  }

  // 현재 사용자 정보
  async getCurrentUser(): Promise<{ user: User }> {
    return this.request<{ user: User }>('/api/auth/me');
  }

  // 사용자 목록
  async getUsers(): Promise<{ users: User[]; total: number }> {
    return this.request<{ users: User[]; total: number }>('/api/users');
  }

  // 서버 상태 확인
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    return this.request<{ status: string; timestamp: string }>('/api/health');
  }

  // 대시보드 통계
  async getDashboardStats(): Promise<DashboardStats> {
    return this.request<DashboardStats>('/api/dashboard/stats');
  }
}

// 싱글톤 인스턴스
export const apiClient = new ApiClient();

// 타입 내보내기
export type { User, LoginRequest, LoginResponse, ApiResponse, DashboardStats };
