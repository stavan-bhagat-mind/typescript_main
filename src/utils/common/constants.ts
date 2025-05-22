export const ROLE = ["user", "admin"];
export const SERVICE_NAME = "gmail";
export const LOGIN_TYPE = {
  GOOGLE: "google",
  EMAIL: "email",
  GITHUB: "github",
};
export const CATEGORY = {
  USER: "User",
  EVENT: "Event",
  BOOKING: "Booking",
  PAYMENT: "Payment",
  SUBSCRIPTION: "Subscription",
  EMAIL: "Email",
  NOTIFICATION: "Notification",
  SUBSCRIPTION_STATUS: "subscription status",
};
export const CODE = {
  SUCCESS: 1,
  FAIL: 0,
};
// http-Status-Codes
export const STATUS_CODE = {
  STATUS_SUCCESS: 200,
  STATUS_CREATED: 201,
  STATUS_BAD_REQUEST: 400,
  STATUS_UNAUTHORIZED: 401,
  STATUS_NOT_FOUND: 404,
  STATUS_INTERNAL_SERVER_ERROR: 500,
  STATUS_FORBIDDEN: 403,
  STATUS_TOKEN_EXPIRED: 419,
  STATUS_STATUS_CONFLICT: 409,
  STATUS_TO_MANY_REQUEST: 429,
};
// Subscription subject messages
export const EMAIL = {
  SUBJECTS: {
    VERIFICATION: "Verify Your Email Address",
    RESET_PASSWORD: "Reset Your Password",
    SUBSCRIPTION_STARTED: "Welcome to Your Subscription",
    PAYMENT_FAILURE: "Payment Failed for Your Subscription",
    CANCELLATION: "Subscription Cancellation Confirmed",
    EXPIRATION: "Your Subscription Has Expired",
    RENEWAL_STATUS: "Subscription Renewal Status Updated",
    RECOVERY: "Your Subscription Has Been Recovered",
    GRACE_PERIOD_EXPIRED: "Grace Period Ended - Subscription Expired",
  },
};
