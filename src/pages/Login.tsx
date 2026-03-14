import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSanctuary } from "@/context/SanctuaryContext";

export default function Login() {
  const navigate = useNavigate();
  const { loginUser, registerUser } = useSanctuary();
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username.trim() || !password.trim()) {
      setError("Please fill in all fields");
      return;
    }

    if (username.trim().length < 3) {
      setError("Username must be at least 3 characters");
      return;
    }

    if (password.length < 4) {
      setError("Password must be at least 4 characters");
      return;
    }

    if (isRegister) {
      const success = registerUser(username.trim(), password);
      if (success) {
        navigate("/home");
      } else {
        setError("Username already taken. Try another one.");
      }
    } else {
      const success = loginUser(username.trim(), password);
      if (success) {
        navigate("/home");
      } else {
        setError("Invalid username or password");
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden bg-gradient-to-br from-[hsl(340,80%,80%)] via-[hsl(300,60%,82%)] to-[hsl(260,60%,85%)]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
        className="relative z-10 flex flex-col items-center w-full max-w-sm"
      >
        {/* Logo */}
        <motion.div
          className="text-6xl mb-6"
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: [0.23, 1, 0.32, 1] }}
        >
          🌱
        </motion.div>

        <h1 className="text-3xl font-display font-medium text-foreground mb-1">UNHEARD</h1>
        <p className="text-sm font-ui text-muted-foreground mb-8">A Safe Haven</p>

        {/* Form card */}
        <div className="w-full bg-card/60 backdrop-blur-xl rounded-orb p-6 shadow-ceramic">
          <h2 className="text-lg font-display text-foreground text-center mb-5">
            {isRegister ? "Create Your Safe Space" : "Welcome Back"}
          </h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              maxLength={30}
              className="w-full bg-muted/40 rounded-full px-4 py-2.5 font-ui text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:ring-2 focus:ring-ring/30 transition-all"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              maxLength={50}
              className="w-full bg-muted/40 rounded-full px-4 py-2.5 font-ui text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:ring-2 focus:ring-ring/30 transition-all"
            />

            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs font-ui text-destructive-foreground text-center"
              >
                {error}
              </motion.p>
            )}

            <motion.button
              type="submit"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="w-full bg-primary/30 hover:bg-primary/40 text-foreground font-ui font-semibold py-2.5 rounded-full shadow-ceramic transition-colors duration-300 text-sm mt-1"
            >
              {isRegister ? "Create Account" : "Login"}
            </motion.button>
          </form>

          <div className="mt-4 text-center">
            <button
              onClick={() => { setIsRegister(!isRegister); setError(""); }}
              className="text-xs font-ui text-muted-foreground hover:text-foreground transition-colors"
            >
              {isRegister ? "Already have an account? Login" : "New here? Create an account"}
            </button>
          </div>
        </div>

        <p className="text-[11px] font-ui text-muted-foreground/60 mt-6 text-center">
          Your data stays on this device. Completely private.
        </p>
      </motion.div>
    </div>
  );
}
