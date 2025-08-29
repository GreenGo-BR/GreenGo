import { AlertCircle, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface FormMessageProps {
  type: "error" | "success"
  message: string
}

export function FormMessage({ type, message }: FormMessageProps) {
  if (!message) return null

  return (
    <div
      className={cn(
        "p-3 rounded-md flex items-start gap-2 text-sm mt-4",
        type === "error"
          ? "bg-red-50 text-red-800 border border-red-200"
          : "bg-green-50 text-green-800 border border-green-200",
      )}
    >
      {type === "error" ? (
        <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
      ) : (
        <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
      )}
      <span>{message}</span>
    </div>
  )
}
