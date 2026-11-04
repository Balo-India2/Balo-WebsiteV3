import { describe, expect, it } from "vitest";
import { translate } from "./i18n";

describe("translate", () => {
  it("returns the language-specific string", () => {
    expect(translate("nav.home", "en")).toBe("Home");
    expect(translate("nav.home", "hi")).toBe("होम");
  });

  it("falls back to English, then the key", () => {
    expect(translate("nav.home", "bn")).toBe("হোম");
    expect(translate("missing.key", "en")).toBe("missing.key");
  });
});
