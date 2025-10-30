import { Component, OnInit, signal } from '@angular/core';
import { AuthService } from '../../services/auth';
import { Customer } from '../../models/customer';
import { Router } from '@angular/router';
import { OrderTable } from '../../components/order-table/order-table';
import { EditProfile } from '../../components/modals/edit-profile/edit-profile';

@Component({
  selector: 'app-profile',
  imports: [OrderTable, EditProfile],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  constructor(private router: Router, private authService: AuthService) {}

  customer = signal<Customer | null>(null);

  ngOnInit(): void {
    this.loadCustomer();
  }

  loadCustomer() {
    const customer = this.authService.getLoggedInCustomer();

    if (!customer) {
      this.router.navigateByUrl('/login');
      return;
    }

    this.customer.set(customer);
  }
}
