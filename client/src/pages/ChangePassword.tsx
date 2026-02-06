import { ArrowLeft, Lock as LockIcon } from "lucide-react";
import { Input } from "../components/ui/Input";
import { useStrongPassword } from "6pp";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";
import { server } from "../constants/config";
import axios from "axios";

const ChangePassword = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const email = (location.state?.email || "") as string;

  const password = useStrongPassword();
  const confirmPassword = useStrongPassword();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const toastId = toast.loading("Updating password...");

    if (password.value !== confirmPassword.value) {
      toast.error("Passwords do not match", { id: toastId });
      return;
    }

    if (password.error) {
      toast.error("Password is not strong enough", { id: toastId });
      return;
    }

    setIsLoading(true);

    try {
      const { data } = await axios.post(
        `${server}/api/v1/user/change-password`,
        {
          email,
          newPassword: password.value,
        },
        { withCredentials: true },
      );
      toast.success(data.message, { id: toastId });
      navigate("/login");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to update password",
        { id: toastId },
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="w-full min-h-screen flex items-center justify-center gap-8">
      <div className="max-w-110 flex flex-col items-center gap-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight mb-2 capitalize">
            Create new password
          </h1>
          <p className="text-text-light text-base leading-normal">
            Your new password must be different from previously used passwords.
          </p>
        </div>
        <form className="w-full flex flex-col gap-6" onSubmit={handleSubmit}>
          <Input
            label="New Password"
            placeholder="Enter new password"
            type="password"
            value={password.value}
            onChange={password.changeHandler}
            icon={<LockIcon size={16} />}
          />

          {password.error && (
            <p className="text-red-500 text-sm">{password.error}</p>
          )}

          <Input
            label="Confirm New Password"
            placeholder="Re-type new password"
            type="password"
            value={confirmPassword.value}
            onChange={confirmPassword.changeHandler}
            icon={<LockIcon size={16} />}
          />

          {confirmPassword.value &&
            password.value !== confirmPassword.value && (
              <p className="text-red-500 text-sm">Passwords do not match</p>
            )}

          <button
            className="w-full h-14 bg-primary text-white rounded-lg font-bold text-base hover:opacity-90 active:scale-[0.98] transition-all shadow-lg shadow-primary/10 cursor-pointer"
            type="submit"
            disabled={
              isLoading ||
              !password.value ||
              !confirmPassword.value ||
              !!password.error ||
              password.value !== confirmPassword.value
            }
          >
            Update Password
          </button>

          <div className="flex justify-center pt-2">
            <Link
              className="flex items-center gap-1 text-sm font-semibold text-text-light hover:text-text transition-colors group"
              to="/login"
            >
              <ArrowLeft
                size={18}
                className="group-hover:-translate-x-1 transition-transform"
              />
              Back to Login
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
};
export default ChangePassword;
