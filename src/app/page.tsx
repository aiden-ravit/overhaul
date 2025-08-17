"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // 로그인 상태 확인 (localStorage에서 토큰 확인)
    const checkAuthAndRedirect = async () => {
      try {
        // 임시로 localStorage에서 토큰 확인
        const token = localStorage.getItem('auth-token')

        if (token) {
          // 로그인되어 있으면 대시보드로 이동
          router.replace('/dashboard')
        } else {
          // 로그인되어 있지 않으면 로그인 페이지로 이동
          router.replace('/login')
        }
      } catch (error) {
        // 에러 발생 시 로그인 페이지로 이동
        router.replace('/login')
      }
    }

    checkAuthAndRedirect()
  }, [router])

  // 리다이렉트 중 로딩 표시
  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoadingSpinner size="lg" />
    </div>
  )
}
