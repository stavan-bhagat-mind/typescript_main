import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

const authenticationMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authenticationToken = req.headers["authorization"];
    if (!authenticationToken) {
      res.status(401).json({
        success: false,
        data: null,
        message: "Authentication token not provided",
      });
      return;
    }

    const token = authenticationToken.split(" ")[1];
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_KEY is not configured");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET) as { id: string };
    req.userId = decoded.id;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({
        success: false,
        data: null,
        message: "Token has expired",
        errorName: error.name,
      });
    } else if (error instanceof jwt.JsonWebTokenError) {
      res.status(403).json({
        success: false,
        data: null,
        message: "Invalid authentication token",
        errorName: error.name,
      });
    } else {
      console.error("Authentication error:", error);
      res.status(500).json({
        success: false,
        data: null,
        message: "Internal server error",
      });
    }
  }
};

export default authenticationMiddleware;
