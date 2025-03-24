import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListComponent } from './list.component';
import { ProductService } from '../../../shared/services/product.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { Product } from '../../../shared/models/product';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { AddComponent } from '../add/add.component';
import { UpdateComponent } from '../update/update.component';
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

// Mock Child Components
@Component({
  selector: 'app-add',
  template: '',
  standalone: true
})
class MockAddComponent {}

@Component({
  selector: 'app-update',
  template: '',
  standalone: true
})
class MockUpdateComponent {}

// Mock Services
class MockProductService {
  private products: Product[] = [
    { id: 1, name: 'Test Product 1', description: 'Description 1', price: 100 },
    { id: 2, name: 'Test Product 2', description: 'Description 2', price: 200 }
  ];

  getProducts() {
    return of(this.products);
  }

  deleteProduct(id: number) {
    this.products = this.products.filter(p => p.id !== id);
    return of(void 0);
  }
}

class MockMessageService {
  messages: any[] = [];
  add(message: any) {
    this.messages.push(message);
  }
  clear() {
    this.messages = [];
  }
}

class MockConfirmationService {
  confirmation: any = null;
  confirm(confirmation: any) {
    this.confirmation = confirmation;
    if (confirmation.accept) {
      confirmation.accept();
    }
  }
}

describe('ListComponent', () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;
  let mockProductService: MockProductService;
  let mockMessageService: MockMessageService;
  let mockConfirmationService: MockConfirmationService;

  beforeEach(async () => {
    mockProductService = new MockProductService();
    mockMessageService = new MockMessageService();
    mockConfirmationService = new MockConfirmationService();

    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        HttpClientTestingModule,
        DialogModule,
        ConfirmDialogModule,
        TableModule,
        ButtonModule,
        ToastModule,
        BrowserAnimationsModule,
        ListComponent,
        MockAddComponent,
        MockUpdateComponent
      ],
      providers: [
        { provide: ProductService, useValue: mockProductService },
        { provide: MessageService, useValue: mockMessageService },
        { provide: ConfirmationService, useValue: mockConfirmationService },
        { provide: Router, useValue: { navigate: jasmine.createSpy('navigate') } }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load products on init', () => {
    component.ngOnInit();
    expect(component.products.length).toBe(2);
    expect(component.products[0].name).toBe('Test Product 1');
  });

  it('should handle error when loading products fails', () => {
    spyOn(mockProductService, 'getProducts').and.returnValue(throwError(() => new Error('Error')));
    component.ngOnInit();
    expect(mockMessageService.messages[0]).toEqual({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to load products'
    });
  });

  it('should show confirmation dialog when deleting product', () => {
    spyOn(mockConfirmationService, 'confirm').and.callThrough();
    component.confirmDelete(1);
    expect(mockConfirmationService.confirm).toHaveBeenCalled();
    expect(mockConfirmationService.confirmation.message).toBe('Are you sure you want to delete this product?');
  });

  it('should delete product when confirmed', () => {
    spyOn(mockProductService, 'getProducts').and.callThrough();
    spyOn(mockProductService, 'deleteProduct').and.callThrough();
    
    component.ngOnInit();
    component.confirmDelete(1);
    
    expect(mockProductService.deleteProduct).toHaveBeenCalledWith(1);
    expect(mockMessageService.messages[0]).toEqual({
      severity: 'success',
      summary: 'Success',
      detail: 'Product deleted successfully'
    });
    expect(mockProductService.getProducts).toHaveBeenCalledTimes(2);
  });

  it('should handle error when deleting product fails', () => {
    spyOn(mockProductService, 'deleteProduct').and.returnValue(throwError(() => new Error('Error')));
    
    component.confirmDelete(1);
    
    expect(mockMessageService.messages[0]).toEqual({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to delete product'
    });
  });

  it('should show update dialog with selected product', () => {
    const product = { id: 1, name: 'Test Product 1', description: 'Description 1', price: 100 };
    component.showUpdateDialog(product);
    
    expect(component.selectedProduct).toBe(product);
    expect(component.displayUpdateDialog).toBeTrue();
  });

  it('should hide update dialog and reset selected product', () => {
    component.selectedProduct = { id: 1, name: 'Test Product 1', description: 'Description 1', price: 100 };
    component.displayUpdateDialog = true;
    
    component.hideUpdateDialog();
    
    expect(component.selectedProduct).toBeNull();
    expect(component.displayUpdateDialog).toBeFalse();
  });

  it('should navigate to update for existing product', () => {
    component.products = [
      { id: 1, name: 'Test Product 1', description: 'Description 1', price: 100 }
    ];
    
    component.navigateToUpdate(1);
    
    expect(component.selectedProduct).toBeTruthy();
    expect(component.displayUpdateDialog).toBeTrue();
  });

  it('should show error message when navigating to non-existent product', () => {
    component.products = [];
    
    component.navigateToUpdate(999);
    
    expect(mockMessageService.messages[0]).toEqual({
      severity: 'error',
      summary: 'Error',
      detail: 'Product not found'
    });
  });

  it('should show add dialog', () => {
    component.showAddDialog();
    expect(component.displayAddDialog).toBeTrue();
  });

  it('should hide add dialog and reload products', () => {
    spyOn(mockProductService, 'getProducts').and.callThrough();
    component.displayAddDialog = true;
    
    component.hideAddDialog();
    
    expect(component.displayAddDialog).toBeFalse();
    expect(mockProductService.getProducts).toHaveBeenCalled();
  });
});
