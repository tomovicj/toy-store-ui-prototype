import { Component, input } from '@angular/core';
import { Review } from '../../models/review';
import { ToyService } from '../../services/toy';
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

  getCustomerName(customerId: string) {
    const customer = this.customerService.getCustomerById(customerId);
    if (!customer) {
      return this.utilService.getRandomName();
    }
    return customer.firstName + ' ' + customer.lastName;
  }
}
