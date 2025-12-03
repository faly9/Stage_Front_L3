import { test, expect } from "@playwright/test";

test("Login React + Django - Login réussi (mocked navigation)", async ({ page }) => {
  // 🔹 Intercepter l'appel API login
  await page.route('**/auth/login/', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ role: 'Freelance', success: true }),
    });
  });

  // 1️⃣ Aller sur la page
  await page.goto("http://localhost:5173", { waitUntil: "networkidle" });

  // 2️⃣ Remplir le formulaire
  await page.fill("input#email", "andriaarno@gmail.com");
  await page.fill("input#password", "2975");
  await page.click("button[type=submit]");

  // 3️⃣ Attendre le toast
  await page.waitForSelector('text=Connexion réussie', { timeout: 10000 });
  await expect(page.locator("text=Connexion réussie")).toBeVisible();

  // 4️⃣ Vérifier que navigate a été appelé
  const navigateCalls = await page.evaluate(() => window.__navigateCalls || []);
  expect(navigateCalls).toContain("/dashboard-freelance");
});
