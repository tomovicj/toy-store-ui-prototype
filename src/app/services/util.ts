import { Injectable } from '@angular/core';

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
      month: 'long',
      day: 'numeric',
    });
  }
}
