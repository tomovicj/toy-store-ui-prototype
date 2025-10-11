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
}
