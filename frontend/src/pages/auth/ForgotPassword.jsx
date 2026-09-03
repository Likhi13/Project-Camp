import { useState } from "react";
import { Link } from "react-router-dom";
import AuthLayout from "./AuthLayout";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Alert from "../../components/ui/Alert";
import * as authApi from "../../api/auth.api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    if (!email) {
      setError("Email is required");
      return;
    }
    setError("");
    setIsLoading(true);
    try {
      const res = await authApi.forgotPassword(email);
      setSuccessMessage(res.data.message);
    } catch (err) {
      setServerError(
        err.response?.data?.message || "Unable to send reset email",
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (successMessage) {
    return (
      <AuthLayout title="Check your email">
        <Alert type="success">{successMessage}</Alert>
        <Link
          to="/login"
          className="block text-center text-sm text-accent hover:underline mt-5"
        >
          Back to login
        </Link>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Forgot password" subtitle="We'll email you a reset link">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {serverError && <Alert type="error">{serverError}</Alert>}
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={error}
        />
        <Button type="submit" isLoading={isLoading} className="w-full">
          Send reset link
        </Button>
      </form>
      <p className="text-sm text-muted text-center mt-5">
        Remembered it?{" "}
        <Link to="/login" className="text-accent hover:underline">
          Log in
        </Link>
      </p>
    </AuthLayout>
  );
}
