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
 * Component for displaying and managing a list of products.
 * Provides functionality for viewing, adding, updating, and deleting products.
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
  /** Array of products to display in the table */
  products: Product[] = [];
  
  /** Controls the visibility of the add product dialog */
  displayAddDialog = false;
  
  /** Controls the visibility of the update product dialog */
  displayUpdateDialog = false;
  
  /** Currently selected product for editing */
  selectedProduct: Product | null = null;

  constructor(
    private productService: ProductService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private router: Router
  ) {}

  /**
   * Initializes the component by loading the product list
   */
  ngOnInit(): void {
    this.loadProducts();
  }

  /**
   * Fetches the current list of products from the server
   */
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

  /**
   * Displays a confirmation dialog and handles product deletion
   * @param id The ID of the product to delete
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
   * Opens the update dialog for a specific product
   * @param product The product to be updated
   */
  showUpdateDialog(product: Product): void {
    this.selectedProduct = product;
    this.displayUpdateDialog = true;
  }

  /**
   * Closes the update dialog and refreshes the product list
   */
  hideUpdateDialog(): void {
    this.displayUpdateDialog = false;
    this.selectedProduct = null;
    this.loadProducts();
  }

  /**
   * Navigates to the update view for a specific product
   * @param id The ID of the product to update
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
   * Opens the dialog for adding a new product
   */
  showAddDialog(): void {
    this.displayAddDialog = true;
  }

  /**
   * Closes the add dialog and refreshes the product list
   */
  hideAddDialog(): void {
    this.displayAddDialog = false;
    this.loadProducts();
  }
}
