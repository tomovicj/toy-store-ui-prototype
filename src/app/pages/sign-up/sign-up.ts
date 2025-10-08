import { Component } from '@angular/core';
import { AuthService, SignUpData } from '../../services/auth';
import { Router, RouterLink } from '@angular/router';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-sign-up',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.css',
})
export class SignUp {
  constructor(private authService: AuthService, private router: Router) {}

  form = new FormGroup(
    {
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      phoneNumber: new FormControl('', [Validators.required, Validators.pattern(/^\+?[0-9]{10,15}$/)]),
      address: new FormControl('', [Validators.required]),
      favoriteCategory: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      confirmPassword: new FormControl('', [Validators.required]),
    });

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (this.form.value.password !== this.form.value.confirmPassword) {
      this.form.setErrors({ passwordMismatch: true });
      return;
    }

    const signUpData: SignUpData = {
      firstName: this.form.value.firstName!,
      lastName: this.form.value.lastName!,
      email: this.form.value.email!,
      phoneNumber: this.form.value.phoneNumber!,
      address: this.form.value.address!,
      favoriteCategory: this.form.value.favoriteCategory!,
      password: this.form.value.password!,
    };

    const newCustomer = this.authService.signUp(signUpData);
    if (!newCustomer) {
      this.form.setErrors({ emailInUse: true });
      return;
    }

    this.router.navigateByUrl('/');
  }
}
