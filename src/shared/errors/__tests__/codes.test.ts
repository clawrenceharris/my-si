import { describe, it, expect } from "@jest/globals";
import { ERROR_MESSAGES, AppErrorCode } from "../codes";

describe("Error Codes", () => {
  it("should have messages for all error codes", () => {
    const errorCodes = Object.values(AppErrorCode);

    errorCodes.forEach((code) => {
      expect(ERROR_MESSAGES[code]).toBeDefined();
      expect(typeof ERROR_MESSAGES[code]).toBe("string");
      expect(ERROR_MESSAGES[code].length).toBeGreaterThan(0);
    });
  });

  it("should have user-friendly messages", () => {
    expect(ERROR_MESSAGES[AppErrorCode.AUTH_INVALID_CREDENTIALS]).toBe(
      "Invalid email or password. Please try again."
    );

    expect(ERROR_MESSAGES[AppErrorCode.NETWORK_OFFLINE]).toBe(
      "You appear to be offline. Please check your connection."
    );

    expect(ERROR_MESSAGES[AppErrorCode.SESSION_NOT_FOUND]).toBe(
      "Session not found. It may have been deleted or expired."
    );
  });
});
