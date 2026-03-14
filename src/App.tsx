import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SanctuaryProvider } from "@/context/SanctuaryContext";
import QuickExit from "@/components/QuickExit";
import Index from "./pages/Index";
import Garden from "./pages/Garden";
import Breathing from "./pages/Breathing";
import Journal from "./pages/Journal";
import Affirmations from "./pages/Affirmations";
import StoryGarden from "./pages/StoryGarden";
import Chat from "./pages/Chat";
import Resources from "./pages/Resources";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <SanctuaryProvider>
        <Sonner />
        <BrowserRouter>
          <QuickExit />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/garden" element={<Garden />} />
            <Route path="/breathing" element={<Breathing />} />
            <Route path="/journal" element={<Journal />} />
            <Route path="/affirmations" element={<Affirmations />} />
            <Route path="/stories" element={<StoryGarden />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </SanctuaryProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
