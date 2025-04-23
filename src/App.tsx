
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { GameProvider } from "./context/GameContext";
import { AuthProvider } from "./context/AuthContext";

// Pages
import Index from "./pages/Index";
import CreateRoom from "./pages/CreateRoom";
import JoinRoom from "./pages/JoinRoom";
import Lobby from "./pages/Lobby";
import Game from "./pages/Game";
import Results from "./pages/Results";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";

// Auth guard component
const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const isAuthenticated = localStorage.getItem('user') !== null;
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <GameProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={
                <RequireAuth>
                  <Index />
                </RequireAuth>
              } />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/create-room" element={
                <RequireAuth>
                  <CreateRoom />
                </RequireAuth>
              } />
              <Route path="/join-room" element={
                <RequireAuth>
                  <JoinRoom />
                </RequireAuth>
              } />
              <Route path="/lobby" element={
                <RequireAuth>
                  <Lobby />
                </RequireAuth>
              } />
              <Route path="/game" element={
                <RequireAuth>
                  <Game />
                </RequireAuth>
              } />
              <Route path="/results" element={
                <RequireAuth>
                  <Results />
                </RequireAuth>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </GameProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
