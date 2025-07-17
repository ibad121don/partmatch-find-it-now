import { createContext, useContext, useEffect, useState } from "react";

type LocaleContextType = {
  currency: string;
  language: string;
  country: string;
};

const LocaleContext = createContext<LocaleContextType>({
  currency: "USD",
  language: "en",
  country: "US",
});

const countryCurrencyMap: Record<string, string> = {
  NG: "NGN",
  US: "USD",
  GB: "GBP",
  IN: "INR",
  FR: "EUR",
  DE: "EUR",
  CA: "CAD",
  AU: "AUD",
  PK: "PKR",
};

const countryLanguageMap: Record<string, string> = {
  NG: "en",
  US: "en",
  GB: "en",
  IN: "en",
  FR: "fr",
  DE: "de",
  CA: "en",
  AU: "en",
  PK: "en",
};

export const LocaleProvider = ({ children }: { children: React.ReactNode }) => {
  const [currency, setCurrency] = useState("USD");
  const [language, setLanguage] = useState("en");
  const [country, setCountry] = useState("US");

  useEffect(() => {
    const detectLocation = async () => {
      const fallbackToIP = async () => {
        try {
          const res = await fetch("https://ipapi.co/json/");
          const data = await res.json();
          const countryCode = data.country || "US";
          updateLocale(countryCode);
        } catch {
          console.warn("IP fallback also failed, defaulting to US.");
          updateLocale("US");
        }
      };

      const updateLocale = (countryCode: string) => {
        setCountry(countryCode);
        setCurrency(countryCurrencyMap[countryCode] || "USD");
        setLanguage(countryLanguageMap[countryCode] || "en");
      };

      if (!navigator.geolocation) {
        console.warn("Geolocation not supported. Falling back.");
        fallbackToIP();
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const res = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
            );
            const data = await res.json();
            const countryCode = data.countryCode || "US";
            updateLocale(countryCode);
          } catch {
            console.warn("Reverse geocoding failed. Using fallback.");
            fallbackToIP();
          }
        },
        (error) => {
          console.warn("Geolocation error:", error.message);
          fallbackToIP();
        }
      );
    };

    detectLocation();
  }, []);

  return (
    <LocaleContext.Provider value={{ currency, language, country }}>
      {children}
    </LocaleContext.Provider>
  );
};

export const useLocale = () => useContext(LocaleContext);
