
import { Sparkles, Code2, BookOpen } from "lucide-react";
import Message from "./Message";
import TypingIndicator from "./TypingIndicator";
import ErrorMessage from "./ErrorMessage";

export default function ChatWindow({
  messages,
  loading,
  error,
  onCloseError,
  onSuggestion,
}) {
  if (messages.length === 0) {
    return (
      <section className="conversation">
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
                onSuggestion(
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
                onSuggestion(
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

        <ErrorMessage error={error} onClose={onCloseError} />
      </section>
    );
  }

  return (
    <section className="conversation">
      <div className="messages">
        {messages.map((msg, index) => (
          <Message key={index} msg={msg} />
        ))}

        {loading && <TypingIndicator />}

        <ErrorMessage error={error} onClose={onCloseError} />
      </div>
    </section>
  );
}
