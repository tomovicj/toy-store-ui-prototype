import { Injectable } from '@angular/core';
import { Modal } from 'bootstrap';

@Injectable({
  providedIn: 'root',
})
export class UtilService {
  private priceFormatter = new Intl.NumberFormat('sr-RS', {
    style: 'currency',
    currency: 'RSD',
  });

  formatPrice(price: number): string {
    return this.priceFormatter.format(price);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('sr-RS', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    });
  }

  getRandomName(): string {
    const names = [
      'Nataniel Lawson',
      'Anoushka Hodge',
      'Raymond Ruiz',
      'Athena Mcbride',
      'Abdullah Leon',
      'Diana Sloan',
      'Thalia Bass',
      'Yusuf Burke',
      'Johnny Welsh',
      'Yasin May',
      'Spencer Nixon',
      'Sanaa Sanders',
      'Darius Barnes',
      'Chloe Ellis',
      'Jack Solis',
      'Subhan Maddox',
      'Chris Winter',
      'Genevieve Reeves',
      'Libbie Peters',
      'Myles Delacruz',
    ];
    return names[Math.floor(Math.random() * names.length)];
  }

  closeModal(modalInstance: Modal): void {
    modalInstance.hide();

    // Cleanup modal styles
    document.body.classList.remove('modal-open');
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
    document.querySelectorAll('.modal-backdrop').forEach((backdrop) => {
      backdrop.remove();
    });
  }
}
