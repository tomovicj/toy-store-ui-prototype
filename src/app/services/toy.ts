import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Toy } from '../models/toy';
import { Review } from '../models/review';

@Injectable({
  providedIn: 'root',
})
export class ToyService {
  constructor(private http: HttpClient) {
    const toys = localStorage.getItem('toys');
    if (toys) return;

    this.http
      .get<Toy[]>('/toys.json')
      .subscribe((data) => {
      localStorage.setItem('toys', JSON.stringify(data));
    });
  }

  getToys(): Toy[] {
    const toys = localStorage.getItem('toys');
    return toys ? JSON.parse(toys) : [];
  }

  getToyById(id: string): Toy | null {
    const toys = this.getToys();
    return toys.find((toy) => toy.id === id) || null;
  }

  updateToy(updatedToy: Toy): void {
    const toys = this.getToys();
    const toyIndex = toys.findIndex((toy) => toy.id === updatedToy.id);
    if (toyIndex === -1) throw new Error('Toy not found');
    toys[toyIndex] = updatedToy;
    localStorage.setItem('toys', JSON.stringify(toys));
  }

  getReviews(toyId: string): Review[] {
    const toy = this.getToyById(toyId);
    return toy ? toy.reviews : [];
  }

  addReview(toyId: string, review: Review): void {
    const toy = this.getToyById(toyId);
    if (!toy) throw new Error('Toy not found');
    toy.reviews.push(review);
    this.updateToy(toy);
  }

  getAverageRating(toyId: string): number {
    const reviews = this.getReviews(toyId);
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    const avgRating = total / reviews.length;
    return Math.round(avgRating * 10) / 10;
  }
}
