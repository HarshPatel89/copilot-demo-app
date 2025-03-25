import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
  selector: 'app-update',
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
  templateUrl: './update.component.html',
  styleUrl: './update.component.css'
})
export class UpdateComponent implements OnInit {
  @Input() customer: Customer | null = null;
  @Output() customerUpdated = new EventEmitter<void>();
  
  editedCustomer: Customer = {
    id: 0,
    name: '',
    email: '',
    isPrimeMember: false
  };

  constructor(
    private customerService: CustomerService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    if (this.customer) {
      this.editedCustomer = { ...this.customer };
    }
  }

  updateCustomer() {
    if (this.editedCustomer && this.editedCustomer.id) {
      this.customerService.updateCustomer(this.editedCustomer).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Customer updated successfully'
          });
          this.customerUpdated.emit();
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to update customer'
          });
        }
      });
    }
  }
}
