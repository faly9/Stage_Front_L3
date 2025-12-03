import { test, expect } from "@playwright/test";

test("Login React + Django - Login réussi (mocked)", async ({ page }) => {
  // 🔹 Intercepter l'appel API login et renvoyer une réponse simulée
  await page.route('**/auth/login/', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ role: 'Freelance', success: true }),
    });
  });

  // 1️⃣ Aller sur la page React
  await page.goto("http://localhost:5173", { waitUntil: "networkidle" });

  // 2️⃣ Remplir les champs
  await page.fill("input#email", "andriaarno@gmail.com");
  await page.fill("input#password", "2975");

  // 3️⃣ Cliquer sur login
  await page.click("button[type=submit]");

  // 4️⃣ Attendre que le toast de succès apparaisse
  await page.waitForSelector('text=Connexion réussie', { timeout: 10000 });
  await expect(page.locator("text=Connexion réussie")).toBeVisible();

  // 5️⃣ Vérifier la redirection vers le dashboard
  await page.waitForURL("**/dashboard-freelance", { timeout: 30000 });

  // 6️⃣ Vérifier qu'un élément stable du dashboard est visible
  await expect(page.locator("h1", { hasText: "Bienvenue" })).toBeVisible();
});
