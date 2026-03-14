import { motion } from "framer-motion";
import { useSanctuary } from "@/context/SanctuaryContext";
import { getGrowthStage } from "@/lib/sanctuary-data";
import PetalCounter from "@/components/PetalCounter";
import TopBar from "@/components/TopBar";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const quickActions = [
  { label: "Hold My Hand", emoji: "🫧", path: "/breathing", petals: 3 },
  { label: "Journal", emoji: "📔", path: "/journal", petals: 2 },
  { label: "Affirm", emoji: "✨", path: "/affirmations", petals: 1 },
  { label: "Story Chain", emoji: "🌸", path: "/stories", petals: 3 },
  { label: "Chat", emoji: "💬", path: "/chat", petals: 2 },
];

export default function Garden() {
  const { user, checkIn } = useSanctuary();
  const stage = getGrowthStage(user.petals);
  const navigate = useNavigate();
  const [checkedIn, setCheckedIn] = useState(false);

  useEffect(() => {
    const didCheckIn = checkIn();
    if (didCheckIn) setCheckedIn(true);
  }, []);

  const progress = Math.min((user.petals / 80) * 100, 100);

  return (
    <div className="min-h-screen page-gradient">
      <TopBar />

      <div className="pt-28 md:pt-20 pb-12 px-6 max-w-md mx-auto flex flex-col items-center">
        {/* Header */}
        <div className="w-full flex justify-between items-start mb-8">
          <div>
            <p className="text-xs font-ui text-muted-foreground">Welcome back,</p>
            <p className="text-sm font-ui font-semibold text-foreground">{user.username}</p>
          </div>
        </div>

        {checkedIn && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-growth/15 rounded-orb px-5 py-3 mb-6 text-center"
          >
            <p className="text-sm font-ui text-foreground">🌿 Daily check-in complete! +1 petal</p>
          </motion.div>
        )}

        {/* Central Garden Visualization */}
        <motion.div
          className="flex flex-col items-center my-8"
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: [0.23, 1, 0.32, 1] }}
        >
          <span className="text-8xl">{stage.emoji}</span>
          <p className="text-sm font-display text-foreground mt-4">{stage.label}</p>
        </motion.div>

        {/* Progress */}
        <div className="w-full max-w-xs mb-10">
          <div className="flex justify-between text-xs font-ui text-muted-foreground mb-1.5">
            <span>{user.petals} petals</span>
            <span>Next stage</span>
          </div>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-bloom to-growth rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
            />
          </div>
        </div>

        {/* Streak */}
        {user.streak > 0 && (
          <div className="bg-warmth/10 rounded-orb px-5 py-3 mb-8 text-center">
            <p className="text-sm font-ui text-foreground">
              🔥 {user.streak}-day safe streak · The garden is growing with you
            </p>
          </div>
        )}

        {/* Quick Actions */}
        <div className="w-full">
          <p className="text-xs font-ui text-muted-foreground mb-3">Healing activities</p>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action) => (
              <motion.button
                key={action.path}
                onClick={() => navigate(action.path)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="bg-card/60 backdrop-blur-xl rounded-orb p-4 shadow-ceramic flex flex-col items-center gap-2 transition-colors duration-300 hover:bg-card/80"
              >
                <span className="text-2xl">{action.emoji}</span>
                <span className="text-xs font-ui font-semibold text-foreground">{action.label}</span>
                <span className="text-[10px] font-ui text-muted-foreground">+{action.petals} petals</span>
              </motion.button>
            ))}
          </div>
        </div>

        <p className="text-xs font-ui text-muted-foreground/50 mt-10 text-center">
          Take your time. The garden is patient.
        </p>
      </div>
    </div>
  );
}
