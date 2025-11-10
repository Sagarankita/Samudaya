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
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [currentPage, setCurrentPage] = useState("dashboard");

  const handleLogin = (user: any) => {
    setIsLoggedIn(true);
    setIsAdmin(user?.role === "admin");
    setCurrentUser(user);
  };

  const handleAdminLogin = (user: any) => {
    setIsLoggedIn(true);
    setIsAdmin(true);
    setCurrentUser(user);
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

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsAdmin(false);
    setCurrentUser(null);
    setCurrentPage("dashboard");
  };

  const renderPage = () => {
    if (isAdmin) {
      return <AdminPanel user={currentUser} />;
    }

    switch (currentPage) {
      case "dashboard":
        return <Dashboard onPageChange={setCurrentPage} user={currentUser} />;
      case "calendar":
        return <CalendarPage onPageChange={setCurrentPage} user={currentUser} />;
      case "events":
        return <EventListing user={currentUser} />;
      case "create-event":
        return <EventCreation user={currentUser} />;
      case "volunteers":
        return <VolunteerManagement user={currentUser} />;
      case "announcements":
        return <Announcements user={currentUser} />;
      case "forum":
        return <Forum user={currentUser} />;
      case "profile":
        return <UserProfile user={currentUser} />;
      default:
        return <Dashboard onPageChange={setCurrentPage} user={currentUser} />;
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
          onLogout={handleLogout}
          user={currentUser}
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