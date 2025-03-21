import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { ProductService } from '../../../shared/services/product.service';
import { Product } from '../../../shared/models/product';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    ConfirmDialogModule,
    ToastModule,
    
  ],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css',
  providers: [
    ConfirmationService, 
    MessageService,
    ProductService
  ]
})
export class ListComponent implements OnInit {
  products: Product[] = [];

  constructor(
    private productService: ProductService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load products'
        });
      }
    });
  }

  confirmDelete(id: number): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this product?',
      accept: () => {
        this.productService.deleteProduct(id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Product deleted successfully'
            });
            this.loadProducts();
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to delete product'
            });
          }
        });
      }
    });
  }

  navigateToUpdate(id: number): void {
    this.router.navigate(['/products/update', id]);
  }
}
