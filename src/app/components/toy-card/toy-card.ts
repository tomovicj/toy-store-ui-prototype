import { Component, input } from '@angular/core';
import { Toy } from '../../models/toy';

@Component({
  selector: 'app-toy-card',
  imports: [],
  templateUrl: './toy-card.html',
  styleUrl: './toy-card.css',
})
export class ToyCard {
  toy = input<Toy>({
    id: '',
    name: '',
    description: '',
    category: '',
    forAgeGroup: '0-2',
    forGender: 'unisex',
    manufactureDate: '',
    price: 0,
    imageUrl: '',
    reviews: [],
  });

  addToCart() {
    // Logic to add the toy to the shopping cart
    console.log(`Adding ${this.toy().name} to cart.`);
  }
}
