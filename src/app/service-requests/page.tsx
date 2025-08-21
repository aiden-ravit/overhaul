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

// 임시 AS 접수 데이터
const serviceRequests = [
  {
    id: "1",
    customerName: "김철수",
    phone: "010-1234-5678",
    product: "아이폰 14 Pro",
    issue: "충전이 안됨",
    status: "접수완료",
    priority: "보통",
    assignedTo: "박기술",
    createdAt: "2024-01-15"
  },
  {
    id: "2",
    customerName: "이영희",
    phone: "010-2345-6789",
    product: "갤럭시 S23",
    issue: "화면 깨짐",
    status: "진행중",
    priority: "긴급",
    assignedTo: "김기술",
    createdAt: "2024-01-14"
  },
  {
    id: "3",
    customerName: "박민수",
    phone: "010-3456-7890",
    product: "MacBook Pro",
    issue: "부팅 안됨",
    status: "완료",
    priority: "보통",
    assignedTo: "이기술",
    createdAt: "2024-01-13"
  },
  {
    id: "4",
    customerName: "정수진",
    phone: "010-4567-8901",
    product: "iPad Air",
    issue: "터치 반응 없음",
    status: "접수완료",
    priority: "긴급",
    assignedTo: "최기술",
    createdAt: "2024-01-12"
  },
  {
    id: "5",
    customerName: "최동현",
    phone: "010-5678-9012",
    product: "AirPods Pro",
    issue: "소리 안남",
    status: "진행중",
    priority: "보통",
    assignedTo: "한기술",
    createdAt: "2024-01-11"
  },
  {
    id: "6",
    customerName: "한미영",
    phone: "010-6789-0123",
    product: "갤럭시 탭",
    issue: "배터리 빨리 닳음",
    status: "접수완료",
    priority: "보통",
    assignedTo: "윤기술",
    createdAt: "2024-01-10"
  },
  {
    id: "7",
    customerName: "윤태호",
    phone: "010-7890-1234",
    product: "ThinkPad",
    issue: "키보드 고장",
    status: "완료",
    priority: "긴급",
    assignedTo: "송기술",
    createdAt: "2024-01-09"
  },
  {
    id: "8",
    customerName: "송지은",
    phone: "010-8901-2345",
    product: "Sony 헤드폰",
    issue: "블루투스 연결 안됨",
    status: "진행중",
    priority: "보통",
    assignedTo: "김기술",
    createdAt: "2024-01-08"
  }
]

export default function ServiceRequests() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("전체")
  const [selectedPriority, setSelectedPriority] = useState("전체")
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  // 필터 옵션
  const statuses = ["전체", "접수완료", "진행중", "완료"]
  const priorities = ["전체", "긴급", "보통"]

  // 필터링된 데이터
  const filteredRequests = useMemo(() => {
    return serviceRequests.filter(request => {
      const matchesSearch = request.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.issue.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = selectedStatus === "전체" || request.status === selectedStatus
      const matchesPriority = selectedPriority === "전체" || request.priority === selectedPriority

      return matchesSearch && matchesStatus && matchesPriority
    })
  }, [searchTerm, selectedStatus, selectedPriority])

  // 페이징된 데이터
  const paginatedRequests = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredRequests.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredRequests, currentPage])

  // 전체 선택/해제
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(paginatedRequests.map(item => item.id))
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
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage)
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    setSelectedItems([]) // 페이지 변경 시 선택 해제
  }

  // 상태별 색상
  const getStatusColor = (status: string) => {
    switch (status) {
      case '접수완료':
        return 'bg-blue-100 text-blue-800'
      case '진행중':
        return 'bg-yellow-100 text-yellow-800'
      case '완료':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  // 우선순위별 색상
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case '긴급':
        return 'bg-red-100 text-red-800'
      case '보통':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">AS 접수 관리</h2>
            <p className="text-muted-foreground">
              AS 접수 현황을 확인하고 처리 상태를 관리할 수 있습니다.
            </p>
          </div>
          <Button>AS 접수</Button>
        </div>

        {/* 검색 및 필터 */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="고객명, 상품명, 문제로 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
          <div className="flex gap-2">
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

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  우선순위: {selectedPriority}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {priorities.map((priority) => (
                  <DropdownMenuItem
                    key={priority}
                    onClick={() => setSelectedPriority(priority)}
                  >
                    {priority}
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
                    checked={selectedItems.length === paginatedRequests.length && paginatedRequests.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>고객명</TableHead>
                <TableHead hideOnMobile>연락처</TableHead>
                <TableHead>상품</TableHead>
                <TableHead>문제</TableHead>
                <TableHead>상태</TableHead>
                <TableHead hideOnMobile>우선순위</TableHead>
                <TableHead hideOnMobile>담당자</TableHead>
                <TableHead hideOnMobile>접수일</TableHead>
                <TableHead className="text-right" hideOnMobile>작업</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedItems.includes(request.id)}
                      onCheckedChange={(checked) => handleSelectItem(request.id, checked as boolean)}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{request.customerName}</TableCell>
                  <TableCell hideOnMobile>{request.phone}</TableCell>
                  <TableCell>{request.product}</TableCell>
                  <TableCell className="max-w-xs truncate">{request.issue}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(request.status)}`}>
                      {request.status}
                    </span>
                  </TableCell>
                  <TableCell hideOnMobile>
                    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getPriorityColor(request.priority)}`}>
                      {request.priority}
                    </span>
                  </TableCell>
                  <TableCell hideOnMobile>{request.assignedTo}</TableCell>
                  <TableCell hideOnMobile>{request.createdAt}</TableCell>
                  <TableCell className="text-right" hideOnMobile>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm">상세보기</Button>
                      <Button variant="outline" size="sm">상태변경</Button>
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
            총 {filteredRequests.length}개 중 {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, filteredRequests.length)}개 표시
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
