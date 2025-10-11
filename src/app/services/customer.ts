import { Injectable } from '@angular/core';
import { Customer } from '../models/customer';
import { Order } from '../models/order';
import { ToyService } from './toy';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  constructor(private toyService: ToyService) {}

  getCustomers(): Customer[] {
    const customers = localStorage.getItem('customers');
    return customers ? JSON.parse(customers) : [];
  }

  getCustomerById(id: string): Customer | null {
    const customers = this.getCustomers();
    return customers.find((c) => c.id === id) || null;
  }

  saveCustomer(customer: Customer) {
    const customers = this.getCustomers();
    const index = customers.findIndex((c) => c.id === customer.id);
    if (index !== -1) {
      customers[index] = customer;
    } else {
      customers.push(customer);
    }

    localStorage.setItem('customers', JSON.stringify(customers));
  }

  reserveToy(customerId: string, toyId: string, quantity: number) {
    const customer = this.getCustomerById(customerId);
    if (!customer) {
      throw new Error('Customer not found');
    }

    const toy = this.toyService.getToyById(toyId);
    if (!toy) {
      throw new Error('Toy not found');
    }

    const order: Order = {
      id: crypto.randomUUID(),
      toyId,
      quantity,
      orderDate: new Date().toISOString(),
      status: 'reserved',
    };

    customer.orders.push(order);
    this.saveCustomer(customer);
    return order;
  }

  orderArrived(customerId: string, orderId: string) {
    const customer = this.getCustomerById(customerId);
    if (!customer) {
      throw new Error('Customer not found');
    }

    const order = customer.orders.find((o) => o.id === orderId);
    if (!order) {
      throw new Error('Order not found');
    }

    order.status = 'arrived';
    this.saveCustomer(customer);
    return order;
  }

  cancelOrder(customerId: string, orderId: string) {
    const customer = this.getCustomerById(customerId);
    if (!customer) {
      throw new Error('Customer not found');
    }

    const order = customer.orders.find((o) => o.id === orderId);
    if (!order) {
      throw new Error('Order not found');
    }

    order.status = 'canceled';
    this.saveCustomer(customer);
    return order;
  }
}
