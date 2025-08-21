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

// 임시 데이터
const products = [
  { id: "1", name: "아이폰 14 Pro 256GB 딥 퍼플 최신형 스마트폰", category: "스마트폰", price: "1,350,000", stock: "25", status: "판매중" },
  { id: "2", name: "갤럭시 S23 Ultra 512GB 그린 펜 포함 프리미엄 모델", category: "스마트폰", price: "1,200,000", stock: "18", status: "판매중" },
  { id: "3", name: "MacBook Pro 14인치 M3 Pro 칩 18GB 512GB 스페이스 그레이", category: "노트북", price: "2,890,000", stock: "8", status: "품절" },
  { id: "4", name: "iPad Air 5세대 Wi-Fi 256GB 스타라이트", category: "태블릿", price: "899,000", stock: "32", status: "판매중" },
  { id: "5", name: "AirPods Pro 2세대 MagSafe 충전 케이스 포함 노이즈 캔슬링", category: "이어폰", price: "349,000", stock: "67", status: "판매중" },
  { id: "6", name: "갤럭시 탭 S9 11인치 Wi-Fi 128GB 그래파이트 S펜 포함", category: "태블릿", price: "1,150,000", stock: "15", status: "판매중" },
  { id: "7", name: "ThinkPad X1 Carbon Gen 11 14인치 i7 16GB 1TB SSD", category: "노트북", price: "2,200,000", stock: "12", status: "판매중" },
  { id: "8", name: "Sony WH-1000XM5 무선 노이즈 캔슬링 헤드폰 블랙", category: "이어폰", price: "450,000", stock: "28", status: "판매중" },
  { id: "9", name: "아이폰 15 Pro Max 512GB 티타늄 블루 프리미엄 에디션", category: "스마트폰", price: "1,550,000", stock: "42", status: "판매중" },
  { id: "10", name: "갤럭시 Z Fold 5 256GB 팬텀 블랙 폴더블 스마트폰", category: "스마트폰", price: "2,100,000", stock: "7", status: "품절" },
  { id: "11", name: "MacBook Air 15인치 M2 칩 16GB 1TB SSD 미드나이트", category: "노트북", price: "2,390,000", stock: "19", status: "판매중" },
  { id: "12", name: "iPad Pro 12.9인치 M2 칩 Wi-Fi 512GB 실버", category: "태블릿", price: "1,649,000", stock: "23", status: "판매중" },
  { id: "13", name: "AirPods Max 스페이스 그레이 프리미엄 오버이어 헤드폰", category: "이어폰", price: "769,000", stock: "14", status: "판매중" },
  { id: "14", name: "갤럭시 탭 S9+ 12.4인치 Wi-Fi 256GB 베이지 S펜 포함", category: "태블릿", price: "1,349,000", stock: "31", status: "판매중" },
  { id: "15", name: "Dell XPS 13 Plus 13인치 i7 32GB 1TB SSD 플래티넘", category: "노트북", price: "2,799,000", stock: "6", status: "품절" },
  { id: "16", name: "Bose QuietComfort 45 무선 노이즈 캔슬링 헤드폰 화이트", category: "이어폰", price: "429,000", stock: "38", status: "판매중" },
  { id: "17", name: "아이폰 14 128GB 퍼플 표준 모델 스마트폰", category: "스마트폰", price: "1,125,000", stock: "54", status: "판매중" },
  { id: "18", name: "갤럭시 S23 256GB 크림 컴팩트 프리미엄 스마트폰", category: "스마트폰", price: "999,000", stock: "29", status: "판매중" },
  { id: "19", name: "MacBook Pro 16인치 M3 Max 칩 32GB 1TB SSD 스페이스 블랙", category: "노트북", price: "4,299,000", stock: "3", status: "품절" },
  { id: "20", name: "iPad 10세대 Wi-Fi 256GB 블루 표준 태블릿", category: "태블릿", price: "679,000", stock: "47", status: "판매중" },
  { id: "21", name: "Galaxy Buds2 Pro 그래파이트 무선 이어버드", category: "이어폰", price: "299,000", stock: "73", status: "판매중" },
  { id: "22", name: "Surface Pro 9 13인치 i7 16GB 512GB SSD 플래티넘", category: "태블릿", price: "2,199,000", stock: "11", status: "판매중" },
  { id: "23", name: "HP Spectre x360 14인치 i7 16GB 1TB SSD 나이트폴 블랙", category: "노트북", price: "2,599,000", stock: "16", status: "판매중" },
  { id: "24", name: "Sony WF-1000XM4 블랙 완전 무선 노이즈 캔슬링 이어버드", category: "이어폰", price: "389,000", stock: "45", status: "판매중" },
  { id: "25", name: "아이폰 SE 3세대 128GB 미드나이트 컴팩트 스마트폰", category: "스마트폰", price: "659,000", stock: "62", status: "판매중" },
  { id: "26", name: "갤럭시 A54 5G 256GB 어썸 바이올렛 중급형 스마트폰", category: "스마트폰", price: "549,000", stock: "81", status: "판매중" },
  { id: "27", name: "ASUS ZenBook Pro 15 OLED i9 32GB 1TB SSD 인디고 블루", category: "노트북", price: "3,199,000", stock: "5", status: "품절" },
  { id: "28", name: "iPad mini 6세대 Wi-Fi 256GB 스페이스 그레이", category: "태블릿", price: "849,000", stock: "36", status: "판매중" },
  { id: "29", name: "Sennheiser Momentum 4 Wireless 블랙 프리미엄 헤드폰", category: "이어폰", price: "549,000", stock: "22", status: "판매중" },
  { id: "30", name: "갤럭시 Z Flip 5 256GB 라벤더 컴팩트 폴더블 스마트폰", category: "스마트폰", price: "1,399,000", stock: "18", status: "판매중" }
]

export default function Products() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("전체")
  const [selectedStatus, setSelectedStatus] = useState("전체")
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  // 카테고리와 상태 옵션
  const categories = ["전체", "스마트폰", "노트북", "태블릿", "이어폰"]
  const statuses = ["전체", "판매중", "품절"]
  const itemsPerPageOptions = [10, 20, 50]

  // 필터링된 데이터
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === "전체" || product.category === selectedCategory
      const matchesStatus = selectedStatus === "전체" || product.status === selectedStatus

      return matchesSearch && matchesCategory && matchesStatus
    })
  }, [searchTerm, selectedCategory, selectedStatus])

  // 페이징된 데이터
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredProducts.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredProducts, currentPage, itemsPerPage])

  // 전체 선택/해제
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(paginatedProducts.map(item => item.id))
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

  // 페이지당 항목 수 변경
  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage)
    setCurrentPage(1) // 첫 페이지로 리셋
    setSelectedItems([]) // 선택 해제
  }

  // 페이지 변경
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    setSelectedItems([]) // 페이지 변경 시 선택 해제
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">상품관리</h2>
            <p className="text-muted-foreground">
              상품 정보를 관리하고 조회할 수 있습니다.
            </p>
          </div>
          <Button>상품 추가</Button>
        </div>

        {/* 검색 및 필터 */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="상품명 또는 카테고리로 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  카테고리: {selectedCategory}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {categories.map((category) => (
                  <DropdownMenuItem
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
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
                    checked={selectedItems.length === paginatedProducts.length && paginatedProducts.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>상품명</TableHead>
                <TableHead className="w-[140px]">카테고리</TableHead>
                <TableHead className="w-[120px]">가격</TableHead>
                <TableHead className="w-[100px]">재고</TableHead>
                <TableHead className="w-[120px]">상태</TableHead>

              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedItems.includes(product.id)}
                      onCheckedChange={(checked: boolean) => handleSelectItem(product.id, checked)}
                    />
                  </TableCell>
                  <TableCell className="font-medium text-left whitespace-nowrap truncate max-w-xs" title={product.name}>{product.name}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>{product.price}원</TableCell>
                  <TableCell>{product.stock}개</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${product.status === '판매중'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                      }`}>
                      {product.status}
                    </span>
                  </TableCell>

                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* 페이징 */}
        <div className="flex flex-col items-center gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="order-2 text-sm text-muted-foreground whitespace-nowrap text-center sm:order-1 sm:text-left">
            총 {filteredProducts.length}개 중 {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, filteredProducts.length)}개 표시
          </div>
          <Pagination className="order-1 w-full justify-center sm:order-2 sm:justify-end">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                  onClick={(e) => {
                    e.preventDefault()
                    if (currentPage > 1) handlePageChange(currentPage - 1)
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
                      handlePageChange(page)
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
                    if (currentPage < totalPages) handlePageChange(currentPage + 1)
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
