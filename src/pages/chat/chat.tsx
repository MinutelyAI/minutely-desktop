import { useOutlet } from "react-router-dom"

export default function ChatPage() {
  const outlet = useOutlet()

  return outlet ?? (
    <section className="flex flex-1 flex-col p-4 pt-0">
    </section>
  )
}
