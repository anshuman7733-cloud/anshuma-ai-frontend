import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Sparkles } from "lucide-react";

export default function Message({ msg }) {
  const isUser = msg.role === "user";

  return (
    <div className={`message-row ${isUser ? "user-row" : ""}`}>
      {!isUser && (
        <div className="message-avatar">
          <Sparkles size={17} />
        </div>
      )}

      <div className={`message ${isUser ? "user-message" : ""}`}>
        <div className="message-role">
          {isUser ? "You" : "Anshuman's AI"}
        </div>

        <div className={`message-content ${isUser ? "user-content" : "ai-content"}`}>
          {isUser ? (
            msg.content
          ) : (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {msg.content}
            </ReactMarkdown>
          )}
        </div>
      </div>
    </div>
  );
}