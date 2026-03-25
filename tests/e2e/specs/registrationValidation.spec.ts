import { test, expect } from '../fixtures';
import { generateUserData } from '../../api/helpers/data.helper';
import RequestsApi from '../../api/helpers/https.helper';

test.describe('Registration E2E tests', () => {
  test(
    'TC01 - Register new user successfully',
    { tag: ['@smoke'] },
    async ({ registrationPage }) => {
      const userData = generateUserData();

      await registrationPage.goToLogin();

      await registrationPage.fillSignupName(userData.name);
      await registrationPage.fillSignupEmail(userData.email);
      await registrationPage.clickSignupButton();

      await registrationPage.fillAccountInfo({
        password: userData.password,
        title: 'Mr',
        birthDay: userData.birth_date,
        birthMonth: userData.birth_month,
        birthYear: userData.birth_year,
      });

      await registrationPage.fillAddressInfo({
        firstName: userData.firstname,
        lastName: userData.lastname,
        company: userData.company,
        address1: userData.address1,
        address2: userData.address2,
        country: userData.country,
        state: userData.state,
        city: userData.city,
        zipcode: userData.zipcode,
        mobileNumber: userData.mobile_number,
      });

      await registrationPage.clickCreateAccountButton();

      const accountCreatedMessage = await registrationPage.getAccountCreatedMessage();
      expect(accountCreatedMessage).toBe('Account Created!');

      await registrationPage.clickContinueButton();

      const loggedInText = await registrationPage.getLoggedInAsText();
      expect(loggedInText).toContain(userData.name);
    },
  );

  test(
    'TC02 - Register with already existing email',
    { tag: ['@regression'] },
    async ({ registrationPage, request }) => {
      const userData = generateUserData();
      const api = new RequestsApi(request);

      // First, create an account with this email
      await api.createAccount(userData);

      // Now try to register with the same email
      await registrationPage.goToLogin();

      await registrationPage.fillSignupName(userData.name);
      await registrationPage.fillSignupEmail(userData.email);
      await registrationPage.clickSignupButton();

      const errorMessage = await registrationPage.getSignupErrorMessage();
      expect(errorMessage).toBe('Email Address already exist!');

      // Cleanup
      await api.deleteAccount({ email: userData.email, password: userData.password });
    },
  );

  test(
    'TC03 - Delete account after registration',
    { tag: ['@regression'] },
    async ({ registrationPage, loginPage }) => {
      const userData = generateUserData();

      await registrationPage.goToLogin();

      await registrationPage.fillSignupName(userData.name);
      await registrationPage.fillSignupEmail(userData.email);
      await registrationPage.clickSignupButton();

      await registrationPage.fillAccountInfo({
        password: userData.password,
        title: 'Mr',
        birthDay: userData.birth_date,
        birthMonth: userData.birth_month,
        birthYear: userData.birth_year,
      });

      await registrationPage.fillAddressInfo({
        firstName: userData.firstname,
        lastName: userData.lastname,
        company: userData.company,
        address1: userData.address1,
        address2: userData.address2,
        country: userData.country,
        state: userData.state,
        city: userData.city,
        zipcode: userData.zipcode,
        mobileNumber: userData.mobile_number,
      });

      await registrationPage.clickCreateAccountButton();
      await registrationPage.clickContinueButton();

      await loginPage.logout();
      await registrationPage.goToLogin();

      await loginPage.login(userData.email, userData.password);

      await registrationPage.deleteAccount();

      const accountDeletedMessage = await registrationPage.getAccountDeletedMessage();
      expect(accountDeletedMessage).toBe('Account Deleted!');
    },
  );

  test(
    'TC04 - Register form field validations',
    { tag: ['@regression'] },
    async ({ registrationPage }) => {
      const userData = generateUserData();

      await registrationPage.goToLogin();

      await test.step('Empty name validation', async () => {
        await registrationPage.fillSignupName('');
        await registrationPage.fillSignupEmail(userData.email);
        await registrationPage.clickSignupButton();

        const isInvalid = await registrationPage.isFieldRequiredValidation(
          registrationPage.nameInput,
        );
        expect(isInvalid).toBe(true);
      });

      await test.step('Empty email validation', async () => {
        await registrationPage.fillSignupName(userData.name);
        await registrationPage.fillSignupEmail('');
        await registrationPage.clickSignupButton();

        const isInvalid = await registrationPage.isFieldRequiredValidation(
          registrationPage.emailInput,
        );
        expect(isInvalid).toBe(true);
      });

      await test.step('Invalid email format validation', async () => {
        await registrationPage.fillSignupName(userData.name);
        await registrationPage.fillSignupEmail('invalidemail');
        await registrationPage.clickSignupButton();

        const isInvalid = await registrationPage.isFieldRequiredValidation(
          registrationPage.emailInput,
        );
        expect(isInvalid).toBe(true);
      });
    },
  );
});
