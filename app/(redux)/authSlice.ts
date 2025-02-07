import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { User } from "@/utils/types/userTypes";
import { setUserInStorage, loadUserFromStorage, removeUserFromStorage } from "../../utils/userAsyncStorage";

interface AuthState {
  user: User | null;
  loading: boolean;
  error:string | null;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error:null
};

export const loginUser = createAsyncThunk(
    "auth/loginUser",
    async (credentials: { username: string; password: string }, { rejectWithValue }) => {
      try {
        const response = await fetch("https://dummyjson.com/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(credentials),
        });
  
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Invalid login credentials");
          }
  
        const data: User = await response.json();
        await setUserInStorage(data);
        return data;
      } catch (error: any) {
        return rejectWithValue(error.message);
      }
    }
  );

  export const checkStoredUser = createAsyncThunk("auth/checkUser", async (): Promise<User | null> => {
    const user = await loadUserFromStorage();
    return user;
  });

  export const logout = createAsyncThunk("auth/logout", async () => {
    await removeUserFromStorage();
    return null;
  });

  const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
          .addCase(loginUser.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
          .addCase(loginUser.fulfilled, (state, action: PayloadAction<any>) => {
            state.loading = false;
            state.user = action.payload;
          })
          .addCase(loginUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
          })
          .addCase(checkStoredUser.fulfilled, (state, action: PayloadAction<any>) => {
            state.user = action.payload;
          })
          .addCase(logout.fulfilled, (state) => {
            state.user = null;
          });
      },
  });
  
  export default authSlice.reducer;
