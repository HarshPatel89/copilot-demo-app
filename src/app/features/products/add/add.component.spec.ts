import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { AddComponent } from './add.component';
import { ProductService } from '../../../shared/services/product.service';
import { of, throwError } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToastModule } from 'primeng/toast';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Product } from '../../../shared/models/product';
import { providePrimeNG } from 'primeng/config';

// Mock Product Service
class MockProductService {
  addProduct(product: Product) {
    if (product.name === 'Error Product') {
      return throwError(() => new Error('API Error'));
    }
    return of(product);
  }
}

describe('AddComponent', () => {
  let component: AddComponent;
  let fixture: ComponentFixture<AddComponent>;
  let mockProductService: MockProductService;

  beforeEach(async () => {
    mockProductService = new MockProductService();

    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        FormsModule,
        ButtonModule,
        InputTextModule,
        TextareaModule,
        InputNumberModule,
        ToastModule,
        AddComponent
      ],
      providers: [
        { provide: ProductService, useValue: mockProductService },
        providePrimeNG()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AddComponent);
    component = fixture.componentInstance;
    
    // Create spy for messageService
    spyOn(component.messageService, 'add');
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty product', () => {
    expect(component.product).toEqual({
      id: 0,
      name: '',
      description: '',
      price: 0
    });
  });

  it('should reset product form', () => {
    component.product = {
      id: 1,
      name: 'Test Product',
      description: 'Test Description',
      price: 99.99
    };

    component.resetProduct();

    expect(component.product).toEqual({
      id: 0,
      name: '',
      description: '',
      price: 0
    });
  });

  describe('saveProduct', () => {
    const testProduct = {
      id: 1,
      name: 'Test Product',
      description: 'Test Description',
      price: 99.99
    };

    beforeEach(() => {
      component.product = { ...testProduct };
    });

    it('should save product successfully and show success message', fakeAsync(() => {
      const productSavedSpy = spyOn(component.productSaved, 'emit');

      component.saveProduct();
      tick();

      expect(component.messageService.add).toHaveBeenCalledWith({
        severity: 'success',
        summary: 'Success',
        detail: 'Product added successfully'
      });
      expect(productSavedSpy).toHaveBeenCalled();
      expect(component.product).toEqual({
        id: 0,
        name: '',
        description: '',
        price: 0
      });
    }));

    it('should handle error when saving product fails', fakeAsync(() => {
      const productSavedSpy = spyOn(component.productSaved, 'emit');
      component.product.name = 'Error Product';

      component.saveProduct();
      tick();

      expect(component.messageService.add).toHaveBeenCalledWith({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to add product'
      });
      expect(productSavedSpy).not.toHaveBeenCalled();
    }));
  });
});
