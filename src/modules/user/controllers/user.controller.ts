import { Sequelize, sequelize } from "../../../db/models/index";
import { Request, Response } from "express";
("../../../db/models/index");
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  validateUserRegister,
  validateUserLogin,
  //   validateUserUpdate,
  //   validateResetPassword,
  //   validatePasswordUpdate,
} from "../../user/validations/validation";
import {
  errorResponseWithoutData,
  successResponseData,
  validationErrorResponseData,
  successResponseWithoutData,
} from "../../../utils/response";
import { USER } from "../utils/user.constants";
import dotenv from "dotenv";
dotenv.config();
import { MESSAGES, COMMON_MSG } from "../../../utils/common/messages";
import { CATEGORY, STATUS_CODE } from "../../../utils/common/constants";
const Models = sequelize.models;
console.log("Models", Models);

// Register User
export async function registerHandler(
  req: Request,
  res: Response
): Promise<void> {
  try {
    // validate user input
    const { success, value, error } = validateUserRegister(req.body);
    if (!success) {
      validationErrorResponseData(res, error || COMMON_MSG.VALIDATION_FAILED);
      return;
    }

    // Check for existing user
    const existingUser = await sequelize.models.User.findOne({
      where: { email: value.email },
    });
    if (existingUser) {
      if (!existingUser.dataValues.deleted_at) {
        errorResponseWithoutData(
          res,
          STATUS_CODE.STATUS_BAD_REQUEST,
          COMMON_MSG.ALREADY_EXISTS.replace("##", USER)
        );
        return;
      }
    }
    const hashedPassword = await bcrypt.hash(value.password, 10);
    // Create new user
    const user = await Models.User.create({
      first_name: value.first_name,
      last_name: value.last_name,
      email: value.email,
      user_type: value.user_type,
      password: hashedPassword,
      contact_number: value.contact_number,
    });

    successResponseData(
      res,
      user,
      STATUS_CODE.STATUS_CREATED,
      COMMON_MSG.CREATED_SUCCESS.replace("##", USER)
    );
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Registration error: ${error.message}`);
      errorResponseWithoutData(
        res,
        STATUS_CODE.STATUS_INTERNAL_SERVER_ERROR,
        MESSAGES.INTERNAL_SERVER_ERROR
      );
    }
  }
}

// User Login
export async function loginHandler(req: Request, res: Response): Promise<void> {
  try {
    const { success, value, error } = validateUserLogin(req.body);
    if (!success) {
      validationErrorResponseData(res, error || COMMON_MSG.VALIDATION_FAILED);
      return;
    }
    // Find user
    const user = await Models.User.findOne({ where: { email: value.email } });
    if (!user) {
      errorResponseWithoutData(
        res,
        STATUS_CODE.STATUS_NOT_FOUND,
        COMMON_MSG.NOT_FOUND.replace("##", USER)
      );
      return;
    }

    // Check password
    const isMatch = await bcrypt.compare(
      value.password,
      user.dataValues.password
    );

    if (!isMatch) {
      errorResponseWithoutData(
        res,
        STATUS_CODE.STATUS_FORBIDDEN,
        MESSAGES.MSG_INVALID_CREDENTIALS
      );
      return;
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.dataValues.id, email: user.dataValues.email },
      process.env.JWT_SECRET as string,
      { expiresIn: process.env.JWT_EXPIRY_TIME ?? "1h" } as jwt.SignOptions
    );

    const refreshToken = jwt.sign(
      { id: user.dataValues.id, email: user.dataValues.email },
      process.env.JWT_REFRESH_KEY as string,
      {
        expiresIn: process.env.JWT_REFRESH_EXPIRE_TIME ?? "7d",
      } as jwt.SignOptions
    );
    successResponseData(
      res,
      {
        id: user.dataValues.id,
        name: user.dataValues.firstName + " " + user.dataValues.lastName,
        email: user.dataValues.email,
        userType: user.dataValues.userType,
        token,
        refreshToken,
      },
      STATUS_CODE.STATUS_SUCCESS,
      MESSAGES.MSG_USER_LOGGED_IN_SUCCESS
    );
  } catch (error) {
    if (error instanceof Error) {
      console.error(`login error: ${error.message}`);
      errorResponseWithoutData(
        res,
        STATUS_CODE.STATUS_INTERNAL_SERVER_ERROR,
        MESSAGES.INTERNAL_SERVER_ERROR
      );
    }
  }
}

//Get User
export async function getUserHandler(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const userId = req.userId;
    const user = await Models.User.findByPk(userId);
    if (!user) {
      errorResponseWithoutData(
        res,
        STATUS_CODE.STATUS_NOT_FOUND,
        COMMON_MSG.NOT_FOUND.replace("##", USER)
      );
      return;
    }
    successResponseData(
      res,
      user,
      STATUS_CODE.STATUS_SUCCESS,
      COMMON_MSG.FETCHED_SUCCESS.replace("##", USER)
    );
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Registration error: ${error.message}`);
      errorResponseWithoutData(
        res,
        STATUS_CODE.STATUS_INTERNAL_SERVER_ERROR,
        MESSAGES.INTERNAL_SERVER_ERROR
      );
    }
  }
}
