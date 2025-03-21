/**
 * Application-wide routing configuration.
 * Defines the top-level routes for the application.
 * Feature modules can define their own child routes which will be loaded lazily.
 */
import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'products',
        loadChildren: () => import('./features/products/products.module').then(m => m.ProductsModule)   
    }
];
