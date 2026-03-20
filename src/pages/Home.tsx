import { motion, useScroll } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useSanctuary } from "@/context/SanctuaryContext";
import TopBar from "@/components/TopBar";
import { useRef } from "react";

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
  const scrollRef = useRef<HTMLDivElement>(null);
  const { scrollXProgress } = useScroll({ container: scrollRef });

  return (
    <div className="h-screen w-full page-gradient overflow-hidden flex flex-col relative select-none">
      {/* Decorative Outer Frame (Noomo Style) */}
      <div className="pointer-events-none absolute top-20 bottom-3 left-3 right-3 md:top-24 md:bottom-6 md:left-6 md:right-6 border border-primary/30 rounded-3xl z-40" />
      
      <TopBar />

      <main 
        ref={scrollRef}
        className="flex-1 w-full overflow-x-auto hide-scrollbar snap-x snap-mandatory flex flex-row items-stretch pt-24 md:pt-28 pb-12 px-[5vw] gap-6 md:gap-12"
      >
        {/* Hero Section / Chapter 1 */}
        <div className="snap-center w-[90vw] flex-shrink-0 flex flex-col items-center relative py-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
            className="flex flex-col items-center z-10 my-auto pb-4 max-h-full min-h-0"
          >
            <motion.div
              className="mb-0"
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <img 
                src="/white_rose_emoji.png" 
                alt="White rose" 
                className="w-28 h-28 md:w-36 md:h-36 object-contain drop-shadow-2xl"
              />
            </motion.div>
            <h1 className="text-[clamp(1.5rem,3.5vw,3.2rem)] leading-none font-display font-medium text-foreground text-center mb-4 tracking-tight -mt-2 md:-mt-4">
              Welcome to <br/>
              <span className="inline-block bg-primary/20 text-foreground px-4 py-1 rounded-2xl mt-2 border border-primary/30 backdrop-blur-sm">
                your world
              </span>
              , {user.username}.
            </h1>
            <p className="text-xs md:text-sm font-ui text-muted-foreground mt-4 uppercase tracking-[0.2em]">
              Scroll to explore <span className="inline-block ml-2 md:hidden animate-bounce">👉</span>
            </p>
          </motion.div>

          {/* Floating Transparent Arrow */}
          <motion.div
            className="absolute right-0 top-1/2 -translate-y-1/2 text-foreground/20 text-7xl md:text-[10rem] font-light pointer-events-none hidden md:block"
            animate={{ x: [0, 20, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            ⟶
          </motion.div>
        </div>

        {/* Feature Chapters */}
        {features.map((feat, i) => (
          <div 
            key={feat.path}
            className="snap-center w-[85vw] sm:w-[60vw] lg:w-[40vw] flex-shrink-0 flex flex-col justify-center group py-4 h-full min-h-0"
          >
            <motion.button
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
              onClick={() => navigate(feat.path)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex-1 max-h-[80vh] bg-card/60 backdrop-blur-2xl rounded-[2rem] p-6 md:p-10 shadow-ceramic flex flex-col items-center justify-center gap-4 transition-all duration-500 hover:bg-card/80 border border-border/40 hover:border-primary/50 relative overflow-hidden my-auto min-h-0"
            >
              {/* Decorative background element per card */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[2rem]" />
              
              <motion.span 
                className="text-7xl md:text-9xl relative z-10 drop-shadow-xl"
                whileHover={{ rotate: 5, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {feat.emoji}
              </motion.span>
              <h2 className="text-xs md:text-sm font-display font-semibold text-foreground relative z-10 text-center leading-loose">
                {feat.label}
              </h2>
              <p className="text-sm md:text-lg font-ui text-muted-foreground text-center relative z-10 max-w-xs">
                {feat.desc}
              </p>
              
              {/* Chapter indicator */}
              <div className="absolute top-6 left-6 text-xs font-ui font-bold text-muted-foreground/50 tracking-widest uppercase">
                Chap {i + 1}
              </div>
            </motion.button>
          </div>
        ))}

        {/* Ending Spacer */}
        <div className="min-w-[10vw] flex-shrink-0 flex items-center justify-center snap-center h-[65vh]">
          <p className="text-xs font-ui text-muted-foreground/50 text-center tracking-widest uppercase rotate-90 whitespace-nowrap">
            Take your time.
          </p>
        </div>
      </main>

      {/* Progress Bar (Bottom) */}
      <div className="fixed bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2 pointer-events-none">
        <div className="w-32 md:w-48 h-1.5 bg-muted/40 backdrop-blur-md rounded-full overflow-hidden border border-border/20 shadow-sm">
          <motion.div 
            className="h-full bg-foreground/70 rounded-full" 
            style={{ scaleX: scrollXProgress, transformOrigin: 'left' }} 
          />
        </div>
      </div>
      
    </div>
  );
}
