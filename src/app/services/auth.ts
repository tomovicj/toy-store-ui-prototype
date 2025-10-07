import { Injectable } from '@angular/core';
import { Customer } from '../models/customer';

export type SignUpData = Omit<Customer, 'id' | 'orders'>;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor() {
    const customers = this.getCustomers();
    if (customers.length === 0) {
      this.signUp({
        firstName: 'Example',
        lastName: 'User',
        email: 'example.user@email.com',
        phoneNumber: '123-456-7890',
        address: '123 Main St',
        favoriteCategories: [],
        password: 'password',
      });
    }
  }

  getCustomers(): Customer[] {
    return JSON.parse(localStorage.getItem('customers') || '[]') as Customer[];
  }

  isLoggedIn(): boolean {
    const loggedInCustomerId = localStorage.getItem('loggedInCustomer');
    return loggedInCustomerId !== null;
  }

  getLoggedInCustomer(): Customer | null {
    const loggedInCustomerId = localStorage.getItem('loggedInCustomer');
    if (!loggedInCustomerId) {
      return null;
    }

    const customers = this.getCustomers();
    const loggedInCustomer = customers.find((customer) => customer.id === loggedInCustomerId);
    return loggedInCustomer || null;
  }

  signUp(data: SignUpData): Customer {
    const customers = this.getCustomers();
    const existingCustomer = customers.find((customer) => customer.email === data.email);
    if (existingCustomer) {
      throw new Error('Email already in use');
    }

    const customer: Customer = {
      id: crypto.randomUUID(),
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phoneNumber: data.phoneNumber,
      address: data.address,
      favoriteCategories: data.favoriteCategories,
      password: data.password,
      orders: [],
    };

    customers.push(customer);
    localStorage.setItem('customers', JSON.stringify(customers));

    this.login(data.email, data.password);
    return customer;
  }

  login(email: string, password: string): Customer | null {
    const customers = this.getCustomers();
    const customer = customers.find(
      (customer) => customer.email === email && customer.password === password
    );

    if (!customer) {
      return null;
    }

    localStorage.setItem('loggedInCustomer', customer.id);
    return customer;
  }

  logout(): void {
    localStorage.removeItem('loggedInCustomer');
  }
}
