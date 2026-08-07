import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Check, Timer, Eye, EyeOff } from "lucide-react";
import { useRegister } from "../../hooks/useAuth";

export default function Register() {
  const navigate = useNavigate();
  const { mutateAsync: registerMutation, isPending } = useRegister();

  const [formData, setFormData] = useState({  fullName: "", email: "",  password: ""});
  const [errors, setErrors] = useState({  fullName: "",  email: "",  password: "", agreed: "",});
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);


  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validate = () => {
    const newErrors = { fullName: "", email: "", password: "", agreed: "" };

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.trim().length < 3) {
      newErrors.password = "Password must be at least 3 characters";
    }

    if (!agreed) {
      newErrors.agreed =
        "You must agree to the Terms of Service and Privacy Policy";
    }

    setErrors(newErrors);
    return ( !newErrors.fullName && !newErrors.email && !newErrors.password && !newErrors.agreed );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      const data = await registerMutation({
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
      });

      alert(data.message);

      navigate("/");

    } catch (error) {
      console.log(error);
      alert(
        error.response?.data?.message || error.message || "Registration failed",
      );
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#FCEEE9] px-6 py-12">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left side */}
        <div className="max-w-lg">
          <h1 className="text-5xl font-extrabold text-[#1B1B2F] leading-tight">
            Sign up to CargoConnect
          </h1>
          <p className="mt-4 text-lg text-slate-400">
            Create an account to send and receive parcels with ease and join our community.
          </p>
        </div>

        {/* Right side - Sign up card */}
        <div className="w-full max-w-md ml-auto bg-white rounded-2xl shadow-xl p-8 sm:p-10">
          <button
            type="button"
            aria-label="Go back"
            onClick={() => navigate(-1)}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <ArrowLeft size={22} />
          </button>

          <div className="text-center mt-2 mb-8">
            <h2 className="text-2xl font-bold text-[#1B1B2F]">
              Sign up to CargoConnect
            </h2>
            <p className="text-slate-400 mt-1">Create a new account</p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <div>
              <label htmlFor="fullName" className="block text-sm font-semibold text-[#1B1B2F] mb-2">
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                value={formData.fullName}
                onChange={(e) => {setFormData((prev) => ({...prev,fullName: e.target.value,}));}}
                placeholder="e.g. John Champion"
                className={`w-full rounded-xl border px-4 py-3 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 ${
                  errors.fullName? "border-red-400 focus:ring-red-200 focus:border-red-400": "border-slate-200 focus:ring-[#E8734A]/40 focus:border-[#E8734A]"}`}
              />
              {errors.fullName && (<p className="mt-1.5 text-sm text-red-500">{errors.fullName}</p>)}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-[#1B1B2F] mb-2">
                Email
              </label>
              <input
                id="email"
                type="text"
                value={formData.email}
                onChange={(e) => {setFormData((prev) => ({...prev,email: e.target.value,}));}}
                placeholder="e.g. john@gmail.com"
                className={`w-full rounded-xl border px-4 py-3 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 ${
                  errors.email? "border-red-400 focus:ring-red-200 focus:border-red-400": "border-slate-200 focus:ring-[#E8734A]/40 focus:border-[#E8734A]"}`}
              />
              {errors.email && (<p className="mt-1.5 text-sm text-red-500">{errors.email}</p>)}
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
                  onChange={(e) => {setFormData((prev) => ({...prev,password: e.target.value,}));}}
                  placeholder="Enter your password"
                  className={`w-full rounded-xl border px-4 py-3 pr-11 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 ${
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

            <div>
              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-slate-300 text-[#E8734A] focus:ring-[#E8734A]/40 accent-[#E8734A]"
                />
                <span className="text-sm text-slate-700">
                  Creating an account means you're okay with our{" "}
                  <a href="#" className="text-[#E8734A] font-medium hover:underline">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-[#E8734A] font-medium hover:underline">
                    Privacy Policy
                  </a>
                  .
                </span>
              </label>
              {errors.agreed && (
                <p className="mt-1.5 text-sm text-red-500">{errors.agreed}</p>
              )}
            </div>

            <button type="submit" disabled={isPending} className="w-full bg-[#E8734A] hover:bg-[#DE6740] text-white font-semibold py-3.5 rounded-xl disabled:opacity-50">
              {isPending ? "Creating Account..." : "Sign Up"}
            </button>
          </form>

          <p className="text-center text-slate-400 mt-6">
            Already have an account?{" "}
            <Link to="/" className="text-[#E8734A] font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
