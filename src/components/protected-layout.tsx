import { Fragment, useState } from "react"
import { Link, Outlet, useLocation } from "react-router-dom"

import { AppSidebar as Sidebar } from "@/components/sidebar"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator, } from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
// import { Bell as Notification, BellDot as NewNotification } from "lucide-react"
import { BellIcon as Notif } from '@heroicons/react/24/outline'
import { BellIcon as NotifOpen } from '@heroicons/react/24/solid'

export default function ProtectedLayout() {
  const [notifOpen, setNotifOpen] = useState(false)

  const { pathname } = useLocation()
  const breadcrumbs = (() => {
    switch (pathname) {
      case "/":
        return []
      case "/meetings":
        return [{ label: "Meetings" }]
      case "/meetings/start-meetings":
        return [
          { label: "Meetings", to: "/meetings" },
          { label: "Start Meeting" },
        ]
      case "/meetings/meetings-notes":
        return [
          { label: "Meetings", to: "/meetings" },
          { label: "Meeting Notes" },
        ]
      case "/meetings/calender":
        return [
          { label: "Meetings", to: "/meetings" },
          { label: "Calendar" },
        ]
      default:
        return []
    }
  })()

  return (
    <SidebarProvider>
      <Sidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center px-4">
          <div className="flex w-full items-center justify-between">

            <div className="flex items-center gap-2">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" />

              {breadcrumbs.length > 0 && (
                <Breadcrumb>
                  <BreadcrumbList>
                    {breadcrumbs.map((crumb, index) => {
                      const isLast = index === breadcrumbs.length - 1

                      return (
                        <Fragment key={`${crumb.label}-${index}`}>
                          <BreadcrumbItem>
                            {isLast || !crumb.to ? (
                              <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                            ) : (
                              <BreadcrumbLink render={<Link to={crumb.to} />}>
                                {crumb.label}
                              </BreadcrumbLink>
                            )}
                          </BreadcrumbItem>
                          {!isLast && (
                            <BreadcrumbSeparator className="hidden md:block" />
                          )}
                        </Fragment>
                      )
                    })}
                  </BreadcrumbList>
                </Breadcrumb>
              )}
            </div>

            {notifOpen ? (
              <NotifOpen onClick={() => setNotifOpen(false)} className="w-5 h-5 cursor-pointer" />
            ) : (
              <Notif onClick={() => setNotifOpen(true)} className="w-5 h-5 cursor-pointer" />
            )}

          </div>
        </header>
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  )
}
