
import { Library as LibraryIcon, MessageSquare } from "lucide-react";

export default function Library({ chats, onSelect }) {
  const savedChats = chats.filter(
    (chat) => chat.messages.length > 0
  );

  return (
    <section className="library-page">
      <div className="page-heading">
        <div className="heading-icon">
          <LibraryIcon size={24} />
        </div>

        <div>
          <h1>Your Library</h1>
          <p>All your saved conversations in one place.</p>
        </div>
      </div>

      <div className="library-grid">
        {savedChats.map((chat) => (
          <button
            key={chat.id}
            className="library-card"
            onClick={() => onSelect(chat.id)}
          >
            <MessageSquare size={19} />
            <strong>{chat.title || "New chat"}</strong>
            <span>
              {chat.messages.length} messages
            </span>
          </button>
        ))}

        {savedChats.length === 0 && (
          <p className="empty-library">
            Your library is empty. Start a conversation to see it here.
          </p>
        )}
      </div>
    </section>
  );
}
