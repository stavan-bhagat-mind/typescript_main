import { Response } from "express";
import { CODE, STATUS_CODE } from "./common/constants";

interface MetaData {
  code: number;
  message: string;
  [key: string]: any;
}

interface ApiResponse<T> {
  data: T | null;
  meta: MetaData;
  [key: string]: any;
}

export const successResponseData = <T>(
  res: Response,
  data: T,
  statusCode: number,
  message: string,
  extras?: Record<string, any>
): Response => {
  const response: ApiResponse<T> = {
    data,
    meta: {
      code: CODE.SUCCESS,
      message,
    },
  };

  if (extras) {
    Object.keys(extras).forEach((key) => {
      if ({}.hasOwnProperty.call(extras, key)) {
        response.meta[key] = extras[key];
      }
    });
  }

  return res.status(statusCode).json(response);
};

export const successResponseWithoutData = (
  res: Response,
  responseCode: number,
  message: string
): Response => {
  const response: ApiResponse<null> = {
    data: null,
    meta: {
      code: CODE.SUCCESS,
      message,
    },
  };

  return res.status(responseCode).json(response);
};

export const errorResponseWithoutData = (
  res: Response,
  statusCode: number,
  message: string
): Response => {
  const response: ApiResponse<null> = {
    data: null,
    meta: {
      code: CODE.FAIL,
      message,
    },
  };

  return res.status(statusCode).json(response);
};

export const errorResponseData = (
  res: Response,
  statusCode: number,
  message: string,
  extras?: Record<string, any>
): Response => {
  const response: ApiResponse<null> = {
    data: null,
    meta: {
      code: CODE.FAIL,
      message,
    },
  };

  if (extras) {
    Object.keys(extras).forEach((key) => {
      if ({}.hasOwnProperty.call(extras, key)) {
        response[key] = extras[key];
      }
    });
  }

  return res.status(statusCode).json(response);
};

export const validationErrorResponseData = (
  res: Response,
  message: string,
  extras?: Record<string, any>
): Response => {
  const response: ApiResponse<null> = {
    data: null,
    meta: {
      code: CODE.FAIL,
      message,
    },
  };

  if (extras) {
    Object.keys(extras).forEach((key) => {
      if ({}.hasOwnProperty.call(extras, key)) {
        response[key] = extras[key];
      }
    });
  }

  return res.status(STATUS_CODE.STATUS_BAD_REQUEST).json(response);
};

// Commented out functions in the original code
/*
export const errorResponseDataLeave = (
  message: string,
  code: number = CODE.FAIL,
  statusCode: number = STATUS_BAD_REQUEST,
  first_date?: string,
  second_date?: string
): {
  statusCode: number;
  body: string;
  headers: Record<string, string>;
} => {
  const response: ApiResponse<null> = {
    data: null,
    meta: {
      code,
      message,
      first_date,
      second_date,
    },
  };

  return {
    statusCode: statusCode,
    body: JSON.stringify(response),
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'OPTIONS, POST, GET, PUT, DELETE',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  };
};

export const errorResponseWithData = <T>(
  data: T,
  code: number = CODE.FAIL,
  message: string,
  statusCode: number
): {
  statusCode: number;
  body: string;
  headers: Record<string, string>;
} => {
  const response: ApiResponse<T> = {
    data,
    meta: {
      code,
      message,
    },
  };

  return {
    statusCode,
    body: JSON.stringify(response),
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'OPTIONS, POST, GET, PUT, DELETE',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  };
};
*/
