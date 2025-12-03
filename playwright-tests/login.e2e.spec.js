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

  // 🔹 Mock window.navigate pour capturer la redirection
  await page.addInitScript(() => {
    window.__navigatedTo = null;
    const originalNavigate = window.history.pushState;
    window.history.pushState = function(state, title, url) {
      window.__navigatedTo = url;
      return originalNavigate.apply(this, arguments);
    };
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

  // 🔹 Vérifier que la navigation aurait été déclenchée
  const navigated = await page.evaluate(() => window.__navigatedTo);
  expect(navigated).toContain("/dashboard-freelance");
});
