// Cloudflare Worker API 서버
export interface Env {
  // KV 네임스페이스
  USERS: KVNamespace;

  // D1 데이터베이스
  DB: D1Database;

  // 환경변수
  JWT_SECRET: string;
  ENVIRONMENT: string;
  API_VERSION: string;
}

// CORS 헤더 설정
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400',
};

// 응답 헬퍼 함수
function jsonResponse(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders,
    },
  });
}

function errorResponse(message: string, status = 500) {
  return jsonResponse({ error: message }, status);
}

// JWT 헬퍼 (간단한 예시 - 실제로는 crypto-js 등 사용 권장)
async function verifyJWT(token: string, secret: string) {
  try {
    // 실제 구현에서는 proper JWT 라이브러리 사용
    // 여기서는 간단한 예시
    return { valid: true, payload: { userId: '1' } };
  } catch {
    return { valid: false, payload: null };
  }
}

// 라우터
async function handleRequest(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const path = url.pathname;

  // CORS preflight 처리
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // API 라우팅
  if (path.startsWith('/api/')) {
    return handleApiRequest(request, env, path);
  }

  // 기본 응답
  return jsonResponse({
    message: 'Overhaul API Server',
    version: env.API_VERSION,
    environment: env.ENVIRONMENT,
    endpoints: [
      'GET /api/health - 서버 상태 확인',
      'POST /api/auth/login - 로그인',
      'GET /api/auth/me - 사용자 정보',
      'GET /api/users - 사용자 목록',
    ],
  });
}

// API 요청 처리
async function handleApiRequest(request: Request, env: Env, path: string): Promise<Response> {
  const method = request.method;

  try {
    // Health Check
    if (path === '/api/health') {
      return jsonResponse({
        status: 'ok',
        timestamp: new Date().toISOString(),
        environment: env.ENVIRONMENT,
      });
    }

    // 인증 API
    if (path.startsWith('/api/auth/')) {
      return handleAuthRequest(request, env, path, method);
    }

    // 사용자 API
    if (path.startsWith('/api/users')) {
      return handleUsersRequest(request, env, path, method);
    }

    return errorResponse('API endpoint not found', 404);
  } catch (error: any) {
    console.error('API Error:', error);
    return errorResponse(error.message || 'Internal server error');
  }
}

// 비밀번호 해싱 함수
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + 'overhaul-salt-2025');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// 인증 API 처리
async function handleAuthRequest(request: Request, env: Env, path: string, method: string): Promise<Response> {
  if (path === '/api/auth/login' && method === 'POST') {
    const body = await request.json() as { email: string; password: string };

    try {
      // 데이터베이스에서 사용자 조회 (username으로 조회)
      const userResult = await env.DB.prepare(
        'SELECT id, username, password_hash, name, role_name, is_active FROM users WHERE username = ? AND is_active = 1'
      ).bind(body.email).first();

      if (!userResult) {
        return errorResponse('Invalid credentials', 401);
      }

      // 비밀번호 검증
      const inputPasswordHash = await hashPassword(body.password);
      if (inputPasswordHash !== userResult.password_hash) {
        return errorResponse('Invalid credentials', 401);
      }

      // JWT 토큰 생성 (실제로는 proper JWT 라이브러리 사용)
      const token = 'jwt-' + userResult.id + '-' + Date.now();

      // KV에 사용자 세션 저장
      await env.USERS.put(`session:${token}`, JSON.stringify({
        userId: userResult.id,
        username: userResult.username,
        name: userResult.name,
        role: userResult.role_name,
        loginAt: new Date().toISOString(),
      }), { expirationTtl: 3600 * 24 }); // 24시간

      return jsonResponse({
        success: true,
        token,
        user: {
          id: userResult.id,
          email: userResult.username, // username을 email로 호환
          name: userResult.name,
          role: userResult.role_name,
        },
      });
    } catch (error) {
      console.error('Database login error:', error);
      return errorResponse('Database error', 500);
    }
  }

  if (path === '/api/auth/me' && method === 'GET') {
    const authorization = request.headers.get('Authorization');
    if (!authorization?.startsWith('Bearer ')) {
      return errorResponse('Unauthorized', 401);
    }

    const token = authorization.slice(7);
    const session = await env.USERS.get(`session:${token}`);

    if (!session) {
      return errorResponse('Invalid token', 401);
    }

    const sessionData = JSON.parse(session);

    try {
      // 데이터베이스에서 최신 사용자 정보 조회
      const userResult = await env.DB.prepare(
        'SELECT id, username, name, role_name, is_active FROM users WHERE id = ? AND is_active = 1'
      ).bind(sessionData.userId).first();

      if (!userResult) {
        return errorResponse('User not found', 404);
      }

      return jsonResponse({
        user: {
          id: userResult.id,
          email: userResult.username, // username을 email로 호환
          name: userResult.name,
          role: userResult.role_name,
        },
      });
    } catch (error) {
      console.error('Database user lookup error:', error);
      // 세션 데이터로 fallback
      return jsonResponse({
        user: {
          id: sessionData.userId,
          email: sessionData.username,
          name: sessionData.name,
          role: sessionData.role,
        },
      });
    }
  }

  return errorResponse('Auth endpoint not found', 404);
}

// 사용자 API 처리
async function handleUsersRequest(request: Request, env: Env, path: string, method: string): Promise<Response> {
  // JWT 인증 확인
  const authorization = request.headers.get('Authorization');
  if (!authorization?.startsWith('Bearer ')) {
    return errorResponse('Unauthorized', 401);
  }

  const token = authorization.slice(7);
  const session = await env.USERS.get(`session:${token}`);

  if (!session) {
    return errorResponse('Invalid token', 401);
  }

  if (path === '/api/users' && method === 'GET') {
    // D1 데이터베이스에서 사용자 목록 조회
    try {
      const result = await env.DB.prepare(
        'SELECT id, username, name, role_name, is_active, created_at FROM users ORDER BY created_at DESC'
      ).all();

      return jsonResponse({
        users: result.results?.map((user: any) => ({
          id: user.id,
          email: user.username, // username을 email로 호환
          name: user.name,
          role: user.role_name,
          is_active: user.is_active,
          created_at: user.created_at,
        })) || [],
        total: result.results?.length || 0,
      });
    } catch (error) {
      console.error('Database users query error:', error);
      return errorResponse('Database error', 500);
    }
  }

  return errorResponse('Users endpoint not found', 404);
}

// Worker 메인 엔트리포인트
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    return handleRequest(request, env);
  },
};
