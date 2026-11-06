import { describe, expect, test } from "bun:test";
import {
  isAuthorizedAdminEmail,
  isAllowedAdminAuthOrigin,
  isVerifiedAdminAccount,
  normalizeAdminUsername,
} from "../src/lib/admin-auth-rules";

describe("admin authentication rules", () => {
  test("only the authorised owner email is accepted, without case sensitivity", () => {
    expect(isAuthorizedAdminEmail(" ShahrehShi@gmail.com ")).toBe(true);
    expect(isAuthorizedAdminEmail("baloindia2015@gmail.com")).toBe(true);
    expect(isAuthorizedAdminEmail("someone@example.com")).toBe(false);
  });

  test("admin access requires the authorised email to be verified", () => {
    expect(isVerifiedAdminAccount("shahrehshi@gmail.com", "2026-10-10T00:00:00Z")).toBe(true);
    expect(isVerifiedAdminAccount("shahrehshi@gmail.com", null)).toBe(false);
    expect(isVerifiedAdminAccount("someone@example.com", "2026-10-10T00:00:00Z")).toBe(false);
  });

  test("username lookup uses a normalized handle", () => {
    expect(normalizeAdminUsername("  School.Owner_1 ")).toBe("school.owner_1");
  });

  test("admin email links only return to the local preview or this project's preview", () => {
    expect(isAllowedAdminAuthOrigin("http://localhost:8080")).toBe(true);
    expect(isAllowedAdminAuthOrigin("https://id-preview--260bd6c6-afdc-4219-9095-bec95a6b4f9d.lovable.app")).toBe(true);
    expect(isAllowedAdminAuthOrigin("https://attacker.example")).toBe(false);
  });
});