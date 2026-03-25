import { test, expect } from '../fixtures';

test.describe('Automation Exercise - Product Details page validation', () => {
  test.beforeEach(async ({ productDetailsPage }) => {
    const detailsPageUrl = await productDetailsPage.openFirstProduct();

    expect(detailsPageUrl).toContain('product_details');
  });

  test(
    'TC-01: UI elements visibility validation',
    { tag: ['@smoke'] },
    async ({ productDetailsPage }) => {
      const productDetails = await productDetailsPage.productDetailsElementsValidation();

      Object.values(productDetails).forEach((singleElement) => {
        expect(singleElement.visible).toBe(true);
      });
    },
  );

  test(
    'TC-02: Quantity input field validation, user is able to input value',
    { tag: ['@regression'] },
    async ({ productDetailsPage }) => {
      const desiredQuantity = '3';
      const itemsAdded = await productDetailsPage.setQuantity(desiredQuantity);

      expect(itemsAdded).toEqual(desiredQuantity);
    },
  );
});
