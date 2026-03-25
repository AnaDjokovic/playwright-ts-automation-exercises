import { test, expect } from '../fixtures';
import { emptyCartNotification } from '../helpers/data.helper';

test.describe('Automation Exercise - Product page validation', () => {
  test(
    'Cart flow: add, verify, and remove products',
    { tag: ['@regression'] },
    async ({ page, productsPage, cartPage }) => {
      const numberOfProductsToBeAdded = 4;

      await test.step('Navigate to products page', async () => {
        const pageUrl = await productsPage.goToProducts();

        expect(pageUrl).toEqual(page.url());
      });

      await test.step('Add multiple random products to cart', async () => {
        await productsPage.multipleProducts(numberOfProductsToBeAdded);

        expect(page.url()).toContain('view_cart');
      });

      await test.step('Verify products are added to cart', async () => {
        const cartItemsCount = await cartPage.getCartItemsCount();

        expect(cartItemsCount).toEqual(numberOfProductsToBeAdded);
      });

      await test.step('Remove all items and verify empty cart', async () => {
        const emptyCartText = await cartPage.removeItemFromCart();
        const cartItemsCount = await cartPage.getCartItemsCount();

        expect(emptyCartText).toEqual(emptyCartNotification);
        expect(cartItemsCount).toEqual(0);
      });
    },
  );
});
