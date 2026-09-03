import { useState } from "react";
import Alert from "../ui/Alert";
import Button from "../ui/Button";
import * as authApi from "../../api/auth.api";

export default function EmailVerificationBanner() {
  const [isSending, setIsSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleResend = async () => {
    setIsSending(true);
    try {
      await authApi.resendEmailVerification();
      setSent(true);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="px-6 pt-4">
      <Alert type="info">
        <div className="flex items-center justify-between gap-4">
          <span>
            {sent
              ? "Verification email sent — check your inbox."
              : "Please verify your email address."}
          </span>
          {!sent && (
            <Button
              variant="ghost"
              isLoading={isSending}
              onClick={handleResend}
              className="px-2 py-1"
            >
              Resend
            </Button>
          )}
        </div>
      </Alert>
    </div>
  );
}
