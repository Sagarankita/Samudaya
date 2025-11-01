import { useState, useEffect } from "react";
import {
  SidebarProvider,
  SidebarInset,
} from "./components/ui/sidebar";
import { AppSidebar } from "./components/AppSidebar";
import { LoginPage } from "./components/LoginPage";
import { AdminLoginPage } from "./components/AdminLoginPage";
import { Dashboard } from "./components/Dashboard";
import { CalendarPage } from "./components/CalendarPage";
import { EventListing } from "./components/EventListing";
import { EventCreation } from "./components/EventCreation";
import { VolunteerManagement } from "./components/VolunteerManagement";
import { Announcements } from "./components/Announcements";
import { Forum } from "./components/Forum";
import { UserProfile } from "./components/UserProfile";
import { AdminPanel } from "./components/AdminPanel";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [currentPage, setCurrentPage] = useState("dashboard");

  const handleLogin = () => {
    setIsLoggedIn(true);
    setIsAdmin(false);
  };

  const handleAdminLogin = () => {
    setIsLoggedIn(true);
    setIsAdmin(true);
    setCurrentPage("admin");
  };

  // Show admin login page
  if (!isLoggedIn && showAdminLogin) {
    return (
      <AdminLoginPage 
        onLogin={handleAdminLogin} 
        onBackToUserLogin={() => setShowAdminLogin(false)}
      />
    );
  }

  // Show user login page
  if (!isLoggedIn) {
    return (
      <LoginPage 
        onLogin={handleLogin} 
        onAdminLoginClick={() => setShowAdminLogin(true)}
      />
    );
  }

  const renderPage = () => {
    if (isAdmin) {
      return <AdminPanel />;
    }

    switch (currentPage) {
      case "dashboard":
        return <Dashboard onPageChange={setCurrentPage} />;
      case "calendar":
        return <CalendarPage onPageChange={setCurrentPage} />;
      case "events":
        return <EventListing />;
      case "create-event":
        return <EventCreation />;
      case "volunteers":
        return <VolunteerManagement />;
      case "announcements":
        return <Announcements />;
      case "forum":
        return <Forum />;
      case "profile":
        return <UserProfile />;
      default:
        return <Dashboard onPageChange={setCurrentPage} />;
    }
  };

  // Admin view
  if (isAdmin) {
    return (
      <div className="min-h-screen w-full bg-slate-50">
        <main className="p-6 md:p-8 lg:p-10">
          {renderPage()}
        </main>
      </div>
    );
  }

  // Regular user view
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          isAdmin={false}
        />
        <SidebarInset className="flex-1">
          <main className="p-6 md:p-8 lg:p-10">
            {renderPage()}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}