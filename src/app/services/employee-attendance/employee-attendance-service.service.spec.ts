import { TestBed } from '@angular/core/testing';

import { EmployeeAttendanceServiceService } from './employee-attendance-service.service';

describe('EmployeeAttendanceServiceService', () => {
  let service: EmployeeAttendanceServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmployeeAttendanceServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
