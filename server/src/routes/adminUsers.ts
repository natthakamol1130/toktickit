import { Router, Response } from "express";
import bcrypt from "bcryptjs";
import { getPrisma } from "../prisma.js";
import {
  authenticateToken,
  requireRoles,
  enforcePasswordChange,
  AuthenticatedRequest,
} from "../middleware/authMiddleware.js";

export const adminUsersRouter = Router();

// ---------------------------------------------------------------------------
// 1. GET /api/admin/users (List users with search & filters - Admin ONLY)
// ---------------------------------------------------------------------------
adminUsersRouter.get(
  "/admin/users",
  authenticateToken,
  requireRoles("ADMINISTRATOR"),
  enforcePasswordChange,
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const prisma = getPrisma();
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 10;
      const skip = (page - 1) * limit;

      const search = (req.query.search as string) || "";
      const roleFilter = (req.query.role as string) || "";
      const isActiveFilter = req.query.isActive as string;
      const sortBy = (req.query.sortBy as string) || "id";
      const sortOrder = (req.query.sortOrder as string)?.toLowerCase() === "desc" ? "desc" : "asc";

      const whereClause: any = {};

      if (search.trim()) {
        whereClause.OR = [
          { name: { contains: search.trim(), mode: "insensitive" } },
          { email: { contains: search.trim(), mode: "insensitive" } },
          { department: { contains: search.trim(), mode: "insensitive" } },
        ];
      }

      if (roleFilter && roleFilter !== "ALL") {
        whereClause.role = roleFilter;
      }

      if (isActiveFilter !== undefined && isActiveFilter !== "ALL") {
        whereClause.isActive = isActiveFilter === "true";
      }

      const totalItems = await prisma.user.count({ where: whereClause });
      const users = await prisma.user.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        select: {
          id: true,
          email: true,
          name: true,
          department: true,
          role: true,
          isActive: true,
          mustChangePassword: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      res.status(200).json({
        success: true,
        data: users,
        pagination: {
          totalItems,
          totalPages: Math.ceil(totalItems / limit) || 1,
          currentPage: page,
          pageSize: limit,
        },
      });
    } catch (error) {
      console.error("Fetch Admin Users Error:", error);
      res.status(500).json({
        success: false,
        error: { message: "Failed to fetch users" },
      });
    }
  }
);

// ---------------------------------------------------------------------------
// 2. POST /api/admin/users (Create user with initial password - Admin ONLY)
// ---------------------------------------------------------------------------
adminUsersRouter.post(
  "/admin/users",
  authenticateToken,
  requireRoles("ADMINISTRATOR"),
  enforcePasswordChange,
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const prisma = getPrisma();
      const { email, name, department, role, isActive, initialPassword } = req.body;

      if (!email || typeof email !== "string" || !email.includes("@")) {
        res.status(400).json({
          success: false,
          error: { message: "Valid email address is required" },
        });
        return;
      }

      if (!name || typeof name !== "string" || name.trim().length === 0) {
        res.status(400).json({
          success: false,
          error: { message: "Full Name is required" },
        });
        return;
      }

      const normalizedEmail = email.trim().toLowerCase();
      const existingUser = await prisma.user.findUnique({
        where: { email: normalizedEmail },
      });

      if (existingUser) {
        res.status(409).json({
          success: false,
          error: { message: "A user with this email address already exists" },
        });
        return;
      }

      const tempPassword = initialPassword || "InitialPassword123!";
      const passwordHash = await bcrypt.hash(tempPassword, 10);

      const newUser = await prisma.user.create({
        data: {
          email: normalizedEmail,
          name: name.trim(),
          department: department ? department.trim() : null,
          role: role || "REQUESTER",
          isActive: isActive !== undefined ? Boolean(isActive) : true,
          passwordHash,
          mustChangePassword: true,
        },
        select: {
          id: true,
          email: true,
          name: true,
          department: true,
          role: true,
          isActive: true,
          mustChangePassword: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      res.status(201).json({
        success: true,
        data: newUser,
      });
    } catch (error) {
      console.error("Create User Error:", error);
      res.status(500).json({
        success: false,
        error: { message: "Failed to create user" },
      });
    }
  }
);

// ---------------------------------------------------------------------------
// 3. PATCH /api/admin/users/:id (Edit user profile or activation status)
// ---------------------------------------------------------------------------
adminUsersRouter.patch(
  "/admin/users/:id",
  authenticateToken,
  requireRoles("ADMINISTRATOR"),
  enforcePasswordChange,
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const prisma = getPrisma();
      const targetUserId = parseInt(req.params.id, 10);

      if (isNaN(targetUserId)) {
        res.status(400).json({
          success: false,
          error: { message: "Invalid user ID" },
        });
        return;
      }

      const targetUser = await prisma.user.findUnique({
        where: { id: targetUserId },
      });

      if (!targetUser) {
        res.status(404).json({
          success: false,
          error: { message: "User not found" },
        });
        return;
      }

      const { name, email, department, role, isActive } = req.body;

      // Prevent self-deactivation
      if (req.user!.id === targetUserId && isActive === false) {
        res.status(400).json({
          success: false,
          error: { message: "Self-deactivation of Administrator account is prohibited" },
        });
        return;
      }

      // Prevent deactivating or downgrading the last active Administrator account
      if (targetUser.role === "ADMINISTRATOR" && (isActive === false || (role && role !== "ADMINISTRATOR"))) {
        const activeAdminCount = await prisma.user.count({
          where: { role: "ADMINISTRATOR", isActive: true },
        });

        if (activeAdminCount <= 1) {
          res.status(400).json({
            success: false,
            error: { message: "Cannot deactivate or downgrade the last active Administrator account" },
          });
          return;
        }
      }

      const updateData: any = {};
      if (name !== undefined) updateData.name = name.trim();
      if (department !== undefined) updateData.department = department ? department.trim() : null;
      if (role !== undefined) updateData.role = role;
      if (isActive !== undefined) updateData.isActive = Boolean(isActive);

      if (email !== undefined && email.trim().toLowerCase() !== targetUser.email) {
        const normalizedEmail = email.trim().toLowerCase();
        const conflictUser = await prisma.user.findUnique({ where: { email: normalizedEmail } });
        if (conflictUser) {
          res.status(409).json({
            success: false,
            error: { message: "Email address is already in use by another account" },
          });
          return;
        }
        updateData.email = normalizedEmail;
      }

      const updatedUser = await prisma.user.update({
        where: { id: targetUserId },
        data: updateData,
        select: {
          id: true,
          email: true,
          name: true,
          department: true,
          role: true,
          isActive: true,
          mustChangePassword: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      res.status(200).json({
        success: true,
        data: updatedUser,
      });
    } catch (error) {
      console.error("Update User Error:", error);
      res.status(500).json({
        success: false,
        error: { message: "Failed to update user" },
      });
    }
  }
);

// ---------------------------------------------------------------------------
// 4. POST /api/admin/users/:id/reset-password (Reset initial password)
// ---------------------------------------------------------------------------
adminUsersRouter.post(
  "/admin/users/:id/reset-password",
  authenticateToken,
  requireRoles("ADMINISTRATOR"),
  enforcePasswordChange,
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const prisma = getPrisma();
      const targetUserId = parseInt(req.params.id, 10);
      const { newInitialPassword } = req.body;

      if (isNaN(targetUserId)) {
        res.status(400).json({
          success: false,
          error: { message: "Invalid user ID" },
        });
        return;
      }

      const targetUser = await prisma.user.findUnique({
        where: { id: targetUserId },
      });

      if (!targetUser) {
        res.status(404).json({
          success: false,
          error: { message: "User not found" },
        });
        return;
      }

      const tempPassword = newInitialPassword || "InitialPassword123!";
      const passwordHash = await bcrypt.hash(tempPassword, 10);

      const updatedUser = await prisma.user.update({
        where: { id: targetUserId },
        data: {
          passwordHash,
          mustChangePassword: true,
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          mustChangePassword: true,
        },
      });

      res.status(200).json({
        success: true,
        message: "Password reset successfully",
        data: updatedUser,
      });
    } catch (error) {
      console.error("Reset Password Error:", error);
      res.status(500).json({
        success: false,
        error: { message: "Failed to reset password" },
      });
    }
  }
);
