import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import {
  User,
  Phone,
  MapPin,
  Trash2,
  Save,
  Shield,
  FileText,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import SellerVerificationForm from "./SellerVerificationForm";
import SellerVerificationStatus from "./SellerVerificationStatus";

interface ProfileData {
  first_name: string;
  last_name: string;
  phone: string;
  location: string;
  address: string;
}

interface VerificationData {
  id: string;
  verification_status: string;
  full_name: string;
  seller_type: string;
  admin_notes?: string;
  created_at: string;
  verified_at?: string;
}

const SellerProfileManagement = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [verification, setVerification] = useState<VerificationData | null>(
    null
  );
  const [showVerificationForm, setShowVerificationForm] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    first_name: "",
    last_name: "",
    phone: "",
    location: "",
    address: "",
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchVerificationStatus();
    }
  }, [user]);

  const fetchVerificationStatus = async () => {
    try {
      const { data, error } = await supabase
        .from("seller_verifications")
        .select("*")
        .eq("user_id", user?.id)
        .maybeSingle();

      if (error && error.code !== "PGRST116") {
        throw error;
      }

      setVerification(data);
    } catch (error) {
      console.error("Error fetching verification status:", error);
    }
  };

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("first_name, last_name, phone, location, address")
        .eq("id", user?.id)
        .single();

      if (error) throw error;

      if (data) {
        setProfileData({
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          phone: data.phone || "",
          location: data.location || "",
          address: data.address || "",
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast({
        title: t("error", "Error"),
        description: t(
          "sellerProfile.failedToLoad",
          "Failed to load profile data."
        ),
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  const handleUpdateProfile = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          first_name: profileData.first_name,
          last_name: profileData.last_name,
          phone: profileData.phone,
          location: profileData.location,
          address: profileData.address,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user?.id);

      if (error) throw error;

      toast({
        title: t("profileUpdated", "Profile Updated"),
        description: t(
          "sellerProfile.profileUpdated",
          "Your profile has been successfully updated."
        ),
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: t("error", "Error"),
        description: t(
          "sellerProfile.failedToUpdate",
          "Failed to update profile. Please try again."
        ),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProfile = async () => {
    setDeleting(true);
    try {
      console.log(
        "Starting seller account deletion process for user:",
        user?.id
      );

      // First delete the user's profile data
      const { error: profileError } = await supabase
        .from("profiles")
        .delete()
        .eq("id", user?.id);

      if (profileError) {
        console.error("Error deleting profile:", profileError);
        throw profileError;
      }

      console.log("Profile deleted successfully");

      // Delete seller-specific data (car parts, offers, etc.)
      const { error: partsError } = await supabase
        .from("car_parts")
        .delete()
        .eq("supplier_id", user?.id);

      if (partsError) {
        console.error("Error deleting car parts:", partsError);
      }

      const { error: offersError } = await supabase
        .from("offers")
        .delete()
        .eq("supplier_id", user?.id);

      if (offersError) {
        console.error("Error deleting offers:", offersError);
      }

      // Get the current session token for authentication
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        throw new Error("No valid session found");
      }

      // Call the Edge Function to delete the user from Auth
      const { error: deleteUserError } = await supabase.functions.invoke(
        "delete-user",
        {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        }
      );

      if (deleteUserError) {
        console.error("Error calling delete-user function:", deleteUserError);
        throw deleteUserError;
      }

      console.log("User successfully deleted from Auth system");

      // Sign out the user locally
      await supabase.auth.signOut();

      toast({
        title: t("sellerProfile.accountDeleted", "Account Deleted"),
        description: t(
          "sellerProfile.accountDeletedDesc",
          "Your seller account has been permanently deleted."
        ),
      });

      // Redirect to home page
      navigate("/");
    } catch (error) {
      console.error("Error deleting seller account:", error);
      toast({
        title: t("error", "Error"),
        description: t(
          "sellerProfile.failedToDelete",
          "Failed to delete account. Please try again or contact support."
        ),
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
    }
  };

  const handleVerificationSubmitted = () => {
    setShowVerificationForm(false);
    fetchVerificationStatus();
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Seller Verification Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            {t("sellerProfile.verification", "Seller Verification")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {verification ? (
            <SellerVerificationStatus
              verification={{
                ...verification,
                verification_status: verification.verification_status as
                  | "pending"
                  | "approved"
                  | "rejected",
              }}
            />
          ) : (
            <div className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <FileText className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-yellow-800">
                      {t(
                        "sellerProfile.verificationRequired",
                        "Verification Required"
                      )}
                    </h3>
                    <p className="text-sm text-yellow-700 mt-1">
                      {t(
                        "sellerProfile.verificationRequiredDesc",
                        "To sell car parts on our platform, you need to complete seller verification. This helps build trust with buyers and ensures a safe marketplace for everyone."
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {!showVerificationForm ? (
                <Button
                  onClick={() => setShowVerificationForm(true)}
                  className="w-full bg-orange-600 hover:bg-orange-700"
                >
                  <Shield className="h-4 w-4 mr-2" />
                  {t(
                    "sellerProfile.startVerification",
                    "Start Verification Process"
                  )}
                </Button>
              ) : (
                <div className="space-y-4">
                  <SellerVerificationForm
                    onVerificationSubmitted={handleVerificationSubmitted}
                  />
                  <Button
                    variant="outline"
                    onClick={() => setShowVerificationForm(false)}
                    className="w-full"
                  >
                    {t("cancel", "Cancel")}
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Separator />

      {/* Profile Management Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            {t("sellerProfile.profileManagement", "Seller Profile Management")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">{t("firstName", "First Name")}</Label>
              <Input
                id="firstName"
                value={profileData.first_name}
                onChange={(e) =>
                  handleInputChange("first_name", e.target.value)
                }
                placeholder={t(
                  "sellerProfile.enterFirstName",
                  "Enter your first name"
                )}
              />
            </div>
            <div>
              <Label htmlFor="lastName">{t("lastName", "Last Name")}</Label>
              <Input
                id="lastName"
                value={profileData.last_name}
                onChange={(e) => handleInputChange("last_name", e.target.value)}
                placeholder={t(
                  "sellerProfile.enterLastName",
                  "Enter your last name"
                )}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="phone">{t("phone", "Phone/WhatsApp")}</Label>
            <div className="relative">
              <Phone className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
              <Input
                id="phone"
                value={profileData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder={t(
                  "sellerProfile.phonePlaceholder",
                  "+233 20 123 4567"
                )}
                className="pl-10"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="location">{t("location", "Location")}</Label>
            <div className="relative">
              <MapPin className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
              <Input
                id="location"
                value={profileData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                placeholder={t(
                  "sellerProfile.locationPlaceholder",
                  "e.g. Accra, Kumasi"
                )}
                className="pl-10"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="address">
              {t(
                "sellerProfile.businessAddress",
                "Business Address (Optional)"
              )}
            </Label>
            <Textarea
              id="address"
              value={profileData.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              placeholder={t(
                "sellerProfile.enterBusinessAddress",
                "Enter your business address"
              )}
              rows={3}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:justify-between pt-4">
            <Button
              onClick={handleUpdateProfile}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto order-2 sm:order-1"
            >
              <Save className="h-4 w-4 mr-2" />
              {loading
                ? t("sellerProfile.updating", "Updating...")
                : t("sellerProfile.updateProfile", "Update Profile")}
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  disabled={deleting}
                  className="w-full sm:w-auto order-1 sm:order-2"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  {t("sellerProfile.deleteAccount", "Delete Account")}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    {t(
                      "sellerProfile.deleteConfirmTitle",
                      "Are you absolutely sure?"
                    )}
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    {t(
                      "sellerProfile.deleteConfirmDesc",
                      "This action cannot be undone. This will permanently delete your seller account and remove all your data, including your car parts listings and offers. You will be immediately signed out and will not be able to sign in again with these credentials."
                    )}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{t("cancel", "Cancel")}</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteProfile}
                    disabled={deleting}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    {deleting
                      ? t("sellerProfile.deleting", "Deleting...")
                      : t("sellerProfile.deleteAccount", "Delete Account")}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SellerProfileManagement;

// Note: This file has grown quite large (300+ lines). Consider refactoring into smaller components:
// - ProfileForm component for the form fields
// - ProfileActions component for the buttons and delete dialog
// - This would improve maintainability and readability
