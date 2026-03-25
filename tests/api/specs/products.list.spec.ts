import { test, expect } from '@playwright/test';
import RequestsApi from '../helpers/https.helper';

test.describe('Products List API tests', () => {
  let getRequest: RequestsApi;

  test.beforeEach(async ({ request }) => {
    getRequest = new RequestsApi(request);
  });

  test('TC01 - Get list of products', { tag: ['@smoke'] }, async () => {
    const getListResponse = await getRequest.getProductsList();

    const { responseCode, products } = getListResponse.jsonResponse as {
      responseCode: number;
      products: Record<string, unknown>[];
    };
    const listOfProperties = ['id', 'name', 'price', 'brand', 'category'];

    expect(responseCode).toBe(200);
    expect(products.length).toBeGreaterThan(0);

    for (const product of products) {
      for (const property of listOfProperties) {
        expect(product).toHaveProperty(property);
      }
    }
  });

  test('TC05 - Response validation (GET)', { tag: ['@smoke'] }, async () => {
    const getListResponse = await getRequest.getProductsList();
    const { responseCode, products } = getListResponse.jsonResponse as {
      responseCode: number;
      products: {
        id: number;
        price: string | number;
        name: string;
        brand: string;
        category: { usertype: { usertype: string } };
      }[];
    };

    expect(responseCode).toBe(200);

    for (const product of products) {
      const { id, price, name, brand } = product;
      const category = product.category.usertype.usertype;

      expect(typeof name).toEqual('string');
      expect(typeof brand).toEqual('string');
      expect(typeof category).toEqual('string');
      expect(typeof id).toEqual('number');
      expect(typeof price === 'string' || typeof price === 'number').toBe(true);
    }
  });
});
