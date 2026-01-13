
export enum Category {
  Sarees = 'Sarees',
  Earrings = 'Earrings',
  Neckpieces = 'Neckpieces',
  Rings = 'Rings',
  NosePins = 'Nose Pins',
  Anklets = 'Anklets',
  Lehenga = 'Lehenga'
}

export const ELIGIBLE_FOR_OFFER = [
  Category.Earrings,
  Category.Neckpieces,
  Category.Rings,
  Category.NosePins,
  Category.Anklets
];

export interface Product {
  id: string;
  name: string;
  code: string;
  category: Category;
  shortDescription: string;
  longDescription: string;
  price: number;
  discount: number; // Percentage
  material: string;
  deliveryTimeline: string;
  showOnHomepage: boolean;
  images: string[];
  rating: number;
  deliveryDate: string;
  buy2get1Eligible: boolean;
  viewsCount: number;
  whatsappClicks: number;
  isSoldOut: boolean;
  fastSelling?: boolean;
  trending?: boolean;
  limitedStock?: boolean;
  createdAt: number;
}

export interface CartItem extends Product {
  quantity: number;
  isFree?: boolean;
}

export interface Coupon {
  id?: string;
  code: string;
  type: 'percentage' | 'flat';
  value: number;
  isActive: boolean;
}

export interface GlobalSettings {
  buy2get1Enabled: boolean;
}

export interface AnalyticsData {
  totalViews: number;
  totalWhatsAppClicks: number;
  productPerformance: {
    productId: string;
    name: string;
    views: number;
    clicks: number;
  }[];
}
