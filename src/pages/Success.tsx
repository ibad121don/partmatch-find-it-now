import { supabase } from "@/integrations/supabase/client";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Success() {
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    saveToDB();
    // eslint-disable-next-line
  }, []);

  const saveToDB = async () => {
    console.log("Saving subscription data to DB...");

    let userdata = await localStorage.getItem("profiles");
    let userPaymentRaw = await localStorage.getItem("lastPayment");
    let userPayment = userPaymentRaw ? JSON.parse(userPaymentRaw) : {};
    let tempuser = userdata ? JSON.parse(userdata) : null;
    console.log(11, tempuser);
    if (tempuser && tempuser.id) {
      // Update localStorage profile
      console.log("Updating localStorage profile...");

      console.log("Updating localStorage profile...", 1);

      // Update user profile in Supabase
      await supabase
        .from("profiles")
        .update({
          subscription_type: "active",
        })
        .eq("id", tempuser.id);

      // Store payment/subscription record in 'payments' table
      // (Assumes you have a 'payments' table with these columns)
      await supabase.from("payments").insert([
        {
          payer_id: tempuser.id,
          payment_method: tempuser.lastPaymentMethod || "stripe",
          status: "completed",
          amount: userPayment.amount ? Number(userPayment.amount) : 0,
          currency: userPayment.currency || "GHS",
        },
      ]);

      setSaved(true);
      navigate("/seller-dashboard");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8 flex flex-col items-center">
        <h1 className="text-2xl sm:text-3xl font-bold mb-3 text-green-700">
          Payment Successful
        </h1>
        <p className="text-base sm:text-lg mb-6 text-gray-700 text-center">
          Thank you! Your subscription has been activated.
        </p>
        <button
          onClick={() => saveToDB()}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
