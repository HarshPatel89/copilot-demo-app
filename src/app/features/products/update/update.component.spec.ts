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

class MockProductService {
  updateProduct(product: Product) {
    return of(product);
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
  let productService: MockProductService;
  let messageService: MockMessageService;

  const mockProduct: Product = {
    id: 1,
    name: 'Test Product',
    description: 'Test Description',
    price: 99.99
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UpdateComponent],
      imports: [
        NoopAnimationsModule,
        FormsModule,
        ButtonModule,
        InputTextModule,
        TextareaModule,
        InputNumberModule,
        ToastModule,
        RouterModule.forRoot([])
      ],
      providers: [
        { provide: ProductService, useClass: MockProductService },
        { provide: MessageService, useClass: MockMessageService }
      ]
    }).compileComponents();

    productService = TestBed.inject(ProductService) as MockProductService;
    messageService = TestBed.inject(MessageService) as unknown as MockMessageService;
    
    messageService.clear();
    
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
    expect(component.editedProduct).toBeTruthy();
    expect(component.editedProduct.id).toBe(mockProduct.id);
    expect(component.editedProduct.name).toBe(mockProduct.name);
    expect(component.editedProduct.description).toBe(mockProduct.description);
    expect(component.editedProduct.price).toBe(mockProduct.price);
  });

  it('should handle null product input', () => {
    component.product = null;
    component.ngOnInit();
    expect(component.editedProduct).toEqual({
      id: 0,
      name: '',
      description: '',
      price: 0
    });
  });

  it('should successfully update product', () => {
    component.editedProduct = { ...mockProduct };
    const updateSpy = spyOn(productService, 'updateProduct').and.returnValue(of({ ...mockProduct }));
    const emitSpy = spyOn(component.productUpdated, 'emit');

    component.updateProduct();

    expect(updateSpy).toHaveBeenCalledWith(component.editedProduct);
    expect(messageService.messages.length).toBe(1);
    expect(messageService.messages[0]).toEqual({
      severity: 'success',
      summary: 'Success',
      detail: 'Product updated successfully'
    });
    expect(emitSpy).toHaveBeenCalled();
  });

  it('should handle update error', () => {
    component.editedProduct = { ...mockProduct };
    spyOn(productService, 'updateProduct').and.returnValue(throwError(() => new Error('Update failed')));

    component.updateProduct();

    expect(messageService.messages.length).toBe(1);
    expect(messageService.messages[0]).toEqual({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to update product'
    });
  });

  it('should not call updateProduct if editedProduct is null', () => {
    component.editedProduct = null as any;
    const updateSpy = spyOn(productService, 'updateProduct');
    
    component.updateProduct();
    
    expect(updateSpy).not.toHaveBeenCalled();
  });

  it('should not call updateProduct if editedProduct id is 0', () => {
    component.editedProduct = { ...mockProduct, id: 0 };
    const updateSpy = spyOn(productService, 'updateProduct');
    
    component.updateProduct();
    
    expect(updateSpy).not.toHaveBeenCalled();
  });

  it('should emit productUpdated event on successful update', () => {
    spyOn(component.productUpdated, 'emit');
    component.editedProduct = { ...mockProduct };
    spyOn(productService, 'updateProduct').and.returnValue(of({ ...mockProduct }));

    component.updateProduct();

    expect(component.productUpdated.emit).toHaveBeenCalled();
    expect(messageService.messages[0]).toEqual({
      severity: 'success',
      summary: 'Success',
      detail: 'Product updated successfully'
    });
  });
});