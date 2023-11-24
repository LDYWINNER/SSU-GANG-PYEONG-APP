import { IUser } from "../types";
import axiosInstance, { SSU_TOKEN_NAME, saveToken } from "./config";

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
    saveToken(SSU_TOKEN_NAME, _token);
    return response.data.user;
  } catch (error) {
    console.log("error in loginUser", error);
    throw error;
  }
};
