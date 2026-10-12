import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Plus, Library, MessageSquare, Search,
  Settings, PanelLeft, Sparkles, ArrowUp,
  Paperclip, X, Trash2, Moon, Sun,
  Code2, BookOpen, Menu, LoaderCircle
} from "lucide-react";
import "./App.css";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://127.0.0.1:8000";

  
  const createChat = () => ({
    id: crypto.randomUUID(),
    title: "New chat",
    messages: [],
    createdAt: Date.now(),
  });
  
  function App() {
    const [chats, setChats] = useState(() => {
      try {
        return JSON.parse(
          localStorage.getItem("anshuman_ai_chats")
        ) || [createChat()];
      } catch {
        return [createChat()];
      }
    });
    
    const [activeId, setActiveId] = useState(
      () => chats[0]?.id
    );
    const [prompt, setPrompt] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [dark, setDark] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [view, setView] = useState("chat");
    const [search, setSearch] = useState("");
    
    const activeChat = chats.find(
      (chat) => chat.id === activeId
    );
    
    useEffect(() => {
      localStorage.setItem(
        "anshuman_ai_chats",
        JSON.stringify(chats)
      );
    }, [chats]);
    
    const updateChat = (id, changes) => {
      setChats((previous) =>
        previous.map((chat) =>
          chat.id === id ? { ...chat, ...changes } : chat
    )
  );
};

const newChat = () => {
  const chat = createChat();
  setChats((previous) => [chat, ...previous]);
  setActiveId(chat.id);
  setPrompt("");
  setError("");
  setView("chat");
};

const deleteChat = (id) => {
  const remaining = chats.filter(
    (chat) => chat.id !== id
  );
  
  
    if (remaining.length === 0) {
      const fresh = createChat();
      setChats([fresh]);
      setActiveId(fresh.id);
    } else {
      setChats(remaining);
      if (activeId === id) {
        setActiveId(remaining[0].id);
      }
    }
  };

  const sendMessage = async (text = prompt) => {
    const message = text.trim();

    if (!message || loading || !activeChat) return;

    setError("");
    setView("chat");

    const userMessage = {
      role: "user",
      content: message,
    };

    const history = [
      ...activeChat.messages,
      userMessage,
    ];

    const title =
      activeChat.messages.length === 0
        ? message.slice(0, 32) +
          (message.length > 32 ? "..." : "")
        : activeChat.title;

    updateChat(activeId, {
      messages: history,
      title,
    });

    setPrompt("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          session_id: activeId,
          messages: history,
        }),
      });

      if (!response.ok) {
        throw new Error(
          `Server error (${response.status})`
        );
      }

      const data = await response.json();

      const reply =
        data.reply ??
        data.response ??
        data.answer ??
        data.message;

      if (typeof reply !== "string") {
        throw new Error(
          "The backend did not return a text reply."
        );
      }

      setChats((previous) =>
        previous.map((chat) =>
          chat.id === activeId
            ? {
                ...chat,
                messages: [
                  ...chat.messages,
                  { role: "assistant", content: reply },
                ],
              }
            : chat
        )
      );
    } catch (err) {
      setError(
        `${err.message}. Check that your backend is running.`
      );
    } finally {
      setLoading(false);
    }
  };

  const filteredChats = chats.filter((chat) =>
    chat.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={`app ${dark ? "dark" : "light"}`}>
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
                      setError("");
                    }}
                  >
                    <MessageSquare size={16} />
                    <span>{chat.title}</span>
                  </button>

                  <button
                    className="delete-btn"
                    title="Delete conversation"
                    onClick={() => deleteChat(chat.id)}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
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

      <main className="main">
        <header className="topbar">
          <button
            className="icon-btn mobile-menu"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu size={20} />
          </button>

          <div className="mobile-brand">Anshuman's AI</div>

          <div className="model-label">
            <span className="status-dot" />
            AI Assistant
          </div>

          <button
            className="icon-btn mobile-theme"
            onClick={() => setDark(!dark)}
            title="Toggle theme"
          >
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </header>

        {view === "library" ? (
          <section className="library-page">
            <div className="page-heading">
              <div className="heading-icon">
                <Library size={24} />
              </div>
              <div>
                <h1>Your Library</h1>
                <p>
                  All your saved conversations in one place.
                </p>
              </div>
            </div>

            <div className="library-grid">
              {chats
                .filter((chat) => chat.messages.length > 0)
                .map((chat) => (
                  <button
                    key={chat.id}
                    className="library-card"
                    onClick={() => {
                      setActiveId(chat.id);
                      setView("chat");
                    }}
                  >
                    <MessageSquare size={19} />
                    <strong>{chat.title}</strong>
                    <span>
                      {chat.messages.length} messages
                    </span>
                  </button>
                ))}

              {chats.every(
                (chat) => chat.messages.length === 0
              ) && (
                <p className="empty-library">
                  Your library is empty. Start a conversation
                  to see it here.
                </p>
              )}
            </div>
          </section>
        ) : (
          <>
            <section className="conversation">
              {!activeChat?.messages.length ? (
                <div className="welcome">
                  <div className="welcome-icon">
                    <Sparkles size={30} />
                  </div>

                  <div className="eyebrow">
                    YOUR PERSONAL AI ASSISTANT
                  </div>

                  <h1>
                    What can I help
                    <br />
                    <span>you with today?</span>
                  </h1>

                  <p className="welcome-subtitle">
                    Think, create, learn and build.
                    <br />
                    Your next idea starts here.
                  </p>

                  <div className="suggestions">
                    <button
                      onClick={() =>
                        sendMessage(
                          "Help me understand a programming concept step by step."
                        )
                      }
                    >
                      <Code2 size={19} />
                      <span>
                        <strong>Write & debug code</strong>
                        <small>Fix bugs and learn programming</small>
                      </span>
                    </button>

                    <button
                      onClick={() =>
                        sendMessage(
                          "Help me learn a difficult topic in simple language."
                        )
                      }
                    >
                      <BookOpen size={19} />
                      <span>
                        <strong>Learn something new</strong>
                        <small>Break down complex concepts</small>
                      </span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="messages">
                  {activeChat.messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`message-row ${
                        msg.role === "user" ? "user-row" : ""
                      }`}
                    >
                      {msg.role !== "user" && (
                        <div className="message-avatar">
                          <Sparkles size={17} />
                        </div>
                      )}

                      <div className={`message ${
                        msg.role === "user" ? "user-message" : ""
                      }`}>
                        <div className="message-role">
                          {msg.role === "user"
                            ? "You"
                            : "Anshuman's AI"}
                        </div>
                        <div className="message-content">
                          {msg.role === "assistant" ? (
                              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {msg.content}
                              </ReactMarkdown>
                            ) : (
                              msg.content
                            )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {loading && (
                    <div className="message-row">
                      <div className="message-avatar">
                        <Sparkles size={17} />
                      </div>
                      <div className="typing">
                        <LoaderCircle size={17} className="spin" />
                        <span>Thinking...</span>
                      </div>
                    </div>
                  )}

                  {error && (
                    <div className="error-message">
                      {error}
                      <button onClick={() => setError("")}>
                        <X size={15} />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </section>

            <div className="composer-area">
              {!activeChat?.messages.length && (
                <div className="composer-caption">
                  Ask anything. Make something amazing.
                </div>
              )}

              <form
                className="composer"
                onSubmit={(e) => {
                  e.preventDefault();
                  sendMessage();
                }}
              >
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={(e) => {
                    if (
                      e.key === "Enter" &&
                      !e.shiftKey &&
                      !e.nativeEvent.isComposing
                    ) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                  placeholder="Message Anshuman's AI..."
                  rows={2}
                  disabled={loading}
                />

                <div className="composer-footer">
                  <div className="composer-tools">
                    <button
                      type="button"
                      className="tool-btn"
                      title="Attachment support can be added next"
                      onClick={() =>
                        setError(
                          "File uploads are not connected yet."
                        )
                      }
                    >
                      <Paperclip size={17} />
                    </button>
                    <span>Shift + Enter for a new line</span>
                  </div>

                  <button
                    className="send-btn"
                    type="submit"
                    disabled={!prompt.trim() || loading}
                    title="Send message"
                  >
                    {loading ? (
                      <LoaderCircle size={18} className="spin" />
                    ) : (
                      <ArrowUp size={20} />
                    )}
                  </button>
                </div>
              </form>

              {error && !activeChat?.messages.length && (
                <div className="error-message">
                  {error}
                  <button onClick={() => setError("")}>
                    <X size={15} />
                  </button>
                </div>
              )}

              <p className="disclaimer">
                An AI assistant can make mistakes. Check important
                information.
              </p>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
// export default API_URL;
export default App;