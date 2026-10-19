
import {
  Plus,
  Library,
  MessageSquare,
  Search,
  Settings,
  PanelLeft,
  Sparkles,
  Trash2,
  Moon,
  Sun,
} from "lucide-react";

export default function Sidebar({
  chats,
  activeId,
  view,
  sidebarOpen,
  setSidebarOpen,
  setActiveId,
  setView,
  search,
  setSearch,
  newChat,
  deleteChat,
  dark,
  setDark,
}) {
  const filteredChats = chats.filter((chat) =>
    (chat.title || "New chat")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <aside className={`sidebar ${sidebarOpen ? "" : "closed"}`}>
      <div className="brand">
        <div className="brand-icon">
          <Sparkles size={21} />
        </div>

        {sidebarOpen && (
          <div className="brand-name">
            <strong>Anshuman's AI</strong>
            <span>Your AI workspace</span>
          </div>
        )}

        <button
          className="icon-btn collapse-btn"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          title="Toggle sidebar"
        >
          <PanelLeft size={19} />
        </button>
      </div>

      <button
        className="new-chat"
        onClick={newChat}
        title="New Chat"
      >
        <Plus size={19} />
        {sidebarOpen && <span>New Chat</span>}
      </button>

      {sidebarOpen && (
        <div className="search-box">
          <Search size={16} />
          <input
            placeholder="Search conversations"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      )}

      <nav className="navigation">
        <button
          className={`nav-item ${view === "chat" ? "selected" : ""}`}
          onClick={() => setView("chat")}
          title="Chats"
        >
          <MessageSquare size={18} />
          {sidebarOpen && <span>Chats</span>}
        </button>

        <button
          className={`nav-item ${view === "library" ? "selected" : ""}`}
          onClick={() => setView("library")}
          title="Library"
        >
          <Library size={18} />
          {sidebarOpen && <span>Library</span>}
        </button>
      </nav>

      {sidebarOpen && (
        <>
          <div className="section-label">YOUR CHATS</div>

          <div className="chat-list">
            {filteredChats.map((chat) => (
              <div
                key={chat.id}
                className={`chat-item ${
                  activeId === chat.id && view === "chat"
                    ? "active"
                    : ""
                }`}
              >
                <button
                  className="chat-select"
                  onClick={() => {
                    setActiveId(chat.id);
                    setView("chat");
                  }}
                >
                  <MessageSquare size={16} />
                  <span>{chat.title || "New chat"}</span>
                </button>

                <button
                  className="delete-btn"
                  title="Delete conversation"
                  aria-label={`Delete ${chat.title || "conversation"}`}
                  onClick={() => deleteChat(chat.id)}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}

            {filteredChats.length === 0 && (
              <p className="empty-library">
                No matching conversations.
              </p>
            )}
          </div>

          <div className="sidebar-bottom">
            <button
              className="nav-item"
              onClick={() => setDark(!dark)}
            >
              {dark ? <Sun size={18} /> : <Moon size={18} />}
              <span>{dark ? "Light mode" : "Dark mode"}</span>
            </button>

            <div className="profile">
              <div className="avatar">A</div>
              <div className="profile-info">
                <strong>Anshuman</strong>
                <span>Personal workspace</span>
              </div>
              <Settings size={17} />
            </div>
          </div>
        </>
      )}
    </aside>
  );
}
