import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  Target,
  Users,
} from "lucide-react";
import { meetingNotes } from "@/mock";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { MeetingActionItem } from "@/types";

export default function MeetingNoteDetailPage() {
  const { noteId } = useParams();
  const note = meetingNotes.find((item) => String(item.id) === noteId);
  const [actionItems, setActionItems] = useState<MeetingActionItem[]>([]);

  useEffect(() => {
    setActionItems(note?.actionItems ?? []);
  }, [note]);

  if (!note) {
    return (
      <section
        className="flex flex-1 items-center justify-center p-5"
        aria-label="Meeting note page"
      >
        <div className="w-full max-w-xl space-y-4 border-l-2 border-border pl-6">
          <Badge variant="outline" className="w-fit">
            Missing note
          </Badge>
          <div>
            <h1 className="text-2xl font-semibold">Meeting note not found</h1>
            <CardDescription className="mt-2 max-w-md leading-6">
              The requested note does not exist in the current workspace.
            </CardDescription>
          </div>
          <Button asChild variant="outline" className="px-2">
            <Link to="/meetings/meetings-notes">
              <ArrowLeft className="h-4 w-4" />
              Back to meeting notes
            </Link>
          </Button>
        </div>
      </section>
    );
  }

  const toggleActionItem = (actionItemId: number) => {
    setActionItems((currentItems) =>
      currentItems.map((actionItem) =>
        actionItem.id === actionItemId
          ? {
              ...actionItem,
              completed: !actionItem.completed,
              status: actionItem.completed ? "open" : "completed",
            }
          : actionItem
      )
    );
  };

  return (
    <section
      className="flex flex-1 flex-col gap-5 p-5"
      aria-label={`${note.title} note page`}
    >
      <div className="flex flex-col gap-4">
        <Button asChild variant="link" className="w-fit px-2 text-muted-foreground">
          <Link to="/meetings/meetings-notes">
            <ArrowLeft className="h-4 w-4" />
            Back to meeting notes
          </Link>
        </Button>

        <div className="space-y-3">
          <Badge className="w-fit">{note.category}</Badge>
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold">{note.title}</h1>
            <CardDescription className="max-w-3xl text-sm leading-6">
              {note.meeting.summary}
            </CardDescription>
          </div>
          <div className="flex flex-wrap gap-2">
            {note.tags.map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        <Separator />
      </div>

      <div className="grid gap-10 xl:grid-cols-[minmax(0,1.8fr)_minmax(280px,0.9fr)]">
        <div className="space-y-8">
          <div className="space-y-2">
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
              Detailed notes
            </p>
            <h2 className="text-lg font-semibold">Meeting transcript and discussion</h2>
          </div>

          <div className="space-y-8">
            {note.sections.map((section, index) => (
              <div key={section.title} className="space-y-5">
                {index > 0 && <Separator />}
                <div className="grid gap-4 md:grid-cols-[140px_minmax(0,1fr)] md:gap-6">
                  <div>
                    <p className="text-sm font-semibold text-foreground/80">{section.title}</p>
                  </div>
                  <ul className="grid gap-3 text-[15px] leading-7 text-muted-foreground">
                    {section.items.map((item) => (
                      <li key={item} className="flex gap-3">
                        <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-foreground/70" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        <aside className="space-y-8 xl:sticky xl:top-20 xl:self-start">

          <div className="space-y-4 border-l border-border pl-5">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-muted-foreground" />
              <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Action items
              </h2>
            </div>
            <div className="space-y-3">
              {actionItems.map((actionItem) => {
                const isCompleted = actionItem.completed;

                return (
                  <div
                    key={actionItem.id}
                    className="flex items-start gap-3 py-1 text-sm"
                  >
                    <button
                      type="button"
                      className="pt-0.5"
                      onClick={() => toggleActionItem(actionItem.id)}
                      aria-pressed={isCompleted}
                      aria-label={`Mark ${actionItem.title} as ${
                        isCompleted ? "incomplete" : "complete"
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                      ) : (
                        <Circle className="h-4 w-4 shrink-0 text-muted-foreground" />
                      )}
                    </button>
                    <button
                      type="button"
                      className="min-w-0 text-left"
                      onClick={() => toggleActionItem(actionItem.id)}
                      aria-label={`Toggle ${actionItem.title}`}
                    >
                      <span
                        className={`block font-medium text-foreground ${
                          isCompleted ? "line-through opacity-60" : ""
                        }`}
                      >
                        {actionItem.title}
                      </span>
                      <span className="mt-1 block text-muted-foreground">
                        {actionItem.owner}
                      </span>
                      <span className="block text-muted-foreground">
                        Due {actionItem.dueDate}
                      </span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-4 border-l border-border pl-5">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Participants
              </h2>
            </div>
            <div className="space-y-4">
              {note.meeting.participants.map((participant) => (
                <div key={participant.id} className="space-y-1 text-sm">
                  <p className="font-medium text-foreground">{participant.displayName}</p>
                  <p className="text-muted-foreground">@{participant.username}</p>
                </div>
              ))}
            </div>
          </div>

        </aside>
      </div>
    </section>
  );
}
