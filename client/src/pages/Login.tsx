import { useFileHandler, useInputValidation, useStrongPassword } from "6pp";
import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { server } from "../constants/config.js";
import { userExists } from "../redux/reducers/auth.js";

import { Button } from "../components/ui/Button.js";
import { Input } from "../components/ui/Input.js";

import {
  ArrowRight as ArrowRightIcon,
  CameraIcon,
  IdCard as IdCardIcon,
  Lock as LockIcon,
  Mail as MailIcon,
  MessageCircleHeart as MessageCircleHeartIcon,
  Pen as PenIcon,
  User as UserIcon,
} from "lucide-react";
import { emailValidator, usernameValidator } from "../utils/validators.js";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const name = useInputValidation("");
  const bio = useInputValidation("");
  const username = useInputValidation("", (val) => ({
    ...usernameValidator(val),
    errorMessage: usernameValidator(val).errorMessage || "",
  }));
  const email = useInputValidation("", (val) => ({
    ...emailValidator(val),
    errorMessage: emailValidator(val).errorMessage || "",
  }));
  const password = useStrongPassword();
  const avatar = useFileHandler("single");
  const identifier = useInputValidation("");

  const toggleLogin = () => setIsLogin((p) => !p);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const toastId = toast.loading("Logging in...");
    setIsLoading(true);

    try {
      const { data } = await axios.post(
        `${server}/api/v1/user/login`,
        {
          identifier: identifier.value,
          password: password.value,
        },
        { withCredentials: true },
      );

      if (data.redirect === "/verify-email") {
        navigate("/verify-email", {
          state: { email: data.email, type: "email" },
        });
        toast.success(data.message, { id: toastId });
        setIsLoading(false);
        return;
      }
      dispatch(userExists(data.user));
      toast.success(data.message, { id: toastId });
    } catch (err: any) {
      console.log(err);
      toast.error(err?.response?.data?.message || "Error", { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendOtp = async (email: string) => {
    const toastId = toast.loading("Signing up...");
    setIsLoading(true);
    try {
      const { data } = await axios.post(
        `${server}/api/v1/user/send-otp`,
        {
          email: email,
          type: "email",
        },
        { withCredentials: true },
      );
      toast.success(data.message, { id: toastId });

      navigate("/verify-email", { state: { email, type: "email" } });
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Error", { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    const toastId = toast.loading("Signing up...");
    setIsLoading(true);

    const formData = new FormData();
    if (avatar.file) {
      formData.append("avatar", avatar.file);
    }
    formData.append("name", name.value);
    formData.append("bio", bio.value);
    formData.append("username", username.value);
    formData.append("email", email.value);
    formData.append("password", password.value);

    try {
      const { data } = await axios.post(`${server}/api/v1/user/new`, formData, {
        withCredentials: true,
      });

      // dispatch(userExists(data.user));
      toast.success(data.message, { id: toastId });

      await handleSendOtp(email.value);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Error", { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white md:bg-background md:px-4">
      <div className="w-full max-w-md md:rounded-2xl bg-white md:shadow-xl md:border border-secondary/30 p-8">
        <div className="">
          <h2 className="text-lg font-semibold tracking-tight flex items-center justify-center gap-1 text-center mb-4 text-text/80">
            <MessageCircleHeartIcon /> Karlobaat
          </h2>
          <h1 className="text-2xl font-bold text-text text-center mb-1 tracking-tight">
            Welcome Back
          </h1>
          <p className="text-center text-sm text-text/50">
            Connect instantly with friends and family.
          </p>
        </div>

        {/* Toggle Pill Button */}
        <div className="w-full rounded-xl bg-accent p-1 flex my-6">
          <button
            onClick={() => setIsLogin(false)}
            className={`cursor-pointer flex-1 rounded-xl py-2 text-sm font-medium transition-all duration-200
          ${
            isLogin === false ? "bg-white text-text shadow" : "text-text-light"
          }`}
          >
            Sign Up
          </button>

          <button
            onClick={() => setIsLogin(true)}
            className={`cursor-pointer flex-1 rounded-xl py-2 text-sm font-medium transition-all duration-200
          ${
            isLogin === true ? "bg-white text-text shadow" : "text-text-light"
          }`}
          >
            Login
          </button>
        </div>

        {isLogin ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              label="Username/Email"
              placeholder="Enter username or email address"
              value={identifier.value}
              type="text"
              onChange={identifier.changeHandler}
              icon={<UserIcon size={16} />}
            />

            <Input
              label="Password"
              placeholder="Enter password"
              type="password"
              forgotPasswordLink={true}
              value={password.value}
              onChange={password.changeHandler}
              icon={<LockIcon size={16} />}
            />

            <Button disabled={isLoading} className="w-full">
              Continue <ArrowRightIcon className="ml-2" size={16} />
            </Button>
          </form>
        ) : (
          <form onSubmit={handleSignup} className="space-y-4">
            {/* Avatar */}
            <div className="flex flex-col items-center gap-2 mt-6">
              <div className="relative group">
                {/* Avatar Image */}
                <img
                  src={avatar.preview || "/avatar-placeholder.png"}
                  alt="Avatar"
                  className="w-32 h-32 rounded-full object-cover border-2 border-secondary shadow-sm transition-all duration-200 group-hover:brightness-75"
                />

                {/* Overlay */}
                <button
                  type="button"
                  onClick={() =>
                    document.getElementById("avatarUpload")?.click()
                  }
                  className="absolute inset-0 flex items-center justify-center rounded-full
                 bg-black/40 opacity-0 group-hover:opacity-100
                 transition-all duration-200"
                >
                  <div className="flex flex-col items-center text-background text-xs">
                    <CameraIcon size={18} />
                    <span className="mt-1">Change</span>
                  </div>
                </button>

                {/* Hidden Input */}
                <input
                  id="avatarUpload"
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={avatar.changeHandler}
                />
              </div>

              {/* Helper text */}
              <p className="text-xs text-secondary">Upload profile picture</p>
            </div>

            {avatar.error && (
              <p className="text-sm text-red-500 text-center">{avatar.error}</p>
            )}

            <Input
              label="Name"
              placeholder="Enter your full name"
              value={name.value}
              onChange={name.changeHandler}
              icon={<IdCardIcon size={16} />}
            />
            <Input
              label="Username"
              placeholder="Choose a username"
              value={username.value}
              onChange={username.changeHandler}
              icon={<UserIcon size={16} />}
            />
            {username.error && (
              <p className="text-sm text-red-500">{username.error}</p>
            )}
            <Input
              label="Email Address"
              placeholder="Enter your email address"
              value={email.value}
              onChange={email.changeHandler}
              icon={<MailIcon size={16} />}
            />
            {email.error && (
              <p className="text-sm text-red-500">{email.error}</p>
            )}

            <Input
              label="Bio"
              placeholder="Enter about yourself"
              value={bio.value}
              onChange={bio.changeHandler}
              icon={<PenIcon size={16} />}
            />

            <Input
              label="Password"
              type="password"
              placeholder="Create a password"
              value={password.value}
              onChange={password.changeHandler}
              icon={<LockIcon size={16} />}
              className="mb-3"
            />
            {password.error && (
              <p className="text-sm text-red-500">{password.error}</p>
            )}

            <Button disabled={isLoading} className="w-full">
              Signup
            </Button>
          </form>
        )}

        <div className="mt-4">
          <p className="text-xs text-text/50 text-center">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              onClick={toggleLogin}
              className="text-primary font-medium hover:underline"
            >
              {isLogin ? "Sign Up" : "Log in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
