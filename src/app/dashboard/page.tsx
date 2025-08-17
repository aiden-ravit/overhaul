import { AdminLayout } from "@/components/layout/AdminLayout"

export default function Dashboard() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">대시보드</h2>
          <p className="text-muted-foreground">
            시스템 현황을 한눈에 확인하세요.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="tracking-tight text-sm font-medium">총 사용자</h3>
            </div>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              전월 대비 +0%
            </p>
          </div>

          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="tracking-tight text-sm font-medium">활성 세션</h3>
            </div>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              현재 접속 중인 사용자
            </p>
          </div>

          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="tracking-tight text-sm font-medium">시스템 상태</h3>
            </div>
            <div className="text-2xl font-bold">정상</div>
            <p className="text-xs text-muted-foreground">
              모든 서비스 운영 중
            </p>
          </div>

          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="tracking-tight text-sm font-medium">데이터베이스</h3>
            </div>
            <div className="text-2xl font-bold">연결됨</div>
            <p className="text-xs text-muted-foreground">
              응답 시간: 12ms
            </p>
          </div>
        </div>

        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <h3 className="text-lg font-medium mb-4">최근 활동</h3>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              아직 활동 내역이 없습니다.
            </p>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
