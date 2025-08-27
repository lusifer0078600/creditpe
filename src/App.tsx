import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import SplashScreen from "./pages/SplashScreen";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import KYC from "./pages/KYC";
import Documents from "./pages/Documents";
import Eligibility from "./pages/Eligibility";
import Offer from "./pages/Offer";
import ESign from "./pages/ESign";
import Payment from "./pages/Payment";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<SplashScreen />} />
            <Route path="/home" element={<Home />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/kyc" element={<KYC />} />
            <Route path="/documents" element={<Documents />} />
            <Route path="/eligibility" element={<Eligibility />} />
            <Route path="/offer" element={<Offer />} />
            <Route path="/esign" element={<ESign />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/dashboard" element={<Dashboard />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
