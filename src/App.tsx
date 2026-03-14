import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SanctuaryProvider, useSanctuary } from "@/context/SanctuaryContext";
import QuickExit from "@/components/QuickExit";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Garden from "./pages/Garden";
import Breathing from "./pages/Breathing";
import Journal from "./pages/Journal";
import Affirmations from "./pages/Affirmations";
import StoryGarden from "./pages/StoryGarden";
import Chat from "./pages/Chat";
import Resources from "./pages/Resources";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useSanctuary();
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  const { isLoggedIn } = useSanctuary();

  return (
    <Routes>
      <Route path="/login" element={isLoggedIn ? <Navigate to="/home" replace /> : <Login />} />
      <Route path="/" element={<Navigate to={isLoggedIn ? "/home" : "/login"} replace />} />
      <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
      <Route path="/garden" element={<ProtectedRoute><Garden /></ProtectedRoute>} />
      <Route path="/breathing" element={<ProtectedRoute><Breathing /></ProtectedRoute>} />
      <Route path="/journal" element={<ProtectedRoute><Journal /></ProtectedRoute>} />
      <Route path="/affirmations" element={<ProtectedRoute><Affirmations /></ProtectedRoute>} />
      <Route path="/stories" element={<ProtectedRoute><StoryGarden /></ProtectedRoute>} />
      <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
      <Route path="/resources" element={<ProtectedRoute><Resources /></ProtectedRoute>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <SanctuaryProvider>
        <Sonner />
        <BrowserRouter>
          <QuickExit />
          <AppRoutes />
        </BrowserRouter>
      </SanctuaryProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
