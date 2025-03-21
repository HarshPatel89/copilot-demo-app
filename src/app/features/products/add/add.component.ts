import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { MessageService } from 'primeng/api';
import { ProductService } from '../../../shared/services/product.service';
import { Product } from '../../../shared/models/product';
import { ToastModule } from 'primeng/toast';

/**
 * Component for adding new products to the system.
 * Provides a form interface for creating new product entries.
 */
@Component({
  selector: 'app-add',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    TextareaModule,
    InputNumberModule,
    ToastModule
  ],
  templateUrl: './add.component.html',
  styleUrl: './add.component.css'
})
export class AddComponent {
  /** Event emitter that notifies parent component when a new product has been saved */
  @Output() productSaved = new EventEmitter<void>();

  /** The new product being created */
  product: Product = {
    id: 0,
    name: '',
    description: '',
    price: 0
  };

  constructor(
    private productService: ProductService,
    private messageService: MessageService
  ) {}

  /**
   * Resets the product form to its initial state
   */
  resetProduct(): void {
    this.product = {
      id: 0,
      name: '',
      description: '',
      price: 0
    };
  }

  /**
   * Saves a new product to the system.
   * On success, displays a success message and resets the form.
   * On failure, displays an error message.
   */
  saveProduct(): void {
    this.productService.addProduct(this.product).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Product added successfully'
        });
        this.resetProduct(); // Reset the form after successful save
        this.productSaved.emit();
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to add product'
        });
      }
    });
  }
}
