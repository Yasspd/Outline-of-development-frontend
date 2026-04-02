import { expect, test } from '@playwright/test';

const password = 'Password123!';

async function login(page: import('@playwright/test').Page, email: string) {
  await page.goto('/login');
  await page.getByLabel('Эл. почта').fill(email);
  await page.getByLabel('Пароль').fill(password);
  const submitButton = page.getByRole('button', { name: 'Войти' });
  await expect(submitButton).toBeEnabled({ timeout: 30000 });
  await submitButton.click();
}

test('employee lands in employee workspace and sees seeded HR course', async ({ page }) => {
  await login(page, 'employee@kontur.local');

  await expect(page).toHaveURL(/\/employee\/dashboard$/);

  await page.goto('/employee/my-courses');
  await expect(page.getByText('АЛРОСА ИТ: основы платформы контура обучения')).toBeVisible();
});

test('employee can open external learning request form without runtime error', async ({ page }) => {
  await login(page, 'employee@kontur.local');

  await expect(page).toHaveURL(/\/employee\/dashboard$/);

  await page.goto('/employee/external-learning');
  await page.getByRole('link', { name: 'Создать заявку' }).click();

  await expect(page).toHaveURL(/\/employee\/external-learning\/new$/);
  await expect(page.getByPlaceholder('Product Discovery Bootcamp')).toBeVisible();
});

test('manager lands in manager workspace and sees team members', async ({ page }) => {
  await login(page, 'manager@kontur.local');

  await expect(page).toHaveURL(/\/manager\/dashboard$/);

  await page.goto('/manager/team');
  await expect(page.getByText('employee.demo@kontur.local')).toBeVisible();
});

test('hr lands in hr workspace and sees users, requests, certificates and courses', async ({ page }) => {
  await login(page, 'hr.admin@kontur.local');

  await expect(page).toHaveURL(/\/hr\/dashboard$/);

  await page.goto('/hr/users');
  await expect(page.getByText('employee@kontur.local')).toBeVisible();

  await page.goto('/hr/approvals');
  await expect(
    page.getByText('Управление учебным бюджетом и закупкой внешнего обучения').first(),
  ).toBeVisible();

  await page.goto('/hr/certificates');
  await expect(page.getByText('certificate-learning-metrics.pdf')).toBeVisible();

  await page.goto('/hr/courses');
  await expect(page.getByText('АЛРОСА ИТ: основы платформы контура обучения')).toBeVisible();

  await page.goto('/hr/analytics');
  await expect(page.getByText('Провайдеры внешнего обучения')).toBeVisible();

  await page.goto('/hr/reports');
  await expect(page.getByText('Управленческий срез')).toBeVisible();
});

test('trainer lands in trainer workspace and sees seeded participant monitoring', async ({ page }) => {
  await login(page, 'trainer@kontur.local');

  await expect(page).toHaveURL(/\/trainer\/dashboard$/);

  await page.goto('/trainer/participants');
  await expect(page.getByText('employee.demo@kontur.local')).toBeVisible();
});

test('employee can find published course by partial title in workspace search', async ({ page }) => {
  await login(page, 'employee@kontur.local');

  await expect(page).toHaveURL(/\/employee\/dashboard$/);

  const searchInput = page.getByPlaceholder('Поиск по курсам, заявкам и сертификатам');
  await searchInput.fill('основ');

  const searchResult = page.getByRole('link', {
    name: /АЛРОСА ИТ: основы платформы контура обучения/,
  });

  await expect(searchResult).toBeVisible();
  await searchResult.click();
  await expect(page).toHaveURL(/\/employee\/my-courses$/);
});

test('employee is redirected away from hr workspace', async ({ page }) => {
  await login(page, 'employee@kontur.local');
  await expect(page).toHaveURL(/\/employee\/dashboard$/);

  await page.goto('/hr/dashboard');
  await expect(page).toHaveURL(/\/employee\/dashboard$/);
});
