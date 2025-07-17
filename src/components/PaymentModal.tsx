import { useState } from "react";
import { useTranslation } from "react-i18next";
import { loadStripe } from "@stripe/stripe-js";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Smartphone, Phone } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  offerId: string;
  amount: number;
  currency?: string;
  onPaymentSuccess: () => void;
}

const PaymentModal = ({
  isOpen,
  onClose,
  offerId,
  amount,
  currency = "GHS",
  onPaymentSuccess,
}: PaymentModalProps) => {
  const [paymentMethod, setPaymentMethod] = useState<string>("stripe");
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const handlePayment = async () => {
    localStorage.setItem(
      "lastPayment",
      JSON.stringify({
        amount,
        currency,
        offerId,
        paymentMethod,
      })
    );
    console.log("PaymentModal: Payment info stored in localStorage:", {
      amount,
      currency,
      offerId,
      paymentMethod,
    });

    let userMail = await localStorage.getItem("profiles");
    console.log("PaymentModal: User email from localStorage:", userMail);
    if (!userMail) {
      toast({
        title: t("payment.user_not_found_title", "User not found"),
        description: t(
          "payment.user_not_found_desc",
          "Please log in to proceed with payment."
        ),
        variant: "destructive",
      });
      return;
    }
    let tempUser = JSON.parse(userMail);
    console.log("PaymentModal: Parsed user data:", tempUser);
    if (!paymentMethod) {
      toast({
        title: t("payment.method_required_title", "Payment Method Required"),
        description: t(
          "payment.method_required_desc",
          "Please select a payment method."
        ),
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      if (paymentMethod === "stripe") {
        const response = await fetch(
          "http://localhost:8001/api/v1/stripe/onetimestripe",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              offerId,
              amount,
              currency,
              receiptEmail: tempUser.email || "Testmail@gmail.com",
            }),
          }
        );

        const contentType = response.headers.get("content-type");
        if (!response.ok) {
          const text = await response.text();
          throw new Error(text || "Failed to create Stripe session");
        }
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Invalid response format from server");
        }

        const data = await response.json();

        if (!data?.success) {
          throw new Error(data.message || "Stripe session creation failed");
        }

        // Prefer redirect using Stripe Checkout hosted URL if available
        if (data.url) {
          window.location.href = data.url;
          return;
        }

        const stripe = await loadStripe(data.publishableKey);
        if (!stripe) throw new Error("Stripe.js failed to load");

        const result = await stripe.redirectToCheckout({
          sessionId: data.sessionId,
        });

        if (result.error) throw result.error;
        return;
      }

      toast({
        title: t(
          "payment.paystack_not_available_title",
          "Paystack Not Available"
        ),
        description: t(
          "payment.paystack_not_available_desc",
          "Paystack integration is not implemented yet."
        ),
        variant: "destructive",
      });
    } catch (error: any) {
      console.error("Payment error:", error);
      toast({
        title: t("payment.failed_title", "Payment Failed"),
        description:
          error?.message || t("payment.failed_desc", "Please try again later."),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md mx-3 sm:mx-auto max-w-[95vw]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-sm sm:text-base">
            <Phone className="h-4 w-4 sm:h-5 sm:w-5" />
            {t("payment.unlock_contact_details", "Unlock Contact Details")}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 sm:space-y-6">
          <div className="text-center">
            <p className="text-xl sm:text-2xl font-bold text-green-600">
              {currency} {amount.toFixed(2)}
            </p>
            <p className="text-xs sm:text-sm text-gray-600">
              {t(
                "payment.one_time_fee",
                "One-time fee to unlock contact details"
              )}
            </p>
          </div>

          <div className="space-y-3 sm:space-y-4">
            <div>
              <Label className="text-xs sm:text-sm">
                {t("payment.method_label", "Payment Method")}
              </Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger className="text-sm">
                  <SelectValue
                    placeholder={t(
                      "payment.select_method_placeholder",
                      "Select payment method"
                    )}
                  />
                </SelectTrigger>
                <SelectContent className="bg-white z-50">
                  <SelectItem value="stripe">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-3 w-3 sm:h-4 sm:w-4" />
                      {t("payment.stripe", "Stripe")}
                    </div>
                  </SelectItem>
                  <SelectItem value="paystack">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-3 w-3 sm:h-4 sm:w-4" />
                      {t("payment.paystack", "Paystack")}
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-2 sm:gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 text-xs sm:text-sm"
              disabled={loading}
            >
              {t("payment.cancel", "Cancel")}
            </Button>
            <Button
              onClick={handlePayment}
              disabled={loading}
              className="flex-1 bg-green-600 hover:bg-green-700 text-xs sm:text-sm"
            >
              {loading
                ? t("payment.processing", "Processing...")
                : t("payment.pay_now", "Pay Now")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
