
import { useEffect, useState } from "react";
import "./App.css";

import API_URL from "./config.js";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Library from "./components/Library";
import ChatWindow from "./components/ChatWindow";
import ChatInput from "./components/ChatInput";

const createChat = () => ({
  id: crypto.randomUUID(),
  title: "New chat",
  messages: [],
  createdAt: Date.now(),
});

function App() {
  // Load saved conversations
  const [chats, setChats] = useState(() => {
    try {
      const saved = JSON.parse(
        localStorage.getItem("anshuman_ai_chats")
      );

      return Array.isArray(saved) && saved.length > 0
        ? saved
        : [createChat()];
    } catch {
      return [createChat()];
    }
  });

  const [activeId, setActiveId] = useState(
    () => {
      try {
        const saved = JSON.parse(
          localStorage.getItem("anshuman_ai_chats")
        );

        return saved?.[0]?.id;
      } catch {
        return undefined;
      }
    }
  );

  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dark, setDark] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [view, setView] = useState("chat");
  const [search, setSearch] = useState("");

  // Ensure the selected chat always exists
  const activeChat =
    chats.find((chat) => chat.id === activeId) ?? chats[0];

  // Save conversations to localStorage
  useEffect(() => {
    localStorage.setItem(
      "anshuman_ai_chats",
      JSON.stringify(chats)
    );
  }, [chats]);

  // Update a particular conversation
  const updateChat = (id, changes) => {
    setChats((previous) =>
      previous.map((chat) =>
        chat.id === id
          ? { ...chat, ...changes }
          : chat
      )
    );
  };

  // Create a new conversation
  const newChat = () => {
    const chat = createChat();

    setChats((previous) => [chat, ...previous]);
    setActiveId(chat.id);
    setPrompt("");
    setError("");
    setView("chat");
  };

  // Delete a conversation
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

    setError("");
  };

  // Send a message to the backend
  const sendMessage = async (text = prompt) => {
    const message = text.trim();

    if (!message || loading || !activeChat) {
      return;
    }

    const chatId = activeChat.id;

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

    updateChat(chatId, {
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
          session_id: chatId,
          messages: history,
        }),
      });

      if (!response.ok) {
        throw new Error(
          `Server error (${response.status})`
        );
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      let reply = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        reply += decoder.decode(value, { stream: true });

        // Update the assistant message with the accumulated reply.
      }
      reply += decoder.decode();

      if (typeof reply !== "string") {
        throw new Error(
          "The backend did not return a text reply."
        );
      }

      setChats((previous) =>
        previous.map((chat) =>
          chat.id === chatId
            ? {
                ...chat,
                messages: [
                  ...chat.messages,
                  {
                    role: "assistant",
                    content: reply,
                  },
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

  return (
    <div className={`app ${dark ? "dark" : "light"}`}>
      {/* Sidebar */}
      <Sidebar
        chats={chats}
        activeId={activeChat?.id}
        view={view}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        setActiveId={setActiveId}
        setView={setView}
        search={search}
        setSearch={setSearch}
        newChat={newChat}
        deleteChat={deleteChat}
        dark={dark}
        setDark={setDark}
      />

      {/* Main content */}
      <main className="main">
        {/* Header */}
        <Header
          dark={dark}
          setDark={setDark}
          setSidebarOpen={setSidebarOpen}
        />

        {/* Library or conversation */}
        {view === "library" ? (
          <Library
            chats={chats}
            onSelect={(id) => {
              setActiveId(id);
              setView("chat");
              setError("");
            }}
          />
        ) : (
          <>
            <ChatWindow
              messages={activeChat?.messages ?? []}
              loading={loading}
              error={error}
              onCloseError={() => setError("")}
              onSuggestion={sendMessage}
            />

            <ChatInput
              prompt={prompt}
              setPrompt={setPrompt}
              loading={loading}
              onSend={() => sendMessage()}
              hasMessages={
                (activeChat?.messages.length ?? 0) > 0
              }
            />
          </>
        )}
      </main>
    </div>
  );
}

export default App;
