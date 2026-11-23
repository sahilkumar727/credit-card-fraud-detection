// Luhn Algorithm (MOD 10) for verifying credit card numbers
export function validateLuhn(numberString) {
  const digitsOnly = String(numberString).replace(/\D/g, "");
  if (!digitsOnly || digitsOnly.length < 13 || digitsOnly.length > 19) {
    return false;
  }

  let sum = 0;
  let shouldDouble = false;

  for (let i = digitsOnly.length - 1; i >= 0; i--) {
    let digit = parseInt(digitsOnly.charAt(i), 10);

    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }

    sum += digit;
    shouldDouble = !shouldDouble;
  }

  return sum % 10 === 0;
}

export function getCardNetwork(numberString) {
  const digits = String(numberString).replace(/\D/g, "");
  if (/^4/.test(digits)) return { name: "Visa", color: "#1a56db", icon: "💳" };
  if (/^(5[1-5]|2[2-7])/.test(digits)) return { name: "Mastercard", color: "#ea580c", icon: "💳" };
  if (/^3[47]/.test(digits)) return { name: "American Express", color: "#0284c7", icon: "💳" };
  if (/^(60|65|81|82)/.test(digits)) return { name: "RuPay", color: "#16a34a", icon: "💳" };
  if (/^6(011|5)/.test(digits)) return { name: "Discover", color: "#d97706", icon: "💳" };
  return { name: "Bank Card", color: "#2dd4bf", icon: "💳" };
}
