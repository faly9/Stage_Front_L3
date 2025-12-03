import { test, expect } from "@playwright/test";

test("Login React + Django - Login réussi", async ({ page }) => {
  // 1️⃣ Aller sur la page React
  await page.goto("http://localhost:5173");

  // 2️⃣ Remplir les champs
  await page.fill("input#email", "andriaarno@gmail.com");
  await page.fill("input#password", "2975");

  // 3️⃣ Attendre que le bouton login soit visible
  await page.waitForSelector("button[type=submit]", { timeout: 10000 });
  await page.click("button[type=submit]");

  // 4️⃣ Attendre que le toast de succès apparaisse
  await page.waitForSelector('text=Connexion réussie', { timeout: 10000 });
  await expect(page.locator("text=Connexion réussie")).toBeVisible();

  // 5️⃣ Vérifier la redirection vers le dashboard
  await page.waitForURL("**/dashboard-freelance", { timeout: 30000 });
});