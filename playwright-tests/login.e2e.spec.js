import { test, expect } from "@playwright/test";

test("Login React + Django - Login réussi", async ({ page }) => {
  // 1️⃣ Aller sur la page React
  await page.goto("http://localhost:5173", { waitUntil: "networkidle" });

  // 2️⃣ Remplir les champs
  await page.fill("input#email", "andriaarno@gmail.com");
  await page.fill("input#password", "2975");

  // 3️⃣ Cliquer sur login
  await page.click("button[type=submit]");

  // 4️⃣ Attendre la redirection vers le dashboard
  await page.waitForURL("**/dashboard-freelance", { timeout: 60000 });

  // 5️⃣ Vérifier un élément stable du dashboard
  await expect(page.locator("h1", { hasText: "Bienvenue" })).toBeVisible();
});
