
export interface Product {
  id: string;
  title: string;
  sourceUrl: string;
  supplierName: string;
  supplierPrice: number;
  listingPrice: number;
  inventoryCount: number;
  images: string[];
  status: 'active' | 'out_of_stock' | 'syncing' | 'draft';
  platform: 'ebay' | 'shopify' | 'both';
  lastSync: string;
  roi?: number;
  profit?: number;
}

export interface Order {
  id: string;
  customerName: string;
  productTitle: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  platform: 'ebay' | 'shopify';
  trackingNumber?: string;
  orderDate: string;
}

export interface MarketTrend {
  productName: string;
  demandLevel: 'high' | 'medium' | 'low';
  estimatedProfit: string;
  competitionLevel: string;
  reasoning: string;
}

export interface UserStats {
  totalSales: number;
  activeListings: number;
  syncCount: number;
  totalProfit: number;
  ordersProcessed: number;
}
