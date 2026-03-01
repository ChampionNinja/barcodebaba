import { useState } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ProfileSetupModal } from "@/components/ProfileSetupModal";
import { ProfileButton } from "@/components/ProfileButton";
import { profileExists } from "@/utils/profile";
import Home from "./pages/Home";
import Scan from "./pages/Scan";
import NotFound from "./pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/scan" component={Scan} />
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <ProfileSetupModal
          forceOpen={settingsOpen || !profileExists()}
          onClose={() => setSettingsOpen(false)}
        />
        <ProfileButton onClick={() => setSettingsOpen(true)} />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
