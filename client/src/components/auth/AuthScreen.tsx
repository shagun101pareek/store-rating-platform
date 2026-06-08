import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import api from "../../services/api";
import {
  formatServerErrors,
  getFieldErrors,
  validateAddress,
  validateEmail,
  validateName,
  validatePassword,
  type ServerValidationError,
} from "../../utils/validation";
import {
  ArrowRightIcon,
  CheckCircleIcon,
  LockIcon,
  MailIcon,
  StarLogo,
} from "../icons";
import UnavailableData from "../ui/UnavailableData";

type AuthMode = "login" | "signup";

type Props = {
  mode: AuthMode;
};

const AuthScreen = ({ mode: initialMode }: Props) => {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const navigate = useNavigate();

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setFieldErrors({});

    const emailError = validateEmail(email);
    if (emailError) {
      setFieldErrors({ email: emailError });
      setError(emailError);
      setLoading(false);
      return;
    }

    try {
      const response = await api.post("/auth/login", { email: email.trim(), password });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      const role = response.data.user.role;

      if (role === "ADMIN") {
        navigate("/admin");
      } else if (role === "STORE_OWNER") {
        navigate("/owner");
      } else {
        navigate("/home");
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const serverErrors = err.response?.data?.errors as
          | ServerValidationError[]
          | undefined;
        if (serverErrors?.length) {
          setFieldErrors(getFieldErrors(serverErrors));
          setError(formatServerErrors(serverErrors));
        } else {
          setError("Invalid email or password. Please try again.");
        }
      } else {
        setError("Invalid email or password. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setFieldErrors({});

    const errors: Record<string, string> = {};
    const nameError = validateName(name);
    if (nameError) errors.name = nameError;
    const emailError = validateEmail(email);
    if (emailError) errors.email = emailError;
    const addressError = validateAddress(address);
    if (addressError) errors.address = addressError;
    const passwordError = validatePassword(password);
    if (passwordError) errors.password = passwordError;

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setError(Object.values(errors)[0]);
      setLoading(false);
      return;
    }

    try {
      await api.post("/auth/signup", {
        name: name.trim(),
        email: email.trim(),
        address: address.trim(),
        password,
      });

      navigate("/");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const serverErrors = err.response?.data?.errors as
          | ServerValidationError[]
          | undefined;
        if (serverErrors?.length) {
          setFieldErrors(getFieldErrors(serverErrors));
          setError(formatServerErrors(serverErrors));
        } else {
          setError(
            err.response?.data?.message ||
              "Signup failed. Please check your details and try again."
          );
        }
      } else {
        setError("Signup failed. Please check your details and try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (nextMode: AuthMode) => {
    setMode(nextMode);
    setError("");
    setFieldErrors({});
    navigate(nextMode === "login" ? "/" : "/signup", { replace: true });
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#f4f7fb]">
      <header className="flex items-center justify-between px-4 py-4 sm:px-8 sm:py-5">
        <div className="flex min-w-0 items-center gap-2.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white">
            <StarLogo className="h-4 w-4" />
          </div>
          <span className="truncate text-sm font-bold text-slate-900 sm:text-base">
            Store Rating Platform
          </span>
        </div>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="text-sm font-medium text-slate-400 transition hover:text-slate-600"
        >
          &lt; Back
        </button>
      </header>

      <div className="flex flex-1 flex-col items-center justify-center px-4 pb-8 sm:px-6">
        <div className="mb-6 text-center sm:mb-8">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50">
            <StarLogo className="h-7 w-7 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            {mode === "login" ? "Welcome back" : "Create your account"}
          </h1>
          <p className="mt-2 text-slate-500">
            {mode === "login"
              ? "Sign in to continue rating your favorite stores"
              : "Sign up to start rating your favorite stores"}
          </p>
        </div>

        <div className="w-full max-w-md rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-8">
          <div className="mb-6 flex rounded-xl bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => switchMode("login")}
              className={`flex-1 rounded-lg py-2.5 text-sm font-semibold transition ${
                mode === "login"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => switchMode("signup")}
              className={`flex-1 rounded-lg py-2.5 text-sm font-semibold transition ${
                mode === "signup"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Sign Up
            </button>
          </div>

          {error && (
            <div className="mb-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {mode === "login" ? (
            <form onSubmit={handleLogin} className="space-y-5">
              <AuthInput
                id="email"
                label="Email Address"
                type="email"
                required
                value={email}
                onChange={setEmail}
                placeholder="name@example.com"
                icon={<MailIcon className="h-5 w-5 text-slate-400" />}
                error={fieldErrors.email}
              />

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="text-xs font-semibold uppercase tracking-wider text-slate-400"
                  >
                    Password
                  </label>
                  <UnavailableData />
                </div>
                <AuthInput
                  id="password"
                  label=""
                  type="password"
                  required
                  value={password}
                  onChange={setPassword}
                  placeholder="••••••••"
                  icon={<LockIcon className="h-5 w-5 text-slate-400" />}
                  hideLabel
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Signing in..." : "Sign In"}
                {!loading && <ArrowRightIcon className="h-4 w-4" />}
              </button>
            </form>
          ) : (
            <form onSubmit={handleSignup} className="space-y-5">
              <AuthInput
                id="name"
                label="Full Name"
                type="text"
                required
                value={name}
                onChange={setName}
                placeholder="20–60 characters"
                error={fieldErrors.name}
              />
              <AuthInput
                id="signup-email"
                label="Email Address"
                type="email"
                required
                value={email}
                onChange={setEmail}
                placeholder="name@example.com"
                icon={<MailIcon className="h-5 w-5 text-slate-400" />}
                error={fieldErrors.email}
              />
              <AuthInput
                id="address"
                label="Address"
                type="text"
                required
                value={address}
                onChange={setAddress}
                placeholder="Max 400 characters"
                error={fieldErrors.address}
              />
              <AuthInput
                id="signup-password"
                label="Password"
                type="password"
                required
                value={password}
                onChange={setPassword}
                placeholder="8–16 chars, uppercase + special"
                icon={<LockIcon className="h-5 w-5 text-slate-400" />}
                error={fieldErrors.password}
              />

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Creating account..." : "Sign Up"}
                {!loading && <ArrowRightIcon className="h-4 w-4" />}
              </button>
            </form>
          )}

          <p className="mt-6 text-center text-sm text-slate-500">
            {mode === "login" ? (
              <>
                Don&apos;t have an account?{" "}
                <button
                  type="button"
                  onClick={() => switchMode("signup")}
                  className="font-semibold text-blue-600 hover:text-blue-700"
                >
                  Sign up for free
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => switchMode("login")}
                  className="font-semibold text-blue-600 hover:text-blue-700"
                >
                  Sign in
                </button>
              </>
            )}
          </p>

          <div className="mt-8">
            <div className="relative mb-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-3 text-xs font-semibold uppercase tracking-widest text-slate-400">
                  Secure
                </span>
              </div>
            </div>
            <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
              <CheckCircleIcon className="h-4 w-4 text-emerald-500" />
              <span>SSL Encrypted Connection</span>
            </div>
          </div>
        </div>
      </div>

      <footer className="px-6 pb-8 text-center text-[10px] uppercase leading-relaxed tracking-wider text-slate-400">
        By continuing, you agree to our Terms of Service and Privacy Policy.
        <br />© 2024 Store Rating Platform Inc.
      </footer>
    </div>
  );
};

type AuthInputProps = {
  id: string;
  label: string;
  type: string;
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  icon?: React.ReactNode;
  hideLabel?: boolean;
  error?: string;
};

const AuthInput = ({
  id,
  label,
  type,
  required,
  value,
  onChange,
  placeholder,
  icon,
  hideLabel,
  error,
}: AuthInputProps) => (
  <div>
    {!hideLabel && (
      <label
        htmlFor={id}
        className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400"
      >
        {label}
      </label>
    )}
    <div className="relative">
      {icon && (
        <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2">
          {icon}
        </span>
      )}
      <input
        id={id}
        type={type}
        required={required}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className={`w-full rounded-xl border bg-slate-50 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-blue-500/20 ${
          icon ? "pl-11 pr-4" : "px-4"
        } ${
          error
            ? "border-red-300 focus:border-red-500"
            : "border-transparent focus:border-blue-500"
        }`}
      />
    </div>
    {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
  </div>
);

export default AuthScreen;
