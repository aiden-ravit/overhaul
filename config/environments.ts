// 환경별 도메인 설정
export const environments = {
  development: {
    WORKER_DOMAIN: 'overhaul-as-system-dev.ravit-cloud.workers.dev',
    PAGES_DOMAIN: 'overhaul-frontend-dev.pages.dev',
    API_BASE_URL: 'https://overhaul-as-system-dev.ravit-cloud.workers.dev',
    FRONTEND_URL: 'https://overhaul-frontend-dev.pages.dev',
  },
  production: {
    WORKER_DOMAIN: 'overhaul-as-system-prod.ravit-cloud.workers.dev', 
    PAGES_DOMAIN: 'overhaul-frontend-prod.pages.dev',
    API_BASE_URL: 'https://overhaul-as-system-prod.ravit-cloud.workers.dev',
    FRONTEND_URL: 'https://overhaul-frontend-prod.pages.dev',
  },
  local: {
    WORKER_DOMAIN: 'localhost:8787',
    PAGES_DOMAIN: 'localhost:3000', 
    API_BASE_URL: 'http://localhost:8787',
    FRONTEND_URL: 'http://localhost:3000',
  },
} as const;

export type Environment = keyof typeof environments;

// 현재 환경 감지
export function getCurrentEnvironment(): Environment {
  // 브라우저 환경에서는 NODE_ENV 또는 기본값 사용
  if (typeof window !== 'undefined') {
    return (process.env.NODE_ENV as Environment) || 'development';
  }
  
  // 서버 환경에서는 ENVIRONMENT 변수 사용
  const env = process.env.ENVIRONMENT || process.env.NODE_ENV || 'development';
  return env as Environment;
}

// 현재 환경의 설정 가져오기
export function getEnvironmentConfig() {
  const currentEnv = getCurrentEnvironment();
  return environments[currentEnv];
}

// 특정 환경의 설정 가져오기
export function getEnvironmentConfigFor(env: Environment) {
  return environments[env];
}
