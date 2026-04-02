import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { useSanctuary } from "@/context/SanctuaryContext";
import TopBar from "@/components/TopBar";

const rooms = [
  { id: "general", label: "General Support", emoji: "💙" },
  { id: "healing", label: "Healing Together", emoji: "🌿" },
  { id: "quiet", label: "Quiet Corner", emoji: "🕊️" },
  { id: "nightowls", label: "Night Owls", emoji: "🌙" },
];

const sampleMessages = [
  { id: "m1", text: "Sending love to everyone here tonight 💛", author: "SteadyMeadow_412", room: "general", timestamp: new Date(Date.now() - 300000).toISOString(), reactions: { "💙": 3, "🙏": 1, "🌸": 2, "🤗": 0 } },
  { id: "m2", text: "It gets easier. Not all at once, but it does. Hold on.", author: "RadiantPearl_778", room: "general", timestamp: new Date(Date.now() - 120000).toISOString(), reactions: { "💙": 5, "🙏": 4, "🌸": 0, "🤗": 2 } },
  { id: "m3", text: "Thank you all for being here. I don't feel so alone anymore.", author: "HopefulDawn_203", room: "general", timestamp: new Date(Date.now() - 60000).toISOString(), reactions: { "💙": 8, "🙏": 2, "🌸": 3, "🤗": 6 } },
];

const crisisKeywords = ["kill myself", "self-harm", "suicide", "end it all", "want to die"];

export default function Chat() {
  const { user, addChatMessage, reactToMessage, setChatAgreed } = useSanctuary();
  const [activeRoom, setActiveRoom] = useState("general");
  const [message, setMessage] = useState("");
  const [crisisAlert, setCrisisAlert] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const allMessages = [...sampleMessages, ...user.chatMessages].filter((m) => m.room === activeRoom);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [allMessages.length]);

  const handleSend = () => {
    if (!message.trim()) return;
    const lower = message.toLowerCase();
    if (crisisKeywords.some((kw) => lower.includes(kw))) {
      setCrisisAlert(true);
      return;
    }
    addChatMessage(message.trim(), activeRoom);
    setMessage("");
  };

  const handleAgree = () => {
    setChatAgreed(true);
  };

  if (!user.chatAgreed) {
    return (
      <div className="min-h-screen page-gradient flex flex-col">
        <TopBar />
        <div className="flex-1 pt-32 md:pt-28 pb-12 px-6 flex flex-col items-center min-h-[80vh]">
          <div className="w-full max-w-sm text-center my-auto">
            <h1 className="text-sm md:text-base font-display text-foreground mb-4 leading-loose">Safe Chat</h1>
            <div className="bg-card/50 backdrop-blur-xl rounded-orb p-6 shadow-ceramic mb-6">
              <p className="text-sm font-ui text-foreground/80 leading-relaxed mb-4">
                This is an anonymous, supportive space. Before entering:
              </p>
              <ul className="text-xs font-ui text-muted-foreground text-left space-y-2 mb-4">
                <li>• Be kind and supportive to others</li>
                <li>• No sharing of personal identifying information</li>
                <li>• No harmful or triggering language</li>
                <li>• Report any concerning messages</li>
                <li>• If you're in crisis, please reach out to a helpline</li>
              </ul>
            </div>
            <motion.button
              onClick={handleAgree}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="bg-calm/20 hover:bg-calm/30 text-foreground font-ui font-semibold px-8 py-3 rounded-full shadow-ceramic text-sm"
            >
              I understand — Enter Chat
            </motion.button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen page-gradient flex flex-col overflow-hidden">
      <TopBar />

      <div className="flex-1 pt-24 md:pt-28 pb-6 px-4 md:px-6 w-full max-w-2xl mx-auto flex flex-col h-full overflow-hidden">
        <h1 className="text-xs md:text-sm font-display text-foreground mb-1 leading-loose">Safe Chat</h1>

        <div className="bg-warmth/10 rounded-pebble px-3 py-2 mb-3 text-[10px] font-ui text-muted-foreground">
          Need help now? <a href="https://988lifeline.org" target="_blank" rel="noopener" className="underline text-foreground">988 Lifeline</a> · <a href="https://www.rainn.org" target="_blank" rel="noopener" className="underline text-foreground">RAINN</a>
        </div>

        <div className="flex gap-1.5 mb-3 overflow-x-auto pb-1">
          {rooms.map((room) => (
            <button
              key={room.id}
              onClick={() => setActiveRoom(room.id)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-ui font-semibold whitespace-nowrap transition-colors duration-300 ${
                activeRoom === room.id ? "bg-calm/20 text-foreground" : "text-muted-foreground hover:bg-muted/50"
              }`}
            >
              <span>{room.emoji}</span>
              <span>{room.label}</span>
            </button>
          ))}
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-2 mb-3 pr-1">
          <AnimatePresence>
            {allMessages.map((msg) => {
              const isOwn = msg.author === user.username;
              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                  className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                >
                  <div className={`max-w-[80%] p-3 shadow-sm ${
                    isOwn ? "bg-warmth/20 rounded-pebble rounded-br-lg" : "bg-card/60 rounded-pebble rounded-bl-lg"
                  }`}>
                    {!isOwn && <p className="text-[10px] font-ui font-semibold text-bloom mb-0.5">{msg.author}</p>}
                    <p className="text-sm font-ui text-foreground/90 leading-relaxed">{msg.text}</p>
                    <div className="flex gap-2 mt-1.5">
                      {(["💙", "🙏", "🌸", "🤗"] as const).map((type) => (
                        <motion.button
                          key={type}
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => reactToMessage(msg.id, type)}
                          className="text-xs flex items-center gap-0.5 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {type}
                          {msg.reactions[type] > 0 && <span className="text-[10px]">{msg.reactions[type]}</span>}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {crisisAlert && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 bg-background/80 backdrop-blur-xl flex items-center justify-center p-6"
            >
              <div className="bg-card rounded-orb p-6 shadow-ceramic text-center max-w-xs">
                <p className="text-lg font-display text-foreground mb-3">You're not alone 💛</p>
                <p className="text-sm font-ui text-muted-foreground mb-4">
                  If you're in crisis, please reach out to someone who can help:
                </p>
                <div className="space-y-2 mb-4">
                  <a href="tel:988" className="block text-sm font-ui font-semibold text-foreground underline">988 Suicide & Crisis Lifeline</a>
                  <a href="https://www.rainn.org" target="_blank" rel="noopener" className="block text-sm font-ui font-semibold text-foreground underline">RAINN (1-800-656-4673)</a>
                  <p className="text-xs font-ui text-muted-foreground">Text HOME to 741741</p>
                </div>
                <button
                  onClick={() => { setCrisisAlert(false); setMessage(""); }}
                  className="bg-warmth/20 hover:bg-warmth/30 text-foreground font-ui font-semibold px-6 py-2 rounded-full text-sm"
                >
                  I understand
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex gap-2">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Share something gentle..."
            maxLength={300}
            className="flex-1 bg-card/50 backdrop-blur-xl rounded-full px-4 py-2.5 font-ui text-sm text-foreground placeholder:text-muted-foreground/40 border-none outline-none shadow-ceramic focus:ring-2 focus:ring-ring/20"
          />
          <motion.button
            onClick={handleSend}
            disabled={!message.trim()}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-calm/20 hover:bg-calm/30 disabled:opacity-30 text-foreground font-ui font-semibold px-4 py-2.5 rounded-full shadow-ceramic text-sm"
          >
            🌷
          </motion.button>
        </div>
      </div>
    </div>
  );
}
