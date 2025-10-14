import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Toy } from '../models/toy';

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
}
