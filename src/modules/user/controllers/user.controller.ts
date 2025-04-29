import { Sequelize, sequelize } from "../../../db/models/index";
import { Request, Response } from "express";
("../../../db/models/index");
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  validateUserRegister,
  //   validateLogin,
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
import { CATEGORY, STATUS_CODE, APP } from "../../../utils/common/constants";

// Register User
export async function registerHandler(req: Request, res: Response) {
  try {
    // validate user input
    const { success, value, error } = validateUserRegister(req.body);
    if (!success) {
      return validationErrorResponseData(
        res,
        error || COMMON_MSG.VALIDATION_FAILED
      );
    }
    // Check for existing user
    const existingUser = await sequelize.models.User.findOne({
      where: { email: value.email },
    });

    if (existingUser) {
      if (!existingUser.deletedAt) {
        return errorResponseWithoutData(
          res,
          STATUS_STATUS_CONFLICT,
          COMMON_MSG.ALREADY_EXISTS.replace("##", USER)
        );
      }
      // Hash password
      const hashedPassword = await bcrypt.hash(value.password, 10);
      const emailVerificationToken = jwt.sign(
        { email: value.email },
        process.env.VERIFY_SECRET,
        { expiresIn: process.env.VERIFY_EXPIRY_TIME }
      );
      // Create new user
      const user = await Models.User.create({
        firstName: value.firstName,
        lastName: value.lastName,
        email: value.email,
        userType: value.userType,
        password: hashedPassword,
        contactNumber: value.contactNumber,
      });

      // response
      const userResponse = {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        userType: user.userType,
        isEmailVerified: user.isEmailVerified,
        contactNumber: user.contactNumber,
        createdAt: user.createdAt,
      };

      return successResponseData(
        res,
        userResponse,
        STATUS_CREATED,
        MSG_VERIFY_EMAIL
      );
    }
  } catch (error) {
    console.error(`Registration error: ${error.message}`);
    return errorResponseWithoutData(
      res,
      STATUS_INTERNAL_SERVER_ERROR,
      MSG_INTERNAL_SERVER_ERROR
    );
  }
}
