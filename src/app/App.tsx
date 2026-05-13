import React, { useState } from "react";
import { Layout } from "./components/Layout";
import { HRDashboard } from "./components/hr/HRDashboard";
import { EmployeeManagement } from "./components/hr/EmployeeManagement";
import { HRAnalytics } from "./components/hr/HRAnalytics";
import { HRBilling } from "./components/hr/HRBilling";
import { HRSettings } from "./components/hr/HRSettings";
import { SignIn } from "./components/auth/SignIn";
import { SignUp } from "./components/auth/SignUp";
import { ForgotPassword } from "./components/auth/ForgotPassword";
import { PurchaseSetup } from "./components/auth/PurchaseSetup";
import { WelcomeVideoModal } from "./components/WelcomeVideoModal";
import { OnboardingGuide } from "./components/OnboardingGuide";
import { Toaster } from "./components/ui/sonner";

// Placeholder for Supabase connection logic (if we were to implement it)
const SupabaseConnectionBanner = () => null;

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Check localStorage for auth state to persist session
    const storedAuth = localStorage.getItem("qp_merchant_auth");
    return storedAuth === "true";
  });
  const [authView, setAuthView] = useState<
    "signin" | "signup" | "forgotpassword" | "purchase"
  >("signin");
  const [currentView, setCurrentView] = useState("hr-dashboard");
  const [showWelcomeVideo, setShowWelcomeVideo] =
    useState(false);
  const [showWelcomeModal, setShowWelcomeModal] =
    useState(false);

  const handleLoginSuccess = () => {
    localStorage.setItem("qp_merchant_auth", "true");
    setIsAuthenticated(true);
    setShowWelcomeModal(true); // Show welcome details modal first
  };

  // If not authenticated, show Auth pages
  if (!isAuthenticated) {
    return (
      <>
        {authView === "signin" ? (
          <SignIn
            onSignIn={handleLoginSuccess}
            onNavigateToSignUp={() => setAuthView("signup")}
          />
        ) : authView === "signup" ? (
          <SignUp
            onSignUp={() => setAuthView("purchase")}
            onNavigateToSignIn={() => setAuthView("signin")}
          />
        ) : authView === "purchase" ? (
          <PurchaseSetup onComplete={handleLoginSuccess} onBack={() => setAuthView("signup")} />
        ) : (
          <ForgotPassword
            onNavigateToSignIn={() => setAuthView("signin")}
          />
        )}
        <Toaster position="top-center" />
        <SupabaseConnectionBanner />
      </>
    );
  }

  const renderView = () => {
    switch (currentView) {
      case "hr-dashboard":
        return <HRDashboard onNavigate={setCurrentView} />;
      case "hr-employees":
        return <EmployeeManagement onNavigate={setCurrentView} />;
      case "hr-analytics":
        return <HRAnalytics onNavigate={setCurrentView} />;
      case "hr-billing":
        return <HRBilling onNavigate={setCurrentView} />;
      case "hr-settings":
        return <HRSettings onNavigate={setCurrentView} />;
      default:
        return <HRDashboard onNavigate={setCurrentView} />;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("qp_merchant_auth");
    setIsAuthenticated(false);
    setAuthView("signin");
    setCurrentView("hr-dashboard");
  };

  return (
    <>
      <Layout
        currentView={currentView}
        onChangeView={setCurrentView}
        onLogout={handleLogout}
        onShowGuide={() => setShowWelcomeVideo(true)}
      >
        {renderView()}
      </Layout>
      <OnboardingGuide
        isOpen={showWelcomeModal}
        onClose={() => setShowWelcomeModal(false)}
        onWatchVideo={() => {
          setShowWelcomeModal(false);
          setShowWelcomeVideo(true);
        }}
      />
      <WelcomeVideoModal
        isOpen={showWelcomeVideo}
        onClose={() => setShowWelcomeVideo(false)}
      />
      <Toaster position="top-center" />
      <SupabaseConnectionBanner />
    </>
  );
}