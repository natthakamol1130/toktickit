import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import multer from "multer";
import { RequestedPriority } from "@prisma/client";
import { getPrisma } from "./prisma.js";

export const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ensure upload directory exists
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage setup
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${uniqueSuffix}${ext}`);
  },
});

const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp", "application/pdf"];

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (_req, file, cb) => {
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("UNSUPPORTED_FILE_TYPE"));
    }
  },
});

// Middleware to extract and validate Requester ID
function getRequesterId(req: Request): number | null {
  const headerVal = req.headers["x-requester-id"];
  if (!headerVal) return null;
  const parsed = parseInt(Array.isArray(headerVal) ? headerVal[0] : headerVal, 10);
  return isNaN(parsed) ? null : parsed;
}

// Sequence generator helper for Ticket Numbers: TKT-2026-XXXXXX
async function generateTicketNumber(): Promise<string> {
  const prisma = getPrisma();
  const year = new Date().getFullYear();
  const lastTicket = await prisma.ticket.findFirst({
    orderBy: { id: "desc" },
    select: { id: true },
  });
  const randomOffset = Math.floor(Math.random() * 1000);
  const nextId = ((lastTicket?.id || 0) * 10 + randomOffset + 1) % 900000 + 100000;
  return `TKT-${year}-${nextId}`;
}

// ---------------------------------------------------------------------------
// Health Check
// ---------------------------------------------------------------------------
app.get("/api/health", (_req: Request, res: Response) => {
  res.status(200).json({ status: "ok", service: "TokTickIT API" });
});

// ---------------------------------------------------------------------------
// Lab 2 Reference Data REST API Endpoints — Feature 4
// ---------------------------------------------------------------------------

// GET /api/requesters - Active Development Requesters
app.get("/api/requesters", async (_req: Request, res: Response) => {
  try {
    const prisma = getPrisma();
    const requesters = await prisma.requesterUser.findMany({
      where: { isActive: true },
      orderBy: { id: "asc" },
      select: { id: true, name: true, email: true, department: true },
    });
    res.status(200).json({ success: true, data: requesters });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: "Internal server error" } });
  }
});

// GET /api/categories - Active Categories (Consistent payload format: { success: true, data })
app.get("/api/categories", async (_req: Request, res: Response) => {
  try {
    const prisma = getPrisma();
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { id: "asc" },
      select: { id: true, name: true },
    });
    res.status(200).json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: "Internal server error" } });
  }
});

// GET /api/related-systems - Active Related Systems (Consistent payload format: { success: true, data })
app.get("/api/related-systems", async (_req: Request, res: Response) => {
  try {
    const prisma = getPrisma();
    const systems = await prisma.relatedSystem.findMany({
      where: { isActive: true },
      orderBy: { id: "asc" },
      select: { id: true, name: true },
    });
    res.status(200).json({ success: true, data: systems });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: "Internal server error" } });
  }
});

// ---------------------------------------------------------------------------
// Ticket Endpoints
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Ticket Creation API Endpoint — Feature 6
// ---------------------------------------------------------------------------

// POST /api/tickets - Create Ticket with optional attachments
app.post(
  "/api/tickets",
  (req: Request, res: Response, next: NextFunction) => {
    upload.array("files", 5)(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).json({
            success: false,
            error: { code: "FILE_TOO_LARGE", message: "File size exceeds maximum limit of 5MB" },
          });
        }
        return res.status(400).json({ success: false, error: { message: err.message } });
      } else if (err) {
        if (err.message === "UNSUPPORTED_FILE_TYPE") {
          return res.status(400).json({
            success: false,
            error: {
              code: "UNSUPPORTED_FILE_TYPE",
              message: "Allowed file types are JPG, PNG, WEBP, and PDF",
            },
          });
        }
        return res.status(400).json({ success: false, error: { message: err.message } });
      }
      next();
    });
  },
  async (req: Request, res: Response) => {
    try {
      const requesterId = getRequesterId(req);
      if (!requesterId) {
        return res.status(401).json({
          success: false,
          error: { code: "UNAUTHORIZED", message: "Requester identity missing or invalid" },
        });
      }

      const prisma = getPrisma();

      // Verify active requester exists
      const requester = await prisma.requesterUser.findFirst({
        where: { id: requesterId, isActive: true },
      });
      if (!requester) {
        return res.status(403).json({
          success: false,
          error: { code: "FORBIDDEN", message: "Inactive or invalid Development Requester" },
        });
      }

      const { categoryId, relatedSystemId, requestedPriority, summary, description } = req.body;

      // Field validation
      const errors: Record<string, string[]> = {};
      const catId = parseInt(categoryId, 10);
      const sysId = parseInt(relatedSystemId, 10);

      if (!catId || isNaN(catId)) errors.categoryId = ["Category is required"];
      if (!sysId || isNaN(sysId)) errors.relatedSystemId = ["Related System is required"];
      if (!summary || summary.trim().length < 5 || summary.trim().length > 150) {
        errors.summary = ["Summary must be between 5 and 150 characters"];
      }
      if (!description || description.trim().length < 10 || description.trim().length > 2000) {
        errors.description = ["Description must be between 10 and 2000 characters"];
      }

      const validPriorities = ["LOW", "MEDIUM", "HIGH", "URGENT"];
      const priorityVal = (requestedPriority || "MEDIUM").toUpperCase();
      if (!validPriorities.includes(priorityVal)) {
        errors.requestedPriority = ["Invalid requested priority"];
      }

      if (Object.keys(errors).length > 0) {
        return res.status(400).json({
          success: false,
          error: { code: "VALIDATION_ERROR", message: "Validation failed", details: errors },
        });
      }

      const ticketNo = await generateTicketNumber();

      const files = (req.files as Express.Multer.File[]) || [];

      const ticket = await prisma.ticket.create({
        data: {
          ticketNo,
          requesterId,
          categoryId: catId,
          relatedSystemId: sysId,
          requestedPriority: priorityVal as RequestedPriority,
          status: "NEW",
          summary: summary.trim(),
          description: description.trim(),
          attachments: {
            create: files.map((f) => ({
              fileName: f.originalname,
              fileKey: f.filename,
              fileSize: f.size,
              mimeType: f.mimetype,
            })),
          },
        },
        include: {
          category: { select: { id: true, name: true } },
          relatedSystem: { select: { id: true, name: true } },
          attachments: true,
        },
      });

      res.status(201).json({ success: true, data: ticket });
    } catch (error) {
      console.error("Create ticket error:", error);
      res.status(500).json({ success: false, error: { message: "Failed to create ticket" } });
    }
  }
);

// GET /api/tickets - List owned tickets (search, filter, sort, paginate)
app.get("/api/tickets", async (req: Request, res: Response) => {
  try {
    const requesterId = getRequesterId(req);
    if (!requesterId) {
      return res.status(401).json({
        success: false,
        error: { code: "UNAUTHORIZED", message: "Requester identity missing or invalid" },
      });
    }

    const prisma = getPrisma();
    const { search, category, priority, status, page = "1", limit = "10", sortBy = "createdAt", sortOrder = "desc" } = req.query;

    const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
    const limitNum = Math.max(1, Math.min(50, parseInt(limit as string, 10) || 10));
    const skip = (pageNum - 1) * limitNum;

    const where: any = { requesterId };

    if (search && typeof search === "string" && search.trim() !== "") {
      const q = search.trim();
      where.OR = [
        { ticketNo: { contains: q, mode: "insensitive" } },
        { summary: { contains: q, mode: "insensitive" } },
      ];
    }

    if (category) {
      const catId = parseInt(category as string, 10);
      if (!isNaN(catId)) where.categoryId = catId;
    }

    if (priority && typeof priority === "string" && priority !== "ALL") {
      where.requestedPriority = priority.toUpperCase();
    }

    if (status && typeof status === "string" && status !== "ALL") {
      where.status = status.toUpperCase();
    }

    const orderField = ["createdAt", "ticketNo", "requestedPriority", "status"].includes(sortBy as string)
      ? (sortBy as string)
      : "createdAt";
    const orderDirection = sortOrder === "asc" ? "asc" : "desc";

    const [totalItems, tickets] = await Promise.all([
      prisma.ticket.count({ where }),
      prisma.ticket.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: { [orderField]: orderDirection },
        include: {
          category: { select: { id: true, name: true } },
          relatedSystem: { select: { id: true, name: true } },
          attachments: {
            where: { isRemoved: false },
            select: { id: true },
          },
        },
      }),
    ]);

    const data = tickets.map((t) => ({
      ...t,
      attachmentCount: t.attachments.length,
      attachments: undefined,
    }));

    const totalPages = Math.ceil(totalItems / limitNum) || 1;

    res.status(200).json({
      success: true,
      data,
      meta: {
        page: pageNum,
        limit: limitNum,
        totalItems,
        totalPages,
      },
    });
  } catch (error) {
    console.error("List tickets error:", error);
    res.status(500).json({ success: false, error: { message: "Internal server error" } });
  }
});

export default app;
