import { type Locator, type Page } from '@playwright/test';
import BasePage from '../helpers/BasePage';

export interface BrandInfo {
  count: number;
  name: string;
}

export interface FeaturesItemsList {
  count: number;
  isVisible: boolean[];
}

export default class HomePage extends BasePage {
  readonly navBarLinks: Locator;
  private readonly home: Locator;
  private readonly accordian: Locator;
  private readonly categoryHeaders: Locator;
  private readonly categoryPanels: Locator;
  private readonly itemList: Locator;
  private readonly featuresItemsWrapper: Locator;
  private readonly productImageWrapper: Locator;
  private readonly productOverlayClass: Locator;
  private readonly overlayContent: Locator;
  private readonly brandsNameWrapper: Locator;

  constructor(page: Page) {
    super(page);

    this.navBarLinks = page.locator('.nav.navbar-nav li a');
    this.home = page.getByRole('link', { name: 'Home ' });
    this.accordian = page.locator('.category-products .badge');
    this.categoryHeaders = page.locator('.panel-title');
    this.categoryPanels = page.locator('.category-products .panel');
    this.itemList = page.locator('.panel-body ul');
    this.featuresItemsWrapper = page.locator('.features_items');
    this.productImageWrapper = page.locator('.product-image-wrapper');
    this.productOverlayClass = page.locator('.product-overlay');
    this.overlayContent = page.locator('.overlay-content');
    this.brandsNameWrapper = page.locator('div.brands-name');
  }

  async goToHome(): Promise<string> {
    return await this.goto();
  }

  /**
   * Returns text content of all visible navigation bar links.
   */
  async getNavBarLinksText(): Promise<(string | null)[]> {
    const navItems = await this.navBarLinks.all();
    const navTextList: (string | null)[] = [];

    for (const item of navItems) {
      const itemText = await item.textContent();
      navTextList.push(itemText);
    }

    return navTextList;
  }

  async getAllCategoryHeaders(): Promise<string[]> {
    const categories = await this.categoryHeaders.allTextContents();

    return categories.map((t) => t.trim());
  }

  /**
   * Expands a category accordion at the given index.
   */
  private async expandCategoryAccordion(index: number): Promise<void> {
    const productLink = this.accordian.nth(index);
    await productLink.click();
  }

  /**
   * Gets the category name at the given index.
   */
  private async getCategoryName(index: number): Promise<string> {
    const categories = await this.getAllCategoryHeaders();
    return categories[index];
  }

  /**
   * Gets the raw products list for a category at the given index.
   */
  private async getRawCategoryProductsList(index: number): Promise<string[]> {
    const productsPanelList = await this.itemList.nth(index).allInnerTexts();
    return productsPanelList;
  }

  /**
   * Parses and cleans raw product text into an array of product names.
   */
  private parseCategoryProducts(rawText: string[]): string[] {
    return rawText
      .flatMap((text) => text.split('\n'))
      .map((t) => t.trim())
      .filter((t) => t.length > 0);
  }

  /**
   * Expands each category accordion panel, collects items inside,
   * and returns an object mapping category name to its product list.
   */
  async getExpandedCategoryProducts(): Promise<Record<string, string[]>> {
    const productsCount = await this.accordian.count();
    const result: Record<string, string[]> = {};

    for (let i = 0; i < productsCount; i++) {
      await this.expandCategoryAccordion(i);
      const categoryName = await this.getCategoryName(i);
      const rawProductsList = await this.getRawCategoryProductsList(i);
      const parsedProducts = this.parseCategoryProducts(rawProductsList);

      result[categoryName] = parsedProducts;
    }

    return result;
  }

  async getBrandNameAndCount(): Promise<BrandInfo[]> {
    await this.brandsNameWrapper.waitFor({ state: 'visible' });
    const brandItem = await this.brandsNameWrapper.locator('ul li').allTextContents();

    return brandItem.map((item) => {
      const match = item.match(/\((\d+)\)(.+)/);

      if (!match) {
        throw new Error(`Unexpected brand format: ${item}`);
      }

      return {
        count: Number(match[1]),
        name: match[2].trim(),
      };
    });
  }

  async totalBrandsCount(): Promise<number> {
    const getCount = await this.getBrandNameAndCount();

    return getCount.reduce((sum, brand) => sum + Number(brand.count), 0);
  }

  /**
   * Gets the total count of feature items products.
   */
  private async getProductCount(): Promise<number> {
    await this.featuresItemsWrapper.waitFor({ state: 'visible' });
    const products = this.featuresItemsWrapper.locator(this.productImageWrapper);
    return await products.count();
  }

  /**
   * Checks if a product at the given index is visible.
   */
  private async getProductVisibility(index: number): Promise<boolean> {
    await this.featuresItemsWrapper.waitFor({ state: 'visible' });
    const products = this.featuresItemsWrapper.locator(this.productImageWrapper);
    return await products.nth(index).isVisible();
  }

  async getFeaturesItemsList(): Promise<FeaturesItemsList> {
    const productsCount = await this.getProductCount();
    const productsAreVisible: boolean[] = [];

    for (let i = 0; i < productsCount; i++) {
      const isVisible = await this.getProductVisibility(i);
      productsAreVisible.push(isVisible);
    }

    return { count: productsCount, isVisible: productsAreVisible };
  }

  async productOverlay(): Promise<string[]> {
    await this.productImageWrapper.first().waitFor({ state: 'visible' });
    await this.productImageWrapper.first().hover();
    await this.productOverlayClass.first().waitFor({ state: 'visible' });
    await this.overlayContent.first().waitFor({ state: 'visible' });

    const trimmedText = await this.overlayContent.first().textContent();
    const overlayedTextTrimmed = (trimmedText ?? '')
      .split('\n')
      .map((t) => t.trim())
      .filter((t) => t !== '');

    return overlayedTextTrimmed;
  }
}
