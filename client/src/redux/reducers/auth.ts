import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { adminLogin, adminLogout, getAdmin } from "../thunks/admin";
import toast from "react-hot-toast";

// Define the user type
interface AdminUser {
  _id: string;
  name: string;
  email: string;
  // add more fields if needed
}

// State interface
interface AuthState {
  user: AdminUser | null;
  isAdmin: boolean;
  loader: boolean;
}

// Initial state
const initialState: AuthState = {
  user: null,
  isAdmin: false,
  loader: true,
};

// Slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    userExists: (state, action: PayloadAction<AdminUser>) => {
      state.user = action.payload;
      state.loader = false;
    },
    userNotExists: (state) => {
      state.user = null;
      state.loader = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(adminLogin.fulfilled, (state, action: PayloadAction<string>) => {
        state.isAdmin = true;
        toast.success(action.payload);
      })
      .addCase(adminLogin.rejected, (state, action) => {
        state.isAdmin = false;
        toast.error(action.error.message ?? "Login failed");
      })
      .addCase(
        getAdmin.fulfilled,
        (state, action: PayloadAction<AdminUser | null>) => {
          state.isAdmin = !!action.payload;
        }
      )
      .addCase(getAdmin.rejected, (state) => {
        state.isAdmin = false;
      })
      .addCase(
        adminLogout.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.isAdmin = false;
          toast.success(action.payload);
        }
      )
      .addCase(adminLogout.rejected, (state, action) => {
        state.isAdmin = true;
        toast.error(action.error.message ?? "Logout failed");
      });
  },
});

export default authSlice;

// Export actions
export const { userExists, userNotExists } = authSlice.actions;
