import { describe, expect, it } from "vitest";
import { consumeLastCapturedError } from "./error-capture";

describe("consumeLastCapturedError", () => {
  it("returns the last captured error and then clears it", () => {
    const error = new Error("boom");
    window.dispatchEvent(new ErrorEvent("error", { error }));

    expect(consumeLastCapturedError()).toBe(error);
    expect(consumeLastCapturedError()).toBeUndefined();
  });
});
