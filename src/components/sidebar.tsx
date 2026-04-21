import { Calendar, NotepadText, Command, Plus as NewMeeting, MessageSquare, Users, Archive, Trash, Settings, } from "lucide-react"
import { Link } from "react-router-dom"
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem, } from "@/components/ui/sidebar"

import NavUser from "@/components/nav-user"
import { Nav, User } from "@/types"

const data: {
  user: User
  navMeeting: Nav[]
  navChat: Nav[]
  misc: Nav[]
} = {
  user: {
    name: "John",
    email: "jj@example.com",
    avatar: "",
  },
  navMeeting: [
    {
      title: "Start a Meeting",
      url: "/meetings/start-meetings",
      icon: NewMeeting,
    },
    {
      title: "Meeting Notes",
      url: "/meetings/meetings-notes",
      icon: NotepadText,
    },
    {
      title: "Calendar",
      url: "/meetings/calender",
      icon: Calendar,
    },
  ],
  navChat: [
    {
      title: "Team Chat",
      url: "/chat/team",
      icon: MessageSquare,
    },
    {
      title: "Groups",
      url: "/chat/groups",
      icon: Users,
    },
  ],
  misc: [
    {
      title: "Settings",
      url: "/settings",
      icon: Settings,
    },
    {
      title: "Archive",
      url: "/archive",
      icon: Archive,
    },
    {
      title: "Trash",
      url: "/trash",
      icon: Trash,
    }
  ],
}

export function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const userEmail = localStorage.getItem("user_email") || "guest@example.com";
  const userName = userEmail.split("@")[0];
  const displayName = userName.charAt(0).toUpperCase() + userName.slice(1);

  const activeUser = {
    name: displayName,
    email: userEmail,
    avatar: "",
  };

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg">
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <Command className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  Minut<span className="text-rose-400">e</span>ly
                  <span className="text-rose-400">.</span>
                </span>
                <span className="truncate text-xs">Meeting Management</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton render={<Link to="/meetings" />}>
                <span className="truncate text-sm font-medium">Meetings</span>
              </SidebarMenuButton>

              <SidebarMenuSub>
                {data.navMeeting.map((item) => (
                  <SidebarMenuSubItem key={item.title}>
                    <SidebarMenuSubButton render={<Link to={item.url} />}>
                      <item.icon />
                      <span className="truncate text-sm font-medium">
                        {item.title}
                      </span>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                ))}
              </SidebarMenuSub>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton render={<Link to="/chat" />}>
                <span className="truncate text-sm font-medium">Chat</span>
              </SidebarMenuButton>

              <SidebarMenuSub>
                {data.navChat.map((item) => (
                  <SidebarMenuSubItem key={item.title}>
                    <SidebarMenuSubButton render={<Link to={item.url} />}>
                      <item.icon />
                      <span className="truncate text-sm font-medium">
                        {item.title}
                      </span>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                ))}
              </SidebarMenuSub>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <span className="truncate text-sm font-medium">Misc</span>
              </SidebarMenuButton>

              <SidebarMenuSub>
                {data.misc.map((item) => (
                  <SidebarMenuSubItem key={item.title}>
                    <SidebarMenuSubButton render={<Link to={item.url} />}>
                      <item.icon />
                      <span className="truncate text-sm font-medium">
                        {item.title}
                      </span>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                ))}
              </SidebarMenuSub>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

      </SidebarContent>

      <SidebarFooter>
        <NavUser user={activeUser} />
      </SidebarFooter>
    </Sidebar>
  )
}
