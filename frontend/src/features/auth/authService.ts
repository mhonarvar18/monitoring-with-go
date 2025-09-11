
interface LoginResponse {
  statusCode: number;
  message: string;
  token: string;
}

interface LogoutResponse {
  statusCode: number;
  message: string;
}

interface LoginRequest {
  username: string;
  password: string;
}

interface RegisterRequest {
  username: string;
  password: string;
  confirmPassword?: string;
  fullname: string;
  nationalityCode: string;
  personalCode: string;
  fatherName: string;
  phoneNumber: string;
  locationId: number;
  address: string;
  province?: string;
  city?: string;
}

interface RegisterResponse {
  statusCode: number;
  message: string;
}

export interface User {
  id: string;
  username: string;
  fullname: string;
  nationalityCode: string;
  personalCode: string;
  fatherName: string;
  phoneNumber: string;
  locationId: string;
  address: string;
  status: string;
  type: string;
  ip: string;
  createdAt: string;
  updatedAt: string;
  avatarUrl: string | null;
  ConfirmationTime: string | null;
  version: number;
}

export const login = async (values: LoginRequest): Promise<User> => {
  try {
    const user = await window.go.services.AuthService.Login(values.username, values.password);

    if (!user) throw new Error("User info not returned from backend");

    // ذخیره user در localStorage یا sessionStorage (می‌تونی context هم استفاده کنی)
    localStorage.setItem("user", JSON.stringify(user));

    return user;
  } catch (error: any) {
    const message = error?.message || "خطایی در ورود رخ داد.";
    throw new Error(message);
  }
};

export const logout = async (): Promise<LogoutResponse> => {
  try {
    const token = localStorage.getItem("access_token") || "";
    const result = await window.go.services.AuthService.Logout(token);

    localStorage.removeItem("access_token");
    return result;
  } catch (error: any) {
    localStorage.removeItem("access_token");
    const message = error?.message || "خطایی در خروج رخ داد.";
    throw new Error(message);
  }
};

export const register = async (
  values: RegisterRequest
): Promise<RegisterResponse> => {
  try {
    const result = await window.go.services.AuthService.Register(values);
    return result;
  } catch (error: any) {
    const message = error?.message || "خطا در ثبت نام رخ داد.";
    throw new Error(message);
  }
};
