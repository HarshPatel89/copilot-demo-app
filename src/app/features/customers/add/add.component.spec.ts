import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { MessageService } from 'primeng/api';
import { AddComponent } from './add.component';
import { CustomerService } from '../../../shared/services/customer.service';
import { Customer } from '../../../shared/models/customer';

// Mock services
class MockCustomerService {
  addCustomer(customer: Customer) {
    const { id, ...rest } = customer;
    return of({ id: 1, ...rest });
  }
}

class MockMessageService {
  add = jasmine.createSpy('add');
}

fdescribe('AddComponent', () => {
  let component: AddComponent;
  let fixture: ComponentFixture<AddComponent>;
  let mockCustomerService: MockCustomerService;
  let mockMessageService: MockMessageService;

  beforeEach(async () => {
    mockCustomerService = new MockCustomerService();
    mockMessageService = new MockMessageService();

    await TestBed.configureTestingModule({
      imports: [AddComponent, FormsModule],
      providers: [
        { provide: CustomerService, useValue: mockCustomerService },
        { provide: MessageService, useValue: mockMessageService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty customer', () => {
    expect(component.newCustomer).toEqual({
      id: 0,
      name: '',
      email: '',
      isPrimeMember: false
    });
  });

  it('should reset customer to default values', () => {
    // Arrange
    component.newCustomer = {
      id: 1,
      name: 'Test User',
      email: 'test@example.com',
      isPrimeMember: true
    };

    // Act
    component.resetCustomer();

    // Assert
    expect(component.newCustomer).toEqual({
      id: 0,
      name: '',
      email: '',
      isPrimeMember: false
    });
  });

  it('should save customer successfully', () => {
    // Arrange
    const testCustomer = {
      id: 0,
      name: 'Test User',
      email: 'test@example.com',
      isPrimeMember: false
    };
    
    component.newCustomer = {...testCustomer};
    
    spyOn(component.customerSaved, 'emit');
    const customerServiceSpy = TestBed.inject(CustomerService);
    spyOn(customerServiceSpy, 'addCustomer').and.returnValue(of({
      id: 1,
      name: 'Test User',
      email: 'test@example.com',
      isPrimeMember: false
    }));

    // Act
    component.saveCustomer();

    // Assert
    expect(customerServiceSpy.addCustomer).toHaveBeenCalledWith(testCustomer);
    expect(mockMessageService.add).toHaveBeenCalledWith({
      severity: 'success',
      summary: 'Success',
      detail: 'Customer added successfully'
    });
    expect(component.customerSaved.emit).toHaveBeenCalled();
    
    // After successful save, customer should be reset
    expect(component.newCustomer).toEqual({
      id: 0,
      name: '',
      email: '',
      isPrimeMember: false
    });
  });

  it('should handle error when saving customer fails', () => {
    // Arrange
    const testCustomer = {
      id: 0,
      name: 'Test User',
      email: 'test@example.com',
      isPrimeMember: false
    };
    
    component.newCustomer = {...testCustomer};
    
    const customerServiceSpy = TestBed.inject(CustomerService);
    spyOn(customerServiceSpy, 'addCustomer').and.returnValue(throwError(() => new Error('Error')));
    spyOn(component.customerSaved, 'emit');

    // Act
    component.saveCustomer();

    // Assert
    expect(customerServiceSpy.addCustomer).toHaveBeenCalledWith(testCustomer);
    expect(mockMessageService.add).toHaveBeenCalledWith({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to add customer'
    });
    expect(component.customerSaved.emit).not.toHaveBeenCalled();
  });
});
