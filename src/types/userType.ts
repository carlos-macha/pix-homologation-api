import { Request, Response } from "express";

export interface UserLoginRequestBody {
  email: string,
  password: string
}

export interface UserLoginSuccessResponse {
  message: string;
  token: string;
}

export interface UserErrorResponse {
  error: string;
}

export interface ServiceUserResponse {
  status: number;
  message: string;
  token?: string;
};

export interface UserRegisterRequestBody {
  email: string,
  password: string,
  name: string
}

export interface UserRegisterSuccessResponse {
  message: string;
}

export interface ValidateTokenSuccessResponse {
  message: string;
}

export type UserRequestLogin = Request<{}, {}, UserLoginRequestBody>;
export type UserResponseLogin = Response<UserLoginSuccessResponse | UserErrorResponse>;

export type UserRequestRegister = Request<{}, {}, UserRegisterRequestBody>;
export type UserResponseRegister = Response<UserRegisterSuccessResponse | UserErrorResponse>;

export type UserRequestValidateToken = Request;
export type UserResponseValidateToken = Response<ValidateTokenSuccessResponse | UserErrorResponse>;