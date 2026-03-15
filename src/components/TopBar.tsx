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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    <header className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-xl border-b border-border/40 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/home" className="flex items-center gap-2 z-50">
          <span className="text-sm font-display font-bold text-foreground tracking-tight">UNHEARD</span>
        </Link>

        {/* Nav links - Desktop inline (lg and up) */}
        <nav className="hidden lg:flex items-center gap-1.5 ml-8 mr-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-ui font-semibold transition-colors duration-300 ${
                    isActive ? "bg-primary/20 text-foreground" : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                  }`}
                >
                  <span className="text-sm">{item.emoji}</span>
                  <span>{item.label}</span>
                </motion.div>
              </Link>
            );
          })}
        </nav>

        {/* Right side: petals + settings + mobile toggle */}
        <div className="flex items-center gap-3 z-50">
          <PetalCounter />

          {/* Settings button */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setSettingsOpen(!settingsOpen);
                if (mobileMenuOpen) setMobileMenuOpen(false);
              }}
              className="w-9 h-9 rounded-full bg-muted/50 hover:bg-muted flex items-center justify-center text-[15px] transition-colors"
              aria-label="Settings"
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
                  className="absolute right-0 top-full mt-2 w-56 bg-card rounded-2xl shadow-ceramic border border-border/50 overflow-hidden"
                >
                  {/* Username display */}
                  <div className="px-4 py-3 border-b border-border/30">
                    <p className="text-[10px] font-ui text-muted-foreground uppercase tracking-wider mb-1">Logged in as</p>
                    <p className="text-sm font-ui font-bold text-foreground truncate">{user.username}</p>
                  </div>

                  {/* Change username */}
                  {editingName ? (
                    <div className="px-4 py-3 border-b border-border/30">
                      <input
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        placeholder="New username..."
                        maxLength={30}
                        className="w-full bg-muted/50 rounded-lg px-3 py-2 text-xs font-ui text-foreground placeholder:text-muted-foreground/50 outline-none mb-2 focus:ring-1 focus:ring-primary/50"
                        autoFocus
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={handleChangeName}
                          className="flex-1 text-[11px] font-ui font-semibold text-foreground bg-primary/20 hover:bg-primary/30 py-1.5 rounded-lg transition-colors"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => { setEditingName(false); setNewName(""); }}
                          className="flex-1 text-[11px] font-ui font-medium text-muted-foreground hover:text-foreground bg-muted/50 hover:bg-muted/80 py-1.5 rounded-lg transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setEditingName(true)}
                      className="w-full px-4 py-3 text-left text-xs font-ui font-medium text-foreground hover:bg-muted/50 transition-colors flex items-center gap-2"
                    >
                      <span className="text-sm">✏️</span> Change Username
                    </button>
                  )}

                  {/* Dark/Light mode */}
                  <button
                    onClick={toggleDarkMode}
                    className="w-full px-4 py-3 text-left text-xs font-ui font-medium text-foreground hover:bg-muted/50 transition-colors flex items-center gap-2"
                  >
                    <span className="text-sm">{isDarkMode ? "☀️" : "🌙"}</span>
                    {isDarkMode ? "Light Mode" : "Dark Mode"}
                  </button>

                  {/* Logout */}
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-3 text-left text-xs font-ui font-medium text-destructive-foreground hover:bg-destructive/10 transition-colors flex items-center gap-2 border-t border-border/30"
                  >
                    <span className="text-sm">🚪</span> Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile menu toggle button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setMobileMenuOpen(!mobileMenuOpen);
              if (settingsOpen) setSettingsOpen(false);
            }}
            className="lg:hidden w-9 h-9 rounded-full bg-primary/10 hover:bg-primary/20 text-foreground flex items-center justify-center transition-colors"
            aria-label="Toggle Menu"
          >
            <span className="text-sm font-ui">{mobileMenuOpen ? "✖" : "☰"}</span>
          </motion.button>
        </div>
      </div>

      {/* Mobile & Tablet Nav Menu (Dropdown) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="lg:hidden overflow-hidden bg-card/95 backdrop-blur-3xl border-t border-border/40"
          >
            <div className="flex flex-col px-4 py-4 gap-2 max-w-md mx-auto">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link key={item.path} to={item.path} onClick={() => setMobileMenuOpen(false)}>
                    <motion.div
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-ui font-semibold transition-colors duration-300 ${
                        isActive ? "bg-primary/20 text-foreground" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                      }`}
                    >
                      <span className="text-lg">{item.emoji}</span>
                      <span>{item.label}</span>
                    </motion.div>
                  </Link>
                );
              })}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

