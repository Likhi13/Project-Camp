import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import AuthLayout from "./AuthLayout";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Alert from "../../components/ui/Alert";
import * as authApi from "../../api/auth.api";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ newPassword: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validate = () => {
    const next = {};
    if (!form.newPassword) next.newPassword = "Password is required";
    else if (form.newPassword.length < 8)
      next.newPassword = "Password must be at least 8 characters";
    else if (!/[A-Z]/.test(form.newPassword))
      next.newPassword = "Password needs an uppercase letter";
    else if (!/[!@#$%^&*(),.?":{}|<>]/.test(form.newPassword))
      next.newPassword = "Password needs a special character";
    if (form.confirmPassword !== form.newPassword)
      next.confirmPassword = "Passwords don't match";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    if (!validate()) return;
    setIsLoading(true);
    try {
      await authApi.resetPassword(token, form.newPassword);
      setIsSuccess(true);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setServerError(
        err.response?.data?.message || "This link is invalid or has expired.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <AuthLayout title="Password reset">
        <Alert type="success">
          Your password has been reset. Redirecting to login…
        </Alert>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Set a new password">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {serverError && <Alert type="error">{serverError}</Alert>}
        <div className="relative">
          <Input
            label="New password"
            type={showPassword ? "text" : "password"}
            value={form.newPassword}
            onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
            error={errors.newPassword}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-[34px] text-muted"
            aria-label="Toggle password visibility"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        <Input
          label="Confirm password"
          type={showPassword ? "text" : "password"}
          value={form.confirmPassword}
          onChange={(e) =>
            setForm({ ...form, confirmPassword: e.target.value })
          }
          error={errors.confirmPassword}
        />
        <Button type="submit" isLoading={isLoading} className="w-full">
          Reset password
        </Button>
      </form>
      <Link
        to="/login"
        className="block text-center text-sm text-accent hover:underline mt-5"
      >
        Back to login
      </Link>
    </AuthLayout>
  );
}
