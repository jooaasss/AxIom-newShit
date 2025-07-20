import { Navbar } from '@/components/navbar'

export default function PricingLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <div className="h-full">
      <Navbar />
      <main className="h-full pt-16">
        {children}
      </main>
    </div>
  )
}