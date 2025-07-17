import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, MessageCircle, Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import NavigationAuth from "./NavigationAuth";
import NavigationLogo from "./NavigationLogo";
import NavigationMobile from "./NavigationMobile";
import ChatNotificationBadge from "./chat/ChatNotificationBadge";
import { useAuth } from "@/contexts/AuthContext";

const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useAuth();
  const location = useLocation();
  const { t } = useTranslation();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Hide navigation items on home page for authenticated users (they have dashboard tabs)
  const isHomePage = location.pathname === "/";
  const showNavigationItems = !user || !isHomePage;

  return (
    <nav className="bg-nav/95 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-border">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          <NavigationLogo />

          {/* Desktop Navigation */}
          {showNavigationItems && (
            <div className="hidden md:flex items-center space-x-4 lg:space-x-6">
              {/* Desktop Navigation Items with Translations */}
              <Link
                to="/search-parts"
                className="flex flex-col items-center gap-1 text-nav-muted hover:text-nav-accent font-medium transition-colors px-3 py-2 rounded-lg hover:bg-accent group"
              >
                <Search className="h-5 w-5" />
                <span className="text-xs">{t("browse", "Browse Parts")}</span>
              </Link>
              <Link
                to="/request-part"
                className="flex flex-col items-center gap-1 text-nav-muted hover:text-nav-accent font-medium transition-colors px-3 py-2 rounded-lg hover:bg-accent group"
              >
                <Plus className="h-5 w-5" />
                <span className="text-xs">{t("request", "Request Part")}</span>
              </Link>
              {user && (
                <Link
                  to="/chat"
                  className="flex flex-col items-center gap-1 text-nav-muted hover:text-nav-accent font-medium transition-colors px-3 py-2 rounded-lg hover:bg-accent relative group"
                >
                  <MessageCircle className="h-5 w-5" />
                  <span className="text-xs">{t("messages", "Messages")}</span>
                  <ChatNotificationBadge />
                </Link>
              )}
            </div>
          )}

          {/* Desktop Auth */}
          <div className="hidden md:block">
            <NavigationAuth />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMobileMenu}
              className="p-2 text-nav-foreground"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <NavigationMobile
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </nav>
  );
};

export default Navigation;
