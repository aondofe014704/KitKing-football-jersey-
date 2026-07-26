export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'REFUNDED';

export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
export type PaymentMethod = 'PAYSTACK' | 'FLUTTERWAVE' | 'BANK_TRANSFER' | 'COD';

export interface OrderItem {
  id: string;
  productName: string;
  productImage: string;
  size: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  productId: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  paymentReference?: string;
  trackingNumber?: string;
  notes?: string;
  couponCode?: string;
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  userId: string;
  items: OrderItem[];
  shippingAddress?: {
    fullName: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    country: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  id: number;
  quantity: number;
  productId: string;
  variantId: string;
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    comparePrice?: number;
    images: { url: string; isPrimary: boolean }[];
    team?: string;
    league?: string;
  };
  variant: {
    id: string;
    size: string;
    stock: number;
  };
}

export interface WishlistItem {
  id: string;
  productId: string;
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    comparePrice?: number;
    images: { url: string; isPrimary: boolean }[];
    averageRating?: number;
    team?: string;
    league?: string;
  };
  createdAt: string;
}

export interface DeliveryZone {
  id: string;
  name: string;
  states: string[];
  cities: string[];
  shippingFee: number;
  estimatedDays: number;
}

export interface Coupon {
  id: string;
  code: string;
  type: 'PERCENTAGE' | 'FIXED';
  value: number;
  minOrderAmount?: number;
  description?: string;
}
