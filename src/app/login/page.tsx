"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { apiClient } from "@/lib/api"

export default function LoginPage() {
  const [id, setId] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [showErrorDialog, setShowErrorDialog] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // 커스텀 유효성 검사
    if (!id.trim()) {
      setErrorMessage("아이디를 입력해주세요.")
      setShowErrorDialog(true)
      setIsLoading(false)
      // 포커스 제거
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur()
      }
      return
    }

    if (!password.trim()) {
      setErrorMessage("비밀번호를 입력해주세요.")
      setShowErrorDialog(true)
      setIsLoading(false)
      // 포커스 제거
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur()
      }
      return
    }

    try {
      const response = await apiClient.login({ id, password })

      if (response.success) {
        console.log("로그인 성공:", response.user)

        // 토큰을 localStorage에 저장 (임시)
        if (response.token) {
          localStorage.setItem('auth-token', response.token)
        }

        // 대시보드로 리다이렉트
        router.push('/dashboard')
      }
    } catch (error: any) {
      console.error("로그인 실패:", error)
      setErrorMessage(error.message || "로그인에 실패했습니다.")
      setShowErrorDialog(true)
      // 포커스 제거
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur()
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="absolute top-4 right-4 lg:top-6 lg:right-6">
        <ThemeToggle />
      </div>

      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-foreground">
            관리자 로그인
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Overhaul AS System
          </p>
        </div>

        <Card>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Input
                  id="id"
                  type="text"
                  placeholder="아이디"
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Input
                  id="password"
                  type="password"
                  placeholder="비밀번호"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "로그인 중..." : "로그인"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={showErrorDialog} onOpenChange={setShowErrorDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>오류</AlertDialogTitle>
            <AlertDialogDescription>
              {errorMessage}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowErrorDialog(false)}>
              확인
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
