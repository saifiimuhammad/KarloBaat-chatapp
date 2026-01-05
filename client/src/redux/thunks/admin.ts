import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { server } from "../../constants/config";

// Type definitions
interface Admin {
  _id: string;
  name: string;
  email: string;
  // add any other admin fields here
}

interface LoginResponse {
  message: string;
}

interface GetAdminResponse {
  admin: Admin;
}

interface LogoutResponse {
  message: string;
}

// Admin login thunk
export const adminLogin = createAsyncThunk<
  LoginResponse["message"], // Return type
  string, // Thunk argument type (secretKey)
  { rejectValue: string }
>("admin/login", async (secretKey, { rejectWithValue }) => {
  try {
    const config = {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    };

    const { data } = await axios.post<LoginResponse>(
      `${server}/api/v1/admin/verify`,
      { secretKey },
      config
    );

    return data.message;
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    return rejectWithValue(err.response?.data.message || "Login failed");
  }
});

// Get current admin thunk
export const getAdmin = createAsyncThunk<
  Admin, // Return type
  void, // No argument
  { rejectValue: string }
>("admin/get", async (_, { rejectWithValue }) => {
  try {
    const { data } = await axios.get<GetAdminResponse>(
      `${server}/api/v1/admin/`,
      {
        withCredentials: true,
      }
    );

    return data.admin;
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    return rejectWithValue(
      err.response?.data.message || "Fetching admin failed"
    );
  }
});

// Admin logout thunk
export const adminLogout = createAsyncThunk<
  LogoutResponse["message"], // Return type
  void, // No argument
  { rejectValue: string }
>("admin/logout", async (_, { rejectWithValue }) => {
  try {
    const { data } = await axios.get<LogoutResponse>(
      `${server}/api/v1/admin/logout`,
      {
        withCredentials: true,
      }
    );

    return data.message;
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    return rejectWithValue(err.response?.data.message || "Logout failed");
  }
});
