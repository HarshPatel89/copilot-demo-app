import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { MessageService } from 'primeng/api';
import { CustomerService } from '../../../shared/services/customer.service';
import { Customer } from '../../../shared/models/customer';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-add',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    CheckboxModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './add.component.html',
  styleUrl: './add.component.css'
})
export class AddComponent {
  @Output() customerSaved = new EventEmitter<void>();

  newCustomer: Customer = {
    id: 0,
    name: '',
    email: '',
    isPrimeMember: false
  };

  constructor(
    private customerService: CustomerService,
    public messageService: MessageService
  ) {}

  resetCustomer(): void {
    this.newCustomer = {
      id: 0,
      name: '',
      email: '',
      isPrimeMember: false
    };
  }

  saveCustomer(): void {
    this.customerService.addCustomer(this.newCustomer).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Customer added successfully'
        });
        this.resetCustomer();
        this.customerSaved.emit();
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to add customer'
        });
      }
    });
  }
}
