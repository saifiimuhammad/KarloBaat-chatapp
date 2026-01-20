import { useEffect, useState, type FormEvent } from "react";
import { Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { adminLogin, getAdmin } from "../../redux/thunks/admin";
import type { RootState, AppDispatch } from "../../redux/store";

const AdminLogin: React.FC = () => {
  const [secretKey, setSecretKey] = useState<string>("");

  const dispatch = useDispatch<AppDispatch>();
  const { isAdmin, loader } = useSelector((state: RootState) => state.auth);

  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!secretKey.trim()) return;
    dispatch(adminLogin(secretKey));
  };

  useEffect(() => {
    dispatch(getAdmin());
  }, [dispatch]);

  if (isAdmin) return <Navigate to="/admin/dashboard" replace />;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-light">
      <div className="w-full max-w-sm bg-white rounded-2xl border border-zinc-200 p-8">
        <h1 className="text-xl font-semibold text-text text-center">
          Admin Access
        </h1>
        <p className="text-sm text-textLight text-center mt-1">
          Enter admin secret key to continue
        </p>

        <form onSubmit={submitHandler} className="mt-6 space-y-4">
          <div>
            <label
              htmlFor="secretKey"
              className="block text-sm font-medium text-text mb-1"
            >
              Secret Key
            </label>
            <input
              id="secretKey"
              type="password"
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl border border-accent px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loader}
            className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-white hover:bg-[#4a6231] transition disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed"
          >
            {loader ? "Verifying..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
