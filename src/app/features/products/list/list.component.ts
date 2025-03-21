import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { ProductService } from '../../../shared/services/product.service';
import { Product } from '../../../shared/models/product';
import { AddComponent } from '../add/add.component';
import { UpdateComponent } from '../update/update.component';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    ConfirmDialogModule,
    ToastModule,
    DialogModule,
    AddComponent,
    UpdateComponent
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
  displayAddDialog = false;
  displayUpdateDialog = false;
  selectedProduct: Product | null = null;

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

  showUpdateDialog(product: Product): void {
    this.selectedProduct = product;
    this.displayUpdateDialog = true;
  }

  hideUpdateDialog(): void {
    this.displayUpdateDialog = false;
    this.selectedProduct = null;
    this.loadProducts();
  }

  navigateToUpdate(id: number): void {
    const product = this.products.find(p => p.id === id);
    if (product) {
      this.showUpdateDialog(product);
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Product not found'
      });
    }
  }

  showAddDialog(): void {
    this.displayAddDialog = true;
  }

  hideAddDialog(): void {
    this.displayAddDialog = false;
    this.loadProducts();
  }
}
