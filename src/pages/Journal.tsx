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
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const entriesByDate = user.journalEntries.reduce((acc, entry) => {
    const dateStr = new Date(entry.date).toLocaleDateString();
    if (!acc[dateStr]) acc[dateStr] = [];
    acc[dateStr].push(entry);
    return acc;
  }, {} as Record<string, typeof user.journalEntries>);

  const distinctDates = Object.keys(entriesByDate);

  const handleSubmit = () => {
    if (!text.trim() || !selectedMood) return;
    addJournalEntry(text.trim(), selectedMood);
    setText("");
    setSelectedMood(null);
  };

  return (
    <div className="min-h-screen page-gradient">
      <TopBar />

      <div className="pt-40 md:pt-36 pb-12 px-6 flex flex-col items-center min-h-[80vh]">
        <div className="w-full max-w-md flex flex-col items-center text-center my-auto">
          <h1 className="text-sm md:text-base font-display text-foreground mb-2 leading-loose">Private Journal</h1>
          <p className="text-sm font-ui text-muted-foreground mb-6">
            A safe space for your thoughts. +2 petals per entry.
          </p>

          <div className="flex gap-2 mb-6 justify-center">
            {(["write", "history"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => { setView(tab); setSelectedDate(null); }}
                className={`px-4 py-2 rounded-full text-xs font-ui font-semibold transition-colors duration-300 ${
                  view === tab ? "bg-primary/20 text-foreground" : "text-muted-foreground hover:bg-muted/50"
                }`}
              >
                {tab === "write" ? "Write" : "History"}
              </button>
            ))}
          </div>

          {view === "write" ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-4 w-full">
              <div className="flex flex-col items-center">
                <p className="text-xs font-ui text-muted-foreground mb-2">How are you feeling?</p>
                <div className="flex flex-wrap gap-2 justify-center">
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
                className="w-full h-40 bg-card/50 backdrop-blur-xl rounded-orb p-4 font-journal text-lg text-foreground placeholder:text-muted-foreground/40 border-none outline-none resize-none shadow-ceramic focus:ring-2 focus:ring-ring/20 transition-all duration-300 text-left"
              />

              <motion.button
                onClick={handleSubmit}
                disabled={!text.trim() || !selectedMood}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="self-center bg-bloom/20 hover:bg-bloom/30 disabled:opacity-30 disabled:cursor-not-allowed text-foreground font-ui font-semibold px-6 py-2.5 rounded-full shadow-ceramic transition-colors duration-300 text-sm"
              >
                Plant this entry 🌱
              </motion.button>
            </motion.div>
          ) : (
            <div className="flex flex-col gap-4 w-full">
              {user.journalEntries.length === 0 ? (
                <p className="text-sm font-ui text-muted-foreground text-center py-10">
                  No entries yet. Your journal awaits. 📔
                </p>
              ) : selectedDate === null ? (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4"
                >
                  {distinctDates.map((date) => (
                    <motion.button
                      key={date}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setSelectedDate(date)}
                      className="bg-card/50 backdrop-blur-xl rounded-[1.5rem] p-5 shadow-ceramic flex flex-col items-center justify-center gap-2 transition-all duration-300 hover:bg-card/80 border border-border/40 hover:border-primary/40 text-center"
                    >
                      <span className="text-2xl text-primary/80 opacity-80">🗓️</span>
                      <span className="text-xs md:text-sm font-ui font-bold text-foreground mt-1">{date}</span>
                      <span className="text-[10px] font-ui font-medium text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-full">
                        {entriesByDate[date].length} {entriesByDate[date].length === 1 ? 'entry' : 'entries'}
                      </span>
                    </motion.button>
                  ))}
                </motion.div>
              ) : (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col gap-4 w-full">
                  <div className="flex items-center justify-between px-2 mb-2">
                    <button 
                      onClick={() => setSelectedDate(null)}
                      className="text-[11px] md:text-xs font-ui font-semibold text-muted-foreground hover:text-foreground flex items-center gap-1.5 transition-colors bg-muted/40 hover:bg-muted/80 px-3 py-1.5 rounded-full"
                    >
                      <span>←</span> Back
                    </button>
                    <span className="text-xs md:text-sm font-ui font-bold text-foreground bg-card/60 px-3 py-1.5 rounded-full border border-border/30">
                      {selectedDate}
                    </span>
                  </div>
                  
                  <div className="flex flex-col gap-3">
                    <AnimatePresence>
                      {entriesByDate[selectedDate]?.map((entry) => (
                        <motion.div
                          key={entry.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-card/50 backdrop-blur-xl rounded-orb p-5 shadow-ceramic text-left border border-border/20"
                        >
                          <div className="flex justify-between items-center mb-3">
                            <span className="text-xl drop-shadow-sm">{entry.mood}</span>
                            <span className="text-[10px] font-ui font-medium text-muted-foreground bg-muted/30 px-2 py-1 rounded-full">
                              {new Date(entry.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="font-journal text-base md:text-lg text-foreground/90 leading-relaxed break-words whitespace-pre-wrap">{entry.text}</p>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </motion.div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
