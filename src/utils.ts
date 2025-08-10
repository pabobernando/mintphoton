/**
 * Convert microunits to standard units
 */
export const fromMicroUnits = (amount: string | number): number => {
  return parseFloat(amount.toString()) / 1_000_000;
};

/**
 * Convert standard units to microunits
 */
export const toMicroUnits = (amount: number): string => {
  return Math.floor(amount * 1_000_000).toString();
};

/**
 * Format number with commas
 */
export const formatNumber = (num: number, decimals: number = 6): string => {
  return num.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};

/**
 * Validate AtomOne address
 */
export const isValidAtomOneAddress = (address: string): boolean => {
  if (!address || typeof address !== "string") {
    return false;
  }

  // Check prefix and length
  const hasValidPrefix = address.startsWith("atone1");
  const hasValidLength = address.length >= 39 && address.length <= 50;

  // Basic character validation (alphanumeric, no uppercase)
  const hasValidChars = /^[a-z0-9]+$/.test(address);

  return hasValidPrefix && hasValidLength && hasValidChars;
};

/**
 * Calculate estimated fee
 */
export const calculateFee = (
  gasLimit: string = "250000"
): { amount: string; denom: string }[] => {
  return [{ denom: "uatone", amount: "10000" }];
};

/**
 * Format transaction hash for display
 */
export const formatTxHash = (hash: string, length: number = 8): string => {
  if (hash.length <= length * 2) return hash;
  return `${hash.slice(0, length)}...${hash.slice(-length)}`;
};
