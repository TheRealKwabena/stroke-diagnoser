
import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navigation from "./components/Navigation";
import Home from "./pages/Home";
import Form from "./pages/Form";
import Dashboard from "./pages/Dashboard";
import PatientForm from "./pages/PatientForm";
import PatientDashboard from "./pages/PatientDashboard";
import NeurologistDashboard from "./pages/NeurologistDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import NotFound from "./pages/NotFound";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import { AuthModal } from "./components/AuthModal";

const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ children, allowedRoles }: { 
  children: React.ReactNode; 
  allowedRoles: string[] 
}) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  
  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

const AppContent = () => {
  const { user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  useEffect(() => {
    // Show auth modal on first visit if not logged in
    if (!user) {
      const hasVisitedBefore = localStorage.getItem('hasVisitedBefore');
      if (!hasVisitedBefore) {
        setShowAuthModal(true);
        localStorage.setItem('hasVisitedBefore', 'true');
      }
    }
  }, [user]);
  
  const handleCloseAuthModal = () => {
    setShowAuthModal(false);
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      <Routes>
        <Route path="/" element={<Home />} />
        
        {/* Doctor routes */}
        <Route 
          path="/form" 
          element={
            <ProtectedRoute allowedRoles={["Doctor"]}>
              <Form />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/doctor-dashboard" 
          element={
            <ProtectedRoute allowedRoles={["Doctor"]}>
              <DoctorDashboard />
            </ProtectedRoute>
          } 
        />
        
        {/* Patient routes */}
        <Route 
          path="/patient-form" 
          element={
            <ProtectedRoute allowedRoles={["Patient"]}>
              <PatientForm />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/patient-dashboard" 
          element={
            <ProtectedRoute allowedRoles={["Patient"]}>
              <PatientDashboard />
            </ProtectedRoute>
          } 
        />
        
        {/* Neurologist routes */}
        <Route 
          path="/neurologist-dashboard" 
          element={
            <ProtectedRoute allowedRoles={["Neurologist"]}>
              <NeurologistDashboard />
            </ProtectedRoute>
          } 
        />
        
        {/* Legacy routes - accessible by doctors and neurologists */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute allowedRoles={["Doctor", "Neurologist"]}>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        
        <Route path="*" element={<NotFound />} />
      </Routes>
      
      <AuthModal isOpen={showAuthModal} onClose={handleCloseAuthModal} />
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
