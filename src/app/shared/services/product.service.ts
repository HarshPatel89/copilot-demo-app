import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product';

/**
 * Service responsible for handling all product-related operations.
 * Provides methods for CRUD operations and communicates with the backend API.
 * Uses Angular's HttpClient for all API communications.
 */
@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'https://localhost:44385/api/product';

  constructor(private http: HttpClient) { }

  /**
   * Retrieves all products from the backend.
   * @returns An Observable of Product array containing all products
   */
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  /**
   * Retrieves a specific product by its ID.
   * @param id - The unique identifier of the product
   * @returns An Observable of Product containing the requested product details
   */
  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  /**
   * Creates a new product.
   * @param product - The product object to create
   * @returns An Observable of Product containing the created product with its assigned ID
   */
  createProduct(product: Omit<Product, 'id'>): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product);
  }

  /**
   * Updates an existing product.
   * @param id - The unique identifier of the product to update
   * @param product - The updated product data
   * @returns An Observable of Product containing the updated product details
   */
  updateProduct(id: number, product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, product);
  }

  /**
   * Deletes a product from the system.
   * @param id - The unique identifier of the product to delete
   * @returns An Observable of void indicating completion
   */
  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
