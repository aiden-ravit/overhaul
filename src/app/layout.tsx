import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Overhaul Admin",
  description: "어드민 시스템",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className="font-pretendard">{children}</body>
    </html>
  )
}
