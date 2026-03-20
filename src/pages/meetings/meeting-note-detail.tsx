import { useParams } from "react-router-dom";
import { meetingNotes } from "@/mock";

export default function MeetingNoteDetailPage() {
  const { noteId } = useParams();
  const note = meetingNotes.find((item) => String(item.id) === noteId);

  return (
    <section
      className="flex flex-1 p-5"
      aria-label={note ? `${note.title} note page` : "Meeting note page"}
    />
  );
}
