export type Category = 'coffee' | 'equipment' | 'apparel' | 'home';

export interface ColorOption {
  name: string;
  hex: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: Category;
  price: number; // RON
  compareAtPrice?: number; // old price for "sale" badge
  description: string;
  emoji: string; // product "photo" is a generated illustration
  hue: number; // background hue for the illustration
  sizes?: string[];
  colors?: ColorOption[];
  stock: number;
  rating: number;
  tags: string[];
}

export interface CartItem {
  key: string; // productId + variant, so S and M are different lines
  productId: string;
  size?: string;
  color?: string;
  qty: number;
}

export interface Coupon {
  code: string;
  type: 'percent' | 'fixed';
  value: number;
  minSubtotal?: number;
  description: string;
}

export interface Totals {
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
}

export type OrderStatus = 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderLine {
  productId: string;
  name: string;
  variant: string;
  unitPrice: number;
  qty: number;
}

export interface Customer {
  name: string;
  email: string;
  address: string;
  city: string;
}

export interface Order {
  id: string;
  lines: OrderLine[];
  totals: Totals;
  coupon?: string;
  customer: Customer;
  status: OrderStatus;
  createdAt: string;
}
