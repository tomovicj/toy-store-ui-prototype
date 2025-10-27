import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Output,
  Signal,
  signal,
  ViewChild,
  WritableSignal,
} from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Customer } from '../../../models/customer';
import { AuthService } from '../../../services/auth';
import { Modal } from 'bootstrap';
import { CustomerService } from '../../../services/customer';
import { UtilService } from '../../../services/util';

@Component({
  selector: 'app-edit-profile',
  imports: [ReactiveFormsModule],
  templateUrl: './edit-profile.html',
  styleUrl: './edit-profile.css',
})
export class EditProfile implements AfterViewInit {
  constructor(
    private authService: AuthService,
    private customerService: CustomerService,
    private utilService: UtilService
  ) {}

  @Output() onProfileUpdated = new EventEmitter<Customer>();

  @ViewChild('editProfileModal') modalElement!: ElementRef;

  user = signal<Customer | null>(null);
  showPassword = signal<boolean>(false);
  showConfirmPassword = signal<boolean>(false);
  private modalInstance: Modal | null = null;

  form = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    phoneNumber: new FormControl('', [Validators.required, Validators.pattern(/^\+?[0-9]{10,15}$/)]),
    address: new FormControl('', [Validators.required]),
    favoriteCategory: new FormControl('', [Validators.required]),
    password: new FormControl('', [this.passwordValidator()]),
    confirmPassword: new FormControl(''),
  }, { validators: this.confirmPasswordValidator() });

  passwordValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control || !control.value) {
        return null;
      }
      return control.value.length >= 6 ? null : { minlength: true };
    };
  }

  confirmPasswordValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = control.get('password');
      const confirmPassword = control.get('confirmPassword');
      if (!password || !confirmPassword) {
        return null;
      }
      return password.value === confirmPassword.value ? null : { passwordMismatch: true };
    };
  }

  ngAfterViewInit() {
    const modal = this.modalElement.nativeElement;
    this.modalInstance = new Modal(modal);

    modal.addEventListener('show.bs.modal', () => {
      const user = this.authService.getLoggedInCustomer();
      if (user) {
        this.user.set(user);
        this.form.patchValue({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phoneNumber: user.phoneNumber,
          address: user.address,
          favoriteCategory: user.favoriteCategory,
        });
      }
    });

    modal.addEventListener('hidden.bs.modal', () => {
      this.user.set(null);
      this.form.reset();
    });
  }

  onSubmit() {
    console.log(this.form.valid)
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const user = this.user();
    if (!user) {
      return;
    }

    const newData: Customer = {
      id: user.id,
      firstName: this.form.value.firstName!,
      lastName: this.form.value.lastName!,
      email: this.form.value.email!,
      phoneNumber: this.form.value.phoneNumber!,
      address: this.form.value.address!,
      favoriteCategory: this.form.value.favoriteCategory!,
      password: user.password,
      orders: user.orders,
    };

    const password = this.form.value.password;
    if (password) {
      newData.password = password;
    }

    this.customerService.saveCustomer(newData);
    this.onProfileUpdated.emit(newData);

    this.utilService.closeModal(this.modalInstance!);
  }

  toggleShowPassword() {
    this.showPassword.set(!this.showPassword());
  }

  toggleShowConfirmPassword() {
    this.showConfirmPassword.set(!this.showConfirmPassword());
  }
}
