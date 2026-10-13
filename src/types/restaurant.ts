export type ProductCategory = 
  | 'todos'
  | 'massas'
  | 'pizzas'
  | 'antipasti'
  | 'sobremesas'
  | 'bebidas';

export interface ExtraOption {
  id: string;
  name: string;
  price: number;
}

export interface Product {
  id: string;
  name: string;
  italianName: string;
  description: string;
  price: number;
  category: 'massas' | 'pizzas' | 'antipasti' | 'sobremesas' | 'bebidas';
  imageUrl: string;
  tags?: string[];
  isGlutenFree?: boolean;
  isVegetarian?: boolean;
  prepTimeMinutes?: number;
  hasCookingPoint?: boolean;
  cookingPoints?: string[];
  hasCheeseOption?: boolean;
  cheeseOptions?: string[];
  availableExtras?: ExtraOption[];
}

export interface CartItemExtra {
  id: string;
  name: string;
  price: number;
}

export interface CartItem {
  cartItemId: string;
  product: Product;
  quantity: number;
  cookingPoint?: string;
  cheeseOption?: string;
  selectedExtras: CartItemExtra[];
  notes?: string;
  unitPrice: number;
  itemTotal: number;
}

export type DiningOption = 'dine-in' | 'takeaway';

export type PaymentMethod = 'pix' | 'credit_card' | 'debit_card' | 'counter';

export type OrderStatus = 'received' | 'preparing' | 'ready' | 'delivered';

export interface Order {
  id: string;
  orderNumber: string; // ex: #101
  customerName: string;
  customerPhone?: string;
  diningOption: DiningOption;
  tableNumber?: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: 'paid' | 'pending';
  status: OrderStatus;
  estimatedTimeMinutes: number;
  createdAt: string;
  syncedToSupabase?: boolean;
}

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  isConnected: boolean;
}
