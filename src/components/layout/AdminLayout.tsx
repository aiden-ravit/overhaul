"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { usePathname } from "next/navigation"
import { useCallback } from "react"
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
import { apiClient } from "@/lib/api"
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
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
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
  ChevronsUpDown,
  ArrowLeft,
  ArrowRight,
  RotateCcw
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
    icon: Package,
    subItems: [
      {
        title: "상품관리",
        url: "/products",
      },
    ],
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
    title: "AS",
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
  const [showSessionExpiredDialog, setShowSessionExpiredDialog] = useState(false)
  const [expandedMenus, setExpandedMenus] = useState<string[]>([])
  const [canGoBack, setCanGoBack] = useState(false)
  const [canGoForward, setCanGoForward] = useState(false)
  const [contentKey, setContentKey] = useState(0)

  // localStorage에서 확장된 메뉴 상태 로드
  useEffect(() => {
    // sessionStorage에서 임시 저장된 사이드바 상태 확인
    const savedSidebarState = sessionStorage.getItem('sidebar-state')
    if (savedSidebarState) {
      try {
        const sidebarState = JSON.parse(savedSidebarState)
        // 현재 경로와 저장된 경로가 같으면 사이드바 상태 복원
        if (sidebarState.pathname === pathname) {
          setExpandedMenus(sidebarState.expandedMenus)
        }
        // 사용 후 삭제
        sessionStorage.removeItem('sidebar-state')
      } catch (error) {
        console.error('사이드바 상태 복원 실패:', error)
      }
    } else {
      // 일반적인 localStorage에서 확장된 메뉴 상태 로드
      const savedExpandedMenus = localStorage.getItem('sidebar-expanded-menus')
      if (savedExpandedMenus) {
        try {
          setExpandedMenus(JSON.parse(savedExpandedMenus))
        } catch (error) {
          console.error('확장 메뉴 상태 로드 실패:', error)
        }
      }
    }
  }, [pathname])

  // API 클라이언트 세션 만료 콜백 설정
  useEffect(() => {
    apiClient.setSessionExpiredCallback(() => {
      setShowSessionExpiredDialog(true)
    })
  }, [])

  // 히스토리 상태 확인
  const checkHistoryState = useCallback(() => {
    if (typeof window !== 'undefined') {
      setCanGoBack(window.history.length > 1)

      // 앞으로가기 가능 여부 확인
      // 현재 위치가 히스토리의 마지막이 아닌 경우 앞으로가기 가능
      // sessionStorage에 히스토리 상태 저장
      const currentHistoryIndex = sessionStorage.getItem('history-index') || '0'
      const maxHistoryIndex = sessionStorage.getItem('max-history-index') || '0'

      setCanGoForward(parseInt(currentHistoryIndex) < parseInt(maxHistoryIndex))
    }
  }, [])

  useEffect(() => {
    // 초기 히스토리 상태 설정
    if (typeof window !== 'undefined') {
      const currentIndex = sessionStorage.getItem('history-index')
      if (!currentIndex) {
        sessionStorage.setItem('history-index', '0')
        sessionStorage.setItem('max-history-index', '0')
      }
    }

    checkHistoryState()
    // 라우트 변경 시 히스토리 상태 재확인
    const handleRouteChange = () => {
      checkHistoryState()
    }

    window.addEventListener('popstate', handleRouteChange)
    return () => {
      window.removeEventListener('popstate', handleRouteChange)
    }
  }, [checkHistoryState])

  // 활성 메뉴 체크 함수 (상위 메뉴는 active 하지 않음)
  const isMenuActive = (menuItem: any): boolean => {
    const normalizedPath = pathname.replace(/\/$/, '') || '/'

    if (menuItem.url) {
      return normalizedPath === menuItem.url
    }

    // 상위 메뉴는 active 표시하지 않음
    return false
  }

  const getBreadcrumbs = () => {
    // pathname 정규화 (trailing slash 제거)
    const normalizedPath = pathname.replace(/\/$/, '') || '/'

    const breadcrumbs: { name: string; href?: string; isLast: boolean; clickable: boolean }[] = []



    // 각 경로별 breadcrumb 생성
    switch (normalizedPath) {
      case '/':
      case '/dashboard':
        breadcrumbs.push({ name: '관리', isLast: false, clickable: false })
        breadcrumbs.push({ name: '대시보드', isLast: true, clickable: false })
        break

      case '/products':
        breadcrumbs.push({ name: '관리', isLast: false, clickable: false })
        breadcrumbs.push({ name: '상품', isLast: false, clickable: false })
        breadcrumbs.push({ name: '상품관리', isLast: true, clickable: false })
        break

      case '/users':
        breadcrumbs.push({ name: '관리', isLast: false, clickable: false })
        breadcrumbs.push({ name: '사용자', isLast: true, clickable: false })
        break

      case '/settings':
        breadcrumbs.push({ name: '관리', isLast: false, clickable: false })
        breadcrumbs.push({ name: '설정', isLast: true, clickable: false })
        break

      case '/service-requests':
        breadcrumbs.push({ name: '서비스', isLast: false, clickable: false })
        breadcrumbs.push({ name: 'AS', isLast: false, clickable: false })
        breadcrumbs.push({ name: '접수현황', isLast: true, clickable: false })
        break

      default:
        // 알 수 없는 경로의 경우 기본 처리
        const pathMap: Record<string, string> = {
          'dashboard': '대시보드',
          'products': '상품',
          'users': '사용자',
          'service-requests': 'AS접수',
          'settings': '설정'
        }

        const pathSegments = normalizedPath.split('/').filter(Boolean)
        if (pathSegments.length > 0) {
          const lastSegment = pathSegments[pathSegments.length - 1]
          const displayName = pathMap[lastSegment] || lastSegment
          breadcrumbs.push({
            name: displayName,
            isLast: true,
            clickable: false
          })
        }
    }

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

  const handleLogout = async () => {
    try {
      await apiClient.logout()
      router.push('/')
    } catch (error) {
      console.error('로그아웃 중 오류:', error)
      router.push('/')
    }
  }

  const handleSessionExpired = () => {
    setShowSessionExpiredDialog(false)
    router.push('/login')
  }

  const handleNavigation = (url: string) => {
    // 새로운 페이지로 이동할 때 히스토리 인덱스 업데이트
    const currentIndex = parseInt(sessionStorage.getItem('history-index') || '0')
    const newIndex = currentIndex + 1
    sessionStorage.setItem('history-index', newIndex.toString())
    sessionStorage.setItem('max-history-index', newIndex.toString())

    router.push(url)
  }

  const handleGoBack = () => {
    if (canGoBack) {
      // 현재 히스토리 인덱스 감소
      const currentIndex = parseInt(sessionStorage.getItem('history-index') || '0')
      sessionStorage.setItem('history-index', (currentIndex - 1).toString())

      router.back()
    }
  }

  const handleGoForward = () => {
    if (canGoForward) {
      // 현재 히스토리 인덱스 증가
      const currentIndex = parseInt(sessionStorage.getItem('history-index') || '0')
      sessionStorage.setItem('history-index', (currentIndex + 1).toString())

      router.forward()
    }
  }

  const handleRefresh = () => {
    window.location.reload()
  }

  return (
    <SidebarProvider>
      <ContextMenu>
        <ContextMenuTrigger className="flex min-h-screen w-full">
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
                      {mainMenuItems.map((item) => {
                        const isActive = isMenuActive(item)
                        return (
                          <SidebarMenuItem key={item.title}>
                            {item.subItems ? (
                              <>
                                <SidebarMenuButton
                                  onClick={() => toggleMenu(item.title)}
                                  className={`w-full justify-between hover:bg-sidebar-accent ${isActive ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium' : ''
                                    }`}
                                >
                                  <div className="flex items-center gap-2">
                                    <item.icon className="h-4 w-4" />
                                    <span>{item.title}</span>
                                  </div>
                                  <ChevronRight
                                    className={`h-3 w-3 opacity-50 ${expandedMenus.includes(item.title) ? 'rotate-90' : ''
                                      }`}
                                  />
                                </SidebarMenuButton>

                                {expandedMenus.includes(item.title) && (
                                  <div className="ml-4 mt-1 space-y-1 border-l border-sidebar-border pl-2">
                                    {item.subItems.map((subItem) => {
                                      const isSubActive = pathname.replace(/\/$/, '') === subItem.url
                                      return (
                                        <SidebarMenuButton
                                          key={subItem.title}
                                          onClick={() => handleNavigation(subItem.url)}
                                          className={`text-sm font-normal ${isSubActive ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium' : ''
                                            }`}
                                        >
                                          {subItem.title}
                                        </SidebarMenuButton>
                                      )
                                    })}
                                  </div>
                                )}
                              </>
                            ) : (
                              <SidebarMenuButton
                                onClick={() => handleNavigation(item.url)}
                                className={isActive ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium' : ''}
                              >
                                <item.icon />
                                <span>{item.title}</span>
                              </SidebarMenuButton>
                            )}
                          </SidebarMenuItem>
                        )
                      })}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup>
                  <SidebarGroupLabel>서비스</SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {serviceMenuItems.map((item) => {
                        const isActive = isMenuActive(item)
                        return (
                          <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                              onClick={() => toggleMenu(item.title)}
                              className={`w-full justify-between hover:bg-sidebar-accent ${isActive ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium' : ''
                                }`}
                            >
                              <div className="flex items-center gap-2">
                                <item.icon className="h-4 w-4" />
                                <span>{item.title}</span>
                              </div>
                              <ChevronRight
                                className={`h-3 w-3 opacity-50 ${expandedMenus.includes(item.title) ? 'rotate-90' : ''
                                  }`}
                              />
                            </SidebarMenuButton>

                            {expandedMenus.includes(item.title) && (
                              <div className="ml-4 mt-1 space-y-1 border-l border-sidebar-border pl-2">
                                {item.subItems.map((subItem) => {
                                  const isSubActive = pathname.replace(/\/$/, '') === subItem.url
                                  return (
                                    <SidebarMenuButton
                                      key={subItem.title}
                                      onClick={() => handleNavigation(subItem.url)}
                                      className={`text-sm font-normal ${isSubActive ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium' : ''
                                        }`}
                                    >
                                      {subItem.title}
                                    </SidebarMenuButton>
                                  )
                                })}
                              </div>
                            )}
                          </SidebarMenuItem>
                        )
                      })}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              </SidebarContent>

              <SidebarFooter>
                {/* 로그아웃은 프로필 드롭다운으로 이동 */}
              </SidebarFooter>
              <SidebarRail />
            </Sidebar>

            <main className="flex-1 flex flex-col border-l overflow-x-hidden bg-background">
              <header className="flex h-16 items-center gap-1 border-b bg-background px-6">
                <SidebarTrigger className="-ml-1" />
                <div className="flex-1">
                  <h1 className="text-lg font-semibold">Overhaul 관리자 시스템</h1>
                </div>
                <ThemeToggle />
              </header>

              <div className="flex-1 p-6 bg-background">
                <div className="mb-6">
                  <Breadcrumb>
                    <BreadcrumbList>
                      {getBreadcrumbs().map((breadcrumb, index) => (
                        <React.Fragment key={`${breadcrumb.name}-${index}`}>
                          <BreadcrumbItem>
                            {breadcrumb.isLast ? (
                              <BreadcrumbPage>{breadcrumb.name}</BreadcrumbPage>
                            ) : breadcrumb.clickable && breadcrumb.href ? (
                              <BreadcrumbLink href={breadcrumb.href}>
                                {breadcrumb.name}
                              </BreadcrumbLink>
                            ) : (
                              <span className="text-muted-foreground">
                                {breadcrumb.name}
                              </span>
                            )}
                          </BreadcrumbItem>
                          {!breadcrumb.isLast && <BreadcrumbSeparator />}
                        </React.Fragment>
                      ))}
                    </BreadcrumbList>
                  </Breadcrumb>
                </div>
                <div key={contentKey}>
                  {children}
                </div>
              </div>
            </main>
          </div>
        </ContextMenuTrigger>

        <ContextMenuContent>
          <ContextMenuItem
            onClick={handleGoBack}
            disabled={!canGoBack}
            className={!canGoBack ? "opacity-50 cursor-not-allowed" : ""}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            뒤로
          </ContextMenuItem>
          <ContextMenuItem
            onClick={handleGoForward}
            disabled={!canGoForward}
            className={!canGoForward ? "opacity-50 cursor-not-allowed" : ""}
          >
            <ArrowRight className="mr-2 h-4 w-4" />
            앞으로
          </ContextMenuItem>
          <ContextMenuItem onClick={handleRefresh}>
            <RotateCcw className="mr-2 h-4 w-4" />
            새로고침
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

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

      <AlertDialog open={showSessionExpiredDialog} onOpenChange={setShowSessionExpiredDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>세션 만료</AlertDialogTitle>
            <AlertDialogDescription>
              세션이 만료되었습니다.<br />
              다시 로그인해주세요.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={handleSessionExpired}>
              로그인으로 이동
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SidebarProvider>
  )
}
