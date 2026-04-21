import { useState } from "react"
import { BadgeCheck, Bell, ChevronsUpDown, CreditCard, LogOut, Sparkles } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar"
import { useNavigate } from "react-router-dom"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

const API_URL = import.meta.env.VITE_BACKEND;

export default function NavUser({
  user,
}: {
  user: {
    name: string
    email: string
    avatar: string
  }
}) {
  const { isMobile } = useSidebar()
  const navigate = useNavigate();

  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [showBillingModal, setShowBillingModal] = useState(false)
  const [showAccountModal, setShowAccountModal] = useState(false)

  const userInitials = user?.name ? user.name.charAt(0).toUpperCase() : "U";

  const handleLogout = async () => {
  const token = localStorage.getItem("token")

  try {
    if (API_URL) {
      const res = await fetch(`${API_URL}/api/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      })

      if (!res.ok) {
        const text = await res.text()
        console.error("Logout error response:", text)
      }
    }
  } catch (error) {
    console.error("Logout error:", error)
  } finally {
    localStorage.removeItem("token")
    localStorage.removeItem("auth")
    localStorage.removeItem("user_email")
    navigate("/login")
  }
}
  
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              />
            }
          >
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="rounded-lg">{userInitials}</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{user.name}</span>
              <span className="truncate text-xs">{user.email}</span>
            </div>
            <ChevronsUpDown className="ml-auto size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="rounded-lg">{userInitials}</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{user.name}</span>
                    <span className="truncate text-xs">{user.email}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => setShowUpgradeModal(true)}>
                <Sparkles />
                Upgrade to Pro
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => setShowAccountModal(true)}>
                <BadgeCheck />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setShowBillingModal(true)}>
                <CreditCard />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Bell />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Dialog open={showUpgradeModal} onOpenChange={setShowUpgradeModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upgrade to Minutely Pro</DialogTitle>
              <DialogDescription>
                Unlock unlimited AI meetings, advanced analytics, and custom integrations.
              </DialogDescription>
            </DialogHeader>
            <div className="flex items-center justify-center p-6 bg-muted/30 rounded-xl my-4">
              <Sparkles className="w-12 h-12 text-primary opacity-20" />
            </div>
            <DialogFooter>
              <Button onClick={() => setShowUpgradeModal(false)}>Explore Plans</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={showBillingModal} onOpenChange={setShowBillingModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Billing Settings</DialogTitle>
              <DialogDescription>
                Manage your payment methods and subscription plan.
              </DialogDescription>
            </DialogHeader>
            <div className="py-6">
              <p className="text-sm text-muted-foreground text-center">You are currently on the Free plan.</p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowBillingModal(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={showAccountModal} onOpenChange={setShowAccountModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Account Profile</DialogTitle>
              <DialogDescription>
                Update your personal details.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-4 py-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback>{userInitials}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{user.name}</h3>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAccountModal(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      </SidebarMenuItem>
    </SidebarMenu>
  )
}
