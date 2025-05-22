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
import {
  CATEGORY,
  STATUS_CODE,
  LOGIN_TYPE,
  ROLE,
} from "../../../utils/common/constants";
import { ref } from "process";

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
    const userData = {
      first_name: value.first_name,
      last_name: value.last_name,
      email: value.email,
      user_type: value.user_type,
      password: hashedPassword,
      contact_number: value.contact_number,
      auth_method: LOGIN_TYPE.EMAIL,
    };

    const user = await sequelize.models.User.create(userData);

    successResponseData(
      res,
      userData,
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
    const user = await sequelize.models.User.findOne({
      where: { email: value.email },
    });
    if (!user) {
      errorResponseWithoutData(
        res,
        STATUS_CODE.STATUS_NOT_FOUND,
        COMMON_MSG.NOT_FOUND.replace("##", USER)
      );
      return;
    }

    if (user.dataValues.auth_method !== LOGIN_TYPE.GOOGLE) {
      errorResponseWithoutData(
        res,
        STATUS_CODE.STATUS_FORBIDDEN,
        MESSAGES.MSG_ACCOUNT_ASSOCIATED_WITH_GOOGLE
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
        name: user.dataValues.first_name + " " + user.dataValues.last_name,
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

// Get User
export async function getUserHandler(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const userId = req.userId;
    const user = await sequelize.models.User.findByPk(userId);
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

interface OAuthUser {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  provider: string;
  profileUrl?: string; // Added for profile URL from OAuth
  accessToken: string;
  refreshToken: string | null;
  username?: string;
}

// Handle OAuth (Google or GitHub)
export async function handleOAuth(req: Request, res: Response): Promise<void> {
  try {
    if (!req.user) {
      console.warn("OAuth failed: No user data received");
      errorResponseWithoutData(
        res,
        STATUS_CODE.STATUS_UNAUTHORIZED,
        MESSAGES.MSG_INVALID_CREDENTIALS
      );
      return;
    }

    const {
      id: oauthId,
      firstName,
      lastName,
      email,
      provider: authProvider,
      profileUrl,
      username,
      accessToken,
      refreshToken,
    } = req.user as OAuthUser;

    // Validate provider
    console.log("user------", req.user);
    const normalizedProvider = authProvider;
    if (!Object.values(LOGIN_TYPE).includes(normalizedProvider)) {
      console.warn(`OAuth failed: Invalid provider ${authProvider}`);
      errorResponseWithoutData(
        res,
        STATUS_CODE.STATUS_BAD_REQUEST,
        `Invalid provider: ${authProvider}`
      );
      return;
    }

    // Validate email
    if (!email) {
      console.warn(`${authProvider} auth failed: No email provided`);
      errorResponseWithoutData(
        res,
        STATUS_CODE.STATUS_BAD_REQUEST,
        `No email provided by ${authProvider}`
      );
      return;
    }

    // Check if user exists
    let user = await sequelize.models.User.findOne({
      where: { email },
    });

    // Handle existing user with different auth_method
    if (user && user.dataValues.auth_method !== normalizedProvider) {
      console.warn(
        `${authProvider} auth attempt failed: Email ${email} registered with ${user.dataValues.auth_method}`
      );
      errorResponseWithoutData(
        res,
        STATUS_CODE.STATUS_FORBIDDEN,
        `This email is registered with ${user.dataValues.auth_method.toLowerCase()} login. Please use that method or link your ${authProvider} account.`
      );
      return;
    }

    // Prepare user data for creation or update
    const userData: any = {
      first_name: firstName || "Unknown",
      last_name: lastName || "User",
      email,
      auth_method: normalizedProvider,
      profile_url: profileUrl || null,
    };

    // Set provider-specific ID
    if (normalizedProvider === LOGIN_TYPE.GOOGLE) {
      userData.google_id = oauthId;
    } else if (normalizedProvider === LOGIN_TYPE.GITHUB) {
      userData.github_id = oauthId;
    }

    // Create or update user
    if (!user) {
      user = await sequelize.models.User.create({
        ...userData,
        created_at: new Date(),
        updated_at: new Date(),
      });
      console.log(`New ${authProvider} user created: ${email}`);
    } else {
      // Update existing user with OAuth-specific fields
      await user.update({
        ...userData,
        updated_at: new Date(),
      });
      console.log(`Updated ${authProvider} user: ${email}`);
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.dataValues.id, email: user.dataValues.email },
      process.env.JWT_SECRET as string,
      { expiresIn: process.env.JWT_EXPIRY_TIME ?? "1h" } as jwt.SignOptions
    );

    // Send success response
    successResponseData(
      res,
      {
        id: user.dataValues.id,
        name: `${user.dataValues.first_name} ${user.dataValues.last_name}`,
        email: user.dataValues.email,
        token,
        auth_method: user.dataValues.auth_method,
        profile_url: user.dataValues.profile_url,
        accessToken,
        refreshToken,
        username,
      },
      STATUS_CODE.STATUS_SUCCESS,
      MESSAGES.MSG_USER_LOGGED_IN_SUCCESS
    );
  } catch (error) {
    console.error(`OAuth error: ${(error as Error).message}`);
    errorResponseWithoutData(
      res,
      STATUS_CODE.STATUS_INTERNAL_SERVER_ERROR,
      MESSAGES.INTERNAL_SERVER_ERROR
    );
  }
}
