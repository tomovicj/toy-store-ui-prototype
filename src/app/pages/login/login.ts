import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  constructor(private authService: AuthService, private router: Router) {}

  showPassword = signal<boolean>(false);

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const loginSuccess = this.authService.login(this.form.value.email!, this.form.value.password!);
    if (!loginSuccess) {
      this.form.setErrors({ invalidCredentials: true });
      return;
    }

    this.router.navigateByUrl('/');
  }

  toggleShowPassword() {
    this.showPassword.set(!this.showPassword());
  }
}
