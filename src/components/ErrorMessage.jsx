
import { X } from "lucide-react";

export default function ErrorMessage({ error, onClose }) {
  if (!error) return null;

  return (
    <div className="error-message">
      {error}
      <button onClick={onClose} aria-label="Close error">
        <X size={15} />
      </button>
    </div>
  );
}
