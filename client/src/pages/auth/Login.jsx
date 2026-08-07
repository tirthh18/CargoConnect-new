import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Check, Timer, Eye, EyeOff } from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import { useLogin } from "../../hooks/useAuth";

export default function Login() {

  const navigate = useNavigate();
  const { login } = useAuth();
  const { mutateAsync: loginMutation, isPending } = useLogin();
  
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "" });

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validate = () => {
    const newErrors = { email: "", password: "" };

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return !newErrors.email && !newErrors.password;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      const data = await loginMutation({
        email: formData.email,
        password: formData.password,
      });

      login(data.token, data.user);

      if (data.user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/user/dashboard");
      }
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || error.message || "Login failed");
    }
  };
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#FCEEE9] px-6 py-12">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="max-w-lg">
          <h1 className="text-5xl font-extrabold text-[#1B1B2F] leading-tight">
            Welcome Back!
          </h1>
          <p className="mt-4 text-lg text-slate-400">
            Smart Shipping for a Fast-Paced World.
          </p>

          <div className="mt-10 space-y-4">
            <FeatureCard
              icon={<Check size={20} strokeWidth={3} className="text-[#E8734A]" />}
              title="Trusted Courier Service"
              subtitle="Advanced protection for your Consignment"
            />
            <FeatureCard
              icon={<Timer size={20} className="text-[#E8734A]" />}
              title="Real-time Collaboration"
              subtitle="Work together seamlessly"
            />
          </div>
        </div>

        <div className="w-full max-w-md ml-auto bg-white rounded-2xl shadow-xl p-8 sm:p-10">
          <button
            type="button"
            aria-label="Go back"
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <ArrowLeft size={22} />
          </button>

          <div className="text-center mt-2 mb-8">
            <h2 className="text-2xl font-bold text-[#1B1B2F]">Sign In</h2>
            <p className="text-slate-400 mt-1">Access your account</p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-[#1B1B2F] mb-2">
                Email
              </label>
              <input
                id="email"
                type="text"
                value={formData.email}
                onChange={(e) => {setFormData((prev) => ({...prev, email: e.target.value}));}}
                placeholder="e.g. tirth@gmail.com"
                className={`w-full rounded-xl border px-4 py-3 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 ${
                  errors.email ? "border-red-400 focus:ring-red-200 focus:border-red-400": "border-slate-200 focus:ring-[#E8734A]/40 focus:border-[#E8734A]"}`}
              />
              {errors.email && (
                <p className="mt-1.5 text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-[#1B1B2F] mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => {setFormData((prev) => ({...prev, password: e.target.value}));}}
                  className={`w-full rounded-xl border px-4 py-3 pr-11 text-slate-700 focus:outline-none focus:ring-2 ${
                    errors.password? "border-red-400 focus:ring-red-200 focus:border-red-400": "border-slate-200 focus:ring-[#E8734A]/40 focus:border-[#E8734A]"}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-sm text-red-500">{errors.password}</p>
              )}
            </div>

            <button type="submit" disabled={isPending} className="w-full bg-[#E8734A] hover:bg-[#DE6740] text-white font-semibold py-3.5 rounded-xl disabled:opacity-50">
              {isPending ? "Logging In..." : "Log In"}
            </button>
          </form>

          <p className="text-center text-slate-400 mt-6">
            Don't have an account?{" "}
            <Link to="/register" className="text-[#E8734A] font-medium hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, subtitle }) {
  return (
    <div className="flex items-center gap-4 bg-white/60 rounded-2xl p-5">
      <div className="flex items-center justify-center w-11 h-11 rounded-full bg-[#F8D9CC] shrink-0">
        {icon}
      </div>
      <div>
        <p className="font-semibold text-[#1B1B2F]">{title}</p>
        <p className="text-slate-400 text-sm mt-0.5">{subtitle}</p>
      </div>
    </div>
  );
}