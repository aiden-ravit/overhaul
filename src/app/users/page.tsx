import { AdminLayout } from "@/components/layout/AdminLayout"

export default function Users() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">사용자 관리</h2>
          <p className="text-muted-foreground">
            시스템 사용자를 관리하고 권한을 설정할 수 있습니다.
          </p>
        </div>

        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex items-center justify-center h-32">
            <p className="text-muted-foreground">
              사용자 관리 기능이 구현될 예정입니다.
            </p>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
