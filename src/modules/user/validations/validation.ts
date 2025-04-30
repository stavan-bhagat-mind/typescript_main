import Joi from "joi";
import { ROLE } from "../../../utils/common/constants";

interface UserRegisterData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  user_type: string;
  contact_number?: string;
}

interface ValidationResult {
  success: boolean;
  value: UserRegisterData;
  error?: string;
}

export const validateUserRegister = (
  data: UserRegisterData
): ValidationResult => {
  const userValidationSchema = Joi.object<UserRegisterData>({
    first_name: Joi.string().min(3).max(30).required(),
    last_name: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    user_type: Joi.string()
      .valid(...ROLE)
      .required(),
    contact_number: Joi.string()
      .pattern(/^[0-9]{10}$/)
      .messages({ "string.pattern.base": `Phone number must have 10 digits.` })
      .optional(),
  });

  const { error, value } = userValidationSchema.validate(data);
  return {
    success: !error,
    value: value,
    error: error?.details[0].message,
  };
};

// login validation
interface UserLoginData {
  email: string;
  password: string;
}
export const validateUserLogin = (data: UserLoginData): ValidationResult => {
  const userValidationSchema = Joi.object<UserRegisterData>({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  });

  const { error, value } = userValidationSchema.validate(data);
  return {
    success: !error,
    value: value,
    error: error?.details[0].message,
  };
};
