export interface Order {
  toyId: string;
  quantity: number;
  orderDate: string; // ISO date string
  status: 'reserved' | 'arrived' | 'canceled';
}
