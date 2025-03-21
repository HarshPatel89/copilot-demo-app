/**
 * Represents a product in the system.
 * This interface defines the structure and required properties for product objects
 * throughout the application.
 */
export interface Product {
  /** Unique identifier for the product */
  id: number;
  
  /** Name of the product */
  name: string;
  
  /** Detailed description of the product */
  description: string;
  
  /** Current price of the product */
  price: number;
}