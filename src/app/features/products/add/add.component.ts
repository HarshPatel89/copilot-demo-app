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
  styleUrl: './add.component.css',
  providers: [MessageService]
})
export class AddComponent {
  @Output() productSaved = new EventEmitter<void>();

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

  saveProduct(): void {
    this.productService.addProduct(this.product).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Product added successfully'
        });
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
