import { Fragment } from "react"
import { Link, Outlet, useLocation } from "react-router-dom"

import { AppSidebar as Sidebar } from "@/components/sidebar"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator, } from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"

export default function ProtectedLayout() {
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
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
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
                        {!isLast && <BreadcrumbSeparator className="hidden md:block" />}
                      </Fragment>
                    )
                  })}
                </BreadcrumbList>
              </Breadcrumb>
            )}
          </div>
        </header>
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  )
}
