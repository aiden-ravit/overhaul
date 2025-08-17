"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar"
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
import { Button } from "@/components/ui/button"
import {
  Home,
  Users,
  Settings,
  LogOut,
  Menu
} from "lucide-react"

interface AdminLayoutProps {
  children: React.ReactNode
}

const menuItems = [
  {
    title: "대시보드",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "사용자 관리",
    url: "/users",
    icon: Users,
  },
  {
    title: "설정",
    url: "/settings",
    icon: Settings,
  },
]

export function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter()
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)

  const handleLogout = () => {
    try {
      localStorage.removeItem('auth-token')
      router.push('/')
    } catch (error) {
      console.error('로그아웃 중 오류:', error)
      router.push('/')
    }
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar variant="inset">
          <SidebarHeader>
            <div className="flex items-center gap-2 px-4 py-2">
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Menu className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">Overhaul Admin</span>
                <span className="truncate text-xs">관리자 시스템</span>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>메뉴</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <a href={item.url}>
                          <item.icon />
                          <span>{item.title}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => setShowLogoutDialog(true)}>
                  <LogOut />
                  <span>로그아웃</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
          <SidebarRail />
        </Sidebar>

        <main className="flex-1 flex flex-col border-l">
          <header className="flex h-16 items-center gap-4 border-b bg-background px-4 lg:px-6">
            <SidebarTrigger className="-ml-1" />
            <div className="w-full flex-1">
              <h1 className="text-lg font-semibold">Overhaul 관리자 시스템</h1>
            </div>
          </header>

          <div className="flex-1 p-4 lg:p-6">
            {children}
          </div>
        </main>
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
            <AlertDialogAction onClick={handleLogout}>
              로그아웃
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SidebarProvider>
  )
}
