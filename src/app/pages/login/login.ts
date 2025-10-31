import { AfterViewInit, Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';
import { Tooltip } from 'bootstrap';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements AfterViewInit {
  constructor(private authService: AuthService, private router: Router) {}

  showPassword = signal<boolean>(false);

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });

  ngAfterViewInit() {
    // Initialize Bootstrap tooltips
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    const tooltipList = [...tooltipTriggerList].map(
      (tooltipTriggerEl) => new Tooltip(tooltipTriggerEl)
    );
  }

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

  fillExampleUserCredentials() {
    const user = this.authService.getExampleUserInfo();
    this.form.patchValue({
      email: user.email,
      password: user.password,
    });
  }
}
