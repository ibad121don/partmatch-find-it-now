import { useState, useEffect } from "react";
import { useGeolocation } from "@/hooks/useGeolocation";
import { convertFromGHS } from "@/utils/exchangeRates";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Crown, Calendar, CreditCard, AlertCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import PaymentModal from "./PaymentModal";
import { supabase } from "@/integrations/supabase/client";

interface SubscriptionManagerProps {
  sellerId: string;
}

const SubscriptionManager = ({ sellerId }: SubscriptionManagerProps) => {
  const [subscription, setSubscription] = useState<any>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const { country, currency } = useGeolocation();
  const subscriptionBaseGHS = 100;
  const displayAmount = convertFromGHS(subscriptionBaseGHS, currency || "GHS");

  useEffect(() => {
    fetchSubscription();
  }, [sellerId]);

  const fetchSubscription = async () => {
    // This would fetch the subscription from Supabase
    // For now, simulating the API call
    setLoading(false);
  };

  const handleSubscribe = async () => {
    let userData = await localStorage.getItem("profiles");

    let tempuser = JSON.parse(userData || "{}");
    console.log("User data:", tempuser.id);
    if (!tempuser.id) {
      toast({
        title: "User not found",
        description: "Please log in to proceed with payment.",
        variant: "destructive",
      });
      return;
    }
    const SubscriptionData = await supabase
      .from("payments")
      .select("*")
      .eq("payer_id", tempuser.id)
      .single();

    console.log("Subscription data:", SubscriptionData);
    if (SubscriptionData.data?.payer_id) {
      toast({
        title: "Already Subscribed",
        description: "You already have an active subscription.",
        variant: "destructive",
      });
      setShowPaymentModal(false);
      return;
    } else {
      setShowPaymentModal(true);
    }
  };

  const handlePaymentSuccess = () => {
    toast({
      title: "Subscription Activated!",
      description:
        "Your Business subscription is now active. Enjoy unlimited posts and featured listings!",
    });
    setShowPaymentModal(false);
    fetchSubscription();
  };

  const handleCancelSubscription = () => {
    toast({
      title: "Subscription Cancelled",
      description:
        "Your subscription will remain active until the end of the current billing period.",
    });
  };

  if (loading) {
    return <div>Loading subscription...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-orange-600" />
            Business Subscription
          </CardTitle>
        </CardHeader>
        <CardContent>
          {subscription?.is_active ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">Business Plan</h3>
                  <p className="text-sm text-gray-600">Active subscription</p>
                </div>
                <Badge className="bg-green-100 text-green-800">Active</Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Next billing date</p>
                  <p className="font-medium">{subscription.end_date}</p>
                </div>
                <div>
                  <p className="text-gray-600">Amount</p>
                  <p className="font-medium">
                    {currency || "GHS"}{" "}
                    {displayAmount.toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                    })}
                    /month
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h4 className="font-medium mb-2">Your Benefits</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>✓ Unlimited posts</li>
                  <li>✓ All listings automatically featured</li>
                  <li>✓ Priority customer support</li>
                  <li>✓ Advanced analytics dashboard</li>
                  <li>✓ No transaction fees on first 50 sales</li>
                </ul>
              </div>

              <div className="flex gap-2 pt-4">
                <Button variant="outline" size="sm">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Update Payment
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCancelSubscription}
                >
                  Cancel Subscription
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-center py-6">
                <Crown className="h-12 w-12 text-orange-600 mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">
                  Upgrade to Business
                </h3>
                <p className="text-gray-600 mb-6">
                  Get unlimited posts, featured listings, and priority support
                </p>

                <div className="bg-orange-50 rounded-lg p-4 mb-6">
                  <div className="text-2xl font-bold text-orange-600 mb-1">
                    {currency || "GHS"}{" "}
                    {displayAmount.toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                    })}
                  </div>
                  <div className="text-sm text-gray-600">per month</div>
                </div>

                <ul className="text-left text-sm space-y-2 mb-6">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Unlimited car part listings
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    All listings automatically featured
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Up to 10 photos per listing included
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Priority customer support
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Advanced analytics and insights
                  </li>
                </ul>

                <Button
                  onClick={handleSubscribe}
                  className="w-full bg-orange-600 hover:bg-orange-700"
                >
                  Start Business Subscription
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Transaction Fees Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-blue-600" />
            Transaction Fees
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">Online transaction fee</span>
              <span className="font-semibold">3% per sale</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Business subscribers</span>
              <span className="font-semibold text-green-600">
                {subscription?.is_active
                  ? "First 50 sales free"
                  : "3% per sale"}
              </span>
            </div>
            <p className="text-xs text-gray-600">
              Transaction fees are automatically deducted from successful sales
            </p>
          </div>
        </CardContent>
      </Card>

      {showPaymentModal && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          offerId={sellerId}
          amount={displayAmount}
          currency={currency || "GHS"}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
};

export default SubscriptionManager;
