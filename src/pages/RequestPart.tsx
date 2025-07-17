import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import RequestFormFields from "@/components/RequestForm/RequestFormFields";
import { useRequestSubmission } from "@/hooks/useRequestSubmission";
import PageHeader from "@/components/PageHeader";
import { RequestFormData } from "@/components/RequestForm/RequestFormData";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

const RequestPart = () => {
  const { t } = useTranslation();
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const {
    loading: submissionLoading,
    aiReviewing,
    submitRequest,
  } = useRequestSubmission();
  const [formData, setFormData] = useState<RequestFormData>({
    make: "",
    model: "",
    year: "",
    part: "",
    description: "",
    location: "",
    phone: "",
  });
  const [photo, setPhoto] = useState<File | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      toast({
        title: t("requestPart.signInRequired", "Sign In Required"),
        description: t(
          "requestPart.pleaseSignIn",
          "Please sign in to request car parts."
        ),
        variant: "destructive",
      });
      navigate("/buyer-auth");
    }
  }, [user, loading, navigate]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePhotoChange = (file: File | null) => {
    setPhoto(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({
        title: t("requestPart.authRequired", "Authentication Required"),
        description: t(
          "requestPart.pleaseSignIn",
          "Please sign in to request car parts."
        ),
        variant: "destructive",
      });
      navigate("/buyer-auth");
      return;
    }

    await submitRequest(formData, photo);
  };

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t("loading", "Loading...")}</p>
        </div>
      </div>
    );
  }

  // Don't render the form if user is not authenticated
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100">
      <PageHeader
        title={t("requestPart.title", "Request Car Part")}
        subtitle={t(
          "requestPart.subtitle",
          "Tell us what you need and we'll connect you with sellers"
        )}
        backTo="/"
        showHomeButton={true}
        showSignOut={true}
      />

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <RequestFormFields
            formData={formData}
            photo={photo}
            onInputChange={handleInputChange}
            onPhotoChange={handlePhotoChange}
          />

          <Button
            type="submit"
            disabled={submissionLoading || aiReviewing}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            {submissionLoading || aiReviewing
              ? t("requestPart.submitting", "Submitting...")
              : t("requestPart.submitRequest", "Submit Request")}
          </Button>
        </form>
      </main>
    </div>
  );
};

export default RequestPart;
