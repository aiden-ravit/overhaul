"use client"

import { AdminLayout } from "@/components/layout/AdminLayout"
import { apiClient, DashboardStats } from "@/lib/api"
import { useEffect, useState, useRef, useMemo, useCallback } from "react"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

// 전역 변수로 중복 호출 방지
let dashboardDataPromise: Promise<DashboardStats> | null = null

export default function Dashboard() {
  const [data, setData] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  const fetchDashboardData = useCallback(async () => {
    // 이미 진행 중인 요청이 있다면 재사용
    if (dashboardDataPromise) {
      try {
        const stats = await dashboardDataPromise
        setData(stats)
        setLoading(false)
        return
      } catch (err) {
        // 에러가 발생한 경우 새로운 요청 생성
        dashboardDataPromise = null
      }
    }

    // 이전 요청이 있다면 취소
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    // 새로운 AbortController 생성
    abortControllerRef.current = new AbortController()

    // 새로운 요청 생성
    dashboardDataPromise = apiClient.getDashboardStats()

    try {
      setLoading(true)
      setError(null)
      
      // 대시보드 통계 데이터 가져오기
      const stats = await dashboardDataPromise
      
      // 컴포넌트가 여전히 마운트되어 있는지 확인
      if (!abortControllerRef.current.signal.aborted) {
        setData(stats)
      }
    } catch (err: any) {
      // AbortError는 무시 (요청이 취소된 경우)
      if (err.name === 'AbortError') {
        return
      }
      
      console.error('대시보드 데이터 로드 실패:', err)
      setError('데이터를 불러오는데 실패했습니다.')
      
      // 에러 시 기본값 설정
      if (!abortControllerRef.current?.signal.aborted) {
        setData({
          totalUsers: 0,
          activeSessions: 0,
          systemStatus: 'error',
          databaseStatus: {
            connected: false,
            responseTime: 0
          }
        })
      }
      
      // 에러 발생 시 전역 변수 초기화
      dashboardDataPromise = null
    } finally {
      if (!abortControllerRef.current?.signal.aborted) {
        setLoading(false)
      }
    }
  }, [])

  useEffect(() => {
    fetchDashboardData()

    // cleanup 함수
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [fetchDashboardData])

  const getSystemStatusText = useMemo(() => (status: 'healthy' | 'warning' | 'error') => {
    switch (status) {
      case 'healthy':
        return '정상'
      case 'warning':
        return '주의'
      case 'error':
        return '오류'
      default:
        return '알 수 없음'
    }
  }, [])

  const getSystemStatusColor = useMemo(() => (status: 'healthy' | 'warning' | 'error') => {
    switch (status) {
      case 'healthy':
        return 'text-green-600'
      case 'warning':
        return 'text-yellow-600'
      case 'error':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }, [])

  const getDatabaseStatusText = useMemo(() => (connected: boolean) => {
    return connected ? '연결됨' : '연결 안됨'
  }, [])

  const getDatabaseStatusColor = useMemo(() => (connected: boolean) => {
    return connected ? 'text-green-600' : 'text-red-600'
  }, [])

  if (loading) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">대시보드</h2>
            <p className="text-muted-foreground">
              시스템 현황을 한눈에 확인하세요.
            </p>
          </div>
          
          <div className="flex items-center justify-center h-64">
            <LoadingSpinner size="lg" />
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">대시보드</h2>
          <p className="text-muted-foreground">
            시스템 현황을 한눈에 확인하세요.
          </p>
        </div>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border bg-card text-card-foreground p-6">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="tracking-tight text-sm font-medium">총 사용자</h3>
            </div>
            <div className="text-2xl font-bold">{data?.totalUsers || 0}</div>
            <p className="text-xs text-muted-foreground">
              등록된 사용자 수
            </p>
          </div>

          <div className="rounded-lg border bg-card text-card-foreground p-6">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="tracking-tight text-sm font-medium">활성 세션</h3>
            </div>
            <div className="text-2xl font-bold">{data?.activeSessions || 0}</div>
            <p className="text-xs text-muted-foreground">
              현재 접속 중인 사용자
            </p>
          </div>

          <div className="rounded-lg border bg-card text-card-foreground p-6">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="tracking-tight text-sm font-medium">시스템 상태</h3>
            </div>
            <div className={`text-2xl font-bold ${getSystemStatusColor(data?.systemStatus || 'error')}`}>
              {getSystemStatusText(data?.systemStatus || 'error')}
            </div>
            <p className="text-xs text-muted-foreground">
              {data?.systemStatus === 'healthy' ? '모든 서비스 운영 중' : 
               data?.systemStatus === 'warning' ? '일부 서비스 주의 필요' : '서비스 오류 발생'}
            </p>
          </div>

          <div className="rounded-lg border bg-card text-card-foreground p-6">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="tracking-tight text-sm font-medium">데이터베이스</h3>
            </div>
            <div className={`text-2xl font-bold ${getDatabaseStatusColor(data?.databaseStatus.connected || false)}`}>
              {getDatabaseStatusText(data?.databaseStatus.connected || false)}
            </div>
            <p className="text-xs text-muted-foreground">
              응답 시간: {data?.databaseStatus.responseTime || 0}ms
            </p>
          </div>
        </div>

        <div className="rounded-lg border bg-card text-card-foreground p-6">
          <h3 className="text-lg font-medium mb-4">최근 활동</h3>
          <div className="space-y-2">
            {data?.recentActivity && data.recentActivity.length > 0 ? (
              data.recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
                  <div>
                    <p className="text-sm font-medium">{activity.description}</p>
                    <p className="text-xs text-muted-foreground">{activity.type}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {new Date(activity.timestamp).toLocaleString()}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                아직 활동 내역이 없습니다.
              </p>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
