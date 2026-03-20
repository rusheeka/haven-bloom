import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { useSanctuary } from "@/context/SanctuaryContext";
import TopBar from "@/components/TopBar";

const phases = [
  { label: "Breathe in", duration: 4000 },
  { label: "Hold", duration: 4000 },
  { label: "Breathe out", duration: 6000 },
];

export default function Breathing() {
  const { addPetals } = useSanctuary();
  const [active, setActive] = useState(false);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [cycles, setCycles] = useState(0);
  const [earned, setEarned] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (!active) return;
    const phase = phases[phaseIndex];
    timerRef.current = setTimeout(() => {
      const next = (phaseIndex + 1) % phases.length;
      setPhaseIndex(next);
      if (next === 0) setCycles((c) => c + 1);
    }, phase.duration);
    return () => clearTimeout(timerRef.current);
  }, [active, phaseIndex]);

  useEffect(() => {
    if (cycles >= 3 && !earned) {
      addPetals(3, "breathing exercise");
      setEarned(true);
    }
  }, [cycles, earned, addPetals]);

  const phase = phases[phaseIndex];
  const scaleValue = phaseIndex === 0 ? 1.3 : phaseIndex === 1 ? 1.3 : 1;
  const opacityValue = phaseIndex === 2 ? 0.6 : 1;

  return (
    <div className="min-h-screen page-gradient">
      <TopBar />

      <div className="pt-40 md:pt-36 pb-12 px-6 flex flex-col items-center min-h-[80vh]">
        <div className="flex flex-col items-center text-center max-w-sm my-auto">
          <h1 className="text-sm md:text-base font-display text-foreground mb-2 leading-loose">Hold My Hand</h1>
          <p className="text-sm font-ui text-muted-foreground mb-10">
            Breathe with the circle. Take your time.
          </p>

          <div className="relative mb-10">
            <motion.div
              animate={active ? { scale: scaleValue, opacity: opacityValue } : { scale: 1, opacity: 0.5 }}
              transition={{ duration: phase.duration / 1000, ease: [0.23, 1, 0.32, 1] }}
              className="w-48 h-48 rounded-full bg-gradient-to-br from-calm/40 to-growth/30 flex items-center justify-center"
            >
              <motion.div
                animate={active ? { scale: scaleValue * 0.8, opacity: opacityValue } : { scale: 0.8, opacity: 0.3 }}
                transition={{ duration: phase.duration / 1000, ease: [0.23, 1, 0.32, 1] }}
                className="w-32 h-32 rounded-full bg-gradient-to-br from-calm/50 to-bloom/20 flex items-center justify-center"
              >
                <span className="text-sm font-ui font-semibold text-foreground/80">
                  {active ? phase.label : "Ready"}
                </span>
              </motion.div>
            </motion.div>
          </div>

          {active && (
            <p className="text-xs font-ui text-muted-foreground mb-6">
              Cycle {cycles + 1} · {earned ? "✨ Petals earned!" : "Complete 3 cycles for +3 petals"}
            </p>
          )}

          <motion.button
            onClick={() => {
              setActive(!active);
              if (!active) {
                setPhaseIndex(0);
                setCycles(0);
                setEarned(false);
              }
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="bg-calm/20 hover:bg-calm/30 text-foreground font-ui font-semibold px-8 py-3 rounded-full shadow-ceramic transition-colors duration-300 text-sm"
          >
            {active ? "Pause" : "Begin Breathing"}
          </motion.button>
        </div>
      </div>
    </div>
  );
}
