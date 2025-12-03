// playwright-tests/login.e2e.spec.js
import { test, expect } from "@playwright/test";

test("Login React + Django - Login réussi (mocked navigation)", async ({ page }) => {
  // 🔹 Mock de l'API login
  await page.route('**/auth/login/', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ role: 'Freelance', success: true }),
    });
  });

  // 🔹 Injecter un spy pour navigate (fonction React)
  await page.addInitScript(() => {
    window.__navigateCalls = [];
    const originalNavigate = window.ReactRouterNavigate;
    // Si tu peux, remplacer navigate par une fonction spy dans ton bundle
    window.mockNavigate = (url) => window.__navigateCalls.push(url);
  });

  // 1️⃣ Aller sur la page React
  await page.goto("http://localhost:5173", { waitUntil: "networkidle" });

  // 2️⃣ Remplir le formulaire
  await page.fill("input#email", "andriaarno@gmail.com");
  await page.fill("input#password", "2975");

  // 3️⃣ Cliquer sur login
  await page.click("button[type=submit]");

  // 4️⃣ Vérifier que le toast de succès apparaît
  await page.waitForSelector('text=Connexion réussie', { timeout: 10000 });
  await expect(page.locator("text=Connexion réussie")).toBeVisible();

  // 5️⃣ Vérifier que navigate a été appelé avec la bonne URL
  const navigateCalls = await page.evaluate(() => window.__navigateCalls || []);
  expect(navigateCalls).toContain("/dashboard-freelance");
});
