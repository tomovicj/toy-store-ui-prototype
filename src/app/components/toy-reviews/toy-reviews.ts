import { Component, input } from '@angular/core';
import { Review } from '../../models/review';
import { UtilService } from '../../services/util';
import { CustomerService } from '../../services/customer';

@Component({
  selector: 'app-toy-reviews',
  imports: [],
  templateUrl: './toy-reviews.html',
  styleUrl: './toy-reviews.css',
})
export class ToyReviews {
  constructor(private customerService: CustomerService, public utilService: UtilService) {}

  reviews = input<Review[]>([]);

  private customerNameCache = new Map<string, string>();

  getCustomerName(customerId: string) {
    if (this.customerNameCache.has(customerId)) {
      return this.customerNameCache.get(customerId);
    }

    const customer = this.customerService.getCustomerById(customerId);
    let fullName: string;
    if (customer) {
      fullName = customer.firstName + ' ' + customer.lastName;
    } else {
      fullName = this.utilService.getRandomName();
    }

    this.customerNameCache.set(customerId, fullName);
    return fullName;
  }
}
