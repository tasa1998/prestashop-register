import { test, expect } from '@playwright/test';
import { RegisterPage } from '../pages/RegisterPage';
import { buildCustomer } from '../utils/testData';

test.describe('Register (create account)', () => {
  let registerPage: RegisterPage;

  test.beforeEach(async ({ page }) => {
    registerPage = new RegisterPage(page);
    await registerPage.open();
  });

  test('should register a new customer with valid data', async () => {
    await registerPage.register(buildCustomer());

    await expect(registerPage.myAccountButton).toBeVisible();
  });

  test('should not register a customer with an email that is already used', async () => {
  const customer = buildCustomer();

  await registerPage.register(customer);
  await expect(registerPage.myAccountButton).toBeVisible();
  await registerPage.signOut();
  await registerPage.goToRegistrationForm();

  await registerPage.register(customer);

  await expect(registerPage.emailAlert).toBeVisible();
  await expect(registerPage.myAccountButton).toBeHidden();
});

  test('should not register a customer who has not accepted the privacy consent', async () => {
    await registerPage.fillForm(buildCustomer());
    await registerPage.acceptTerms(); // privacy stays unchecked
    await registerPage.submit();

    expect(await registerPage.isMissing(registerPage.privacyCheckbox)).toBe(true);
    await expect(registerPage.myAccountButton).toBeHidden();
  });

  test('should not register a customer who has not accepted the terms and conditions', async () => {
    await registerPage.fillForm(buildCustomer());
    await registerPage.acceptPrivacy(); // terms stay unchecked
    await registerPage.submit();

    expect(await registerPage.isMissing(registerPage.termsCheckbox)).toBe(true);
    await expect(registerPage.myAccountButton).toBeHidden();
  });

  test('should not submit the form when required fields are empty', async () => {
    await registerPage.submit();

    expect(await registerPage.isMissing(registerPage.firstNameInput)).toBe(true);
    expect(await registerPage.isMissing(registerPage.lastNameInput)).toBe(true);
    expect(await registerPage.isMissing(registerPage.emailInput)).toBe(true);
    expect(await registerPage.isMissing(registerPage.passwordInput)).toBe(true);
    await expect(registerPage.myAccountButton).toBeHidden();
  });

  const invalidEmails = [
    'emailaddress',
    'user@',
    '@domain.com',
    'user@@domain.com',
    'user name@domain.com',
  ];

  for (const email of invalidEmails) {
    test(`should reject invalid email format "${email}"`, async () => {
      await registerPage.fillForm(buildCustomer({ email }));
      await registerPage.acceptConsents();
      await registerPage.submit();

      expect(await registerPage.hasTypeMismatch(registerPage.emailInput)).toBe(true);
      await expect(registerPage.myAccountButton).toBeHidden();
    });
  }
});