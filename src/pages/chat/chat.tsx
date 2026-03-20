import { useOutlet } from "react-router-dom"

export default function ChatPage() {
  const outlet = useOutlet()

  return outlet ?? (
    <section className="flex flex-1 flex-col p-4 pt-0">
      <div className="min-h-[calc(100svh-5rem)] rounded-xl border border-dashed bg-muted/20 p-6">
      </div>
    </section>
  )
}
