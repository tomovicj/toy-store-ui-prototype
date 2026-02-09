import { Component, input, output } from '@angular/core';
import { Customer } from '../../models/customer';

@Component({
  selector: 'app-user-profile',
  imports: [],
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.css'
})
export class UserProfile {
  customer = input.required<Customer | null>();
  onEdit = output<void>();

  handleEdit() {
    this.onEdit.emit();
  }
}
