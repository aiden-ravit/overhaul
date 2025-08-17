"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { usePathname } from "next/navigation"
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
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { Separator } from "@/components/ui/separator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Home,
  Package,
  Users,
  ClipboardList,
  Settings,
  LogOut,
  Menu,
  ChevronRight,
  User,
  Shield,
  Bell,
  ChevronsUpDown
} from "lucide-react"

interface AdminLayoutProps {
  children: React.ReactNode
}

const mainMenuItems = [
  {
    title: "대시보드",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "상품",
    url: "/products",
    icon: Package,
  },
  {
    title: "사용자",
    url: "/users",
    icon: Users,
  },
  {
    title: "설정",
    url: "/settings",
    icon: Settings,
  },
]

const serviceMenuItems = [
  {
    title: "AS관리",
    icon: ClipboardList,
    subItems: [
      {
        title: "접수현황",
        url: "/service-requests",
      },
    ],
  },
]

export function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)
  const [expandedMenus, setExpandedMenus] = useState<string[]>([])

  // localStorage에서 확장된 메뉴 상태 로드
  useEffect(() => {
    const savedExpandedMenus = localStorage.getItem('sidebar-expanded-menus')
    if (savedExpandedMenus) {
      try {
        setExpandedMenus(JSON.parse(savedExpandedMenus))
      } catch (error) {
        console.error('확장 메뉴 상태 로드 실패:', error)
      }
    }
  }, [])

  const getBreadcrumbs = () => {
    const pathSegments = pathname.split('/').filter(Boolean)
    const breadcrumbs: { name: string; href: string; isLast: boolean }[] = []

    const pathMap: Record<string, string> = {
      'dashboard': '대시보드',
      'products': '상품',
      'users': '사용자',
      'service-requests': 'AS접수',
      'settings': '설정'
    }

    // 홈은 현재 페이지가 대시보드가 아닐 때만 추가
    if (pathname !== '/dashboard') {
      breadcrumbs.push({ name: '홈', href: '/dashboard', isLast: false })
    }

    pathSegments.forEach((segment, index) => {
      if (pathMap[segment]) {
        const href = '/' + pathSegments.slice(0, index + 1).join('/')
        const isLast = index === pathSegments.length - 1
        breadcrumbs.push({ name: pathMap[segment], href, isLast })
      }
    })

    return breadcrumbs
  }

  const toggleMenu = (menuTitle: string) => {
    const newExpandedMenus = expandedMenus.includes(menuTitle)
      ? expandedMenus.filter(item => item !== menuTitle)
      : [...expandedMenus, menuTitle]

    setExpandedMenus(newExpandedMenus)

    // localStorage에 상태 저장
    try {
      localStorage.setItem('sidebar-expanded-menus', JSON.stringify(newExpandedMenus))
    } catch (error) {
      console.error('확장 메뉴 상태 저장 실패:', error)
    }
  }

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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center gap-2 px-2 py-1.5 cursor-pointer hover:bg-sidebar-accent rounded-md">
                  <div className="flex aspect-square size-8 items-center justify-center rounded-[12px] bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold text-sm">
                    A
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">admin</span>
                    <span className="truncate text-xs text-muted-foreground">관리자</span>
                  </div>
                  <ChevronsUpDown className="h-4 w-4 stroke-1" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="start" side="right">
                <DropdownMenuLabel>내 계정</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>프로필</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Bell className="mr-2 h-4 w-4" />
                  <span>알림 설정</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setShowLogoutDialog(true)}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>로그아웃</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>관리</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {mainMenuItems.map((item) => (
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

            <SidebarGroup>
              <SidebarGroupLabel>서비스</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {serviceMenuItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        onClick={() => toggleMenu(item.title)}
                        className="w-full justify-between hover:bg-sidebar-accent"
                      >
                        <div className="flex items-center gap-2">
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </div>
                        <ChevronRight
                          className={`h-3 w-3 opacity-50 ${expandedMenus.includes(item.title) ? 'rotate-90' : ''
                            }`}
                          style={{ transition: 'transform 0.2s' }}
                        />
                      </SidebarMenuButton>

                      {expandedMenus.includes(item.title) && (
                        <div className="ml-4 mt-1 space-y-1 border-l border-sidebar-border pl-2">
                          {item.subItems.map((subItem) => (
                            <SidebarMenuButton key={subItem.title} asChild>
                              <a href={subItem.url} className="text-sm font-normal">
                                {subItem.title}
                              </a>
                            </SidebarMenuButton>
                          ))}
                        </div>
                      )}
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter>
            {/* 로그아웃은 프로필 드롭다운으로 이동 */}
          </SidebarFooter>
          <SidebarRail />
        </Sidebar>

        <main className="flex-1 flex flex-col border-l">
          <header className="flex h-16 items-center gap-1 border-b bg-background px-4 lg:px-6">
            <SidebarTrigger className="-ml-1" />
            <div className="flex-1">
              <h1 className="text-lg font-semibold">Overhaul 관리자 시스템</h1>
            </div>
            <ThemeToggle />
          </header>

          <div className="flex-1 p-4 lg:p-6">
            <div className="mb-6">
              <Breadcrumb>
                <BreadcrumbList>
                  {getBreadcrumbs().map((breadcrumb, index) => (
                    <React.Fragment key={`${breadcrumb.href}-${index}`}>
                      <BreadcrumbItem>
                        {breadcrumb.isLast ? (
                          <BreadcrumbPage>{breadcrumb.name}</BreadcrumbPage>
                        ) : (
                          <BreadcrumbLink href={breadcrumb.href}>
                            {breadcrumb.name}
                          </BreadcrumbLink>
                        )}
                      </BreadcrumbItem>
                      {!breadcrumb.isLast && <BreadcrumbSeparator />}
                    </React.Fragment>
                  ))}
                </BreadcrumbList>
              </Breadcrumb>
            </div>
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
