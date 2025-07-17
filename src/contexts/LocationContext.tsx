// contexts/LocationContext.tsx
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

interface LocationContextType {
  currency: string;
  address: string;
  countryCode: string;
}

const LocationContext = createContext<LocationContextType>({
  currency: "USD",
  address: "",
  countryCode: "US",
});

export const LocationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [currency, setCurrency] = useState("USD");
  const [address, setAddress] = useState("");
  const [countryCode, setCountryCode] = useState("US");

  useEffect(() => {
    const detectLocation = async () => {
      try {
        if (!navigator.geolocation) return;

        navigator.geolocation.getCurrentPosition(
          async ({ coords }) => {
            const { latitude, longitude } = coords;

            const response = await fetch(
              `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=9bc8410018154a2b98484fb633107c83`
            );
            const data = await response.json();
            const components = data?.results?.[0]?.components;

            const city =
              components?.city || components?.town || components?.village || "";
            const state = components?.state || "";
            const country = components?.country || "";
            const code = components?.["ISO_3166-1_alpha-2"] || "US";

            const currencyMap: Record<string, string> = {
              GH: "GHS",
              NG: "NGN",
              KE: "KES",
              ZA: "ZAR",
              US: "USD",
              GB: "GBP",
              CA: "CAD",
              IN: "INR",
              PK: "PKR",
            };

            setCurrency(currencyMap[code] || "USD");
            setAddress(`${city}, ${state}, ${country}`);
            setCountryCode(code);
          },
          () => {
            console.warn("Location access denied");
          }
        );
      } catch (err) {
        console.error("Location detection failed", err);
      }
    };

    detectLocation();
  }, []);

  return (
    <LocationContext.Provider value={{ currency, address, countryCode }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => useContext(LocationContext);
