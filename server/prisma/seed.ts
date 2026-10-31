import { getPrisma } from "../src/prisma.js";
import bcrypt from "bcryptjs";
import { Role, RequestedPriority, ITPriority, TicketStatus } from "@prisma/client";

async function main() {
  const prisma = getPrisma();

  console.log("Seeding Lab 3 database...");

  // 1. Seed Categories
  const categories = [
    "Account and Access",
    "Hardware",
    "Software",
    "Network",
  ];

  const categoryMap: Record<string, number> = {};
  for (const name of categories) {
    const cat = await prisma.category.upsert({
      where: { name },
      update: { isActive: true },
      create: { name, isActive: true },
    });
    categoryMap[name] = cat.id;
  }

  // 2. Seed Related Systems
  const relatedSystems = [
    "Email",
    "Campus Wi-Fi",
    "VPN",
    "LEB2 App",
    "Grade Submission App",
    "Printer",
    "Corporate Laptop",
  ];

  const systemMap: Record<string, number> = {};
  for (const name of relatedSystems) {
    const sys = await prisma.relatedSystem.upsert({
      where: { name },
      update: { isActive: true },
      create: { name, isActive: true },
    });
    systemMap[name] = sys.id;
  }

  // Standard hashed password: "InitialPassword123!" and "Password123!"
  const initialPasswordHash = await bcrypt.hash("InitialPassword123!", 10);
  const standardPasswordHash = await bcrypt.hash("Password123!", 10);

  // 3. Seed Users (Requesters, IT Staff, Administrator)
  const usersData = [
    // Requesters (4 active, 1 inactive)
    {
      email: "jennifer.anderson@toktickit.com",
      name: "Jennifer Anderson",
      department: "Computer Engineering",
      role: Role.REQUESTER,
      isActive: true,
      mustChangePassword: true, // For testing mandatory first-login password change
      passwordHash: initialPasswordHash,
    },
    {
      email: "michael.brown@toktickit.com",
      name: "Michael Brown",
      department: "Information Technology",
      role: Role.REQUESTER,
      isActive: true,
      mustChangePassword: false,
      passwordHash: standardPasswordHash,
    },
    {
      email: "sarah.johnson@toktickit.com",
      name: "Sarah Johnson",
      department: "Electronic Engineering",
      role: Role.REQUESTER,
      isActive: true,
      mustChangePassword: false,
      passwordHash: standardPasswordHash,
    },
    {
      email: "david.lee@toktickit.com",
      name: "David Lee",
      department: "Software Engineering",
      role: Role.REQUESTER,
      isActive: true,
      mustChangePassword: false,
      passwordHash: standardPasswordHash,
    },
    {
      email: "inactive.requester@toktickit.com",
      name: "Inactive Requester Account",
      department: "Archived",
      role: Role.REQUESTER,
      isActive: false,
      mustChangePassword: false,
      passwordHash: standardPasswordHash,
    },

    // IT Staff (3 active, 1 inactive)
    {
      email: "kevin.patel@toktickit.com",
      name: "Kevin Patel",
      department: "IT Support Desk",
      role: Role.IT_STAFF,
      isActive: true,
      mustChangePassword: false,
      passwordHash: standardPasswordHash,
    },
    {
      email: "emily.davis@toktickit.com",
      name: "Emily Davis",
      department: "Network Operations",
      role: Role.IT_STAFF,
      isActive: true,
      mustChangePassword: false,
      passwordHash: standardPasswordHash,
    },
    {
      email: "lisa.martinez@toktickit.com",
      name: "Lisa Martinez",
      department: "Systems Administration",
      role: Role.IT_STAFF,
      isActive: true,
      mustChangePassword: false,
      passwordHash: standardPasswordHash,
    },
    {
      email: "inactive.staff@toktickit.com",
      name: "Inactive Staff Account",
      department: "IT Staff Archived",
      role: Role.IT_STAFF,
      isActive: false,
      mustChangePassword: false,
      passwordHash: standardPasswordHash,
    },

    // Administrator (1 active)
    {
      email: "john.smith@toktickit.com",
      name: "John Smith",
      department: "System Administration",
      role: Role.ADMINISTRATOR,
      isActive: true,
      mustChangePassword: false,
      passwordHash: standardPasswordHash,
    },
  ];

  const userMap: Record<string, number> = {};
  for (const u of usersData) {
    const user = await prisma.user.upsert({
      where: { email: u.email },
      update: {
        name: u.name,
        department: u.department,
        role: u.role,
        isActive: u.isActive,
        mustChangePassword: u.mustChangePassword,
      },
      create: u,
    });
    userMap[u.email] = user.id;

    // Maintain RequesterUser table compatibility
    if (u.role === Role.REQUESTER) {
      await prisma.requesterUser.upsert({
        where: { email: u.email },
        update: { name: u.name, department: u.department || "", isActive: u.isActive },
        create: { name: u.name, email: u.email, department: u.department || "", isActive: u.isActive },
      });
    }
  }

  // 4. Seed Realistic Tickets
  const sampleTickets = [
    {
      ticketNo: "TKT-2026-001234",
      requesterEmail: "jennifer.anderson@toktickit.com",
      categoryName: "Hardware",
      systemName: "Corporate Laptop",
      requestedPriority: RequestedPriority.MEDIUM,
      itPriority: ITPriority.MEDIUM,
      status: TicketStatus.IN_PROGRESS,
      ownerEmail: "kevin.patel@toktickit.com",
      summary: "Laptop battery drains quickly",
      description: "My laptop battery is draining much faster than usual even when idling.",
      requesterResolvedInd: false,
    },
    {
      ticketNo: "TKT-2026-001233",
      requesterEmail: "michael.brown@toktickit.com",
      categoryName: "Network",
      systemName: "VPN",
      requestedPriority: RequestedPriority.HIGH,
      itPriority: ITPriority.HIGH,
      status: TicketStatus.OPEN,
      ownerEmail: null,
      summary: "Cannot connect to VPN",
      description: "Getting timeout error when authenticating through corporate VPN client.",
      requesterResolvedInd: false,
    },
    {
      ticketNo: "TKT-2026-001232",
      requesterEmail: "david.lee@toktickit.com",
      categoryName: "Software",
      systemName: "Email",
      requestedPriority: RequestedPriority.MEDIUM,
      itPriority: ITPriority.MEDIUM,
      status: TicketStatus.IN_PROGRESS,
      ownerEmail: "emily.davis@toktickit.com",
      summary: "Email not syncing on mobile",
      description: "Outlook application on Android mobile device fails to fetch new emails.",
      requesterResolvedInd: false,
    },
    {
      ticketNo: "TKT-2026-001231",
      requesterEmail: "jennifer.anderson@toktickit.com",
      categoryName: "Account and Access",
      systemName: "LEB2 App",
      requestedPriority: RequestedPriority.LOW,
      itPriority: ITPriority.LOW,
      status: TicketStatus.RESOLVED,
      ownerEmail: "lisa.martinez@toktickit.com",
      summary: "New employee setup request",
      description: "Please provision standard LEB2 course access for new TA starting next week.",
      requesterResolvedInd: true,
    },
    {
      ticketNo: "TKT-2026-001235",
      requesterEmail: "jennifer.anderson@toktickit.com",
      categoryName: "Account and Access",
      systemName: "Email",
      requestedPriority: RequestedPriority.MEDIUM,
      itPriority: null,
      status: TicketStatus.NEW,
      ownerEmail: null,
      summary: "Cannot access department shared mailbox",
      description: "Permission error occurs when attempting to open the engineering faculty shared inbox.",
      requesterResolvedInd: false,
    },
    {
      ticketNo: "TKT-2026-001236",
      requesterEmail: "michael.brown@toktickit.com",
      categoryName: "Network",
      systemName: "Campus Wi-Fi",
      requestedPriority: RequestedPriority.LOW,
      itPriority: ITPriority.LOW,
      status: TicketStatus.WAITING_FOR_REQUESTER,
      ownerEmail: "kevin.patel@toktickit.com",
      summary: "Intermittent Wi-Fi drops in library basement",
      description: "Connection drops every 10-15 minutes on floor B1 near study carrels.",
      requesterResolvedInd: false,
    },
    {
      ticketNo: "TKT-2026-001237",
      requesterEmail: "jennifer.anderson@toktickit.com",
      categoryName: "Hardware",
      systemName: "Printer",
      requestedPriority: RequestedPriority.LOW,
      itPriority: ITPriority.LOW,
      status: TicketStatus.CLOSED,
      ownerEmail: "lisa.martinez@toktickit.com",
      summary: "Faculty printer paper jam cleared",
      description: "Main laser printer had mechanical roller jam and tray 2 feeder error.",
      requesterResolvedInd: true,
    },
    {
      ticketNo: "TKT-2026-001238",
      requesterEmail: "david.lee@toktickit.com",
      categoryName: "Network",
      systemName: "Campus Wi-Fi",
      requestedPriority: RequestedPriority.HIGH,
      itPriority: ITPriority.HIGH,
      status: TicketStatus.REOPENED,
      ownerEmail: "kevin.patel@toktickit.com",
      summary: "Recurring Wi-Fi dropouts on 3rd floor study area",
      description: "The Wi-Fi issue reported last week has re-occurred during evening study hours.",
      requesterResolvedInd: false,
    },
    {
      ticketNo: "TKT-2026-001239",
      requesterEmail: "michael.brown@toktickit.com",
      categoryName: "Software",
      systemName: "LEB2 App",
      requestedPriority: RequestedPriority.LOW,
      itPriority: null,
      status: TicketStatus.CANCELLED,
      ownerEmail: null,
      summary: "Duplicate ticket for course registration issue",
      description: "Created by mistake; original ticket is already being handled under ticket 001235.",
      requesterResolvedInd: false,
    },
  ];

  const ticketMap: Record<string, number> = {};

  for (const t of sampleTickets) {
    const requesterId = userMap[t.requesterEmail];
    const ownerId = t.ownerEmail ? userMap[t.ownerEmail] : null;
    const categoryId = categoryMap[t.categoryName];
    const relatedSystemId = systemMap[t.systemName];

    const createdTicket = await prisma.ticket.upsert({
      where: { ticketNo: t.ticketNo },
      update: {
        status: t.status,
        itPriority: t.itPriority,
        ownerId: ownerId,
        requesterResolvedInd: t.requesterResolvedInd,
      },
      create: {
        ticketNo: t.ticketNo,
        requesterId,
        ownerId,
        categoryId,
        relatedSystemId,
        requestedPriority: t.requestedPriority,
        itPriority: t.itPriority,
        status: t.status,
        summary: t.summary,
        description: t.description,
        requesterResolvedInd: t.requesterResolvedInd,
      },
    });

    ticketMap[t.ticketNo] = createdTicket.id;

    // Seed comments/notes for TKT-2026-001234
    if (t.ticketNo === "TKT-2026-001234") {
      await prisma.publicComment.createMany({
        data: [
          {
            ticketId: createdTicket.id,
            authorId: userMap["jennifer.anderson@toktickit.com"],
            content: "Just adding that this issue occurs even when I close all applications.",
            createdAt: new Date("2026-05-12T09:20:00Z"),
          },
          {
            ticketId: createdTicket.id,
            authorId: userMap["kevin.patel@toktickit.com"],
            content: "We are investigating the issue on your device. We will update you shortly.",
            createdAt: new Date("2026-05-13T10:30:00Z"),
          },
        ],
        skipDuplicates: true,
      });

      await prisma.internalNote.createMany({
        data: [
          {
            ticketId: createdTicket.id,
            authorId: userMap["kevin.patel@toktickit.com"],
            content: "Ran battery diagnostics. Wear level is at 45%. Ordering replacement battery unit.",
            createdAt: new Date("2026-05-13T10:35:00Z"),
          },
        ],
        skipDuplicates: true,
      });
    }
  }

  // ---------------------------------------------------------------------------
  // 5. Seed Actions Taken for Lab 4
  // ---------------------------------------------------------------------------
  console.log("Seeding Actions Taken for Lab 4...");

  // Remove existing actions for idempotency
  await prisma.actionTaken.deleteMany({
    where: {
      ticketId: { in: Object.values(ticketMap) },
    },
  });

  const actionsData = [
    // Multiple Actions Taken on TKT-2026-001234 (Multi-staff collaborative remediation)
    {
      ticketId: ticketMap["TKT-2026-001234"],
      performerId: userMap["kevin.patel@toktickit.com"],
      actionDateTime: new Date("2026-05-12T09:30:00Z"),
      description: "Ran comprehensive battery diagnostic test and examined voltage regulator readings.",
      result: "Battery health is at 45% of design capacity. Hardware replacement required.",
      followUpRequired: true,
      followUpNote: "Order replacement battery pack SKU-BAT-882 from authorized supplier.",
      attachmentNotes: "battery_diagnostic_report.png",
    },
    {
      ticketId: ticketMap["TKT-2026-001234"],
      performerId: userMap["emily.davis@toktickit.com"],
      actionDateTime: new Date("2026-05-12T14:15:00Z"),
      description: "Received replacement battery pack SKU-BAT-882 from storage and verified component compatibility.",
      result: "New battery pack passed preliminary resistance and terminal voltage testing.",
      followUpRequired: true,
      followUpNote: "Notify Kevin Patel to coordinate device handover with Requester.",
      attachmentNotes: "part_inspection_cert.pdf",
    },
    {
      ticketId: ticketMap["TKT-2026-001234"],
      performerId: userMap["kevin.patel@toktickit.com"],
      actionDateTime: new Date("2026-05-13T11:00:00Z"),
      description: "Installed new battery unit into laptop chassis and completed full thermal calibration cycle.",
      result: "Device completed full charge and discharge cycle with 100% capacity verified.",
      followUpRequired: false,
      followUpNote: null,
      attachmentNotes: "final_qa_checklist.png",
    },

    // 1 Action Taken on TKT-2026-001232 (In Progress)
    {
      ticketId: ticketMap["TKT-2026-001232"],
      performerId: userMap["emily.davis@toktickit.com"],
      actionDateTime: new Date("2026-05-11T13:45:00Z"),
      description: "Checked Exchange ActiveSync protocol logs and verified mail routing policies.",
      result: "Device partnership corrupted in Exchange mailbox server. Stale partnership removed.",
      followUpRequired: false,
      followUpNote: null,
      attachmentNotes: null,
    },

    // 1 Action Taken on TKT-2026-001236 (Waiting for Requester with follow-up note)
    {
      ticketId: ticketMap["TKT-2026-001236"],
      performerId: userMap["kevin.patel@toktickit.com"],
      actionDateTime: new Date("2026-05-10T15:20:00Z"),
      description: "Re-sent authentication instructions and requested client browser console error log.",
      result: "Email sent to requester with detailed troubleshooting screenshots.",
      followUpRequired: true,
      followUpNote: "Wait 48 hours for requester response before escalating.",
      attachmentNotes: "instructions_guide.pdf",
    },

    // 1 Action Taken on TKT-2026-001231 (Resolved ticket)
    {
      ticketId: ticketMap["TKT-2026-001231"],
      performerId: userMap["lisa.martinez@toktickit.com"],
      actionDateTime: new Date("2026-05-09T16:00:00Z"),
      description: "Provisioned LEB2 course instructor permissions and synchronized active directory role.",
      result: "Account provisioned and verified active in production cluster.",
      followUpRequired: false,
      followUpNote: null,
      attachmentNotes: null,
    },

    // 1 Action Taken on TKT-2026-001237 (Closed ticket)
    {
      ticketId: ticketMap["TKT-2026-001237"],
      performerId: userMap["lisa.martinez@toktickit.com"],
      actionDateTime: new Date("2026-05-08T10:30:00Z"),
      description: "Configured static IP reservation for departmental laser printer on Subnet 10.20.4.0/24.",
      result: "Printer rebooted and network connectivity verified via SNMP ping.",
      followUpRequired: false,
      followUpNote: null,
      attachmentNotes: null,
    },

    // 2 Actions Taken on TKT-2026-001238 (Reopened ticket)
    {
      ticketId: ticketMap["TKT-2026-001238"],
      performerId: userMap["kevin.patel@toktickit.com"],
      actionDateTime: new Date("2026-05-07T08:45:00Z"),
      description: "Investigated recurring Wi-Fi disconnection reports on 3rd floor access points.",
      result: "Interference detected on channel 6 from rogue AP.",
      followUpRequired: true,
      followUpNote: "Locate rogue AP and adjust channel plan.",
      attachmentNotes: null,
    },
    {
      ticketId: ticketMap["TKT-2026-001238"],
      performerId: userMap["emily.davis@toktickit.com"],
      actionDateTime: new Date("2026-05-07T14:30:00Z"),
      description: "Surveyed 3rd floor with RF spectrum analyzer and repositioned AP-302.",
      result: "Signal strength improved to -58dBm across all study areas.",
      followUpRequired: false,
      followUpNote: null,
      attachmentNotes: "rf_heat_map.png",
    },
  ];

  await prisma.actionTaken.createMany({
    data: actionsData.filter((a) => a.ticketId),
  });

  console.log("Seeding completed successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await getPrisma().$disconnect();
  });
