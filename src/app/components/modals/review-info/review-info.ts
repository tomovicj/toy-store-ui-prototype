import { AfterViewInit, Component, ElementRef, signal, ViewChild } from '@angular/core';
import { ToyService } from '../../../services/toy';
import { Review } from '../../../models/review';
import { Modal } from 'bootstrap';
import { Toy } from '../../../models/toy';
import { UtilService } from '../../../services/util';

@Component({
  selector: 'app-review-info',
  imports: [],
  templateUrl: './review-info.html',
  styleUrl: './review-info.css',
})
export class ReviewInfo implements AfterViewInit {
  constructor(private toyService: ToyService, public utilService: UtilService) {}

  @ViewChild('reviewInfoModal') modalElement!: ElementRef;

  review = signal<Review | null>(null);
  toy = signal<Toy | null>(null);
  private modalInstance: Modal | null = null;

  ngAfterViewInit() {
    const modal = this.modalElement.nativeElement;
    this.modalInstance = new Modal(modal);

    modal.addEventListener('show.bs.modal', (event: any) => {
      const button = event.relatedTarget;

      const toyId = button.getAttribute('data-bs-toy-id');
      const orderId = button.getAttribute('data-bs-order-id');
      if (toyId && orderId) {
        const toy = this.toyService.getToyById(toyId);
        this.toy.set(toy);
        const review = this.toyService.getReviewByOrderId(toyId, orderId);
        this.review.set(review);
      }
    });
    modal.addEventListener('hidden.bs.modal', () => {
      this.review.set(null);
    });
  }
}
