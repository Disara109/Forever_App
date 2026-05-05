import { memo } from "react";

/**
 * Clerk injects Cloudflare Turnstile into this node. It must stay mounted: re-renders
 * that replace this subtree reset the challenge (checkbox appears to “loop”).
 * @see https://clerk.com/docs/expo/guides/development/custom-flows/authentication/bot-sign-up-protection
 */
export const ClerkSignUpCaptcha = memo(function ClerkSignUpCaptcha() {
  return (
    <div
      id="clerk-captcha"
      data-cl-theme="light"
      data-cl-size="normal"
      style={{
        width: "100%",
        minHeight: 72,
        marginTop: 8,
        marginBottom: 8,
      }}
    />
  );
});
