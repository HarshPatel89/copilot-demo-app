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

/**
 * Component responsible for displaying the list of products in a table format.
 * Provides functionality for viewing, editing, and deleting products.
 * Uses PrimeNG Table component for displaying data with sorting and filtering capabilities.
 */
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
  /** Collection of products to display in the table */
  products: Product[] = [];
  
  /** Loading state for the products table */
  loading: boolean = true;

  displayAddDialog = false;
  displayUpdateDialog = false;
  selectedProduct: Product | null = null;

  constructor(
    private productService: ProductService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private router: Router
  ) {}

  /**
   * Initializes the component by loading the products list
   */
  ngOnInit(): void {
    this.loadProducts();
  }

  /**
   * Fetches the list of products from the backend
   */
  loadProducts(): void {
    this.loading = true;
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.loading = false;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load products'
        });
        this.loading = false;
      }
    });
  }

  /**
   * Deletes a product after confirmation
   * @param id - The product id to delete
   */
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

  /**
   * Shows the update dialog for a specific product
   * @param product - The product to update
   */
  showUpdateDialog(product: Product): void {
    this.selectedProduct = product;
    this.displayUpdateDialog = true;
  }

  /**
   * Hides the update dialog and reloads the products list
   */
  hideUpdateDialog(): void {
    this.displayUpdateDialog = false;
    this.selectedProduct = null;
    this.loadProducts();
  }

  /**
   * Navigates to the update dialog for a specific product
   * @param id - The product id to update
   */
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

  /**
   * Shows the add dialog
   */
  showAddDialog(): void {
    this.displayAddDialog = true;
  }

  /**
   * Hides the add dialog and reloads the products list
   */
  hideAddDialog(): void {
    this.displayAddDialog = false;
    this.loadProducts();
  }
}
