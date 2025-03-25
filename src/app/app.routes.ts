import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'products',
        loadChildren: () => import('./features/products/products.module').then(m => m.ProductsModule)   
    },
    {
        path: 'customers',
        loadChildren: () => import('./features/customers/customers.module').then(m => m.CustomersModule)
    }
];
