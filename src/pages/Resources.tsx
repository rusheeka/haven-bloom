import { motion } from "framer-motion";
import { helplines } from "@/lib/sanctuary-data";
import TopBar from "@/components/TopBar";

export default function Resources() {
  return (
    <div className="min-h-screen page-gradient">
      <TopBar />

      <div className="pt-28 md:pt-20 pb-12 px-6 max-w-md mx-auto">
        <h1 className="text-2xl font-display text-foreground mb-2">You Are Not Alone</h1>
        <p className="text-sm font-ui text-muted-foreground mb-8 prose-safe">
          If you need to talk to someone, these resources are here for you. All calls are confidential.
        </p>

        <div className="flex flex-col gap-3">
          {helplines.map((line, i) => (
            <motion.a
              key={i}
              href={line.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="bg-card/50 backdrop-blur-xl rounded-orb p-5 shadow-ceramic block"
            >
              <p className="text-sm font-ui font-semibold text-foreground mb-1">{line.name}</p>
              <p className="text-base font-display text-bloom">{line.number}</p>
            </motion.a>
          ))}
        </div>

        <div className="mt-10 bg-growth/10 rounded-orb p-5 text-center">
          <p className="text-sm font-ui text-foreground/80 leading-relaxed">
            "Healing takes courage, and we all have courage — even if we have to dig a little to find it."
          </p>
          <p className="text-xs font-ui text-muted-foreground mt-2">— Tori Amos</p>
        </div>
      </div>
    </div>
  );
}
