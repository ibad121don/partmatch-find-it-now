import { useState, useEffect, useRef } from "react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface Request {
  id: string;
  car_make: string;
  car_model: string;
  car_year: number;
  part_needed: string;
  location: string;
  phone: string;
  description?: string;
  status: string;
  created_at: string;
  owner_id: string;
}

interface Offer {
  id: string;
  price: number;
  message?: string;
  status: string;
  created_at: string;
  contact_unlocked: boolean;
  request: {
    id: string;
    car_make: string;
    car_model: string;
    car_year: number;
    part_needed: string;
    phone: string;
    location: string;
  };
}

export const useSellerData = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<Request[]>([]);
  const [myOffers, setMyOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasFetchedRef = useRef(false);
  useEffect(() => {
    if (user && !hasFetchedRef.current) {
      hasFetchedRef.current = true;
      fetchData();
    } else if (!user) {
      setLoading(false);
    }
  }, [user]);

  const fetchRequests = async () => {
    try {
      console.log("useSellerData: Fetching requests");
      const { data, error } = await supabase
        .from("part_requests")
        .select("*")
        .eq("status", "pending")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("useSellerData: Error fetching requests:", error);
        throw error;
      }

      console.log("useSellerData: Fetched requests:", data?.length || 0);
      setRequests(data || []);
      return data;
    } catch (error) {
      console.error("useSellerData: Request fetch failed:", error);
      toast({
        title: "Error",
        description: "Failed to load requests. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const fetchMyOffers = async () => {
    try {
      console.log("useSellerData: Fetching offers for user:", user?.id);
      const { data, error } = await supabase
        .from("offers")
        .select(
          `
          *,
          request:part_requests(id, car_make, car_model, car_year, part_needed, phone, location)
        `
        )
        .eq("supplier_id", user?.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("useSellerData: Error fetching offers:", error);
        throw error;
      }

      console.log("useSellerData: Fetched offers:", data?.length || 0);
      setMyOffers(data || []);
      return data;
    } catch (error) {
      console.error("useSellerData: Offers fetch failed:", error);
      toast({
        title: "Error",
        description: "Failed to load your offers. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("useSellerData: Starting data fetch");

      // Fetch both requests and offers in parallel
      const [requestsResult, offersResult] = await Promise.allSettled([
        fetchRequests(),
        fetchMyOffers(),
      ]);

      if (requestsResult.status === "rejected") {
        console.error(
          "useSellerData: Failed to fetch requests:",
          requestsResult.reason
        );
      }

      if (offersResult.status === "rejected") {
        console.error(
          "useSellerData: Failed to fetch offers:",
          offersResult.reason
        );
      }

      // If both failed, show error
      if (
        requestsResult.status === "rejected" &&
        offersResult.status === "rejected"
      ) {
        setError("Failed to load dashboard data. Please try again.");
      }
    } catch (error) {
      console.error("useSellerData: Unexpected error in fetchData:", error);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
      console.log("useSellerData: Data fetch completed");
    }
  };

  // useEffect(() => {
  //   if (user) {
  //     console.log('useSellerData: User found, fetching data for:', user.id);
  //     fetchData();
  //   } else {
  //     console.log('useSellerData: No user found');
  //     setLoading(false);
  //   }
  // }, [user]);

  useEffect(() => {
    // Avoid calling fetchData multiple times if user hasn’t changed
    let hasFetched = false;

    if (user && !hasFetched) {
      hasFetched = true;
      console.log("useSellerData: User found, fetching data for:", user.id);
      fetchData();
    } else if (!user) {
      console.log("useSellerData: No user found");
      setLoading(false);
    }
    // Only run once on initial mount (empty dependencies)
  }, []);

  // Set up real-time subscription for offer updates
  useEffect(() => {
    if (!user?.id) return;

    console.log(
      "useSellerData: Setting up realtime subscription for user:",
      user.id
    );
    const channel = supabase
      .channel("offer-updates")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "offers",
          filter: `supplier_id=eq.${user.id}`,
        },
        (payload) => {
          console.log("useSellerData: Offer updated via realtime:", payload);
          fetchMyOffers(); // Refresh offers when status changes
        }
      )
      .subscribe();

    return () => {
      console.log("useSellerData: Cleaning up realtime subscription");
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  return {
    requests,
    myOffers,
    loading,
    error,
    refetch: fetchData,
  };
};
