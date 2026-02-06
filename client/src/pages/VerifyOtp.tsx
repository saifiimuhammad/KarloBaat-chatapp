import axios from "axios";
import { MailCheck, KeyRound } from "lucide-react";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { server } from "../constants/config";
import { userExists } from "../redux/reducers/auth";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";

type LocationState = {
  email: string;
  type: "email" | "password";
};

const VerifyOtp: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { email, type } = (location.state || {}) as LocationState;
  console.log(`Email: ${email}
    Type: ${type}`);

  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);

  if (!email || !type) {
    navigate("/login");
    return null;
  }

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleVerify = async () => {
    if (otp.some((d) => d === "")) return;

    const toastId = toast.loading("Verifying...");
    setIsLoading(true);

    try {
      const endpoint =
        type === "email"
          ? "/api/v1/user/verify-email"
          : "/api/v1/user/verify-password-otp";

      const { data } = await axios.post(
        `${server}${endpoint}`,
        {
          email,
          otp: otp.join(""),
        },
        {
          withCredentials: true,
        },
      );

      toast.success(data.message, { id: toastId });

      if (type === "email") {
        console.log(data);
        console.log(data.user);
        dispatch(userExists(data.user));
      } else {
        navigate("/change-password", { state: { email } });
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "OTP verification failed", {
        id: toastId,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const ui = {
    icon: type === "email" ? MailCheck : KeyRound,
    title: type === "email" ? "Verify Your Email" : "Verify Password Reset",
    description:
      type === "email"
        ? "Enter the 6-digit code sent to your email address."
        : "Enter the 6-digit code sent to reset your password.",
  };

  const Icon = ui.icon;

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-120 bg-white rounded-xl p-8 md:p-12">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <Icon className="text-primary" size={28} />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-center mb-2">{ui.title}</h1>

        <p className="text-text-light text-center mb-8">{ui.description}</p>

        {/* OTP Inputs */}
        <div className="flex justify-center mb-8">
          <div className="flex gap-3">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                autoFocus={index === 0}
                className="h-14 w-12 text-center text-xl font-bold rounded-xl border-2 border-zinc-200 focus:border-primary outline-none"
              />
            ))}
          </div>
        </div>

        <button
          onClick={handleVerify}
          disabled={isLoading || otp.some((d) => d === "")}
          className="w-full h-14 bg-primary text-white rounded-xl font-bold text-lg disabled:opacity-60"
        >
          {isLoading ? "Verifying..." : "Verify OTP"}
        </button>

        <p className="text-center text-sm text-text-light mt-6">
          Didn’t receive OTP?
          <button className="ml-1 text-primary font-bold hover:underline">
            Resend
          </button>
        </p>
      </div>
    </div>
  );
};

export default VerifyOtp;
