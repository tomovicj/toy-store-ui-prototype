import { Pipe, PipeTransform } from '@angular/core';
import { Toy } from '../models/toy';
import { ToyService } from '../services/toy';

export type SortCriteria =
  | 'name-asc'
  | 'name-desc'
  | 'price-asc'
  | 'price-desc'
  | 'rating-asc'
  | 'rating-desc';

@Pipe({
  name: 'sortToys',
})
export class SortToysPipe implements PipeTransform {
  constructor(private toyService: ToyService) {}

  transform(toys: Toy[], sortCriteria: SortCriteria): Toy[] {
    if (!toys) {
      console.warn('SortToysPipe: toys array is undefined or null. Returning empty array.');
      return [];
    }
    if (!sortCriteria) {
      console.warn('SortToysPipe: sortCriteria is undefined or null. Returning unsorted toys.');
      return toys;
    }

    const sortedToys = [...toys];

    switch (sortCriteria) {
      case 'name-asc':
        sortedToys.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        sortedToys.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'price-asc':
        sortedToys.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        sortedToys.sort((a, b) => b.price - a.price);
        break;
      case 'rating-asc':
        sortedToys.sort((a, b) => this.toyService.getAverageRating(a.id) - this.toyService.getAverageRating(b.id));
        break;
      case 'rating-desc':
        sortedToys.sort((a, b) => this.toyService.getAverageRating(b.id) - this.toyService.getAverageRating(a.id));
        break;
      default:
        console.warn('SortToysPipe: Unknown sortCriteria. Returning unsorted toys.');
        return toys;
    }

    return sortedToys;
  }
}
