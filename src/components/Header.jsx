
import { Menu, Sun, Moon } from "lucide-react";

export default function Header({
  dark,
  setDark,
  setSidebarOpen,
}) {
  return (
    <header className="topbar">
      <button
        className="icon-btn mobile-menu"
        onClick={() => setSidebarOpen((previous) => !previous)}
        title="Toggle menu"
        aria-label="Toggle menu"
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
        onClick={() => setDark((previous) => !previous)}
        title="Toggle theme"
        aria-label="Toggle theme"
      >
        {dark ? <Sun size={18} /> : <Moon size={18} />}
      </button>
    </header>
  );
}
