// Add this to let TypeScript know about i18next on window
declare global {
  interface Window {
    i18next?: { changeLanguage: (lang: string) => void };
  }
}
import { useEffect, useState } from "react";
import axios from "axios";

export function useGeolocation() {
  const [location, setLocation] = useState({
    country: "",
    currency: "",
    language: "",
  });

  useEffect(() => {
    // Enable geolocation detection on app load
    const setLanguageAndCurrency = (country: string) => {
      const currency = getCurrencyFromCountry(country);
      const language = getLanguageFromCountry(country);
      setLocation({ country, currency, language });
      // Try to change app language if i18n is available globally
      if (window.i18next?.changeLanguage) {
        window.i18next.changeLanguage(language);
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await axios.get(
              `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=9bc8410018154a2b98484fb633107c83`
            );
            const country = response.data.results[0]?.components?.country || "";
            setLanguageAndCurrency(country);
          } catch (err) {
            console.error("Location error:", err);
            setLanguageAndCurrency("United States");
          }
        },
        (error) => {
          setLanguageAndCurrency("United States");
        }
      );
    } else {
      setLanguageAndCurrency("United States");
    }
  }, []);

  return location;
}

function getCurrencyFromCountry(country: string): string {
  const currencyMap: Record<string, string> = {
    Nigeria: "NGN",
    Ghana: "GHS",
    "South Africa": "ZAR",
    "United States": "USD",
    "United Kingdom": "GBP",
    Germany: "EUR",
    France: "EUR",
    Pakistan: "PKR",
  };

  return currencyMap[country] || "USD";
}

function getLanguageFromCountry(country: string): string {
  const languageMap: Record<string, string> = {
    Nigeria: "en",
    Ghana: "en",
    "South Africa": "en",
    "United States": "en",
    "United Kingdom": "en",
    Germany: "de",
    France: "fr",
    Pakistan: "en",
  };

  return languageMap[country] || "en";
}
