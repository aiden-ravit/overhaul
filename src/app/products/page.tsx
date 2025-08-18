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

// 임시 데이터
const products = [
  {
    id: "1",
    name: "아이폰 14 Pro",
    category: "스마트폰",
    price: "1,350,000",
    stock: "25",
    status: "판매중"
  },
  {
    id: "2",
    name: "갤럭시 S23 Ultra",
    category: "스마트폰",
    price: "1,200,000",
    stock: "18",
    status: "판매중"
  },
  {
    id: "3",
    name: "MacBook Pro 14",
    category: "노트북",
    price: "2,890,000",
    stock: "8",
    status: "품절"
  },
  {
    id: "4",
    name: "iPad Air",
    category: "태블릿",
    price: "899,000",
    stock: "32",
    status: "판매중"
  },
  {
    id: "5",
    name: "AirPods Pro",
    category: "이어폰",
    price: "349,000",
    stock: "67",
    status: "판매중"
  },
  {
    id: "6",
    name: "갤럭시 탭 S9",
    category: "태블릿",
    price: "1,150,000",
    stock: "15",
    status: "판매중"
  },
  {
    id: "7",
    name: "ThinkPad X1",
    category: "노트북",
    price: "2,200,000",
    stock: "12",
    status: "판매중"
  },
  {
    id: "8",
    name: "Sony WH-1000XM5",
    category: "이어폰",
    price: "450,000",
    stock: "28",
    status: "판매중"
  }
]

export default function Products() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("전체")
  const [selectedStatus, setSelectedStatus] = useState("전체")
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  // 카테고리와 상태 옵션
  const categories = ["전체", "스마트폰", "노트북", "태블릿", "이어폰"]
  const statuses = ["전체", "판매중", "품절"]

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
  }, [filteredProducts, currentPage])

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
              className="max-w-sm"
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
                <TableHead>카테고리</TableHead>
                <TableHead>가격</TableHead>
                <TableHead>재고</TableHead>
                <TableHead>상태</TableHead>
                <TableHead className="text-right">작업</TableHead>
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
                  <TableCell className="font-medium">{product.name}</TableCell>
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
            총 {filteredProducts.length}개 중 {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, filteredProducts.length)}개 표시
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
