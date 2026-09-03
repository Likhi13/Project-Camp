import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import AuthLayout from "./AuthLayout";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Alert from "../../components/ui/Alert";
import * as authApi from "../../api/auth.api";

const initialForm = {
  email: "",
  username: "",
  fullName: "",
  password: "",
  confirmPassword: "",
};

export default function Register() {
  const [form, setForm] = useState(initialForm);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validate = () => {
    const next = {};
    if (!form.email) next.email = "Email is required";
    if (!form.username) next.username = "Username is required";
    else if (form.username !== form.username.toLowerCase())
      next.username = "Username must be lowercase";
    else if (form.username.length < 3)
      next.username = "Username must be at least 3 characters";
    if (!form.password) next.password = "Password is required";
    else if (form.password.length < 8)
      next.password = "Password must be at least 8 characters";
    else if (!/[A-Z]/.test(form.password))
      next.password = "Password needs an uppercase letter";
    else if (!/[!@#$%^&*(),.?":{}|<>]/.test(form.password))
      next.password = "Password needs a special character";
    if (form.confirmPassword !== form.password)
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
      const { confirmPassword, ...payload } = form;
      await authApi.register(payload);
      setIsSuccess(true);
    } catch (err) {
      setServerError(err.response?.data?.message || "Unable to register");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <AuthLayout title="Check your email" subtitle="Almost there">
        <Alert type="success">
          We've sent a verification link to {form.email}. Verify your email,
          then log in.
        </Alert>
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
    <AuthLayout title="Create account" subtitle="Set up your workspace access">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {serverError && <Alert type="error">{serverError}</Alert>}
        <Input
          label="Email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          error={errors.email}
        />
        <Input
          label="Username"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          error={errors.username}
        />
        <Input
          label="Full name (optional)"
          value={form.fullName}
          onChange={(e) => setForm({ ...form, fullName: e.target.value })}
        />
        <div className="relative">
          <Input
            label="Password"
            type={showPassword ? "text" : "password"}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            error={errors.password}
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
          Create account
        </Button>
      </form>
      <p className="text-sm text-muted text-center mt-5">
        Already have an account?{" "}
        <Link to="/login" className="text-accent hover:underline">
          Log in
        </Link>
      </p>
    </AuthLayout>
  );
}
