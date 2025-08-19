import type { Metadata } from "next"
import "./globals.css"
import { ThemeProvider } from "@/components/providers/theme-provider"
import { getCurrentEnvironment, type Environment } from "../../config/environments"

// 환경별 타이틀 생성 함수
function generateTitle(): string {
  const environment = getCurrentEnvironment();
  
  // 운영 환경에서는 환경 표시 없음
  if (environment === 'production') {
    return "Overhaul Admin";
  }
  
  // 환경별 표시명
  const envDisplayNames: Record<Environment, string> = {
    local: 'Local',
    development: 'Dev',
    production: 'Prod' // 타입 안전성을 위해 추가하지만 사용하지 않음
  };
  
  const envName = envDisplayNames[environment];
  return `[${envName}] Overhaul Admin`;
}

export const metadata: Metadata = {
  title: generateTitle(),
  description: "어드민 시스템",
  icons: {
    icon: "/favicon.svg",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className="font-pretendard">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
