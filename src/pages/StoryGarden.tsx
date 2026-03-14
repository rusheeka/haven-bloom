import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useSanctuary } from "@/context/SanctuaryContext";
import NavigationOrbs from "@/components/NavigationOrbs";

const sampleStories = [
  { id: "s1", text: "Today I walked outside for the first time in weeks. The sun felt like a gentle friend.", author: "BraveWillow_321", timestamp: new Date().toISOString(), warmth: { "🌱": 4, "💚": 7, "🤍": 2 } },
  { id: "s2", text: "I told my therapist the truth today. It felt like releasing a breath I'd been holding for years.", author: "QuietRiver_654", timestamp: new Date().toISOString(), warmth: { "🌱": 12, "💚": 8, "🤍": 5 } },
  { id: "s3", text: "Some days are hard. But I'm still here. And that counts.", author: "GentleFern_189", timestamp: new Date().toISOString(), warmth: { "🌱": 9, "💚": 15, "🤍": 11 } },
];

export default function StoryGarden() {
  const { user, addStory, sendWarmth } = useSanctuary();
  const [newStory, setNewStory] = useState("");
  const [showForm, setShowForm] = useState(false);

  const allStories = [...user.stories, ...sampleStories];

  const handleSubmit = () => {
    if (!newStory.trim()) return;
    addStory(newStory.trim());
    setNewStory("");
    setShowForm(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center px-6 pt-[8vh] pb-36 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-bloom/5 via-background to-background pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        <h1 className="text-2xl font-display text-foreground mb-2">Story Garden</h1>
        <p className="text-sm font-ui text-muted-foreground mb-6">
          Anonymous stories blooming together. +3 petals for sharing.
        </p>

        <motion.button
          onClick={() => setShowForm(!showForm)}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="w-full bg-bloom/15 hover:bg-bloom/25 text-foreground font-ui font-semibold py-3 rounded-orb shadow-ceramic transition-colors duration-300 text-sm mb-6"
        >
          {showForm ? "Cancel" : "Plant a Story 🌸"}
        </motion.button>

        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 overflow-hidden"
            >
              <textarea
                value={newStory}
                onChange={e => setNewStory(e.target.value)}
                placeholder="Share your story anonymously..."
                maxLength={500}
                className="w-full h-28 bg-card/50 backdrop-blur-xl rounded-orb p-4 font-journal text-lg text-foreground placeholder:text-muted-foreground/40 border-none outline-none resize-none shadow-ceramic mb-3"
              />
              <motion.button
                onClick={handleSubmit}
                disabled={!newStory.trim()}
                whileTap={{ scale: 0.97 }}
                className="bg-bloom/20 hover:bg-bloom/30 disabled:opacity-30 text-foreground font-ui font-semibold px-6 py-2 rounded-full shadow-ceramic text-sm"
              >
                Share Anonymously
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex flex-col gap-3">
          {allStories.map(story => (
            <motion.div
              key={story.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card/50 backdrop-blur-xl rounded-orb p-5 shadow-ceramic"
            >
              <p className="text-sm font-ui font-semibold text-bloom mb-1">{story.author}</p>
              <p className="text-base font-ui text-foreground/90 leading-relaxed mb-3">{story.text}</p>
              <div className="flex gap-3">
                {(["🌱", "💚", "🤍"] as const).map(type => (
                  <motion.button
                    key={type}
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => sendWarmth(story.id, type)}
                    className="flex items-center gap-1 text-xs font-ui text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <span>{type}</span>
                    <span>{story.warmth[type]}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <NavigationOrbs />
    </div>
  );
}
