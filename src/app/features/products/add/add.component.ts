import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
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
 * Implements a reactive form with validation and proper error handling.
 * Uses PrimeNG components for form inputs and messaging.
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
export class AddComponent implements OnInit {
  /** Event emitter to notify parent when a product is successfully added */
  @Output() productAdded = new EventEmitter<void>();

  /** The form group for product creation */
  productForm!: FormGroup;

  product: Product = {
    id: 0,
    name: '',
    description: '',
    price: 0
  };

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private messageService: MessageService
  ) {
    this.initForm();
  }

  ngOnInit(): void {}

  /**
   * Initializes the reactive form with validators
   * @private
   */
  private initForm(): void {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      stockQuantity: [0, [Validators.required, Validators.min(0)]],
      category: ['', Validators.required],
      imageUrl: ['']
    });
  }

  /**
   * Handles form submission and product creation
   */
  onSubmit(): void {
    if (this.productForm.valid) {
      const newProduct = {
        ...this.productForm.value,
        createdDate: new Date()
      };

      this.productService.createProduct(newProduct).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Product created successfully'
          });
          this.productAdded.emit();
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to create product'
          });
        }
      });
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Please fill in all required fields correctly'
      });
    }
  }

  /**
   * Helper method to check if a form control is invalid and touched
   * @param controlName - The name of the form control to check
   * @returns boolean indicating if the control is invalid and touched
   */
  isInvalid(controlName: string): boolean {
    const control = this.productForm.get(controlName);
    return control ? control.invalid && control.touched : false;
  }

  /**
   * Helper method to get error message for a form control
   * @param controlName - The name of the form control
   * @returns The error message if any
   */
  getErrorMessage(controlName: string): string {
    const control = this.productForm.get(controlName);
    if (control?.errors) {
      if (control.errors['required']) {
        return `${controlName.charAt(0).toUpperCase() + controlName.slice(1)} is required`;
      }
      if (control.errors['minlength']) {
        return `${controlName.charAt(0).toUpperCase() + controlName.slice(1)} must be at least ${control.errors['minlength'].requiredLength} characters`;
      }
      if (control.errors['min']) {
        return `${controlName.charAt(0).toUpperCase() + controlName.slice(1)} must be greater than or equal to ${control.errors['min'].min}`;
      }
    }
    return '';
  }
}
