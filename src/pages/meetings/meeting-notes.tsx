import { Link, useOutlet } from "react-router-dom";
import { meetingNotes } from "@/mock";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CalendarDays, ChevronRight, ClipboardList, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FunnelIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

export default function MeetingNotesPage() {
  const outlet = useOutlet();

  const [search, setSearch] = useState("");

  const filteredNotes = meetingNotes.filter((note) =>
    note.title.toLowerCase().includes(search.toLowerCase()) ||
    note.meeting.summary.toLowerCase().includes(search.toLowerCase()) ||
    note.tags.some((tag) => tag.toLowerCase().includes(search.toLowerCase()))
  );

  if (outlet) {
    return outlet;
  }

  return (
    <section className="flex flex-1 flex-col gap-5 p-5">
      <div className="flex items-center justify-end gap-2">
        <Input type="search"
          placeholder="Search meeting notes..."
          className="w-sm"
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button>
          Filter
          <FunnelIcon className="w-4 h-4" />
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filteredNotes.map((note) => (
          <Link key={note.id} to={`/meetings/meetings-notes/${note.id}`} className="block">
            <Card className="h-full border border-border/70 transition hover:-translate-y-0.5 hover:bg-muted/20">
              <CardHeader className="gap-3 border-b">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-2">
                    <Badge>
                      {note.category}
                    </Badge>
                    <div>
                      <CardTitle className="line-clamp-2 text-lg">{note.title}</CardTitle>
                      <CardDescription className="mt-1 line-clamp-2">
                        {note.meeting.summary}
                      </CardDescription>
                    </div>
                  </div>
                  <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground" />
                </div>
              </CardHeader>

              <CardContent className="grid gap-4">
                <div className="flex flex-wrap gap-2">
                  {note.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="grid gap-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4" />
                    <span>{note.meeting.dateLabel}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>{note.meeting.participants.length} participants</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ClipboardList className="h-4 w-4" />
                    <span>{note.actionItems.length} action items</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
