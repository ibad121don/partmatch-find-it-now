// supabase/functions/expireSubscriptions/index.ts

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js";

serve(async () => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")! // Use service role
  );

  // Calculate timestamp 30 days ago
  const thirtyDaysAgo = new Date(
    Date.now() - 30 * 24 * 60 * 60 * 1000
  ).toISOString();

  // Update subscriptions older than 30 days
  const { error } = await supabase
    .from("subscriptions")
    .update({ status: "expired" })
    .lt("created_at", thirtyDaysAgo)
    .eq("status", "active"); // only update active subscriptions

  if (error) {
    console.error("Error expiring subscriptions:", error);
    return new Response("Failed", { status: 500 });
  }

  return new Response("Expired old subscriptions", { status: 200 });
});
