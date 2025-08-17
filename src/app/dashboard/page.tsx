"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function Dashboard() {
  const router = useRouter()
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)

  const handleLogoutClick = () => {
    setShowLogoutDialog(true)
  }

  const handleLogoutConfirm = () => {
    try {
      // localStorage에서 토큰 제거
      localStorage.removeItem('auth-token')

      // 메인 페이지로 리다이렉트 (메인에서 로그인 페이지로 자동 리다이렉트됨)
      router.push('/')
    } catch (error) {
      console.error('로그아웃 중 오류:', error)
      // 에러가 발생해도 메인으로 이동
      router.push('/')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-8">
            대시보드
          </h1>
          <div className="bg-white shadow rounded-lg p-6">
            <p className="text-gray-600">
              대시보드 내용이 여기에 표시됩니다.
            </p>
            <p className="text-sm text-gray-500 mt-4 mb-6">
              아직 구현되지 않았습니다.
            </p>

            <Button
              onClick={handleLogoutClick}
              variant="outline"
              className="mt-4"
            >
              로그아웃
            </Button>
          </div>
        </div>
      </div>

      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>로그아웃 확인</AlertDialogTitle>
            <AlertDialogDescription>
              정말로 로그아웃하시겠습니까?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowLogoutDialog(false)}>
              취소
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleLogoutConfirm}>
              로그아웃
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
