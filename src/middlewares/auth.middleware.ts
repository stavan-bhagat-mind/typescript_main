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
) => {
  try {
    const authenticationToken = req.headers["authorization"];
    if (!authenticationToken) {
      return res.status(401).json({
        success: false,
        data: null,
        message: "Authentication token not provided",
      });
    }

    const token = authenticationToken.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_KEY as string) as {
      id: string;
    };
    req.userId = decoded.id;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        success: false,
        data: null,
        message: "Token has expired",
        errorName: error.name,
      });
    } else if (error instanceof jwt.JsonWebTokenError) {
      return res.status(403).json({
        success: false,
        data: null,
        message: "Invalid authentication token",
        errorName: error.name,
      });
    } else {
      return res.status(500).json({
        success: false,
        data: null,
        message: "Internal server error",
      });
    }
  }
};

export default authenticationMiddleware;
