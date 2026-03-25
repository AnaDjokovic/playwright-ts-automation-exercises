import { type Locator, type Page } from '@playwright/test';
import BasePage from '../helpers/BasePage';

export default class RegistrationPage extends BasePage {
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  private readonly signupButton: Locator;
  private readonly signupErrorMessage: Locator;

  // Account info form (second step)
  private readonly passwordInput: Locator;
  private readonly titleMr: Locator;
  private readonly titleMrs: Locator;
  private readonly birthDaySelect: Locator;
  private readonly birthMonthSelect: Locator;
  private readonly birthYearSelect: Locator;

  // Address info
  private readonly firstNameInput: Locator;
  private readonly lastNameInput: Locator;
  private readonly companyInput: Locator;
  private readonly address1Input: Locator;
  private readonly address2Input: Locator;
  private readonly countrySelect: Locator;
  private readonly stateInput: Locator;
  private readonly cityInput: Locator;
  private readonly zipcodeInput: Locator;
  private readonly mobileNumberInput: Locator;

  private readonly createAccountButton: Locator;
  private readonly accountCreatedMessage: Locator;
  private readonly continueButton: Locator;
  private readonly loggedInAsText: Locator;

  //Delete Account
  private readonly deleteAccountButton: Locator;
  private readonly accountDeletedMessage: Locator;

  constructor(page: Page) {
    super(page);

    // Signup form (first step)
    this.nameInput = page.getByPlaceholder('Name');
    this.emailInput = page
      .locator('form')
      .filter({ hasText: 'Signup' })
      .getByPlaceholder('Email Address');
    this.signupButton = page.getByRole('button', { name: 'Signup' });
    this.signupErrorMessage = page.locator('form').filter({ hasText: 'Signup' }).locator('p');

    // Account info form (second step)
    this.passwordInput = page.locator('#password');
    this.titleMr = page.locator('#id_gender1');
    this.titleMrs = page.locator('#id_gender2');
    this.birthDaySelect = page.locator('#days');
    this.birthMonthSelect = page.locator('#months');
    this.birthYearSelect = page.locator('#years');

    // Address info
    this.firstNameInput = page.locator('#first_name');
    this.lastNameInput = page.locator('#last_name');
    this.companyInput = page.locator('#company');
    this.address1Input = page.locator('#address1');
    this.address2Input = page.locator('#address2');
    this.countrySelect = page.locator('#country');
    this.stateInput = page.locator('#state');
    this.cityInput = page.locator('#city');
    this.zipcodeInput = page.locator('#zipcode');
    this.mobileNumberInput = page.locator('#mobile_number');

    this.createAccountButton = page.getByRole('button', { name: 'Create Account' });
    this.accountCreatedMessage = page.locator('h2.title.text-center b');
    this.continueButton = page.getByRole('link', { name: 'Continue' });
    this.loggedInAsText = page.locator('li a').filter({ hasText: 'Logged in as' });

    //Delete Account
    this.deleteAccountButton = page.getByRole('link', { name: 'Delete Account' });
    this.accountDeletedMessage = page.locator('h2.title.text-center b');
  }

  async goToLogin(): Promise<void> {
    await this.page.goto('/login');
  }

  async fillSignupName(name: string): Promise<void> {
    await this.nameInput.fill(name);
  }

  async fillSignupEmail(email: string): Promise<void> {
    await this.emailInput.fill(email);
  }

  async clickSignupButton(): Promise<void> {
    await this.signupButton.click();
  }

  async fillAccountInfo(data: {
    password: string;
    title?: 'Mr' | 'Mrs';
    birthDay?: string;
    birthMonth?: string;
    birthYear?: string;
  }): Promise<void> {
    if (data.title === 'Mr') await this.titleMr.check();
    if (data.title === 'Mrs') await this.titleMrs.check();

    await this.passwordInput.fill(data.password);

    if (data.birthDay) await this.birthDaySelect.selectOption(data.birthDay);
    if (data.birthMonth) await this.birthMonthSelect.selectOption(data.birthMonth);
    if (data.birthYear) await this.birthYearSelect.selectOption(data.birthYear);
  }

  async fillAddressInfo(data: {
    firstName: string;
    lastName: string;
    company?: string;
    address1: string;
    address2?: string;
    country: string;
    state: string;
    city: string;
    zipcode: string;
    mobileNumber: string;
  }): Promise<void> {
    await this.firstNameInput.fill(data.firstName);
    await this.lastNameInput.fill(data.lastName);
    if (data.company) await this.companyInput.fill(data.company);
    await this.address1Input.fill(data.address1);
    if (data.address2) await this.address2Input.fill(data.address2);
    await this.countrySelect.selectOption(data.country);
    await this.stateInput.fill(data.state);
    await this.cityInput.fill(data.city);
    await this.zipcodeInput.fill(data.zipcode);
    await this.mobileNumberInput.fill(data.mobileNumber);
  }

  async clickCreateAccountButton(): Promise<void> {
    await this.createAccountButton.click();
  }

  async clickContinueButton(): Promise<void> {
    await this.continueButton.click();
  }

  async getSignupErrorMessage(): Promise<string> {
    await this.signupErrorMessage.waitFor({ state: 'visible' });
    return (await this.signupErrorMessage.textContent()) ?? '';
  }

  async getAccountCreatedMessage(): Promise<string> {
    await this.accountCreatedMessage.waitFor({ state: 'visible' });
    return (await this.accountCreatedMessage.textContent()) ?? '';
  }

  async getLoggedInAsText(): Promise<string> {
    await this.loggedInAsText.waitFor({ state: 'visible' });
    return (await this.loggedInAsText.textContent()) ?? '';
  }

  async isFieldRequiredValidation(locator: Locator): Promise<boolean> {
    return await locator.evaluate((el: HTMLInputElement) => !el.validity.valid);
  }

  async isLoggedIn(): Promise<boolean> {
    return await this.loggedInAsText.isVisible();
  }

  async deleteAccount(): Promise<void> {
    await this.deleteAccountButton.click();
  }

  async getAccountDeletedMessage(): Promise<string> {
    await this.accountDeletedMessage.waitFor({ state: 'visible' });
    return (await this.accountDeletedMessage.textContent()) ?? '';
  }

  /**
   * Full registration flow — fills all steps and submits the form.
   */
  async registerUser(data: {
    name: string;
    email: string;
    password: string;
    title?: 'Mr' | 'Mrs';
    birthDay?: string;
    birthMonth?: string;
    birthYear?: string;
    firstName: string;
    lastName: string;
    company?: string;
    address1: string;
    address2?: string;
    country: string;
    state: string;
    city: string;
    zipcode: string;
    mobileNumber: string;
  }): Promise<void> {
    await this.fillSignupName(data.name);
    await this.fillSignupEmail(data.email);
    await this.clickSignupButton();
    await this.fillAccountInfo({
      password: data.password,
      title: data.title,
      birthDay: data.birthDay,
      birthMonth: data.birthMonth,
      birthYear: data.birthYear,
    });
    await this.fillAddressInfo({
      firstName: data.firstName,
      lastName: data.lastName,
      company: data.company,
      address1: data.address1,
      address2: data.address2,
      country: data.country,
      state: data.state,
      city: data.city,
      zipcode: data.zipcode,
      mobileNumber: data.mobileNumber,
    });
    await this.clickCreateAccountButton();
  }
}
