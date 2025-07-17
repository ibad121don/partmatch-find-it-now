// Simple static exchange rates for demonstration. In production, fetch from an API.
export const exchangeRates: Record<string, number> = {
  GHS: 1, // Base
  USD: 0.085, // 1 GHS = 0.085 USD
  NGN: 120, // 1 GHS = 120 NGN
  ZAR: 1.6, // 1 GHS = 1.6 ZAR
  EUR: 0.078, // 1 GHS = 0.078 EUR
  GBP: 0.066, // 1 GHS = 0.066 GBP
  PKR: 24, // 1 GHS = 24 PKR
};

export function convertFromGHS(amount: number, targetCurrency: string): number {
  const rate = exchangeRates[targetCurrency] || 1;
  return amount * rate;
}
