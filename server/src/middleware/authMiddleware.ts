import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { Role } from "@prisma/client";
import { getPrisma } from "../prisma.js";

export const JWT_SECRET = process.env.JWT_SECRET || "toktickit-super-secret-jwt-key-lab3";

export interface AuthUser {
  id: number;
  email: string;
  name: string;
  role: Role;
  isActive: boolean;
  mustChangePassword: boolean;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthUser;
}

export async function extractUserFromRequest(req: Request): Promise<AuthUser | null> {
  let token: string | null = null;

  // 1. Check Authorization Bearer header
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.substring(7);
  } else if (req.headers["x-auth-token"]) {
    // 2. Check x-auth-token fallback header
    token = req.headers["x-auth-token"] as string;
  }

  if (!token) return null;

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number };
    const prisma = getPrisma();
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        mustChangePassword: true,
      },
    });

    if (!user || !user.isActive) return null;
    return user;
  } catch (err) {
    return null;
  }
}

export async function authenticateToken(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  const user = await extractUserFromRequest(req);
  if (!user) {
    res.status(401).json({
      success: false,
      error: { message: "Unauthorized access or inactive account" },
    });
    return;
  }

  req.user = user;
  next();
}

export function requireRoles(...allowedRoles: Role[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: { message: "Authentication required" },
      });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        error: { message: "Forbidden: You do not have permission to access this resource" },
      });
      return;
    }

    next();
  };
}

export function enforcePasswordChange(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void {
  if (req.user && req.user.mustChangePassword && req.path !== "/change-password" && req.path !== "/api/auth/change-password") {
    res.status(403).json({
      success: false,
      error: {
        code: "MUST_CHANGE_PASSWORD",
        message: "You must change your initial password before accessing application features",
      },
    });
    return;
  }
  next();
}
