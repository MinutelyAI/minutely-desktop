import { useNavigate } from "react-router"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, } from "@/components/ui/card"
import { Field, FieldDescription, FieldGroup, FieldLabel, } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { BadgeAlert } from "lucide-react"

const API_URL = import.meta.env.VITE_BACKEND;

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const navigate = useNavigate()
  
  const [form, setForm] = useState({
    email: "",
    password: "",
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setForm({
      ...form,
      [id]: value,
    })
    // Clear error when user starts typing
    if (error) {
      setError(null)
    }
  }

  const handleSubmission = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    // Validation
    if (!form.email.trim()) {
      setError("Email is required")
      return
    }

    if (!form.password) {
      setError("Password is required")
      return
    }

    try {
      setLoading(true)

      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || data.message || "Failed to login")
        return
      }

      // Store auth token
      const token = data.token || data.access_token
      if (!token) {
        setError("Login succeeded but no access token was returned")
        return
      }

      localStorage.setItem("auth", "true")
      localStorage.setItem("token", token)
      localStorage.setItem("user_email", form.email.trim().toLowerCase())

      // Navigate to dashboard
      navigate("/dashboard")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network request failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>
            Login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmission}>
            <FieldGroup>
              {error && (
                <div className="flex items-center gap-2 rounded-md border bg-destructive/5 p-2 text-sm text-destructive">
                  <BadgeAlert />
                  {error}
                </div>
              )}
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={form.email}
                  onChange={handleChange}
                  disabled={loading}
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <a
                    href="#"
                    className="ml-auto text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  required
                  value={form.password}
                  onChange={handleChange}
                  disabled={loading}
                />
              </Field>
              <Field>
                <Button type="submit" disabled={loading} className="flex items-center gap-2">
                  {loading && (
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  )}
                  {loading ? "Logging in..." : "Login"}
                </Button>
                <FieldDescription className="text-center" onClick={() => navigate("/signup")}>
                  Don&apos;t have an account? <a className="font-semibold hover:underline">Sign up</a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  )
}
