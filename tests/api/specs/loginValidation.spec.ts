import { test, expect } from '@playwright/test';
import RequestsApi from '../helpers/https.helper';
import { generateUserData, invalidData } from '../helpers/data.helper';

test.describe('Login API test without registration', () => {
  const userData = generateUserData();
  test('TC01 - Login without prior registration', { tag: ['@regression'] }, async ({ request }) => {
    const api = new RequestsApi(request);
    const response = await api.loginUser({
      email: userData.email,
      password: userData.password,
    });

    const { responseCode, message } = response.jsonResponse as {
      responseCode: number;
      message: string;
    };

    expect(responseCode).toBe(404);
    expect(message).toBe('User not found!');
  });
});

test.describe('Login API tests with registation', () => {
  const userData = generateUserData();
  let getRequest: RequestsApi;

  test.beforeAll(async ({ request }) => {
    const api = new RequestsApi(request);
    await api.createAccount(userData);
  });

  test.afterAll(async ({ request }) => {
    const api = new RequestsApi(request);
    await api.deleteAccount({ email: userData.email, password: userData.password });
  });

  test.beforeEach(async ({ request }) => {
    getRequest = new RequestsApi(request);
  });

  test('TC02 - Login with empty email', { tag: ['@regression'] }, async () => {
    const response = await getRequest.loginUser({
      email: '',
      password: userData.password,
    });
    const { responseCode, message } = response.jsonResponse as {
      responseCode: number;
      message: string;
    };

    expect(responseCode).toBe(404);
    expect(message).toBe('User not found!');
  });

  test('TC03 - Login with invalid email format', { tag: ['@regression'] }, async () => {
    const response = await getRequest.loginUser({
      email: invalidData.invalidEmailFormat,
      password: userData.password,
    });
    const { responseCode, message } = response.jsonResponse as {
      responseCode: number;
      message: string;
    };

    expect(responseCode).toBe(404);
    expect(message).toBe('User not found!');
  });

  test('TC04 - Login with empty password', { tag: ['@regression'] }, async () => {
    const response = await getRequest.loginUser({
      email: userData.email,
      password: '',
    });
    const { responseCode, message } = response.jsonResponse as {
      responseCode: number;
      message: string;
    };

    expect(responseCode).toBe(404);
    expect(message).toBe('User not found!');
  });

  test('TC05 - Login with wrong password', { tag: ['@regression'] }, async () => {
    const response = await getRequest.loginUser({
      email: userData.email,
      password: invalidData.password,
    });
    const { responseCode, message } = response.jsonResponse as {
      responseCode: number;
      message: string;
    };

    expect(responseCode).toBe(404);
    expect(message).toBe('User not found!');
  });

  test('TC06 - Login with valid data', { tag: ['@smoke'] }, async () => {
    const response = await getRequest.loginUser({
      email: userData.email,
      password: userData.password,
    });
    const { responseCode, message } = response.jsonResponse as {
      responseCode: number;
      message: string;
    };

    expect(responseCode).toBe(200);
    expect(message).toBe('User exists!');
  });
});
