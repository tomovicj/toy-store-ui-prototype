import { Component, OnInit, signal } from '@angular/core';
import { Order } from '../../models/order';
import { UtilService } from '../../services/util';
import { ToyService } from '../../services/toy';
import { CustomerService } from '../../services/customer';
import { AuthService } from '../../services/auth';
import { RateAToy } from '../modals/rate-a-toy/rate-a-toy';

@Component({
  selector: 'app-order-table',
  imports: [RateAToy],
  templateUrl: './order-table.html',
  styleUrl: './order-table.css',
})
export class OrderTable implements OnInit {
  constructor(
    public utilService: UtilService,
    private toyService: ToyService,
    private customerService: CustomerService,
    private authService: AuthService
  ) {}

  orders = signal<Order[]>([]);

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    const customer = this.authService.getLoggedInCustomer();
    if (!customer) {
      // This should not happen as the component is only accessible to logged-in users
      throw new Error('No logged in customer');
    }

    this.orders.set(customer.orders);
  }

  getToyName(orderId: string): string {
    const toy = this.toyService.getToyById(orderId);
    return toy ? toy.name : 'Unknown Toy';
  }

  getToyImage(orderId: string): string {
    const toy = this.toyService.getToyById(orderId);
    return toy ? toy.imageUrl : '';
  }

  orderArrived(orderId: string): void {
    const customer = this.authService.getLoggedInCustomer();
    if (!customer) {
      // This should not happen as the component is only accessible to logged-in users
      throw new Error('No logged in customer');
    }

    this.customerService.orderArrived(customer.id, orderId);
    this.loadOrders();
  }

  cancelOrder(orderId: string): void {
    const customer = this.authService.getLoggedInCustomer();
    if (!customer) {
      // This should not happen as the component is only accessible to logged-in users
      throw new Error('No logged in customer');
    }

    this.customerService.cancelOrder(customer.id, orderId);
    this.loadOrders();
  }
}
