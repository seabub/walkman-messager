import { Walkman } from "@/components/walkman/walkman"

export default function Page() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#1a1a1e] p-8">
      <div className="transform scale-100 md:scale-110 lg:scale-125 origin-center">
        <Walkman />
      </div>
    </main>
  )
}
