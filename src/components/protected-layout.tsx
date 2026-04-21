import { Fragment, useState } from "react"
import { Link, Outlet, useLocation } from "react-router-dom"
import { meetingNotes } from "@/mock"

import { AppSidebar as Sidebar } from "@/components/sidebar"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator, } from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { BellIcon as Notif } from '@heroicons/react/24/outline'
import { BellIcon as NotifOpen } from '@heroicons/react/24/solid'
import { CheckCheck, Dot, Trash2 } from "lucide-react"
import { NotificationItem } from "@/types"

export default function ProtectedLayout() {
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [notificationItems, setNotificationItems] =
    useState<NotificationItem[]>([])

  const { pathname } = useLocation()
  const unreadCount = notificationItems.filter((notification) => notification.unread).length

  const markNotificationAsRead = (notificationId: number) => {
    setNotificationItems((currentItems) =>
      currentItems.map((notification) =>
        notification.id === notificationId
          ? { ...notification, unread: false }
          : notification
      )
    )
  }

  const markAllNotificationsAsRead = () => {
    setNotificationItems((currentItems) =>
      currentItems.map((notification) => ({ ...notification, unread: false }))
    )
  }

  const deleteNotification = (notificationId: number) => {
    setNotificationItems((currentItems) =>
      currentItems.filter((notification) => notification.id !== notificationId)
    )
  }

  const breadcrumbs = (() => {
    const meetingNoteMatch = pathname.match(/^\/meetings\/meetings-notes\/([^/]+)$/)
    if (meetingNoteMatch) {
      const currentNote = meetingNotes.find(
        (note) => String(note.id) === meetingNoteMatch[1]
      )

      return [
        { label: "Meetings", to: "/meetings" },
        { label: "Meeting Notes", to: "/meetings/meetings-notes" },
        { label: currentNote?.title ?? "Note" },
      ]
    }

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
      case "/chat":
        return [{ label: "Chat" }]
      case "/chat/team":
        return [
          { label: "Chat", to: "/chat" },
          { label: "Team Chat" },
        ]
      case "/chat/groups":
        return [
          { label: "Chat", to: "/chat" },
          { label: "Groups" },
        ]
      case "/settings":
        return [{ label: "Settings" }]
      case "/archive":
        return [{ label: "Archive" }]
      case "/trash":
        return [{ label: "Trash" }]
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

            <DropdownMenu open={notificationsOpen} onOpenChange={setNotificationsOpen}>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="relative rounded-full aria-expanded:bg-transparent aria-expanded:hover:bg-transparent"
                    aria-label="Open notifications"
                  />
                }
              >
                {notificationsOpen ? (
                  <NotifOpen className="w-5 h-5" />
                ) : (
                  <Notif className="w-5 h-5" />
                )}
                {unreadCount > 0 && (
                  <span className="absolute -right-1 -top-1 inline-flex min-w-5 items-center justify-center rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-semibold text-primary-foreground">
                    {unreadCount}
                  </span>
                )}
              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-96 rounded-sm" align="end" sideOffset={8}>
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="px-3 py-3">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium text-foreground">Notifications</p>
                        <p className="text-xs text-muted-foreground">
                          {unreadCount > 0
                            ? `${unreadCount} unread update${unreadCount === 1 ? "" : "s"}`
                            : "You're all caught up"}
                        </p>
                      </div>
                      {unreadCount > 0 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-auto px-2 py-1 text-xs cursor-pointer"
                          onClick={markAllNotificationsAsRead}
                        >
                          <CheckCheck className="h-3.5 w-3.5" />
                          Mark all read
                        </Button>
                      )}
                    </div>
                  </DropdownMenuLabel>
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                  {notificationItems.length > 0 ? (
                    notificationItems.map((notification, index) => (
                      <Fragment key={notification.id}>
                        <DropdownMenuItem
                          className="cursor-pointer items-start px-3 py-3 focus:bg-primary/5 focus:text-foreground hover:bg-primary/5"
                          onClick={() => markNotificationAsRead(notification.id)}
                        >
                          <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-primary" />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0 flex-1">
                                <p
                                  className={`line-clamp-1 font-medium ${
                                    notification.unread ? "text-foreground" : "text-muted-foreground"
                                  }`}
                                >
                                  {notification.title}
                                </p>
                              </div>
                              <div className="flex items-center gap-1">
                                {notification.unread && <Dot className="h-4 w-4 text-primary" />}
                                <span className="shrink-0 text-xs text-muted-foreground">
                                  {notification.timeLabel}
                                </span>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon-xs"
                                  className="ml-1 text-primary hover:text-primary cursor-pointer"
                                  onClick={(event) => {
                                    event.stopPropagation()
                                    deleteNotification(notification.id)
                                  }}
                                  aria-label={`Delete ${notification.title}`}
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                            </div>
                            <p
                              className={`mt-1 line-clamp-2 text-sm ${
                                notification.unread ? "text-muted-foreground" : "text-muted-foreground/80"
                              }`}
                            >
                              {notification.description}
                            </p>
                          </div>
                        </DropdownMenuItem>
                        {index < notificationItems.length - 1 && <DropdownMenuSeparator />}
                      </Fragment>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center px-4 py-8 text-center text-muted-foreground">
                      <Notif className="mb-3 h-8 w-8 opacity-20" />
                      <p className="text-sm font-medium text-foreground">No new notifications</p>
                      <p className="text-xs mt-1">We'll let you know when something comes up.</p>
                    </div>
                  )}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>

          </div>
        </header>
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  )
}
