
import { CartItem } from '../models/sale.model';

const API_URL = '/api/admin/sales';

interface SalePayload {
  total: number;
  items: {
      product_id: number;
      quantity: number;
      unit_price: number | string;
      subtotal: number;
  }[];
}

import { fetchWithAuth } from '../../../../utils/api';

export const SalesService = {
  create: async (token: string, payload: SalePayload): Promise<void> => {
    const res = await fetchWithAuth(API_URL, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error("Error recording sale");
  },

  getAll: async (token: string, startDate?: string, endDate?: string): Promise<any[]> => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);

    const res = await fetchWithAuth(`${API_URL}?${params.toString()}`);
    if (!res.ok) throw new Error("Error fetching sales history");
    return res.json();
  },

  getById: async (token: string, id: number): Promise<any> => {
    const res = await fetchWithAuth(`${API_URL}/${id}`);
    if (!res.ok) throw new Error("Error fetching sale details");
    return res.json();
  }
};
