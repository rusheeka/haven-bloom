import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useSanctuary } from "@/context/SanctuaryContext";
import PetalCounter from "@/components/PetalCounter";

const navItems = [
  { path: "/garden", label: "Garden", emoji: "🌱" },
  { path: "/breathing", label: "Hold My Hand", emoji: "🫧" },
  { path: "/journal", label: "Journal", emoji: "📔" },
  { path: "/affirmations", label: "Affirm", emoji: "✨" },
  { path: "/stories", label: "Story Chain", emoji: "🌸" },
  { path: "/chat", label: "Chat", emoji: "💬" },
  { path: "/resources", label: "Help", emoji: "🤍" },
];

export default function TopBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, toggleDarkMode, changeUsername, isDarkMode } = useSanctuary();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState("");

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleChangeName = () => {
    if (newName.trim()) {
      changeUsername(newName.trim());
      setEditingName(false);
      setNewName("");
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card/70 backdrop-blur-xl border-b border-border/40 shadow-sm">
      <div className="max-w-5xl mx-auto px-4 py-2 flex items-center justify-between">
        {/* Logo */}
        <Link to="/home" className="flex items-center gap-2">
          <span className="text-xl">🌱</span>
          <span className="text-sm font-display font-medium text-foreground tracking-tight">UNHEARD</span>
        </Link>

        {/* Nav links - scrollable on mobile */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-ui font-semibold transition-colors duration-300 ${
                    isActive ? "bg-primary/20 text-foreground" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  }`}
                >
                  <span>{item.emoji}</span>
                  <span>{item.label}</span>
                </motion.div>
              </Link>
            );
          })}
        </nav>

        {/* Right side: petals + settings */}
        <div className="flex items-center gap-3">
          <PetalCounter />

          {/* Settings button */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSettingsOpen(!settingsOpen)}
              className="w-8 h-8 rounded-full bg-muted/50 hover:bg-muted flex items-center justify-center text-sm transition-colors"
            >
              ⚙️
            </motion.button>

            <AnimatePresence>
              {settingsOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -5 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -5 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 top-full mt-2 w-56 bg-card rounded-orb shadow-ceramic border border-border/50 overflow-hidden"
                >
                  {/* Username display */}
                  <div className="px-4 py-3 border-b border-border/30">
                    <p className="text-[10px] font-ui text-muted-foreground">Logged in as</p>
                    <p className="text-sm font-ui font-semibold text-foreground">{user.username}</p>
                  </div>

                  {/* Change username */}
                  {editingName ? (
                    <div className="px-4 py-3 border-b border-border/30">
                      <input
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        placeholder="New username..."
                        maxLength={30}
                        className="w-full bg-muted/50 rounded-full px-3 py-1.5 text-xs font-ui text-foreground placeholder:text-muted-foreground/50 outline-none mb-2"
                        autoFocus
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={handleChangeName}
                          className="text-[11px] font-ui font-semibold text-foreground bg-primary/20 hover:bg-primary/30 px-3 py-1 rounded-full transition-colors"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => { setEditingName(false); setNewName(""); }}
                          className="text-[11px] font-ui text-muted-foreground hover:text-foreground transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setEditingName(true)}
                      className="w-full px-4 py-2.5 text-left text-xs font-ui text-foreground hover:bg-muted/50 transition-colors flex items-center gap-2"
                    >
                      <span>✏️</span> Change Username
                    </button>
                  )}

                  {/* Dark/Light mode */}
                  <button
                    onClick={toggleDarkMode}
                    className="w-full px-4 py-2.5 text-left text-xs font-ui text-foreground hover:bg-muted/50 transition-colors flex items-center gap-2"
                  >
                    <span>{isDarkMode ? "☀️" : "🌙"}</span>
                    {isDarkMode ? "Light Mode" : "Dark Mode"}
                  </button>

                  {/* Logout */}
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2.5 text-left text-xs font-ui text-destructive-foreground hover:bg-destructive/10 transition-colors flex items-center gap-2 border-t border-border/30"
                  >
                    <span>🚪</span> Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Mobile nav - horizontal scroll */}
      <nav className="md:hidden flex items-center gap-1 px-4 py-1.5 overflow-x-auto border-t border-border/20">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link key={item.path} to={item.path}>
              <div
                className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-ui font-semibold whitespace-nowrap transition-colors duration-300 ${
                  isActive ? "bg-primary/20 text-foreground" : "text-muted-foreground hover:bg-muted/50"
                }`}
              >
                <span>{item.emoji}</span>
                <span>{item.label}</span>
              </div>
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
