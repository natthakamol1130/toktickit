import { Router, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getPrisma } from "../prisma.js";
import {
  authenticateToken,
  AuthenticatedRequest,
  JWT_SECRET,
} from "../middleware/authMiddleware.js";

export const authRouter = Router();

// POST /api/auth/login
authRouter.post("/login", async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        success: false,
        error: { message: "Email and password are required" },
      });
      return;
    }

    const prisma = getPrisma();
    const user = await prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() },
    });

    if (!user) {
      res.status(401).json({
        success: false,
        error: { message: "Invalid email or password" },
      });
      return;
    }

    if (!user.isActive) {
      res.status(401).json({
        success: false,
        error: { message: "Account is disabled. Please contact Administrator." },
      });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      res.status(401).json({
        success: false,
        error: { message: "Invalid email or password" },
      });
      return;
    }

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: "24h",
    });

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        mustChangePassword: user.mustChangePassword,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: "Internal server error" },
    });
  }
});

// POST /api/auth/logout
authRouter.post("/logout", authenticateToken, (_req: AuthenticatedRequest, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});

// GET /api/auth/me
authRouter.get("/me", authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
});

// POST /api/auth/change-password
authRouter.post("/change-password", authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      res.status(400).json({
        success: false,
        error: { message: "Current password and new password are required" },
      });
      return;
    }

    if (newPassword.length < 8) {
      res.status(400).json({
        success: false,
        error: { message: "New password must be at least 8 characters long" },
      });
      return;
    }

    const prisma = getPrisma();
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
    });

    if (!user) {
      res.status(404).json({
        success: false,
        error: { message: "User not found" },
      });
      return;
    }

    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isMatch) {
      res.status(400).json({
        success: false,
        error: { message: "Current password is incorrect" },
      });
      return;
    }

    const newPasswordHash = await bcrypt.hash(newPassword, 10);
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash: newPasswordHash,
        mustChangePassword: false,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        mustChangePassword: true,
      },
    });

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: "Internal server error" },
    });
  }
});
