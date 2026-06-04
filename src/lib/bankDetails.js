import { API_URL } from "./api";
const STORAGE_KEY = "bakeease_bank_details";

const DEFAULT_BANK_DETAILS = {
  accountName: import.meta.env.VITE_BANK_ACCOUNT_NAME || "Bake Ease",
  accountNumber: import.meta.env.VITE_BANK_ACCOUNT_NUMBER || "123554593094",
  bankName: import.meta.env.VITE_BANK_NAME || "LHV",
  iban: import.meta.env.VITE_BANK_IBAN || "FI42 1234 5678 9012 3456",
  swiftCode: import.meta.env.VITE_BANK_SWIFT || "LHVFIHH",
  paymentNote:
    import.meta.env.VITE_BANK_PAYMENT_NOTE ||
    "Please include your unique payment reference in the transfer description.",
};

function getStoredBankDetails() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

export async function getBankDetails() {
  try {
    const response = await fetch(`${API_URL}/settings/bank-details`);
    if (response.ok) {
      const data = await response.json();
      return { ...DEFAULT_BANK_DETAILS, ...data };
    }
  } catch {
    // Fall back when API is unavailable
  }

  const stored = getStoredBankDetails();
  if (stored) {
    return { ...DEFAULT_BANK_DETAILS, ...stored };
  }

  return { ...DEFAULT_BANK_DETAILS };
}

export async function saveBankDetails(details, token) {
  try {
    const response = await fetch(`${API_URL}/settings/bank-details`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(details),
    });

    if (response.ok) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(details));
      return response.json();
    }
  } catch {
    // Fall back to local storage when API is unavailable
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(details));
  return details;
}
