import { AfterViewInit, Component, ElementRef, signal, ViewChild } from '@angular/core';
import { Toy } from '../../../models/toy';
import { Modal } from 'bootstrap';
import { ToyService } from '../../../services/toy';
import { Router } from '@angular/router';
import { UtilService } from '../../../services/util';

@Component({
  selector: 'app-toy-reserved',
  imports: [],
  templateUrl: './toy-reserved.html',
  styleUrl: './toy-reserved.css',
})
export class ToyReserved implements AfterViewInit {
  constructor(
    private toyService: ToyService,
    private router: Router,
    public utilService: UtilService
  ) {}

  @ViewChild('toyReservedModal') modalElement!: ElementRef;

  toy = signal<Toy | null>(null);
  quantity = signal<number>(0);
  private modalInstance: Modal | null = null;

  ngAfterViewInit() {
    const modal = this.modalElement.nativeElement;
    this.modalInstance = new Modal(modal);
    modal.addEventListener('hidden.bs.modal', () => {
      this.toy.set(null);
      this.quantity.set(0);
    });
  }

  show(toyId: string, quantity: number) {
    const toy = this.toyService.getToyById(toyId);
    if (toy) {
      this.toy.set(toy);
      this.quantity.set(quantity);
      this.modalInstance?.show();
    }
  }

  hide() {
    this.modalInstance?.hide();
  }

  goToCart() {
    this.hide();
    this.router.navigateByUrl('/profile');
  }
}
