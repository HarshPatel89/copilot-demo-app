import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListComponent } from './list/list.component';
import { AddComponent } from './add/add.component';
import { UpdateComponent } from './update/update.component';

/**
 * Defines the routing configuration for the products feature module.
 * Includes routes for listing, adding, and updating products.
 */
const routes: Routes = [
  { 
    path: '',
    component: ListComponent,
    title: 'Products List'
  },
  { 
    path: 'add',
    component: AddComponent,
    title: 'Add New Product'
  },
  { 
    path: 'edit/:id',
    component: UpdateComponent,
    title: 'Edit Product'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsRoutingModule { }
