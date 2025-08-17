import { AdminLayout } from "@/components/layout/AdminLayout"

export default function ServiceRequests() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">AS 접수 관리</h2>
          <p className="text-muted-foreground">
            AS 접수 현황을 확인하고 처리 상태를 관리할 수 있습니다.
          </p>
        </div>

        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex items-center justify-center h-32">
            <p className="text-muted-foreground">
              AS 접수 관리 기능이 구현될 예정입니다.
            </p>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
