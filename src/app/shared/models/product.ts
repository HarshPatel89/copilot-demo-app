/**
 * Represents a product in the system.
 * Used across the application for product management operations.
 */
export interface Product {
  /** Unique identifier for the product */
  id: number;
  
  /** Name of the product */
  name: string;
  
  /** Detailed description of the product */
  description: string;
  
  /** Price of the product in the default currency */
  price: number;
}