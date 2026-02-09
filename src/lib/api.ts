// API Configuration
export const API_CONFIG = {
  // Replace with your actual Google Apps Script Web App URL
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || '',
  // This will be set after login
  TOKEN: '',
};

export function setAPIToken(token: string) {
  API_CONFIG.TOKEN = token;
  if (typeof window !== 'undefined') {
    localStorage.setItem('api_token', token);
  }
}

export function getAPIToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('api_token');
  }
  return null;
}

export function clearAPIToken() {
  API_CONFIG.TOKEN = '';
  if (typeof window !== 'undefined') {
    localStorage.removeItem('api_token');
    localStorage.removeItem('api_url');
  }
}

export function setAPIURL(url: string) {
  API_CONFIG.BASE_URL = url;
  if (typeof window !== 'undefined') {
    localStorage.setItem('api_url', url);
  }
}

export function getAPIURL(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('api_url');
  }
  return null;
}

// API Call Function
export async function callAPI(action: string, data: any = {}) {
  const token = getAPIToken();
  const baseURL = getAPIURL();

  if (!token || !baseURL) {
    throw new Error('Not authenticated. Please login first.');
  }

  const payload = {
    action,
    token,
    ...data,
  };

  try {
    const response = await fetch(baseURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      mode: 'no-cors', // Required for Google Apps Script
    });

    // Note: no-cors mode doesn't allow reading response
    // We'll need to handle this differently
    return { success: true };
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// Alternative: Use Apps Script with redirect handling
export async function callAPIWithResponse(action: string, data: any = {}) {
  const token = getAPIToken();
  let baseURL = getAPIURL();

  if (!token || !baseURL) {
    throw new Error('Not authenticated. Please login first.');
  }

  const payload = {
    action,
    token,
    ...data,
  };

  try {
    const response = await fetch(baseURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
      },
      body: JSON.stringify(payload),
      redirect: 'follow',
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error: any) {
    console.error('API Error:', error);
    throw new Error(error.message || 'Failed to connect to API');
  }
}

// Specific API Functions
export const api = {
  generateKitchenList: async (date: string, mealType: string, skipOrders: string[] = []) => {
    return callAPIWithResponse('generateKitchenList', { date, mealType, skipOrders });
  },

  getOrders: async () => {
    return callAPIWithResponse('getOrders', {});
  },

  getDashboardStats: async () => {
    return callAPIWithResponse('getDashboardStats', {});
  },

  getKitchenOrderList: async () => {
    return callAPIWithResponse('getKitchenOrderList', {});
  },

  updatePaymentStatus: async (orderNumber: string, paymentStatus: string) => {
    return callAPIWithResponse('updatePaymentStatus', { orderNumber, paymentStatus });
  },

  updateOrderStatus: async (orderNumber: string, status: string) => {
    return callAPIWithResponse('updateOrderStatus', { orderNumber, status });
  },

  createOrder: async (orderData: any) => {
    return callAPIWithResponse('createOrder', { orderData });
  },
};
