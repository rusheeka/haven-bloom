import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const navItems = [
  { path: "/garden", label: "Garden", emoji: "🌱" },
  { path: "/breathing", label: "Hold My Hand", emoji: "🫧" },
  { path: "/journal", label: "Journal", emoji: "📔" },
  { path: "/affirmations", label: "Affirm", emoji: "✨" },
  { path: "/stories", label: "Story Chain", emoji: "🌸" },
  { path: "/chat", label: "Chat", emoji: "💬" },
  { path: "/resources", label: "Help", emoji: "🤍" },
];


export default function NavigationOrbs() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-16 left-1/2 -translate-x-1/2 z-50 flex bg-card/70 backdrop-blur-xl rounded-full px-3 py-2 shadow-ceramic gap-[35px]">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <Link key={item.path} to={item.path}>
            <motion.div
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.95 }}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-full transition-colors duration-300 ${
              isActive ? "bg-primary/20" : "hover:bg-muted/50"}`
              }>
              
              <span className="text-lg bg-transparent">{item.emoji}</span>
              <span className="text-[10px] font-ui font-semibold text-muted-foreground mx-px my-px">
                {item.label}
              </span>
            </motion.div>
          </Link>);

      })}
    </nav>);

}