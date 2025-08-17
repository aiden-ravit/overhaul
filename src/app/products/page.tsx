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
  }
]

export default function Products() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">상품 관리</h2>
            <p className="text-muted-foreground">
              상품 정보를 관리하고 조회할 수 있습니다.
            </p>
          </div>
          <Button>상품 추가</Button>
        </div>

        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>상품명</TableHead>
                <TableHead>카테고리</TableHead>
                <TableHead>가격</TableHead>
                <TableHead>재고</TableHead>
                <TableHead>상태</TableHead>
                <TableHead className="text-right">작업</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
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
      </div>
    </AdminLayout>
  )
}
