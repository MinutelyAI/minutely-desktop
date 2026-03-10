import { GalleryVerticalEnd } from "lucide-react"
import { LoginForm } from "@/components/login-form"

export default function Login() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <div className="flex items-center self-center text-lg tracking-tighter">
          Minut<span className="text-rose-600">e</span>ly<span className="text-rose-600">.</span>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
