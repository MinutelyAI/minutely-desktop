import { SignupForm } from "@/components/signup-form"
import { ThemeToggle } from "@/components/theme-toggle"

export default function Signup() {
  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>
      <div className="flex w-full max-w-sm flex-col gap-6">
        <div className="flex items-center self-center text-lg tracking-tighter">
          Minut<span className="text-rose-600">e</span>ly<span className="text-rose-600">.</span>
        </div>
        <SignupForm />
      </div>
    </div>
  )
}
