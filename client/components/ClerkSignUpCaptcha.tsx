import { memo } from "react";

/**
 * On native there is no DOM mount for Clerk's Turnstile widget. If sign-up fails with captcha errors on a device, adjust Attack protection in the Clerk dashboard or test on web.
 */
export const ClerkSignUpCaptcha = memo(function ClerkSignUpCaptcha() {
  return null;
});
