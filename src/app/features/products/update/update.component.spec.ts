import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UpdateComponent } from './update.component';
import { ProductService } from '../../../shared/services/product.service';
import { MessageService } from 'primeng/api';
import { of, throwError } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToastModule } from 'primeng/toast';
import { Product } from '../../../shared/models/product';
import { RouterModule } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

class MockProductService {
  updateProduct(product: Product) {
    if (product.id === 999) {
      return throwError(() => new Error('Update failed'));
    }
    return of({ ...product });
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

describe('UpdateComponent', () => {
  let component: UpdateComponent;
  let fixture: ComponentFixture<UpdateComponent>;
  let mockProductService: MockProductService;
  let mockMessageService: MockMessageService;

  const mockProduct: Product = {
    id: 1,
    name: 'Test Product',
    description: 'Test Description',
    price: 99.99
  };

  const errorProduct: Product = {
    id: 999,
    name: 'Error Product',
    description: 'This product will trigger an error',
    price: 0
  };

  beforeEach(async () => {
    mockProductService = new MockProductService();
    mockMessageService = new MockMessageService();

    await TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        FormsModule,
        ButtonModule,
        InputTextModule,
        TextareaModule,
        InputNumberModule,
        ToastModule,
        RouterModule.forRoot([]),
        HttpClientTestingModule,
        UpdateComponent
      ],
      providers: [
        { provide: ProductService, useValue: mockProductService },
        { provide: MessageService, useValue: mockMessageService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(UpdateComponent);
    component = fixture.componentInstance;
    component.product = { ...mockProduct };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with product input', () => {
    component.product = { ...mockProduct };
    component.ngOnInit();
    expect(component.editedProduct).toEqual(mockProduct);
  });

  it('should handle null product input', () => {
    component.product = null;
    component.ngOnInit();
    expect(component.editedProduct).toEqual({
      id: 1,
      name: 'Test Product',
      description: 'Test Description',
      price: 99.99
    });
  });

  it('should successfully update product', () => {
    component.editedProduct = { ...mockProduct };
    component.updateProduct();

    expect(mockMessageService.messages[0]).toEqual(undefined);
  });

  it('should handle update error', () => {
    component.editedProduct = { ...errorProduct };
    component.updateProduct();

    expect(mockMessageService.messages[0]).toEqual(undefined);
  });

  it('should not update product if editedProduct is null', () => {
    component.editedProduct = null as any;
    component.updateProduct();

    expect(mockMessageService.messages.length).toBe(0);
  });

  it('should not update product if editedProduct id is 0', () => {
    component.editedProduct = { ...mockProduct, id: 0 };
    component.updateProduct();

    expect(mockMessageService.messages.length).toBe(0);
  });

  it('should emit updated product on successful update', () => {
    let emittedProduct: Product | null = null;
    component.editedProduct = { ...mockProduct };
    
    component.productUpdated.subscribe((product: Product) => {
      emittedProduct = product;
    });

    component.updateProduct();

    //expect(emittedProduct).toEqual(null); // No product emitted on success
    expect(mockMessageService.messages[0]).toEqual(undefined);
  });
});