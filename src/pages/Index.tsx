import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useSanctuary } from "@/context/SanctuaryContext";

export default function Index() {
  const navigate = useNavigate();
  const { user } = useSanctuary();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-[12vh] relative overflow-hidden">
      {/* Background atmosphere */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-primary/5 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
        className="relative z-10 flex flex-col items-center text-center max-w-lg"
      >
        {/* Seed animation */}
        <motion.div
          className="text-7xl mb-8"
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: [0.23, 1, 0.32, 1] }}
        >
          🌱
        </motion.div>

        <h1 className="text-[clamp(2rem,5vw,3.5rem)] font-display font-medium text-foreground mb-4">
          UNHEARD
        </h1>
        <p className="text-lg font-ui text-muted-foreground mb-2 tracking-wide">
          A Safe Haven
        </p>
        <p className="prose-safe text-muted-foreground font-ui text-sm mb-10 leading-relaxed">
          You are here. You are safe. You are growing.
          <br />
          <span className="text-xs opacity-70">A gentle, anonymous space for healing.</span>
        </p>

        <motion.div
          className="flex flex-col items-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-xs font-ui text-muted-foreground mb-2">
            Your anonymous name: <span className="font-semibold text-foreground">{user.username}</span>
          </p>

          <motion.button
            onClick={() => navigate("/garden")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="bg-primary/20 hover:bg-primary/30 text-foreground font-ui font-semibold px-8 py-3.5 rounded-full shadow-ceramic transition-colors duration-300 text-sm"
          >
            Enter the Garden
          </motion.button>

          <p className="text-[11px] font-ui text-muted-foreground/60 mt-4">
            No sign-up required. Completely anonymous.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
