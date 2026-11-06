/** Inbox that receives admin verification codes. */
export const OWNER_EMAIL = "shahrehshi@gmail.com";

/** Emails that may register / recover. Codes always go to OWNER_EMAIL. */
const AUTHORIZED_ADMIN_EMAILS = [
  OWNER_EMAIL,
  "baloindia2015@gmail.com",
] as const;

export function isAuthorizedAdminEmail(email: string) {
  return AUTHORIZED_ADMIN_EMAILS.includes(
    email.trim().toLowerCase() as (typeof AUTHORIZED_ADMIN_EMAILS)[number],
  );
}
