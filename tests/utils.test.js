"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../src/utils");
describe("Utils", () => {
    describe("fromMicroUnits", () => {
        it("should convert microunits to standard units", () => {
            expect((0, utils_1.fromMicroUnits)("1000000")).toBe(1);
            expect((0, utils_1.fromMicroUnits)(2500000)).toBe(2.5);
            expect((0, utils_1.fromMicroUnits)("0")).toBe(0);
        });
    });
    describe("toMicroUnits", () => {
        it("should convert standard units to microunits", () => {
            expect((0, utils_1.toMicroUnits)(1)).toBe("1000000");
            expect((0, utils_1.toMicroUnits)(2.5)).toBe("2500000");
            expect((0, utils_1.toMicroUnits)(0)).toBe("0");
        });
        it("should handle decimal precision correctly", () => {
            expect((0, utils_1.toMicroUnits)(1.123456789)).toBe("1123456");
        });
    });
    describe("formatNumber", () => {
        it("should format numbers with default 6 decimals", () => {
            expect((0, utils_1.formatNumber)(1234.567890123)).toBe("1,234.567890");
        });
        it("should format numbers with custom decimals", () => {
            expect((0, utils_1.formatNumber)(1234.567890123, 2)).toBe("1,234.57");
        });
    });
    describe("isValidAtomOneAddress", () => {
        it("should validate correct AtomOne addresses", () => {
            const validAddress = "atone1test123456789012345678901234567890123456";
            expect((0, utils_1.isValidAtomOneAddress)(validAddress)).toBe(true);
        });
        it("should reject invalid addresses", () => {
            expect((0, utils_1.isValidAtomOneAddress)("cosmos1invalid")).toBe(false);
            expect((0, utils_1.isValidAtomOneAddress)("atone1short")).toBe(false);
            expect((0, utils_1.isValidAtomOneAddress)("")).toBe(false);
        });
    });
    describe("calculateFee", () => {
        it("should return default fee structure", () => {
            const fee = (0, utils_1.calculateFee)();
            expect(fee).toEqual([{ denom: "uatone", amount: "10000" }]);
        });
    });
    describe("formatTxHash", () => {
        it("should format long transaction hashes", () => {
            const longHash = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
            expect((0, utils_1.formatTxHash)(longHash, 4)).toBe("ABCD...7890");
        });
        it("should return short hashes unchanged", () => {
            const shortHash = "ABC123";
            expect((0, utils_1.formatTxHash)(shortHash, 4)).toBe("ABC123");
        });
    });
});
//# sourceMappingURL=utils.test.js.map