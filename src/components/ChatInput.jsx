
import { ArrowUp, Paperclip, LoaderCircle } from "lucide-react";

export default function ChatInput({
  prompt,
  setPrompt,
  loading,
  onSend,
  hasMessages,
}) {
  return (
    <div className="composer-area">
      {!hasMessages && (
        <div className="composer-caption">
          Ask anything. Make something amazing.
        </div>
      )}

      <form
        className="composer"
        onSubmit={(e) => {
          e.preventDefault();
          onSend();
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
              onSend();
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
              title="File uploads are not connected"
              disabled
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

      <p className="disclaimer">
        An AI assistant can make mistakes. Check important information.
      </p>
    </div>
  );
}
