import * as React from "react"
import { cn } from "@/lib/utils"
import { Eye, EyeOff } from "lucide-react"

interface InputProps extends React.ComponentProps<"input"> {
  isError?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, isError, ...props }, ref,) => {
    const [showPassword, setShowPassword] = React.useState(false)

    const isPassword = type === "password"

    return (
      <div className="relative w-full">
        <input
          type={isPassword && showPassword ? "text" : type}
          className={cn(
            "flex h-10 w-full rounded-md border bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            isError
              ? "border-2 border-red-400 text-red-500 focus-visible:ring-red-400"
              : "border-input focus-visible:ring-ring",
            className
          )}
          ref={ref}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute inset-y-0 right-3 flex items-center text-muted-foreground"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
    );
  }
)

Input.displayName = "Input"

export { Input }
