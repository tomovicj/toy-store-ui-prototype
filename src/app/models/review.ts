export interface Review {
  customerId: string;
  orderId: string;
  rating: number;
  comment: string;
  date: string; // ISO date string
}
