import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Toy } from '../../models/toy';
import { ToyService } from '../../services/toy';
import { UtilService } from '../../services/util';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToyReviews } from '../../components/toy-reviews/toy-reviews';
import { ToyReserved } from '../../components/modals/toy-reserved/toy-reserved';
import { AuthService } from '../../services/auth';
import { CustomerService } from '../../services/customer';
import { Location, NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-toy',
  imports: [ReactiveFormsModule, ToyReviews, ToyReserved, NgOptimizedImage],
  templateUrl: './toy.html',
  styleUrl: './toy.css',
})
export class ToyPage implements OnInit {
  @ViewChild(ToyReserved) toyReservedModal!: ToyReserved;

  toy = signal<Toy | null>(null);
  reservationForm = new FormGroup({
    quantity: new FormControl('1', [
      Validators.required,
      Validators.pattern(/^[0-9]+$/),
      Validators.min(1),
    ]),
  });

  constructor(
    private router: Router,
    private location: Location,
    private route: ActivatedRoute,
    private toyService: ToyService,
    private customerService: CustomerService,
    private authService: AuthService,
    public utilService: UtilService
  ) {}

  ngOnInit(): void {
    const toyId = this.route.snapshot.paramMap.get('id');
    if (toyId) {
      const toy = this.toyService.getToyById(toyId);
      if (toy) {
        this.toy.set(toy);
        return;
      }
    }

    this.router.navigateByUrl('/');
  }

  navigateBack() {
    this.location.back();
  }

  onReserve() {
    const customer = this.authService.getLoggedInCustomer();
    if (!customer) {
      this.router.navigateByUrl('/login');
      return;
    }

    if (this.reservationForm.invalid) {
      this.reservationForm.markAllAsTouched();
      return;
    }

    const toyId = this.toy()!.id;
    const quantity = parseInt(this.reservationForm.value.quantity!);

    this.customerService.reserveToy(
      customer.id,
      toyId,
      quantity
    );

    this.reservationForm.reset({ quantity: '1' });
    this.reservationForm.markAsUntouched();
    this.toyReservedModal?.show(toyId, quantity);
  }

  getAverageRating() {
    return this.toyService.getAverageRating(this.toy()!.id);
  }
}
