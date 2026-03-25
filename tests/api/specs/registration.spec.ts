import { test, expect } from '@playwright/test';
import RequestsApi from '../helpers/https.helper';
import { generateUserData, invalidData } from '../helpers/data.helper';

test.describe('Registration API tests validation', () => {
  let getRequest: RequestsApi;
  const userData = generateUserData();

  test.afterAll(async ({ request }) => {
    const api = new RequestsApi(request);
    await api.deleteAccount({ email: userData.email, password: userData.password });
  });

  test.beforeEach(async ({ request }) => {
    getRequest = new RequestsApi(request);
  });

  test('TC01 - Register without any data', { tag: ['@regression'] }, async () => {
    const response = await getRequest.createAccount({});
    const { responseCode, message } = response.jsonResponse as {
      responseCode: number;
      message: string;
    };

    expect(responseCode).toBe(400);
    expect(message).toBeDefined();
  });

  test('TC02 - Register with empty email', { tag: ['@regression'] }, async () => {
    const response = await getRequest.createAccount({
      ...userData,
      email: '',
    });
    const { responseCode, message } = response.jsonResponse as {
      responseCode: number;
      message: string;
    };

    expect(responseCode).toBe(400);
    expect(message).toBeDefined();
  });

  test('TC03 - Register with invalid email format', { tag: ['@regression'] }, async () => {
    const response = await getRequest.createAccount({
      ...userData,
      email: invalidData.email,
    });
    const { responseCode, message } = response.jsonResponse as {
      responseCode: number;
      message: string;
    };

    expect(responseCode).toBe(400);
    expect(message).toBeDefined();
  });

  test('TC04 - Register with already existing email', { tag: ['@regression'] }, async () => {
    const duplicateUser = generateUserData(); // novi unique user samo za ovaj test

    await getRequest.createAccount(duplicateUser);

    const response = await getRequest.createAccount(duplicateUser);
    const { responseCode, message } = response.jsonResponse as {
      responseCode: number;
      message: string;
    };

    expect(responseCode).toBe(400);
    expect(message).toBe('Email already exists!');

    // cleanup za ovaj user
    await getRequest.deleteAccount({
      email: duplicateUser.email,
      password: duplicateUser.password,
    });
  });

  test('TC05 - Register with valid data', { tag: ['@smoke'] }, async () => {
    const response = await getRequest.createAccount(userData);
    const { responseCode, message } = response.jsonResponse as {
      responseCode: number;
      message: string;
    };

    expect(responseCode).toBe(201);
    expect(message).toBe('User created!');
  });
});
