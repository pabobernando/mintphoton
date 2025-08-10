import {
  fromMicroUnits,
  toMicroUnits,
  formatNumber,
  isValidAtomOneAddress,
  calculateFee,
  formatTxHash,
} from "../src/utils";

describe("Utils", () => {
  describe("fromMicroUnits", () => {
    it("should convert microunits to standard units", () => {
      expect(fromMicroUnits("1000000")).toBe(1);
      expect(fromMicroUnits(2500000)).toBe(2.5);
      expect(fromMicroUnits("0")).toBe(0);
    });
  });

  describe("toMicroUnits", () => {
    it("should convert standard units to microunits", () => {
      expect(toMicroUnits(1)).toBe("1000000");
      expect(toMicroUnits(2.5)).toBe("2500000");
      expect(toMicroUnits(0)).toBe("0");
    });

    it("should handle decimal precision correctly", () => {
      expect(toMicroUnits(1.123456789)).toBe("1123456");
    });
  });

  describe("formatNumber", () => {
    it("should format numbers with default 6 decimals", () => {
      expect(formatNumber(1234.567890123)).toBe("1,234.567890");
    });

    it("should format numbers with custom decimals", () => {
      expect(formatNumber(1234.567890123, 2)).toBe("1,234.57");
    });
  });

  describe("isValidAtomOneAddress", () => {
    it("should validate correct AtomOne addresses", () => {
      const validAddress = "atone1test123456789012345678901234567890123456";
      expect(isValidAtomOneAddress(validAddress)).toBe(true);
    });

    it("should reject invalid addresses", () => {
      expect(isValidAtomOneAddress("cosmos1invalid")).toBe(false);
      expect(isValidAtomOneAddress("atone1short")).toBe(false);
      expect(isValidAtomOneAddress("")).toBe(false);
    });
  });

  describe("calculateFee", () => {
    it("should return default fee structure", () => {
      const fee = calculateFee();
      expect(fee).toEqual([{ denom: "uatone", amount: "10000" }]);
    });
  });

  describe("formatTxHash", () => {
    it("should format long transaction hashes", () => {
      const longHash = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
      expect(formatTxHash(longHash, 4)).toBe("ABCD...7890");
    });

    it("should return short hashes unchanged", () => {
      const shortHash = "ABC123";
      expect(formatTxHash(shortHash, 4)).toBe("ABC123");
    });
  });
});
