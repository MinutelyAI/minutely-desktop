import { useMemo, useState } from "react"
import { Search, SendHorizonal, Users } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

const groups = [
  {
    id: 1,
    name: "Launch Crew",
    members: 8,
    status: "Active",
    topic: "Release prep, QA status, and launch blockers.",
    lastUpdate: "Support caveats still need sign-off before staging freeze.",
  },
  {
    id: 2,
    name: "Design Reviews",
    members: 5,
    status: "Quiet",
    topic: "Async critique and handoff decisions.",
    lastUpdate: "Notes workspace polish is waiting on final spacing review.",
  },
  {
    id: 3,
    name: "Customer Ops",
    members: 6,
    status: "Active",
    topic: "Onboarding asks, pilot issues, and customer follow-ups.",
    lastUpdate: "Enterprise export formatting is still the main recurring request.",
  },
]

export default function GroupsChatPage() {
  const [search, setSearch] = useState("")
  const [selectedGroupId, setSelectedGroupId] = useState(groups[0].id)
  const [draft, setDraft] = useState("")

  const filteredGroups = useMemo(
    () =>
      groups.filter((group) =>
        `${group.name} ${group.topic} ${group.status}`
          .toLowerCase()
          .includes(search.toLowerCase())
      ),
    [search]
  )

  const selectedGroup =
    filteredGroups.find((group) => group.id === selectedGroupId) ??
    groups.find((group) => group.id === selectedGroupId) ??
    filteredGroups[0] ??
    groups[0]

  return (
    <section className="flex flex-1 flex-col gap-5 p-5">
      <Card className="border border-border/60 bg-card/95 py-0">
        <CardHeader className="border-b border-border/70 py-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <CardTitle>Groups</CardTitle>
              </div>
              <CardDescription className="mt-1">
                Shared spaces for ongoing team coordination.
              </CardDescription>
            </div>

            <div className="relative w-full max-w-sm">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search groups..."
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent className="grid gap-4 px-4 py-4 lg:grid-cols-[280px_minmax(0,1fr)]">
          <div className="space-y-3">
            {filteredGroups.map((group) => {
              const isActive = group.id === selectedGroup.id

              return (
                <button
                  key={group.id}
                  type="button"
                  onClick={() => setSelectedGroupId(group.id)}
                  className={cn(
                    "w-full rounded-2xl border px-4 py-3 text-left transition",
                    isActive
                      ? "border-primary/30 bg-primary/8"
                      : "border-border/70 bg-background hover:bg-muted/30"
                  )}
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium">{group.name}</p>
                    <Badge variant="outline">{group.status}</Badge>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{group.members} members</p>
                </button>
              )
            })}

            {filteredGroups.length === 0 && (
              <div className="rounded-2xl border border-dashed border-border/70 px-4 py-6 text-sm text-muted-foreground">
                No groups match your search.
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-border/70 bg-background p-4">
            <div className="flex flex-col gap-3 border-b border-border/70 pb-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-lg font-semibold">{selectedGroup.name}</p>
                  <p className="text-sm text-muted-foreground">{selectedGroup.members} members</p>
                </div>
                <Badge>{selectedGroup.status}</Badge>
              </div>
              <p className="text-sm leading-6 text-muted-foreground">{selectedGroup.topic}</p>
            </div>

            <div className="space-y-4 py-4">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Latest update</p>
                <p className="mt-2 text-sm leading-6">{selectedGroup.lastUpdate}</p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Post an update</p>
                <Textarea
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  placeholder={`Write a short update for ${selectedGroup.name.toLowerCase()}...`}
                  className="mt-2 min-h-28"
                />
              </div>
            </div>

            <div className="flex justify-end border-t border-border/70 pt-4">
              <Button disabled={draft.trim().length === 0}>
                <SendHorizonal />
                Send
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
