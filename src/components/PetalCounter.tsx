import { useSanctuary } from "@/context/SanctuaryContext";
import { getGrowthStage } from "@/lib/sanctuary-data";
import { motion } from "framer-motion";

export default function PetalCounter() {
  const { user } = useSanctuary();
  const stage = getGrowthStage(user.petals);

  return (
    <motion.div
      className="flex items-center gap-2 bg-card/60 backdrop-blur-xl rounded-full px-4 py-2 shadow-ceramic"
      whileHover={{ scale: 1.05 }}>
      
      <span className="text-xl">{stage.emoji}</span>
      <div className="flex flex-col">
        <span className="text-xs font-ui font-semibold text-muted-foreground">{stage.label}</span>
        <span className="text-sm font-ui font-bold text-foreground">{user.petals} petals</span>
      </div>
      {user.streak > 0 &&
      <div className="ml-2 flex items-center gap-1 text-xs font-ui text-warmth">
          <span>🔥</span>
          <span className="text-primary-foreground">{user.streak}d</span>
        </div>
      }
    </motion.div>);

}