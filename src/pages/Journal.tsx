import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useSanctuary } from "@/context/SanctuaryContext";
import { moods } from "@/lib/sanctuary-data";
import TopBar from "@/components/TopBar";

export default function Journal() {
  const { user, addJournalEntry } = useSanctuary();
  const [text, setText] = useState("");
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [view, setView] = useState<"write" | "history">("write");

  const handleSubmit = () => {
    if (!text.trim() || !selectedMood) return;
    addJournalEntry(text.trim(), selectedMood);
    setText("");
    setSelectedMood(null);
  };

  return (
    <div className="min-h-screen page-gradient">
      <TopBar />

      <div className="pt-28 md:pt-20 pb-12 px-6 max-w-md mx-auto">
        <h1 className="text-sm md:text-base font-display text-foreground mb-2 leading-loose">Private Journal</h1>
        <p className="text-sm font-ui text-muted-foreground mb-6">
          A safe space for your thoughts. +2 petals per entry.
        </p>

        <div className="flex gap-2 mb-6">
          {(["write", "history"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setView(tab)}
              className={`px-4 py-2 rounded-full text-xs font-ui font-semibold transition-colors duration-300 ${
                view === tab ? "bg-primary/20 text-foreground" : "text-muted-foreground hover:bg-muted/50"
              }`}
            >
              {tab === "write" ? "Write" : "History"}
            </button>
          ))}
        </div>

        {view === "write" ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-4">
            <div>
              <p className="text-xs font-ui text-muted-foreground mb-2">How are you feeling?</p>
              <div className="flex flex-wrap gap-2">
                {moods.map((m) => (
                  <motion.button
                    key={m.label}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedMood(m.emoji)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-ui transition-all duration-300 ${
                      selectedMood === m.emoji ? "bg-primary/20 shadow-ceramic" : "bg-muted/40 hover:bg-muted/60"
                    }`}
                  >
                    <span>{m.emoji}</span>
                    <span>{m.label}</span>
                  </motion.button>
                ))}
              </div>
            </div>

            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Write freely. No one will see this but you..."
              className="w-full h-40 bg-card/50 backdrop-blur-xl rounded-orb p-4 font-journal text-lg text-foreground placeholder:text-muted-foreground/40 border-none outline-none resize-none shadow-ceramic focus:ring-2 focus:ring-ring/20 transition-all duration-300"
            />

            <motion.button
              onClick={handleSubmit}
              disabled={!text.trim() || !selectedMood}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="self-end bg-bloom/20 hover:bg-bloom/30 disabled:opacity-30 disabled:cursor-not-allowed text-foreground font-ui font-semibold px-6 py-2.5 rounded-full shadow-ceramic transition-colors duration-300 text-sm"
            >
              Plant this entry 🌱
            </motion.button>
          </motion.div>
        ) : (
          <div className="flex flex-col gap-3">
            {user.journalEntries.length === 0 ? (
              <p className="text-sm font-ui text-muted-foreground text-center py-10">
                No entries yet. Your journal awaits. 📔
              </p>
            ) : (
              <AnimatePresence>
                {user.journalEntries.map((entry) => (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-card/50 backdrop-blur-xl rounded-orb p-4 shadow-ceramic"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-lg">{entry.mood}</span>
                      <span className="text-[10px] font-ui text-muted-foreground">
                        {new Date(entry.date).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="font-journal text-base text-foreground/90 leading-relaxed">{entry.text}</p>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
