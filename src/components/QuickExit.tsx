import { useNavigate } from "react-router-dom";

export default function QuickExit() {
  const navigate = useNavigate();

  const handleExit = () => {
    window.location.replace("https://www.google.com");
  };

  return (
    <button
      onClick={handleExit}
      className="fixed bottom-4 right-4 z-[9999] bg-muted/80 backdrop-blur-xl text-muted-foreground font-ui text-xs px-4 py-2 rounded-full shadow-ceramic hover:bg-muted transition-all duration-300"
      aria-label="Quick exit to a safe website"
      title="Quick Exit"
    >
      ✕ Exit
    </button>
  );
}
