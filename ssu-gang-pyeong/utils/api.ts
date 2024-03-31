import { IUser } from "../types";
import axiosInstance, { saveToken } from "./config";

type RegisterUserTypes = IUser;

export const registerUser = async ({
  username,
  email,
  school,
  major,
}: RegisterUserTypes) => {
  try {
    const response = await axiosInstance.post("/api/v1/auth/register", {
      username,
      email,
      school,
      major,
    });
    const _token = response.data.token;
    axiosInstance.defaults.headers.common["Authorization"] = _token;
    saveToken(process.env.SSU_USER_TOKEN as string, _token);
    return response.data.user;
  } catch (error) {
    console.log("error in registerUser", error);
    throw error;
  }
};

type LoginUserTypes = Omit<IUser, "username" | "school" | "major">;

export const loginUser = async ({ email }: LoginUserTypes) => {
  try {
    const response = await axiosInstance.post("/api/v1/auth/login", {
      email,
    });
    const _token = response.data.token;
    axiosInstance.defaults.headers.common["Authorization"] = _token;
    saveToken(process.env.SSU_USER_TOKEN as string, _token);
    return response.data.user;
  } catch (error) {
    console.log("error in loginUser", error);
    throw error;
  }
};
