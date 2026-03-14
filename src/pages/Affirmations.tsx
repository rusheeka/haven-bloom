import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useSanctuary } from "@/context/SanctuaryContext";
import { affirmations } from "@/lib/sanctuary-data";
import TopBar from "@/components/TopBar";

const categories = ["all", "healing", "strength", "hope"] as const;

export default function Affirmations() {
  const { user, toggleFavoriteAffirmation, addPetals } = useSanctuary();
  const [category, setCategory] = useState<typeof categories[number]>("all");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hasEarned, setHasEarned] = useState(false);

  const filtered = category === "all" ? affirmations : affirmations.filter((a) => a.category === category);

  const shuffle = () => {
    const next = Math.floor(Math.random() * filtered.length);
    setCurrentIndex(next);
    if (!hasEarned) {
      addPetals(1, "read affirmation");
      setHasEarned(true);
    }
  };

  const current = filtered[currentIndex % filtered.length];

  return (
    <div className="min-h-screen page-gradient">
      <TopBar />

      <div className="pt-28 md:pt-20 pb-12 px-6 flex flex-col items-center justify-center min-h-[80vh]">
        <div className="flex flex-col items-center text-center max-w-md w-full">
          <h1 className="text-2xl font-display text-foreground mb-2">Affirmations</h1>
          <p className="text-sm font-ui text-muted-foreground mb-6">Words to hold close.</p>

          <div className="flex gap-2 mb-8">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => { setCategory(cat); setCurrentIndex(0); }}
                className={`px-3 py-1.5 rounded-full text-xs font-ui font-semibold capitalize transition-colors duration-300 ${
                  category === cat ? "bg-warmth/20 text-foreground" : "text-muted-foreground hover:bg-muted/50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={current?.text}
              initial={{ opacity: 0, y: 10, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.97 }}
              transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
              className="bg-card/50 backdrop-blur-xl rounded-orb p-8 shadow-ceramic w-full min-h-[180px] flex flex-col items-center justify-center mb-6"
            >
              <p className="text-xl font-display text-foreground leading-relaxed mb-4">"{current?.text}"</p>
              <motion.button
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  const idx = affirmations.indexOf(current);
                  if (idx >= 0) toggleFavoriteAffirmation(idx);
                }}
                className="text-2xl"
              >
                {user.favoriteAffirmations.includes(affirmations.indexOf(current)) ? "💛" : "🤍"}
              </motion.button>
            </motion.div>
          </AnimatePresence>

          <motion.button
            onClick={shuffle}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="bg-warmth/20 hover:bg-warmth/30 text-foreground font-ui font-semibold px-8 py-3 rounded-full shadow-ceramic transition-colors duration-300 text-sm"
          >
            Next Affirmation ✨
          </motion.button>
        </div>
      </div>
    </div>
  );
}
