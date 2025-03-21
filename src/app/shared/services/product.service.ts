import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product';

/**
 * Service responsible for handling all product-related HTTP operations.
 * Provides methods for CRUD operations on products.
 */
@Injectable({
  providedIn: 'root'
})
export class ProductService {
  /** Base API URL for product endpoints */
  private apiUrl = 'https://localhost:44385/api/product';

  constructor(private http: HttpClient) {}

  /**
   * Retrieves all products from the server
   * @returns An Observable of Product array
   */
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  /**
   * Retrieves a specific product by its ID
   * @param id The ID of the product to retrieve
   * @returns An Observable of the requested Product
   */
  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  /**
   * Creates a new product
   * @param product The product data to create
   * @returns An Observable of the created Product
   */
  addProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product);
  }

  /**
   * Updates an existing product
   * @param id The ID of the product to update
   * @param product The updated product data
   * @returns An Observable of the updated Product
   */
  updateProduct(id: number, product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, product);
  }

  /**
   * Deletes a product from the system
   * @param id The ID of the product to delete
   * @returns An Observable of void
   */
  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
