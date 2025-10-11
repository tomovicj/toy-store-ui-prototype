import { Component, input } from '@angular/core';
import { Toy } from '../../models/toy';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CustomerService } from '../../services/customer';
import { UtilService } from '../../services/util';
import { AuthService } from '../../services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-toy-card',
  imports: [ReactiveFormsModule],
  templateUrl: './toy-card.html',
  styleUrl: './toy-card.css',
})
export class ToyCard {
  constructor(
    private router: Router,
    private authService: AuthService,
    private customerService: CustomerService,
    public utilService: UtilService
  ) {}

  toy = input<Toy>({
    id: '',
    name: '',
    description: '',
    category: '',
    forAgeGroup: '0-2',
    forGender: 'unisex',
    manufactureDate: '',
    price: 0,
    imageUrl: '',
    reviews: [],
  });

  form: FormGroup = new FormGroup({
    quantity: new FormControl(1, [
      Validators.required,
      Validators.pattern(/^[0-9]+$/),
      Validators.min(1),
    ]),
  });

  onReserve() {
    const customer = this.authService.getLoggedInCustomer();
    if (!customer) {
      this.router.navigateByUrl('/login');
      return;
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.customerService.reserveToy(customer.id, this.toy().id, this.form.value.quantity);
  }
}
