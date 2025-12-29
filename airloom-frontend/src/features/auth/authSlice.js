import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loginUser } from '../../api/auth.api';
import { decodeToken, getUserRole, isTokenExpired } from '../../utils/jwtHelper';
import { AUTH_STORAGE_KEY } from '../../utils/constants';

// Initial state
const initialState = {
  user: null, // { userName, role }
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

// Async thunk for login
export const loginAsync = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await loginUser(email, password);
      
      // Extract token from response
      const { accessToken } = response;
      
      if (!accessToken) {
        return rejectWithValue('No access token received');
      }
      
      // Decode token
      const decoded = decodeToken(accessToken);
      if (!decoded) {
        return rejectWithValue('Invalid token received');
      }
      
      // Extract role
      const role = getUserRole(accessToken);
      if (!role) {
        return rejectWithValue('Role not found in token - forcing logout');
      }
      
      // Extract userName from token
      const userName = decoded.UserName || decoded.userName || 'User';
      
      // Return user data and token
      return {
        token: accessToken,
        user: {
          userName,
          role,
        },
      };
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Login failed';
      return rejectWithValue(message);
    }
  }
);

// Async thunk for initializing auth from localStorage
export const initializeAuth = createAsyncThunk(
  'auth/initialize',
  async (_, { rejectWithValue }) => {
    try {
      const authData = localStorage.getItem(AUTH_STORAGE_KEY);
      
      if (!authData) {
        return rejectWithValue('No auth data found');
      }
      
      const { token, user } = JSON.parse(authData);
      
      // Validate token
      if (!token || isTokenExpired(token)) {
        localStorage.removeItem(AUTH_STORAGE_KEY);
        return rejectWithValue('Token expired');
      }
      
      // Validate role
      const role = getUserRole(token);
      if (!role) {
        localStorage.removeItem(AUTH_STORAGE_KEY);
        return rejectWithValue('Invalid token - no role found');
      }
      
      return { token, user };
    } catch (error) {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      return rejectWithValue('Failed to initialize auth');
    }
  }
);

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem(AUTH_STORAGE_KEY);
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
        
        // Persist to localStorage
        localStorage.setItem(
          AUTH_STORAGE_KEY,
          JSON.stringify({
            token: action.payload.token,
            user: action.payload.user,
          })
        );
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.error = action.payload;
      })
      // Initialize auth
      .addCase(initializeAuth.pending, (state) => {
        state.loading = true;
      })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(initializeAuth.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
