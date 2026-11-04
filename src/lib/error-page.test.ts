import { describe, expect, it } from "vitest";
import { renderErrorPage } from "./error-page";

describe("renderErrorPage", () => {
  it("includes the title and a home link", () => {
    const html = renderErrorPage();
    expect(html).toContain("This page didn't load");
    expect(html).toContain('href="/"');
    expect(html).toContain("Go home");
  });
});
