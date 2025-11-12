import { Pipe, PipeTransform } from '@angular/core';
import { Toy } from '../models/toy';
import { ToyService } from '../services/toy';


export type AgeGroup = '0-2' | '3-5' | '6-8' | '9-12' | '13+';
export type Gender = 'boy' | 'girl' | 'unisex';
export type ToyFilterParams = {
  nameQuery?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  maxRating?: number;
  category?: string;
  forAgeGroup?: AgeGroup[];
  forGender?: Gender[];
}

@Pipe({
  name: 'filterToys'
})
export class FilterToysPipe implements PipeTransform {
  constructor(private toyService: ToyService) {}

  transform(toys: Toy[], filterParams: ToyFilterParams): Toy[] {
    if (!toys) {
      console.warn('FilterToysPipe: toys is undefined or null. Returning empty array.');
      return [];
    }
    if (!filterParams) {
      console.warn('FilterToysPipe: filterParams is undefined or null. Returning unfiltered toys array.');
      return toys;
    }

    const filtered = toys.filter((toy) => {
      const nameMatch = filterParams.nameQuery ? toy.name.toLowerCase().includes(filterParams.nameQuery.toLowerCase()) : true;
      const minPriceMatch = filterParams.minPrice !== undefined ? toy.price >= filterParams.minPrice : true;
      const maxPriceMatch = filterParams.maxPrice !== undefined ? toy.price <= filterParams.maxPrice : true;
      const minRatingMatch = filterParams.minRating !== undefined ? this.toyService.getAverageRating(toy.id) >= filterParams.minRating : true;
      const maxRatingMatch = filterParams.maxRating !== undefined ? this.toyService.getAverageRating(toy.id) <= filterParams.maxRating : true;
      const categoryMatch = filterParams.category ? toy.category === filterParams.category : true;
      const ageGroupMatch = filterParams.forAgeGroup ? filterParams.forAgeGroup.some(ageGroup => toy.forAgeGroup === ageGroup) : true;
      const genderMatch = filterParams.forGender ? filterParams.forGender.some(gender => toy.forGender === gender) : true;

      return nameMatch && minPriceMatch && maxPriceMatch && minRatingMatch && maxRatingMatch && categoryMatch && ageGroupMatch && genderMatch;
    });

    return filtered;
  }

}
