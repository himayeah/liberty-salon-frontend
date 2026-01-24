import { TestBed } from '@angular/core/testing';

import { EmployeeLeaveServiceService } from './employee-leave-service.service';

describe('EmployeeLeaveServiceService', () => {
  let service: EmployeeLeaveServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmployeeLeaveServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
