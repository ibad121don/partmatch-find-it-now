import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut, User, Settings, MessageCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useUserDisplayName } from "@/hooks/useUserDisplayName";

const NavigationAuth = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const displayName = useUserDisplayName("User");
  const { t } = useTranslation();

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      // Check if there's an active session before attempting signout
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        // No active session, just redirect to home
        console.log("No active session found, redirecting to home");
        navigate("/");
        return;
      }

      const { error } = await supabase.auth.signOut();
      if (error) {
        // If it's a session missing error, just redirect instead of showing error
        if (
          error.message.includes("Auth session missing") ||
          error.message.includes("Session not found")
        ) {
          console.log("Session already expired, redirecting to home");
          navigate("/");
          return;
        }
        throw error;
      }

      navigate("/");
    } catch (error: any) {
      console.error("Error signing out:", error);

      // For session-related errors, just redirect without showing error toast
      if (
        error.message?.includes("Auth session missing") ||
        error.message?.includes("Session not found") ||
        error.name === "AuthSessionMissingError"
      ) {
        console.log("Session error during signout, redirecting to home");
        navigate("/");
        return;
      }

      // Only show error toast for other types of errors
      toast({
        title: "Error signing out",
        description: "There was a problem signing you out. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSigningOut(false);
    }
  };

  const getInitials = (email: string) => {
    return email.charAt(0).toUpperCase();
  };

  const getDashboardLink = () => {
    // Default to buyer dashboard for all users unless they're specifically admin or supplier
    return "/buyer-dashboard";
  };

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Link to="/auth">
          <Button variant="ghost" size="sm">
            {t("navbar.signIn", "Sign In")}
          </Button>
        </Link>
        <Link to="/auth">
          <Button size="sm">{t("navbar.getStarted", "Get Started")}</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-gray-600 hidden sm:block">
        Welcome, {displayName}
      </span>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage src="" alt="User avatar" />
              <AvatarFallback className="bg-purple-100 text-purple-700">
                {getInitials(user.email || "U")}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">Account</p>
              <p className="text-xs leading-none text-muted-foreground">
                {user.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleSignOut}
            disabled={isSigningOut}
            className="text-red-600 focus:text-red-600"
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>{isSigningOut ? "Signing out..." : "Sign out"}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default NavigationAuth;
