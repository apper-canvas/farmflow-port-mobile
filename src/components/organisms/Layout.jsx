import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "@/components/organisms/Header";
import NotificationModal from "@/components/organisms/NotificationModal";
import SettingsModal from "@/components/organisms/SettingsModal";

const Layout = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3);

  const outletContext = {
    showNotifications,
    setShowNotifications,
    showSettings,
    setShowSettings,
    unreadCount,
    setUnreadCount
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-surface">
      <Header 
        showNotifications={showNotifications}
        setShowNotifications={setShowNotifications}
        showSettings={showSettings}
        setShowSettings={setShowSettings}
        unreadCount={unreadCount}
      />
      
      <main className="pb-20 lg:pb-8">
        <div className="container mx-auto px-4 py-6">
          <Outlet context={outletContext} />
        </div>
      </main>

      <NotificationModal 
        isOpen={showNotifications} 
        onClose={() => setShowNotifications(false)}
        onMarkAsRead={() => setUnreadCount(Math.max(0, unreadCount - 1))}
      />
      
      <SettingsModal 
        isOpen={showSettings} 
        onClose={() => setShowSettings(false)} 
      />
    </div>
  );
};

export default Layout;