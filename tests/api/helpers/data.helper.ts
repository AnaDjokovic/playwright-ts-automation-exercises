import { randomUUID } from 'crypto';

export function generateUniqueEmail(): string {
  const uuid = randomUUID().split('-')[0]; // Use first segment for shorter email
  return `testuser_${uuid}@test.com`;
}

export const generateUserData = () => ({
  name: 'Test User',
  email: generateUniqueEmail(),
  password: 'Test@12345',
  title: 'Mr',
  birth_date: '15',
  birth_month: '6',
  birth_year: '1990',
  firstname: 'Test',
  lastname: 'User',
  company: 'Test Company',
  address1: '123 Test Street',
  address2: 'Apt 4B',
  country: 'United States',
  zipcode: '10001',
  state: 'New York',
  city: 'New York',
  mobile_number: '1234567890',
});

export const invalidData = {
  email: 'wrong.email@gmail.com',
  invalidEmailFormat: 'invalidformt.gmail.com',
  password: 'WrongPassword123!',
};

export interface UserData {
  name: string;
  email: string;
  password: string;
  title: string;
  birth_date: string;
  birth_month: string;
  birth_year: string;
  firstname: string;
  lastname: string;
  company: string;
  address1: string;
  address2: string;
  country: string;
  zipcode: string;
  state: string;
  city: string;
  mobile_number: string;
}
