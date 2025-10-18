import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-rate-a-toy',
  imports: [ReactiveFormsModule],
  templateUrl: './rate-a-toy.html',
  styleUrl: './rate-a-toy.css',
})
export class RateAToy {
  form = new FormGroup({
    rating: new FormControl('', [Validators.required, Validators.min(1), Validators.max(5)]),
    review: new FormControl('', [Validators.required]),
  });

  onSubmit() {
    // TODO: Implement submission logic
  }
}
