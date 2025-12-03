import { test, expect } from "@playwright/test";

test("Login React + Django - Login réussi (mocked navigation)", async ({ page }) => {
  // 🔹 Intercepter l'appel API login et renvoyer une réponse simulée
  await page.route('**/auth/login/', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ role: 'Freelance', success: true }),
    });
  });

  // 🔹 Injecter un spy pour useNavigate
  await page.addInitScript(() => {
    window.__navigateCalls = [];
    const originalUseNavigate = Object.getOwnPropertyDescriptor(window, "useNavigate");
    // Si tu ne peux pas accéder directement à useNavigate, tu peux vérifier via ton bundle ou sinon mock dans le composant.
  });

  // 1️⃣ Aller sur la page React
  await page.goto("http://localhost:5173", { waitUntil: "networkidle" });

  // 2️⃣ Remplir les champs
  await page.fill("input#email", "andriaarno@gmail.com");
  await page.fill("input#password", "2975");

  // 3️⃣ Cliquer sur login
  await page.click("button[type=submit]");

  // 4️⃣ Attendre le toast
  await page.waitForSelector('text=Connexion réussie', { timeout: 10000 });
  await expect(page.locator("text=Connexion réussie")).toBeVisible();

  // 🔹 Vérifier que navigate aurait été appelé côté React
  const navigateCalls = await page.evaluate(() => window.__navigateCalls);
  expect(navigateCalls).toContain("/dashboard-freelance");
});
