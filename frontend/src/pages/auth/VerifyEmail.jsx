import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import AuthLayout from "./AuthLayout";
import Spinner from "../../components/ui/Spinner";
import Alert from "../../components/ui/Alert";
import * as authApi from "../../api/auth.api";

export default function VerifyEmail() {
  const { token } = useParams();

  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");

  const hasVerified = useRef(false);

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Verification link is missing a token.");
      return;
    }

    // Prevent duplicate verification requests in development.
    if (hasVerified.current) {
      return;
    }

    hasVerified.current = true;

    authApi
      .verifyEmail(token)
      .then(() => {
        setStatus("success");
      })
      .catch((err) => {
        setStatus("error");
        setMessage(
          err.response?.data?.message || "This link is invalid or has expired.",
        );
      });
  }, [token]);

  return (
    <AuthLayout title="Email verification">
      {status === "loading" && (
        <div className="flex items-center gap-2 text-sm text-muted">
          <Spinner size={16} />
          Verifying your email…
        </div>
      )}

      {status === "success" && (
        <>
          <Alert type="success">Your email has been verified.</Alert>

          <Link
            to="/login"
            className="mt-5 block text-center text-sm text-accent hover:underline"
          >
            Continue to login
          </Link>
        </>
      )}

      {status === "error" && (
        <>
          <Alert type="error">{message}</Alert>

          <Link
            to="/login"
            className="mt-5 block text-center text-sm text-accent hover:underline"
          >
            Back to login
          </Link>
        </>
      )}
    </AuthLayout>
  );
}
