import { type APIRequestContext, type APIResponse } from '@playwright/test';

export interface ApiResponse {
  response: APIResponse;
  jsonResponse: Record<string, unknown>;
}

export default class RequestsApi {
  private request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  async createAccount(body: Record<string, string>): Promise<ApiResponse> {
    const response = await this.request.post('/api/createAccount', {
      form: body,
    });

    const bufferParse = await response.body();
    const jsonResponse = JSON.parse(bufferParse.toString());

    return { response, jsonResponse };
  }

  async loginUser(body: Record<string, string>): Promise<ApiResponse> {
    const response = await this.request.post('/api/verifyLogin', {
      form: body,
    });

    const bufferParse = await response.body();
    const jsonResponse = JSON.parse(bufferParse.toString());

    return { response, jsonResponse };
  }

  async deleteAccount(body: Record<string, string>): Promise<ApiResponse> {
    const response = await this.request.delete('/api/deleteAccount', {
      form: body,
    });

    const bufferParse = await response.body();
    const jsonResponse = JSON.parse(bufferParse.toString());

    return { response, jsonResponse };
  }

  async getProductsList(): Promise<ApiResponse> {
    const response = await this.request.get('/api/productsList');

    if (!response.ok()) {
      throw new Error(`GET /api/productsList failed with status ${response.status()}`);
    }

    const bufferParse = await response.body();
    const jsonResponse = JSON.parse(bufferParse.toString());

    return { response, jsonResponse };
  }

  async searchProduct(body: Record<string, string>): Promise<ApiResponse> {
    const response = await this.request.post('/api/searchProduct', {
      form: body,
    });

    if (!response.ok()) {
      throw new Error(`POST /api/searchProduct failed with status ${response.status()}`);
    }

    const bufferParse = await response.body();
    const jsonResponse = JSON.parse(bufferParse.toString());

    return { response, jsonResponse };
  }

  async exchangeCurrency(): Promise<Record<string, unknown>> {
    const response = await this.request.get(
      'https://kurs.resenje.org/api/v1/currencies/usd/rates/today',
    );

    if (!response.ok()) {
      throw new Error(`Exchange rate API failed with status ${response.status()}`);
    }

    return response.json();
  }
}
