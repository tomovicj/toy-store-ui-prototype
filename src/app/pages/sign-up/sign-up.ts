import { Component, signal } from '@angular/core';
import { AuthService, SignUpData } from '../../services/auth';
import { Router, RouterLink } from '@angular/router';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ToyService } from '../../services/toy';

@Component({
  selector: 'app-sign-up',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.css',
})
export class SignUp {
  constructor(
    private authService: AuthService,
    private toyService: ToyService,
    private router: Router
  ) {}

  showPassword = signal<boolean>(false);
  showConfirmPassword = signal<boolean>(false);

  form = new FormGroup({
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      phoneNumber: new FormControl('', [Validators.required, Validators.pattern(/^\+?[0-9]{10,15}$/)]),
      address: new FormControl('', [Validators.required]),
      favoriteCategory: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      confirmPassword: new FormControl('', [Validators.required]),
    }, { validators: this.confirmPasswordValidator() });

  confirmPasswordValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = control.get('password');
      const confirmPassword = control.get('confirmPassword');
      if (!password || !confirmPassword) {
        return null;
      }
      if (password.value !== confirmPassword.value) {
        confirmPassword.setErrors({ passwordMismatch: true });
        return { passwordMismatch: true };
      }
      return null;
    };
  }

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

    this.authService.login(newCustomer.email, newCustomer.password);

    this.router.navigateByUrl('/');
  }

  getToyCategories(): string[] {
    return this.toyService.getToyCategories();
  }

  toggleShowPassword() {
    this.showPassword.set(!this.showPassword());
  }

  toggleShowConfirmPassword() {
    this.showConfirmPassword.set(!this.showConfirmPassword());
  }
}
