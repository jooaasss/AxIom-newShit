import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface LoaderProps {
  size?: "default" | "sm" | "lg"
  className?: string
}

const sizeClasses = {
  default: "h-8 w-8",
  sm: "h-4 w-4",
  lg: "h-12 w-12",
}

export const Loader = ({ size = "default", className }: LoaderProps) => {
  return (
    <div className="flex items-center justify-center">
      <Loader2 className={cn("animate-spin text-muted-foreground", sizeClasses[size], className)} />
    </div>
  )
}