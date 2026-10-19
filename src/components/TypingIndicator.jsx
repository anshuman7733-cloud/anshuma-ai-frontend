
import { Sparkles, LoaderCircle } from "lucide-react";

export default function TypingIndicator() {
  return (
    <div className="message-row">
      <div className="message-avatar">
        <Sparkles size={17} />
      </div>

      <div className="typing">
        <LoaderCircle size={17} className="spin" />
        <span>Thinking...</span>
      </div>
    </div>
  );
}
