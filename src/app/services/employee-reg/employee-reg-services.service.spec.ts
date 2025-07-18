import { TestBed } from '@angular/core/testing';

import { EmployeeRegServicesService } from './employee-reg-services.service';

describe('EmployeeRegServicesService', () => {
  let service: EmployeeRegServicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmployeeRegServicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
