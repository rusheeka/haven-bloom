import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useSanctuary } from "@/context/SanctuaryContext";
import TopBar from "@/components/TopBar";

const features = [
  { label: "My Garden", emoji: "🌱", path: "/garden", desc: "Watch your healing journey grow" },
  { label: "Hold My Hand", emoji: "🫧", path: "/breathing", desc: "Guided breathing exercises" },
  { label: "Journal", emoji: "📔", path: "/journal", desc: "Write freely and privately" },
  { label: "Affirmations", emoji: "✨", path: "/affirmations", desc: "Words to hold close" },
  { label: "Story Chain", emoji: "🌸", path: "/stories", desc: "Anonymous shared stories" },
  { label: "Safe Chat", emoji: "💬", path: "/chat", desc: "Connect with others safely" },
  { label: "Resources", emoji: "🤍", path: "/resources", desc: "Help is always here" },
];

export default function Home() {
  const navigate = useNavigate();
  const { user } = useSanctuary();

  return (
    <div className="min-h-screen page-gradient">
      <TopBar />

      <div className="pt-28 md:pt-20 pb-12 px-6 max-w-2xl mx-auto">
        {/* Welcome section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
          className="text-center mb-10"
        >
          <motion.div
            className="text-6xl mb-4"
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: [0.23, 1, 0.32, 1] }}
          >
            🌱
          </motion.div>
          <h1 className="text-[clamp(1.8rem,4vw,2.8rem)] font-display font-medium text-foreground mb-2">
            Welcome, {user.username}
          </h1>
          <p className="text-sm font-ui text-muted-foreground">
            You are here. You are safe. You are growing.
          </p>
        </motion.div>

        {/* Feature grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {features.map((feat, i) => (
            <motion.button
              key={feat.path}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.06, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
              onClick={() => navigate(feat.path)}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="bg-card/50 backdrop-blur-xl rounded-orb p-5 shadow-ceramic flex flex-col items-center gap-2 transition-colors duration-300 hover:bg-card/70"
            >
              <span className="text-3xl">{feat.emoji}</span>
              <span className="text-xs font-ui font-semibold text-foreground">{feat.label}</span>
              <span className="text-[10px] font-ui text-muted-foreground text-center leading-tight">{feat.desc}</span>
            </motion.button>
          ))}
        </div>

        <p className="text-xs font-ui text-muted-foreground/50 mt-10 text-center">
          Take your time. The garden is patient. 🌿
        </p>
      </div>
    </div>
  );
}
