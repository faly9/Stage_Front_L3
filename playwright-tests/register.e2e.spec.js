import { test, expect } from '@playwright/test';

test.describe('Formulaire d\'inscription', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/register');
  });

  test('Affiche les erreurs si les champs sont vides', async ({ page }) => {
    await page.click('button:text("S\'inscrire")');

    await expect(page.locator('text=L\'email est obligatoire')).toBeVisible();
    await expect(page.locator('text=Le rôle est obligatoire')).toBeVisible();
    await expect(page.locator('text=Le mot de passe est obligatoire')).toBeVisible();
    await expect(page.locator('text=La confirmation est obligatoire')).toBeVisible();
  });

  test('Affiche une erreur si les mots de passe ne correspondent pas', async ({ page }) => {
    await page.fill('#email', 'test@example.com');
    await page.selectOption('#role', 'Freelance');
    await page.fill('#password', 'password123');
    await page.fill('#cpass', 'password321');

    await page.click('button:text("S\'inscrire")');

    await expect(page.locator('text=Les mots de passe ne correspondent pas')).toBeVisible();
  });

  test('Soumet correctement le formulaire avec mock', async ({ page }) => {
    // Mock de l'API pour simuler une inscription réussie
    await page.route('**/auth/register/**', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'success' }),
      });
    });

    await page.fill('#email', 'test@example.com');
    await page.selectOption('#role', 'Freelance');
    await page.fill('#password', 'password123');
    await page.fill('#cpass', 'password123');

    await page.click('button:text("S\'inscrire")');

    // Maintenant la navigation se produit et le message est affiché
    await expect(page).toHaveURL(/verify-notice/);
    // await expect(page.locator('text=Inscription réussie')).toBeVisible();
  });

});
