import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CustomerService } from '../../../shared/services/customer.service';
import { Customer } from '../../../shared/models/customer';
import { AddComponent } from '../add/add.component';
import { UpdateComponent } from '../update/update.component';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    TableModule, 
    ButtonModule, 
    InputTextModule, 
    FormsModule, 
    DialogModule, 
    CheckboxModule,
    ConfirmDialogModule,
    ToastModule,
    AddComponent,
    UpdateComponent
  ],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css',
  providers: [ConfirmationService, MessageService]
})
export class ListComponent implements OnInit {
  customers: Customer[] = [];
  isLoading: boolean = false;
  isCustomerModalVisible: boolean = false;
  isEditMode: boolean = false;
  selectedCustomer: Customer = { id: 0, name: '', email: '', isPrimeMember: false };

  constructor(
    private customerService: CustomerService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers(): void {
    this.isLoading = true;
    this.customerService.getCustomers().subscribe({
      next: (customers) => {
        this.customers = customers;
        this.isLoading = false;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load customers'
        });
        this.isLoading = false;
      }
    });
  }

  deleteCustomer(id: number): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this customer?',
      accept: () => {
        this.customerService.deleteCustomer(id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Customer deleted successfully'
            });
            this.loadCustomers();
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to delete customer'
            });
          }
        });
      }
    });
  }

  openAddCustomerModal(): void {
    this.isEditMode = false;
    this.selectedCustomer = { id: 0, name: '', email: '', isPrimeMember: false };
    this.isCustomerModalVisible = true;
  }

  openEditCustomerModal(customer: Customer): void {
    this.isEditMode = true;
    this.selectedCustomer = { ...customer };
    this.isCustomerModalVisible = true;
  }

  closeCustomerModal(): void {
    this.isCustomerModalVisible = false;
    this.loadCustomers();
  }

  saveCustomer(): void {
    if (this.isEditMode) {
      this.customerService.updateCustomer(this.selectedCustomer).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Customer updated successfully'
          });
          this.closeCustomerModal();
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to update customer'
          });
        }
      });
    } else {
      this.customerService.addCustomer(this.selectedCustomer).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Customer added successfully'
          });
          this.closeCustomerModal();
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
}
