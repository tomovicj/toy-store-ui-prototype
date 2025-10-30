import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Output,
  signal,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Toy } from '../../../models/toy';
import { ToyService } from '../../../services/toy';
import { Review } from '../../../models/review';
import { AuthService } from '../../../services/auth';
import { Modal } from 'bootstrap';
import { UtilService } from '../../../services/util';

@Component({
  selector: 'app-rate-a-toy',
  imports: [ReactiveFormsModule],
  templateUrl: './rate-a-toy.html',
  styleUrl: './rate-a-toy.css',
})
export class RateAToy implements AfterViewInit {
  constructor(
    private toyService: ToyService,
    private authService: AuthService,
    private utilService: UtilService
  ) {}

  @Output() onRated = new EventEmitter<{ toyId: string; review: Review }>();

  @ViewChild('rateAToyModal') modalElement!: ElementRef;

  toy = signal<Toy | null>(null);
  orderId = signal<string | null>(null);
  private modalInstance: Modal | null = null;

  form = new FormGroup({
    rating: new FormControl('', [Validators.required, Validators.min(1), Validators.max(5)]),
    review: new FormControl('', [Validators.required]),
  });

  ngAfterViewInit() {
    const modal = this.modalElement.nativeElement;
    this.modalInstance = new Modal(modal);

    modal.addEventListener('show.bs.modal', (event: any) => {
      const button = event.relatedTarget;
      const toyId = button.getAttribute('data-bs-toy-id');
      if (toyId) {
        this.toy.set(this.toyService.getToyById(toyId));
      }
      const orderId = button.getAttribute('data-bs-order-id');
      if (orderId) {
        this.orderId.set(orderId);
      }
    });
    modal.addEventListener('hidden.bs.modal', () => {
      this.toy.set(null);
      this.form.reset();
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const toy = this.toy();
    const orderId = this.orderId();
    if (toy && orderId) {
      const review: Review = {
        rating: Number(this.form.value.rating!),
        comment: this.form.value.review!,
        date: new Date().toISOString(),
        customerId: this.authService.getLoggedInCustomer()!.id,
        orderId: orderId,
      };

      this.toyService.addReview(toy.id, review);
      this.onRated.emit({ toyId: toy.id, review: review });
    }

    this.utilService.closeModal(this.modalInstance!);
  }
}
