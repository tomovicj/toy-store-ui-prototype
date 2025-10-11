export interface Order {
  id: string;
  toyId: string;
  quantity: number;
  orderDate: string; // ISO date string
  status: 'reserved' | 'arrived' | 'canceled';
}
