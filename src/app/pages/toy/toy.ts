import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Toy } from '../../models/toy';
import { ToyService } from '../../services/toy';
import { UtilService } from '../../services/util';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToyReviews } from '../../components/toy-reviews/toy-reviews';

@Component({
  selector: 'app-toy',
  imports: [ReactiveFormsModule, ToyReviews],
  templateUrl: './toy.html',
  styleUrl: './toy.css',
})
export class ToyPage implements OnInit {
  toy = signal<Toy | null>(null);
  reservationForm = new FormGroup({
    quantity: new FormControl('1', [
      Validators.required,
      Validators.pattern(/^[0-9]+$/),
      Validators.min(1),
    ]),
  });

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private toyService: ToyService,
    public utilService: UtilService
  ) {}

  ngOnInit(): void {
    const toyId = this.route.snapshot.paramMap.get('id');
    if (toyId) {
      const toy = this.toyService.getToyById(toyId);
      if (toy) {
        this.toy.set(toy);
        return;
      }
    }

    this.router.navigateByUrl('/');
  }

  onReserve() {
    if (this.reservationForm.invalid) {
      this.reservationForm.markAllAsTouched();
      return;
    }

    // TODO
  }

  getAverageRating() {
    return this.toyService.getAverageRating(this.toy()!.id);
  }
}
