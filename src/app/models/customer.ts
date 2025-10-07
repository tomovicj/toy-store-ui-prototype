import { Order } from './order';

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
  favoriteCategory: string;
  password: string;
  orders: Order[];
}
