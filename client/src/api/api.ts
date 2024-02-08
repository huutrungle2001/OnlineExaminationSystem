import axios from "axios";
import {
  LoginArgs,
  AuthResponse,
  RegisterArgs,
  GetMeResponse,
  RegisterResponse,
} from "./types";
//import jwtDecode from "jwt-decode";

const BASE_URL = "http://localhost:5000";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 3000,
});

api.interceptors.request.use(
  async (config) => {
    const userDetails: any = localStorage.getItem("currentUser");

    if (userDetails !== undefined && userDetails !== null) {
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
    console.log(email, password, username);
    const res = await api.post<RegisterResponse>("/api/auth/register", {
      email,
      password,
      username,
    });
    console.log(res);
    return res;
  } catch (err: any) {
    console.log(err);
    return {
      error: true,
      message: err?.response?.data,
    };
  }
};

// protected routes

export const getMe = async () => {
  try {
    const res = await api.get<GetMeResponse>("/api/auth/me");
    console.log(res);
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

export const getAllUser = async (userId: any) => {
  try {
    const res = await api.get<any>(`/api/user/getAll/${userId}`);
    return {
      users: res.data,
      statusCode: 200,
    };
  } catch (err: any) {
    console.log(err);
    return {
      error: true,
      message: err?.response?.data,
      statusCode: err?.response?.status,
    };
  }
};

export const deleteUser = async (userId: string) => {
  try {
    const res = await api.delete<any>(`/api/user/deleteUser/${userId}`);
    return res;
  } catch (error: any) {
    console.log(error);
    return {
      error: true,
      message: error?.response?.data,
      statusCode: error?.response?.status,
    };
  }
};

export const getAllContest = async () => {
  try {
    const res: any = await api.get<any>(`/api/contest/getAll`);
    console.log("ressssss", res);
    return res;
  } catch (error: any) {
    console.log("error asd", error);
    return {
      error: true,
      message: error,
    };
  }
};

export const createContest = async (
  title: string,
  description: string,
  hostId: any
) => {
  try {
    console.log(title, description, hostId);
    const res = await api.post<any>(`/api/contest/create`, {
      title: title,
      description: description,
      hostId: hostId,
    });
    console.log(res);
    return res;
  } catch (error: any) {
    console.log(error);
    return {
      error: true,
      message: error,
    };
  }
};

export const deleteContest = async (contestId: string) => {
  try {
    const res = await api.delete<any>(`/api/contest/${contestId}`);
    return res;
  } catch (error: any) {
    console.log(error);
    return {
      error: true,
      message: error?.response?.data,
      statusCode: error?.response?.status,
    };
  }
};

export const getContestDetail = async (contestId: any) => {
  try {
    const res = await api.get<any>(`/api/contest/${contestId}`);
    return res;
  } catch (error: any) {
    console.log(error);
    return {
      error: true,
      message: error,
    };
  }
};

export const createFillInBlankQuest = async (contestId: any, data: any) => {
  try {
    const res = await api.post<any>(
      `/api/contest/${contestId}/fillInBlankQuest`,
      data
    );
    console.log(res);
    return res;
  } catch (error: any) {
    console.log(error);
    return {
      error: true,
      message: error,
    };
  }
};

export const deleteFill = async (contestId: any, fillInBlankQuestId: any) => {
  try {
    const res = await api.delete<any>(
      `/api/contest/${contestId}/fillInBlankQuest/${fillInBlankQuestId}`
    );
    return res;
  } catch (error) {
    console.log(error);
    return {
      error: true,
      message: error,
    };
  }
};
export const creatMCQ = async (contestId: any, mCQuest: any) => {
  try {
    console.log(mCQuest);
    const res = await api.post<any>(
      `/api/contest/${contestId}/mcqQuest`,
      mCQuest
    );
    console.log(res);
    return res;
  } catch (error) {
    console.log(error);
    return {
      error: true,
      message: error,
    };
  }
};
