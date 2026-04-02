import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { useSanctuary } from "@/context/SanctuaryContext";
import TopBar from "@/components/TopBar";

// Define the breathing patterns
type Phase = { label: string; duration: number; scale: number; opacity: number };
type BreathingPattern = {
  id: string;
  name: string;
  phases: Phase[];
};

const patterns: BreathingPattern[] = [
  {
    id: "calm",
    name: "Calm",
    phases: [
      { label: "Breathe in", duration: 4000, scale: 1.3, opacity: 1 },
      { label: "Hold", duration: 4000, scale: 1.3, opacity: 1 },
      { label: "Breathe out", duration: 6000, scale: 1, opacity: 0.6 },
    ],
  },
  {
    id: "box",
    name: "Box Breathing",
    phases: [
      { label: "Breathe in", duration: 4000, scale: 1.3, opacity: 1 },
      { label: "Hold", duration: 4000, scale: 1.3, opacity: 0.9 },
      { label: "Breathe out", duration: 4000, scale: 1, opacity: 0.6 },
      { label: "Hold empty", duration: 4000, scale: 1, opacity: 0.5 },
    ],
  },
  {
    id: "478",
    name: "4-7-8 Breathing",
    phases: [
      { label: "Breathe in", duration: 4000, scale: 1.4, opacity: 1 },
      { label: "Hold", duration: 7000, scale: 1.4, opacity: 0.9 },
      { label: "Breathe out", duration: 8000, scale: 1, opacity: 0.5 },
    ],
  },
];

export default function Breathing() {
  const { addPetals } = useSanctuary();
  const [active, setActive] = useState(false);
  const [selectedPatternId, setSelectedPatternId] = useState<string>("calm");
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [cycles, setCycles] = useState(0);
  const [earned, setEarned] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  const currentPattern = patterns.find((p) => p.id === selectedPatternId) || patterns[0];

  // Reset state when pattern changes
  useEffect(() => {
    setActive(false);
    setPhaseIndex(0);
    setCycles(0);
    setEarned(false);
  }, [selectedPatternId]);

  useEffect(() => {
    if (!active) return;
    const phase = currentPattern.phases[phaseIndex];
    timerRef.current = setTimeout(() => {
      const next = (phaseIndex + 1) % currentPattern.phases.length;
      setPhaseIndex(next);
      if (next === 0) setCycles((c) => c + 1);
    }, phase.duration);
    return () => clearTimeout(timerRef.current);
  }, [active, phaseIndex, currentPattern]);

  useEffect(() => {
    if (cycles >= 3 && !earned) {
      addPetals(3, "breathing exercise");
      setEarned(true);
    }
  }, [cycles, earned, addPetals]);

  const currentPhase = currentPattern.phases[phaseIndex];

  return (
    <div className="min-h-screen page-gradient">
      <TopBar />

      <div className="pt-40 md:pt-36 pb-12 px-6 flex flex-col items-center min-h-[80vh]">
        <div className="flex flex-col items-center text-center max-w-sm my-auto w-full">
          <h1 className="text-sm md:text-base font-display text-foreground mb-2 leading-loose">Hold My Hand</h1>
          <p className="text-sm font-ui text-muted-foreground mb-6">
            Breathe with the circle. Take your time.
          </p>

          <div className="flex justify-center flex-wrap gap-2 mb-10 w-full">
            {patterns.map((pattern) => (
              <button
                key={pattern.id}
                onClick={() => setSelectedPatternId(pattern.id)}
                className={`px-3 py-1.5 rounded-full text-xs md:text-sm font-ui transition-all duration-300 ${
                  selectedPatternId === pattern.id
                    ? "bg-primary/20 text-foreground shadow-sm shadow-primary/10 border border-primary/20 font-semibold"
                    : "bg-muted/30 text-muted-foreground hover:bg-muted/60 border border-transparent font-medium"
                }`}
              >
                {pattern.name}
              </button>
            ))}
          </div>

          <div className="relative mb-10">
            <motion.div
              animate={active ? { scale: currentPhase.scale, opacity: currentPhase.opacity } : { scale: 1, opacity: 0.5 }}
              transition={{ duration: currentPhase.duration / 1000, ease: [0.23, 1, 0.32, 1] }}
              className="w-48 h-48 rounded-full bg-gradient-to-br from-calm/40 to-growth/30 flex items-center justify-center"
            >
              <motion.div
                animate={active ? { scale: currentPhase.scale * 0.8, opacity: currentPhase.opacity } : { scale: 0.8, opacity: 0.3 }}
                transition={{ duration: currentPhase.duration / 1000, ease: [0.23, 1, 0.32, 1] }}
                className="w-32 h-32 rounded-full bg-gradient-to-br from-calm/50 to-bloom/20 flex items-center justify-center"
              >
                <span className="text-sm font-ui font-semibold text-foreground/80">
                  {active ? currentPhase.label : "Ready"}
                </span>
              </motion.div>
            </motion.div>
          </div>

          <div className="h-6 mb-6 flex items-center justify-center">
            {active && (
              <p className="text-xs font-ui text-muted-foreground">
                Cycle {cycles + 1} · {earned ? "✨ Petals earned!" : "Complete 3 cycles for +3 petals"}
              </p>
            )}
          </div>

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

