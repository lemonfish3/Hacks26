import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { StudyMateProvider, useStudyMate } from "@/context/StudyMateContext";
import Index from "./pages/Index";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import StudyRoom from "./pages/StudyRoom";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function ProtectedStudy({ children }: { children: React.ReactNode }) {
  const { user, profile } = useStudyMate();
  if (!user) return <Navigate to="/signup" replace />;
  if (!profile) return <Navigate to="/profile" replace />;
  return <>{children}</>;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <StudyMateProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<Profile />} />
            <Route
              path="/study"
              element={
                <ProtectedStudy>
                  <StudyRoom />
                </ProtectedStudy>
              }
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </StudyMateProvider>
  </QueryClientProvider>
);

export default App;
