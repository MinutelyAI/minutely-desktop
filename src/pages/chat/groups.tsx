import { Users } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const groups = [
  {
    name: "Launch Crew",
    members: 8,
    status: "Active",
  },
  {
    name: "Design Reviews",
    members: 5,
    status: "Quiet",
  },
  {
    name: "Customer Ops",
    members: 6,
    status: "Active",
  },
]

export default function GroupsChatPage() {
  return (
    <section className="flex flex-1 flex-col gap-5 p-5">
      <Card className="border border-border/60 bg-card/95 py-0">
        <CardHeader className="border-b border-border/70 py-5">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            <CardTitle>Groups</CardTitle>
          </div>
          <CardDescription>
            Shared spaces for ongoing team coordination.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-3 px-4 py-4">
          {groups.map((group) => (
            <div
              key={group.name}
              className="flex items-center justify-between rounded-2xl border border-border/70 bg-background px-4 py-3"
            >
              <div>
                <p className="font-medium">{group.name}</p>
                <p className="text-sm text-muted-foreground">{group.members} members</p>
              </div>
              <Badge variant="outline">{group.status}</Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </section>
  )
}
