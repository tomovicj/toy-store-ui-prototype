import { Component, EventEmitter, input, Output } from '@angular/core';
import { Toy } from '../../models/toy';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CustomerService } from '../../services/customer';
import { UtilService } from '../../services/util';
import { AuthService } from '../../services/auth';
import { Router } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-toy-card',
  imports: [ReactiveFormsModule, NgOptimizedImage],
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

  prioritizeImage = input<boolean>(false);

  @Output() reserved = new EventEmitter<{ toyId: string; quantity: number }>();

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

    const toyId = this.toy().id;
    const quantity = this.form.value.quantity;

    this.customerService.reserveToy(customer.id, toyId, quantity);
    this.form.reset({ quantity: 1 });
    this.reserved.emit({ toyId, quantity });
  }

  onClick(event: MouseEvent) {
    event.stopPropagation();

    // Prevent navigation when clicking on button or input
    const target = event.target as HTMLElement;
    if (target.tagName === 'BUTTON' || target.closest('button')) return;
    if (target.tagName === 'INPUT' || target.closest('input')) return;

    this.router.navigate(['/toy', this.toy().id]);
  }
}
