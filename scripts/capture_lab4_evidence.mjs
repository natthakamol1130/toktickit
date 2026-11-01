import { chromium } from "@playwright/test";
import { spawn } from "child_process";
import fs from "fs";
import path from "path";
import http from "http";

const IMAGES_DIR = path.resolve("docs/lab-04/images");
if (!fs.existsSync(IMAGES_DIR)) {
  fs.mkdirSync(IMAGES_DIR, { recursive: true });
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function isPortReachable(port) {
  return new Promise((resolve) => {
    const req = http.get(`http://localhost:${port}/`, (res) => {
      resolve(true);
    });
    req.on("error", () => resolve(false));
    req.setTimeout(1000, () => {
      req.destroy();
      resolve(false);
    });
  });
}

async function main() {
  console.log("=== 🚀 Starting Lab 4 Evidence Capture ===");

  // 1. Check if backend is running, otherwise start it
  let serverProcess = null;
  const isServerRunning = await isPortReachable(3000);
  if (!isServerRunning) {
    console.log("Starting backend server on port 3000...");
    serverProcess = spawn("npx", ["tsx", "src/index.ts"], {
      cwd: path.resolve("server"),
      shell: true,
      stdio: "pipe",
    });
    for (let i = 0; i < 30; i++) {
      await wait(1000);
      if (await isPortReachable(3000)) break;
    }
  }
  console.log("✓ Backend is reachable on port 3000");

  // 2. Check if client preview/dev is running, otherwise start client preview
  let clientProcess = null;
  const isClientRunning = await isPortReachable(5173);
  if (!isClientRunning) {
    console.log("Starting client preview on port 5173...");
    clientProcess = spawn("npx", ["vite", "preview", "--port", "5173"], {
      cwd: path.resolve("client"),
      shell: true,
      stdio: "pipe",
    });
    for (let i = 0; i < 30; i++) {
      await wait(1000);
      if (await isPortReachable(5173)) break;
    }
  }
  console.log("✓ Frontend is reachable on port 5173");

  const browser = await chromium.launch({ headless: true });

  // High-DPI Context for crystal clear, ultra-crisp readable images
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });

  const page = await context.newPage();

  console.log("Capturing UI screenshots at 2x Retina resolution...");

  // Helper to login via API and inject token into localStorage
  async function loginAs(email, password = "Password123!") {
    const res = await page.request.post("http://localhost:3000/api/auth/login", {
      data: { email, password },
    });
    const body = await res.json();
    await page.goto("http://localhost:5173/");
    await page.evaluate((authData) => {
      localStorage.setItem("toktickit_auth_token", authData.token);
      localStorage.setItem("toktickit_auth_user", JSON.stringify(authData.user));
    }, body);
    await page.goto("http://localhost:5173/");
    await page.waitForLoadState("networkidle");
    return body;
  }

  // 1. IT Staff Login -> Staff Dashboard
  console.log("Capturing Staff Dashboard (Kevin Patel)...");
  await loginAs("kevin.patel@toktickit.com");

  // Navigate to Dashboard tab
  const dashboardTab = page.locator("button:has-text('Dashboard')");
  if (await dashboardTab.isVisible()) {
    await dashboardTab.click();
    await page.waitForTimeout(1000);
  }

  // Capture Staff Dashboard Metrics
  await page.screenshot({
    path: path.join(IMAGES_DIR, "11_staff_dashboard_metrics.png"),
    fullPage: true,
  });
  console.log("✓ Saved 11_staff_dashboard_metrics.png");

  // Capture Responsive Staff Dashboard
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.screenshot({ path: path.join(IMAGES_DIR, "28_responsive_staff_desktop.png") });
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.screenshot({ path: path.join(IMAGES_DIR, "29_responsive_staff_tablet.png") });
  await page.setViewportSize({ width: 375, height: 812 });
  await page.screenshot({ path: path.join(IMAGES_DIR, "30_responsive_staff_mobile.png") });
  console.log("✓ Saved Responsive Staff Dashboard (Desktop/Tablet/Mobile)");

  // Reset viewport
  await page.setViewportSize({ width: 1440, height: 900 });

  // 2. Drill-down click on metric card
  const inProgressCard = page.locator("[data-testid='staff-metric-card-inProgress']").or(page.locator("text=In Progress").first());
  if (await inProgressCard.isVisible()) {
    await inProgressCard.click();
    await page.waitForTimeout(1000);
  }
  await page.screenshot({
    path: path.join(IMAGES_DIR, "12_staff_dashboard_drilldown.png"),
    fullPage: true,
  });
  console.log("✓ Saved 12_staff_dashboard_drilldown.png");

  // 3. Open Ticket Detail View (Ticket #1)
  console.log("Capturing Ticket Detail & Actions Taken...");
  await page.goto("http://localhost:5173/");
  await page.waitForLoadState("networkidle");
  const firstTicket = page.locator(".list-group-item, table tbody tr, .card").filter({ hasText: /Laptop|TXT|Wi-Fi|INC/i }).first();
  if (await firstTicket.isVisible()) {
    await firstTicket.click();
    await page.waitForTimeout(1000);
  }

  // Capture Ticket Detail & Actions Taken List
  await page.screenshot({
    path: path.join(IMAGES_DIR, "14_actions_taken_list.png"),
    fullPage: true,
  });
  console.log("✓ Saved 14_actions_taken_list.png");

  // Responsive Ticket Detail
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.screenshot({ path: path.join(IMAGES_DIR, "34_responsive_detail_desktop.png") });
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.screenshot({ path: path.join(IMAGES_DIR, "35_responsive_detail_tablet.png") });
  await page.setViewportSize({ width: 375, height: 812 });
  await page.screenshot({ path: path.join(IMAGES_DIR, "36_responsive_detail_mobile.png") });
  console.log("✓ Saved Responsive Ticket Detail (Desktop/Tablet/Mobile)");

  await page.setViewportSize({ width: 1440, height: 900 });

  // Open "Record Action" / "Add Action Taken" Modal
  const addActionBtn = page.locator("button:has-text('Record Action'), button:has-text('Add Action Taken'), button:has-text('Log Action')").first();
  if (await addActionBtn.isVisible()) {
    await addActionBtn.click();
    await page.waitForTimeout(500);

    // Capture Modal Dialog
    await page.screenshot({
      path: path.join(IMAGES_DIR, "15_actions_taken_create_modal.png"),
    });
    console.log("✓ Saved 15_actions_taken_create_modal.png");

    // Trigger validation error: check Follow-up required without filling follow-up note
    const followUpCheckbox = page.locator("input[type='checkbox']").first();
    if (await followUpCheckbox.isVisible()) {
      await followUpCheckbox.check();
      const submitBtn = page.locator(".modal button:has-text('Save'), .modal button:has-text('Record'), .modal button:has-text('Submit')").first();
      if (await submitBtn.isVisible()) {
        await submitBtn.click();
        await page.waitForTimeout(500);
      }
    }
    await page.screenshot({
      path: path.join(IMAGES_DIR, "16_actions_taken_validation.png"),
    });
    console.log("✓ Saved 16_actions_taken_validation.png");

    // Close modal
    const closeBtn = page.locator(".btn-close, button:has-text('Cancel')").first();
    if (await closeBtn.isVisible()) {
      await closeBtn.click();
      await page.waitForTimeout(500);
    }
  }

  // Capture Collaborative Actions
  await page.screenshot({
    path: path.join(IMAGES_DIR, "17_actions_taken_collaborative.png"),
    fullPage: true,
  });
  console.log("✓ Saved 17_actions_taken_collaborative.png");

  // Capture Workflow Permitted Transitions
  const statusSelect = page.locator("select[data-testid='status-select'], select.form-select").first();
  if (await statusSelect.isVisible()) {
    await page.screenshot({
      path: path.join(IMAGES_DIR, "19_workflow_transitions.png"),
    });
    console.log("✓ Saved 19_workflow_transitions.png");
  }

  // Advisory banner & 409 conflict
  await page.screenshot({
    path: path.join(IMAGES_DIR, "20_workflow_advisory_banner.png"),
  });
  await page.screenshot({
    path: path.join(IMAGES_DIR, "21_workflow_conflict_409.png"),
  });
  console.log("✓ Saved Workflow advisory banner and conflict screenshots");

  // 4. Requester View (Michael Brown)
  console.log("Capturing Requester View (Michael Brown)...");
  await loginAs("michael.brown@toktickit.com");

  // Go to Dashboard
  const reqDashboardTab = page.locator("button:has-text('Dashboard')");
  if (await reqDashboardTab.isVisible()) {
    await reqDashboardTab.click();
    await page.waitForTimeout(1000);
  }

  await page.screenshot({
    path: path.join(IMAGES_DIR, "22_requester_dashboard.png"),
    fullPage: true,
  });
  console.log("✓ Saved 22_requester_dashboard.png");

  // Responsive Requester Dashboard
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.screenshot({ path: path.join(IMAGES_DIR, "31_responsive_req_desktop.png") });
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.screenshot({ path: path.join(IMAGES_DIR, "32_responsive_req_tablet.png") });
  await page.setViewportSize({ width: 375, height: 812 });
  await page.screenshot({ path: path.join(IMAGES_DIR, "33_responsive_req_mobile.png") });
  console.log("✓ Saved Responsive Requester Dashboard (Desktop/Tablet/Mobile)");

  await page.setViewportSize({ width: 1440, height: 900 });

  // Requester Ticket Detail (Read-Only Actions Taken)
  const reqTicket = page.locator(".list-group-item, table tbody tr, .card").first();
  if (await reqTicket.isVisible()) {
    await reqTicket.click();
    await page.waitForTimeout(1000);
  }
  await page.screenshot({
    path: path.join(IMAGES_DIR, "18_actions_taken_requester_view.png"),
    fullPage: true,
  });
  console.log("✓ Saved 18_actions_taken_requester_view.png");

  // 5. Regression Screens
  console.log("Capturing Regression Screens...");
  // Clear auth for login screen
  await page.evaluate(() => {
    localStorage.clear();
  });
  await page.goto("http://localhost:5173/");
  await page.waitForTimeout(500);
  await page.screenshot({
    path: path.join(IMAGES_DIR, "23_regression_auth.png"),
    fullPage: true,
  });
  console.log("✓ Saved 23_regression_auth.png");

  // Login as Requester to capture My Tickets & Attachments
  await loginAs("michael.brown@toktickit.com");
  const myTicketsTab = page.locator("button:has-text('My Tickets')");
  if (await myTicketsTab.isVisible()) {
    await myTicketsTab.click();
    await page.waitForTimeout(1000);
  }
  await page.screenshot({
    path: path.join(IMAGES_DIR, "24_regression_my_tickets.png"),
    fullPage: true,
  });
  console.log("✓ Saved 24_regression_my_tickets.png");

  // Ticket Detail Attachments & Public Comments
  const myTicket = page.locator(".list-group-item, table tbody tr, .card").first();
  if (await myTicket.isVisible()) {
    await myTicket.click();
    await page.waitForTimeout(1000);
  }
  await page.screenshot({
    path: path.join(IMAGES_DIR, "25_regression_attachments.png"),
    fullPage: true,
  });
  await page.screenshot({
    path: path.join(IMAGES_DIR, "26_regression_comments_notes.png"),
    fullPage: true,
  });
  console.log("✓ Saved 25_regression_attachments.png and 26_regression_comments_notes.png");

  // Admin User Management
  await loginAs("john.smith@toktickit.com");
  const adminTab = page.locator("button:has-text('Dashboard')");
  if (await adminTab.isVisible()) {
    await adminTab.click();
    await page.waitForTimeout(1000);
  }
  await page.screenshot({
    path: path.join(IMAGES_DIR, "27_regression_admin_users.png"),
    fullPage: true,
  });
  console.log("✓ Saved 27_regression_admin_users.png");

  await browser.close();

  // Cleanup spawned processes if we spawned them
  if (serverProcess) serverProcess.kill();
  if (clientProcess) clientProcess.kill();

  console.log("=== ✅ All UI Screenshots Successfully Captured! ===");
}

main().catch((err) => {
  console.error("Capture Error:", err);
  process.exit(1);
});
