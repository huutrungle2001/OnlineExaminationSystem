import axios from "axios";
import {
  LoginArgs,
  AuthResponse,
  RegisterArgs,
  InviteFriendArgs,
  GetMeResponse,
  AddMembersToGroupArgs,
  LeaveGroupArgs,
  RemoveFriendArgs,
  DeleteGroupArgs,
  ForgotPasswordResponse,
  ResetPasswordArgs,
  RegisterResponse,
} from "./types";
//import jwtDecode from "jwt-decode";

const BASE_URL = "http://192.168.1.148:5000";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 3000,
});

api.interceptors.request.use(
  async (config) => {
    const userDetails: any = localStorage.getItem("currentUser");

    if (userDetails) {
      const token = JSON.parse(userDetails).token;
      config.headers!["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

const logOut = () => {
  localStorage.clear();
  window.location.pathname = "/login";
};

const checkForAuthorization = (error: any) => {
  const responseCode = error?.response?.status;

  if (responseCode) {
    responseCode === 401 && logOut();
  }
};

export const login = async ({ email, password }: LoginArgs) => {
  try {
    const res = await api.post<AuthResponse>("/api/auth/login", {
      email,
      password,
    });

    return res.data;
  } catch (err: any) {
    return {
      error: true,
      message: err.response.data,
    };
  }
};

export const register = async ({ email, password, username }: RegisterArgs) => {
  try {
    //const res = await api.post<AuthResponse>("/api/auth/register", {
    const res = await api.post<RegisterResponse>("/api/auth/register", {
      email,
      password,
      username,
    });
    return res;
  } catch (err: any) {
    return {
      error: true,
      message: err.response.data,
    };
  }
};

// protected routes

export const getMe = async () => {
  try {
    const res = await api.get<GetMeResponse>("/api/auth/me");

    return {
      me: res.data.me,
      statusCode: 200,
    };
  } catch (err: any) {
    return {
      error: true,
      message: err.response.data,
      statusCode: err?.response?.status,
    };
  }
};