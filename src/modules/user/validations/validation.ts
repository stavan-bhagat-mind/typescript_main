import Joi from "joi";
import { ROLE } from "../../../utils/common/constants";

interface UserRegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  userType: string;
  contactNumber?: string;
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
    firstName: Joi.string().min(3).max(30).required(),
    lastName: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    userType: Joi.string()
      .valid(...ROLE)
      .required(),
    contactNumber: Joi.string()
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
