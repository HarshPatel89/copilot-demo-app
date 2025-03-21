import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { MessageService } from 'primeng/api';
import { Product } from '../../../shared/models/product';
import { ProductService } from '../../../shared/services/product.service';
import { ToastModule } from 'primeng/toast';

/**
 * Component for updating existing product information.
 * Provides a form interface to edit product details and handles the update operation.
 */
@Component({
  selector: 'app-update',
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
  templateUrl: './update.component.html',
  styleUrl: './update.component.css'
})
export class UpdateComponent implements OnInit {
  /** The product to be edited, received as an input from parent component */
  @Input() product: Product | null = null;
  
  /** Event emitter that notifies parent component when a product has been updated */
  @Output() productUpdated = new EventEmitter<void>();
  
  /** Local copy of the product being edited */
  editedProduct: Product = {
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
   * Initializes the component by creating a copy of the input product for editing
   */
  ngOnInit() {
    if (this.product) {
      this.editedProduct = { ...this.product };
    }
  }

  /**
   * Handles the product update operation.
   * Calls the product service to update the product and shows appropriate success/error messages.
   */
  updateProduct() {
    if (this.editedProduct && this.editedProduct.id) {
      this.productService.updateProduct(this.editedProduct.id, this.editedProduct).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Product updated successfully'
          });
          this.productUpdated.emit();
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to update product'
          });
        }
      });
    }
  }
}
