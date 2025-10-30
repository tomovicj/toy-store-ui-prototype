import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Output,
  signal,
  ViewChild,
} from '@angular/core';
import { CustomerService } from '../../../services/customer';
import { AuthService } from '../../../services/auth';
import { Modal } from 'bootstrap';
import { UtilService } from '../../../services/util';
import { ToyService } from '../../../services/toy';
import { Toy } from '../../../models/toy';

@Component({
  selector: 'app-cancel-order',
  imports: [],
  templateUrl: './cancel-order.html',
  styleUrl: './cancel-order.css',
})
export class CancelOrder implements AfterViewInit {
  constructor(
    private authService: AuthService,
    private customerService: CustomerService,
    private toyService: ToyService,
    private utilService: UtilService
  ) {}

  @Output() onCancel = new EventEmitter<string>();

  @ViewChild('cancelOrderModal') modalElement!: ElementRef;

  orderId = signal<string | null>(null);
  toy = signal<Toy | null>(null);
  private modalInstance: Modal | null = null;

  ngAfterViewInit() {
    const modal = this.modalElement.nativeElement;
    this.modalInstance = new Modal(modal);

    modal.addEventListener('show.bs.modal', (event: any) => {
      const button = event.relatedTarget;

      const orderId = button.getAttribute('data-bs-order-id');
      if (orderId) {
        this.orderId.set(orderId);
      }

      const toyId = button.getAttribute('data-bs-toy-id');
      if (toyId) {
        this.toy.set(this.toyService.getToyById(toyId));
      }
    });
    modal.addEventListener('hidden.bs.modal', () => {
      this.orderId.set(null);
      this.toy.set(null);
    });
  }

  onConfirmCancel() {
    const orderId = this.orderId();
    const customer = this.authService.getLoggedInCustomer();

    if (orderId && customer) {
      this.customerService.cancelOrder(customer.id, orderId);
      this.onCancel.emit(orderId);
    }

    this.utilService.closeModal(this.modalInstance!);
  }
}
