// 비밀번호 해싱 유틸리티
// 실제 운영환경에서는 bcrypt나 더 강력한 해싱 알고리즘 사용 권장

/**
 * 비밀번호를 SHA-256으로 해시화
 * @param password 원본 비밀번호
 * @returns 해시된 비밀번호
 */
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + 'overhaul-salt-2025'); // 솔트 추가
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

/**
 * 비밀번호 검증
 * @param password 입력된 비밀번호
 * @param hash 저장된 해시
 * @returns 일치 여부
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const hashedInput = await hashPassword(password);
  return hashedInput === hash;
}

/**
 * 기본 관리자 비밀번호 해시 생성 (개발용)
 */
export async function getDefaultAdminPasswordHash(): Promise<string> {
  return await hashPassword('qwe123!');
}
