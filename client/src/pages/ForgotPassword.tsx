import axios from "axios";
import { ArrowLeft, ArrowRight, KeyRound, Mail } from "lucide-react";
import React, { useState } from "react";
import { server } from "../constants/config";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const toastId = toast.loading("Sending reset link...");
    setIsLoading(true);

    try {
      const { data } = await axios.post(
        `${server}/api/v1/user/send-otp`,
        {
          email,
          type: "password",
        },
        {
          withCredentials: true,
        },
      );
      toast.success(data.message, { id: toastId });
      navigate("/verify-email", { state: { email, type: "password" } });
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to send reset link. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex-1 flex items-center justify-center p-6">
      <div className="w-full max-w-110">
        <div className="bg-white p-8 md:p-10">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center size-12 rounded-full bg-white text-primary mb-4">
              <KeyRound size={24} />
            </div>

            <h1 className="text-2xl font-bold mb-2">Reset Your Password</h1>

            <p className="text-sm text-text-light leading-relaxed">
              Enter your email and we'll send you a one-time code to reset your
              password.
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold mb-2"
              >
                Email Address
              </label>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-light">
                  <Mail size={18} />
                </div>

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="name@company.com"
                  className="w-full pl-10 pr-4 py-3 bg-background-2 border border-zinc-200 rounded-lg text-primary placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-primary text-white font-bold rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>{isLoading ? "Sending..." : "Send OTP"}</span>
              <ArrowRight size={20} />
            </button>
          </form>

          <div className="mt-8 text-center">
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="inline-flex items-center gap-1 text-sm font-medium text-text-light hover:text-primary transition-colors group cursor-pointer"
            >
              <ArrowLeft
                size={20}
                className="transition-transform group-hover:-translate-x-1"
              />
              Back to Login
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ForgotPassword;
