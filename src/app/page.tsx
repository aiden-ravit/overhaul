import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <h1 className="text-4xl font-bold text-center mb-8">
          Overhaul Admin System
        </h1>
      </div>

      <div className="relative flex place-items-center">
        <Link href="/login">
          <Button size="lg">
            로그인하기
          </Button>
        </Link>
      </div>
    </main>
  )
}
