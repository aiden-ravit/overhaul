"use client"

import { AdminLayout } from "@/components/layout/AdminLayout"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { useState, useMemo } from "react"

// 임시 사용자 데이터
const users = [
  {
    id: "1",
    name: "김철수",
    email: "kim@example.com",
    role: "관리자",
    department: "IT팀",
    status: "활성",
    lastLogin: "2024-01-15"
  },
  {
    id: "2",
    name: "이영희",
    email: "lee@example.com",
    role: "사용자",
    department: "마케팅팀",
    status: "활성",
    lastLogin: "2024-01-14"
  },
  {
    id: "3",
    name: "박민수",
    email: "park@example.com",
    role: "사용자",
    department: "영업팀",
    status: "비활성",
    lastLogin: "2024-01-10"
  },
  {
    id: "4",
    name: "정수진",
    email: "jung@example.com",
    role: "관리자",
    department: "인사팀",
    status: "활성",
    lastLogin: "2024-01-15"
  },
  {
    id: "5",
    name: "최동현",
    email: "choi@example.com",
    role: "사용자",
    department: "개발팀",
    status: "활성",
    lastLogin: "2024-01-13"
  },
  {
    id: "6",
    name: "한미영",
    email: "han@example.com",
    role: "사용자",
    department: "디자인팀",
    status: "활성",
    lastLogin: "2024-01-12"
  },
  {
    id: "7",
    name: "윤태호",
    email: "yoon@example.com",
    role: "관리자",
    department: "재무팀",
    status: "활성",
    lastLogin: "2024-01-11"
  },
  {
    id: "8",
    name: "송지은",
    email: "song@example.com",
    role: "사용자",
    department: "고객지원팀",
    status: "비활성",
    lastLogin: "2024-01-08"
  }
]

export default function Users() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRole, setSelectedRole] = useState("전체")
  const [selectedDepartment, setSelectedDepartment] = useState("전체")
  const [selectedStatus, setSelectedStatus] = useState("전체")
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  // 필터 옵션
  const roles = ["전체", "관리자", "사용자"]
  const departments = ["전체", "IT팀", "마케팅팀", "영업팀", "인사팀", "개발팀", "디자인팀", "재무팀", "고객지원팀"]
  const statuses = ["전체", "활성", "비활성"]

  // 필터링된 데이터
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.department.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesRole = selectedRole === "전체" || user.role === selectedRole
      const matchesDepartment = selectedDepartment === "전체" || user.department === selectedDepartment
      const matchesStatus = selectedStatus === "전체" || user.status === selectedStatus

      return matchesSearch && matchesRole && matchesDepartment && matchesStatus
    })
  }, [searchTerm, selectedRole, selectedDepartment, selectedStatus])

  // 페이징된 데이터
  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredUsers.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredUsers, currentPage])

  // 전체 선택/해제
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(paginatedUsers.map(item => item.id))
    } else {
      setSelectedItems([])
    }
  }

  // 개별 아이템 선택/해제
  const handleSelectItem = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedItems(prev => [...prev, id])
    } else {
      setSelectedItems(prev => prev.filter(item => item !== id))
    }
  }

  // 선택된 아이템 삭제
  const handleDeleteSelected = () => {
    if (selectedItems.length > 0) {
      // 실제로는 API 호출로 삭제 처리
      setSelectedItems([])
    }
  }

  // 페이지 변경
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    setSelectedItems([]) // 페이지 변경 시 선택 해제
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">사용자</h2>
            <p className="text-muted-foreground">
              시스템 사용자를 관리하고 권한을 설정할 수 있습니다.
            </p>
          </div>
          <Button>사용자 추가</Button>
        </div>

        {/* 검색 및 필터 */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="이름, 이메일, 부서로 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  권한: {selectedRole}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {roles.map((role) => (
                  <DropdownMenuItem
                    key={role}
                    onClick={() => setSelectedRole(role)}
                  >
                    {role}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  부서: {selectedDepartment}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {departments.map((department) => (
                  <DropdownMenuItem
                    key={department}
                    onClick={() => setSelectedDepartment(department)}
                  >
                    {department}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  상태: {selectedStatus}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {statuses.map((status) => (
                  <DropdownMenuItem
                    key={status}
                    onClick={() => setSelectedStatus(status)}
                  >
                    {status}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* 선택된 아이템 작업 버튼 */}
        {selectedItems.length > 0 && (
          <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
            <span className="text-sm text-muted-foreground">
              {selectedItems.length}개 선택됨
            </span>
            <Button variant="outline" size="sm" onClick={handleDeleteSelected}>
              선택 삭제
            </Button>
          </div>
        )}

        {/* 테이블 */}
        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedItems.length === paginatedUsers.length && paginatedUsers.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>이름</TableHead>
                <TableHead>이메일</TableHead>
                <TableHead>권한</TableHead>
                <TableHead>부서</TableHead>
                <TableHead>상태</TableHead>
                <TableHead>마지막 로그인</TableHead>
                <TableHead className="text-right">작업</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedItems.includes(user.id)}
                      onCheckedChange={(checked) => handleSelectItem(user.id, checked as boolean)}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${user.role === '관리자'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800'
                      }`}>
                      {user.role}
                    </span>
                  </TableCell>
                  <TableCell>{user.department}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${user.status === '활성'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                      }`}>
                      {user.status}
                    </span>
                  </TableCell>
                  <TableCell>{user.lastLogin}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm">편집</Button>
                      <Button variant="outline" size="sm">삭제</Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* 페이징 */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            총 {filteredUsers.length}개 중 {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, filteredUsers.length)}개 표시
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              이전
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => handlePageChange(page)}
              >
                {page}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              다음
            </Button>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
