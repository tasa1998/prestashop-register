import { Page, FrameLocator, Locator } from '@playwright/test';
import { Customer } from '../utils/testData';

export class RegisterPage {
  private readonly shop: FrameLocator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly termsCheckbox: Locator;
  readonly privacyCheckbox: Locator;
  readonly submitButton: Locator;
  readonly myAccountButton: Locator;
  readonly emailAlert: Locator;



  constructor(private readonly page: Page) {
    this.shop = page.frameLocator('iframe[name="framelive"]');
    this.firstNameInput = this.shop.getByRole('textbox', { name: 'First name' });
    this.lastNameInput = this.shop.getByRole('textbox', { name: 'Last name' });
    this.emailInput = this.shop.getByRole('textbox', { name: 'Email', exact: true });
    this.passwordInput = this.shop.getByRole('textbox', { name: 'Password' });
    this.termsCheckbox = this.shop.getByRole('checkbox', { name: 'I agree to the terms and' });
    this.privacyCheckbox = this.shop.getByRole('checkbox', { name: 'Customer data privacy' });
    this.submitButton = this.shop.getByRole('button', { name: 'Create account' });
    this.myAccountButton = this.shop.getByRole('button', { name: /View my account/ });
    this.emailAlert = this.shop.getByText(/already used/i);
  }

async open(): Promise<void> {
  await this.page.goto('https://demo.prestashop.com/#/en/front');
  await this.goToRegistrationForm();
}

async goToRegistrationForm(): Promise<void> {
  await this.shop.getByLabel('Sign in').click();
  await this.shop.getByRole('link', { name: 'Create your account' }).click();
}

  async fillForm(customer: Customer): Promise<void> {
    await this.shop.getByRole('radio', { name: customer.title }).check();
    await this.firstNameInput.fill(customer.firstName);
    await this.lastNameInput.fill(customer.lastName);
    await this.emailInput.fill(customer.email);
    await this.passwordInput.fill(customer.password);
  }

  async acceptTerms(): Promise<void> {
    await this.termsCheckbox.check();
  }

  async acceptPrivacy(): Promise<void> {
    await this.privacyCheckbox.check();
  }

  async acceptConsents(): Promise<void> {
    await this.acceptTerms();
    await this.acceptPrivacy();
  }

  async submit(): Promise<void> {
    await this.submitButton.click();
  }

  async register(customer: Customer): Promise<void> {
    await this.fillForm(customer);
    await this.acceptConsents();
    await this.submit();
  }

  async isMissing(field: Locator): Promise<boolean> {
    return field.evaluate((el) => (el as HTMLInputElement).validity.valueMissing);
  }

  async hasTypeMismatch(field: Locator): Promise<boolean> {
    return field.evaluate((el) => (el as HTMLInputElement).validity.typeMismatch);
  }

  async signOut(): Promise<void> {
  await this.myAccountButton.click();
  await this.shop.locator('a.dropdown-item', { hasText: 'Sign out' }).click();
}

}