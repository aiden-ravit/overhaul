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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

// AS 접수 데이터
const serviceRequests = [
  { id: "1", branchName: "강남점", phone: "02-1234-5678", symptoms: "화면이 계속 깜빡거리고 간헐적으로 검은색으로 변하면서 터치가 안되는 현상이 반복됨", status: "접수", assignedTo: "김기사", createdAt: "2024-01-15" },
  { id: "2", branchName: "홍대점", phone: "02-2345-6789", symptoms: "전원 버튼을 눌러도 아무 반응이 없고 충전기를 꽂아도 LED 표시등이 켜지지 않음", status: "진행", assignedTo: "이기사", createdAt: "2024-01-14" },
  { id: "3", branchName: "신촌점", phone: "02-3456-7890", symptoms: "기계 내부에서 지속적으로 윙윙거리는 소음이 발생하며 진동도 함께 느껴짐", status: "완료", assignedTo: "박기사", createdAt: "2024-01-13" },
  { id: "4", branchName: "잠실점", phone: "02-4567-8901", symptoms: "냉각 기능이 전혀 작동하지 않아 음료가 미지근하게 나오고 압축기 소리도 들리지 않음", status: "접수", assignedTo: "최기사", createdAt: "2024-01-12" },
  { id: "5", branchName: "건대점", phone: "02-5678-9012", symptoms: "선택 버튼들이 눌러도 반응이 없거나 다른 메뉴가 선택되는 오작동 증상", status: "진행", assignedTo: "정기사", createdAt: "2024-01-11" },
  { id: "6", branchName: "명동점", phone: "02-6789-0123", symptoms: "온도 설정을 아무리 조절해도 항상 같은 온도로만 나오고 디스플레이에 오류 메시지 표시", status: "중단", assignedTo: "한기사", createdAt: "2024-01-10" },
  { id: "7", branchName: "서초점", phone: "02-7890-1234", symptoms: "기계 하단부에서 물이 지속적으로 새어나와 바닥이 항상 젖어있는 상태", status: "완료", assignedTo: "윤기사", createdAt: "2024-01-09" },
  { id: "8", branchName: "마포점", phone: "02-8901-2345", symptoms: "기계에서 탄 냄새와 함께 플라스틱 타는 냄새가 나며 가끔 연기도 보임", status: "접수", assignedTo: "송기사", createdAt: "2024-01-08" },
  { id: "9", branchName: "압구정점", phone: "02-9012-3456", symptoms: "동전 투입구에서 동전이 자꾸 빠져나오고 카드 결제도 인식되지 않는 결제 시스템 오류", status: "진행", assignedTo: "김기사", createdAt: "2024-01-07" },
  { id: "10", branchName: "이태원점", phone: "02-0123-4567", symptoms: "음료 배출구에서 음료가 제대로 나오지 않고 중간에 멈추는 현상이 지속됨", status: "접수", assignedTo: "이기사", createdAt: "2024-01-06" },
  { id: "11", branchName: "청담점", phone: "02-1357-2468", symptoms: "터치스크린이 일부 영역에서만 반응하고 나머지 부분은 터치가 되지 않음", status: "완료", assignedTo: "박기사", createdAt: "2024-01-05" },
  { id: "12", branchName: "삼성점", phone: "02-2468-1357", symptoms: "냉장고 온도가 너무 낮아 음료가 얼어버리고 온도 조절이 불가능한 상태", status: "진행", assignedTo: "최기사", createdAt: "2024-01-04" },
  { id: "13", branchName: "역삼점", phone: "02-3579-0246", symptoms: "기계 전체에서 진동이 심하게 발생하여 주변 소음이 매우 크게 들림", status: "접수", assignedTo: "정기사", createdAt: "2024-01-03" },
  { id: "14", branchName: "논현점", phone: "02-4680-1357", symptoms: "디스플레이 화면에 세로줄이 나타나고 일부 메뉴가 보이지 않는 화면 표시 오류", status: "완료", assignedTo: "한기사", createdAt: "2024-01-02" },
  { id: "15", branchName: "도곡점", phone: "02-5791-2468", symptoms: "음료 시럽 공급이 불균등하여 맛이 이상하고 농도가 일정하지 않음", status: "중단", assignedTo: "윤기사", createdAt: "2024-01-01" },
  { id: "16", branchName: "대치점", phone: "02-6802-3579", symptoms: "기계 내부 조명이 깜빡거리고 완전히 꺼지는 현상이 반복적으로 발생", status: "진행", assignedTo: "송기사", createdAt: "2023-12-31" },
  { id: "17", branchName: "개포점", phone: "02-7913-4680", symptoms: "컵 배출 장치에서 컵이 제대로 나오지 않고 걸려서 막히는 현상", status: "접수", assignedTo: "김기사", createdAt: "2023-12-30" },
  { id: "18", branchName: "수서점", phone: "02-8024-5791", symptoms: "얼음 제조 기능이 작동하지 않아 차가운 음료를 만들 수 없는 상태", status: "완료", assignedTo: "이기사", createdAt: "2023-12-29" },
  { id: "19", branchName: "일원점", phone: "02-9135-6802", symptoms: "기계 외부 패널에 균열이 생기고 일부가 떨어져 나가는 물리적 손상", status: "진행", assignedTo: "박기사", createdAt: "2023-12-28" },
  { id: "20", branchName: "방배점", phone: "02-0246-7913", symptoms: "청소 모드에서 빠져나오지 못하고 계속 청소 상태로만 표시되는 시스템 오류", status: "접수", assignedTo: "최기사", createdAt: "2023-12-27" },
  { id: "21", branchName: "서초중앙점", phone: "02-1357-8024", symptoms: "Wi-Fi 연결이 불안정하여 결제 시스템과 원격 모니터링이 작동하지 않음", status: "완료", assignedTo: "정기사", createdAt: "2023-12-26" },
  { id: "22", branchName: "양재점", phone: "02-2468-9135", symptoms: "음료 농축액 펌프에서 이상한 소리가 나고 공급량이 불규칙하게 변함", status: "진행", assignedTo: "한기사", createdAt: "2023-12-25" },
  { id: "23", branchName: "교대점", phone: "02-3579-0246", symptoms: "기계 하단 배수구에서 물이 역류하여 내부로 들어가는 배수 시스템 문제", status: "중단", assignedTo: "윤기사", createdAt: "2023-12-24" },
  { id: "24", branchName: "사당점", phone: "02-4680-1357", symptoms: "온수 공급 시스템에서 온도가 일정하지 않고 때로는 뜨거운 물이 나오지 않음", status: "접수", assignedTo: "송기사", createdAt: "2023-12-23" },
  { id: "25", branchName: "남태령점", phone: "02-5791-2468", symptoms: "기계 전면 유리창에 김이 계속 서려 있어 내부가 보이지 않고 습도 조절 불가", status: "진행", assignedTo: "김기사", createdAt: "2023-12-22" },
  { id: "26", branchName: "이수점", phone: "02-6802-3579", symptoms: "자동 청소 시스템이 작동 중 멈춰서 수동으로만 청소해야 하는 상태", status: "완료", assignedTo: "이기사", createdAt: "2023-12-21" },
  { id: "27", branchName: "동작점", phone: "02-7913-4680", symptoms: "기계 내부 센서가 오작동하여 재고가 있음에도 품절로 표시되는 현상", status: "접수", assignedTo: "박기사", createdAt: "2023-12-20" },
  { id: "28", branchName: "흑석점", phone: "02-8024-5791", symptoms: "압축기에서 과도한 열이 발생하여 기계 주변 온도가 비정상적으로 높아짐", status: "진행", assignedTo: "최기사", createdAt: "2023-12-19" },
  { id: "29", branchName: "노량진점", phone: "02-9135-6802", symptoms: "기계 내부 필터 시스템에 이물질이 끼어 물 공급이 원활하지 않음", status: "완료", assignedTo: "정기사", createdAt: "2023-12-18" },
  { id: "30", branchName: "신대방점", phone: "02-0246-7913", symptoms: "전자 결제 단말기 화면이 깨져서 터치 입력이 불가능하고 카드 인식 안됨", status: "접수", assignedTo: "한기사", createdAt: "2023-12-17" }
]

const statuses = ["전체", "접수", "진행", "완료", "중단"]
const itemsPerPageOptions = [10, 20, 50]

export default function ServiceRequests() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("전체")
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  // 필터링된 데이터
  const filteredRequests = useMemo(() => {
    return serviceRequests.filter(request => {
      const matchesSearch = request.branchName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.symptoms.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.assignedTo.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = selectedStatus === "전체" || request.status === selectedStatus
      return matchesSearch && matchesStatus
    })
  }, [searchTerm, selectedStatus])

  // 페이지네이션
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage)
  const paginatedRequests = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredRequests.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredRequests, currentPage, itemsPerPage])

  // 선택 관련 함수
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(paginatedRequests.map(request => request.id))
    } else {
      setSelectedItems([])
    }
  }

  const handleSelectItem = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedItems([...selectedItems, id])
    } else {
      setSelectedItems(selectedItems.filter(item => item !== id))
    }
  }

  const handleDeleteSelected = () => {
    console.log("선택된 항목 삭제:", selectedItems)
    setSelectedItems([])
  }

  // 페이지당 항목 수 변경
  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage)
    setCurrentPage(1) // 첫 페이지로 리셋
    setSelectedItems([]) // 선택 해제
  }

  // 상태별 색상
  const getStatusColor = (status: string) => {
    switch (status) {
      case "접수":
        return "bg-blue-100 text-blue-800"
      case "진행":
        return "bg-yellow-100 text-yellow-800"
      case "완료":
        return "bg-green-100 text-green-800"
      case "중단":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">접수현황</h2>
            <p className="text-muted-foreground">
              AS 접수 현황을 관리하고 처리 상태를 추적합니다.
            </p>
          </div>
          <Button>새 접수 등록</Button>
        </div>

        {/* 검색 및 필터 */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="지점명, 증상, 담당자로 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>

          <div className="flex items-center gap-2">
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
                  {itemsPerPage}개씩 보기
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {itemsPerPageOptions.map((count) => (
                  <DropdownMenuItem
                    key={count}
                    onClick={() => handleItemsPerPageChange(count)}
                  >
                    {count}개씩 보기
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
                <TableHead className="w-[140px]">지점명</TableHead>
                <TableHead className="w-[160px]">연락처</TableHead>
                <TableHead>증상</TableHead>
                <TableHead className="w-[120px]">상태</TableHead>
                <TableHead className="w-[140px]">담당자</TableHead>
                <TableHead className="w-[140px]">접수일</TableHead>
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
                  <TableCell className="font-medium">{request.branchName}</TableCell>
                  <TableCell>{request.phone}</TableCell>
                  <TableCell className="text-left whitespace-nowrap truncate max-w-xs" title={request.symptoms}>{request.symptoms}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(request.status)}`}>
                      {request.status}
                    </span>
                  </TableCell>
                  <TableCell>{request.assignedTo}</TableCell>
                  <TableCell>{request.createdAt}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* 페이징 */}
        <div className="flex flex-col items-center gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="order-2 text-sm text-muted-foreground whitespace-nowrap text-center sm:order-1 sm:text-left">
            총 {filteredRequests.length}개 중 {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, filteredRequests.length)}개 표시
          </div>
          <Pagination className="order-1 w-full justify-center sm:order-2 sm:justify-end">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                  onClick={(e) => {
                    e.preventDefault()
                    if (currentPage > 1) setCurrentPage(currentPage - 1)
                  }}
                />
              </PaginationItem>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    href="#"
                    isActive={currentPage === page}
                    onClick={(e) => {
                      e.preventDefault()
                      setCurrentPage(page)
                    }}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                  onClick={(e) => {
                    e.preventDefault()
                    if (currentPage < totalPages) setCurrentPage(currentPage + 1)
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </AdminLayout>
  )
}