import { UserButton } from '@clerk/nextjs'
import { ModeToggle } from '@/components/mode-toggle'
import { MainNav } from '@/components/main-nav'

export const Navbar = () => {
  return (
    <div className="fixed top-0 w-full h-16 z-50 flex justify-between items-center py-2 px-4 border-b border-primary/10 bg-secondary">
      <div className="flex items-center">
        <MainNav />
      </div>
      <div className="flex items-center gap-x-3">
        <ModeToggle />
        <UserButton afterSignOutUrl="/" />
      </div>
    </div>
  )
}