import { test, expect } from '@playwright/test';
import RequestsApi from '../helpers/https.helper';
import convertRsToUsd from '../helpers/function.helper';

test.describe('Products Search API tests', () => {
  let getRequest: RequestsApi;

  test.beforeEach(async ({ request }) => {
    getRequest = new RequestsApi(request);
  });

  test('TC01 - Verify search returns valid results', { tag: ['@regression'] }, async () => {
    const searchedItem = { search_product: 'tshirt' };

    const searchProductRequest = await getRequest.searchProduct(searchedItem);
    const { responseCode, products } = searchProductRequest.jsonResponse as {
      responseCode: number;
      products: { name: string }[];
    };

    expect(responseCode).toBe(200);
    expect(products.length).toBeGreaterThan(0);

    const matchingProducts = products.filter((product) =>
      product.name.toLowerCase().includes(searchedItem.search_product),
    );

    expect(matchingProducts.length).toBeGreaterThan(0);
  });

  test('TC02 - Search with client-side filtering', { tag: ['@regression'] }, async () => {
    const searchTerm = 'top';
    const expectedBrand = 'Madame';

    const searchProductRequest = await getRequest.searchProduct({ search_product: searchTerm });
    const { responseCode, products } = searchProductRequest.jsonResponse as {
      responseCode: number;
      products: {
        name: string;
        brand: string;
        category: { usertype: { usertype: string } };
      }[];
    };

    expect(responseCode).toBe(200);
    expect(products.length).toBeGreaterThan(0);

    const filtered = products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm) && product.brand === expectedBrand,
    );

    expect(filtered.length).toBeGreaterThan(0);

    for (const product of filtered) {
      expect(product.name.toLowerCase()).toContain(searchTerm);
      expect(product.brand).toEqual(expectedBrand);
    }
  });

  test('TC03 - Product price range validation', { tag: ['@regression'] }, async () => {
    const searchedItem = { search_product: 'tshirt' };

    const searchProductRequest = await getRequest.searchProduct(searchedItem);
    const exchangeResponse = await getRequest.exchangeCurrency();

    const { responseCode, products } = searchProductRequest.jsonResponse as {
      responseCode: number;
      products: { price: string; name: string }[];
    };

    const exchangeMiddleUsd = (exchangeResponse as { exchange_middle: number }).exchange_middle;

    expect(responseCode).toBe(200);

    for (const product of products) {
      const priceStr = product.price.trim();
      const priceInRs = Number(priceStr.split(/\s+/)[1]);

      expect(priceInRs).toBeGreaterThan(0);

      const convertedUsd = convertRsToUsd(priceInRs, exchangeMiddleUsd);
      const expectedUsd = Number((priceInRs / exchangeMiddleUsd).toFixed(2));

      expect(convertedUsd).toBe(expectedUsd);
    }
  });
});
