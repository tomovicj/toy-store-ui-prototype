import { Injectable } from '@angular/core';
import { Customer } from '../models/customer';
import { CustomerService } from './customer';

export type SignUpData = Omit<Customer, 'id' | 'orders'>;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private customerService: CustomerService) {
    const customers = this.customerService.getCustomers();
    if (customers.length === 0) {
      this.signUp({
        firstName: 'Example',
        lastName: 'User',
        email: 'example.user@email.com',
        phoneNumber: '+38123456789',
        address: '123 Main St',
        favoriteCategory: '',
        password: 'password',
      });
    }
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

    return this.customerService.getCustomerById(loggedInCustomerId);
  }

  signUp(data: SignUpData): Customer | null {
    const customers = this.customerService.getCustomers();
    const existingCustomer = customers.find((customer) => customer.email === data.email);
    if (existingCustomer) {
      return null;
    }

    const customer: Customer = {
      id: crypto.randomUUID(),
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phoneNumber: data.phoneNumber,
      address: data.address,
      favoriteCategory: data.favoriteCategory,
      password: data.password,
      orders: [],
    };

    this.customerService.saveCustomer(customer);

    this.login(data.email, data.password);
    return customer;
  }

  login(email: string, password: string): Customer | null {
    const customers = this.customerService.getCustomers();
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
