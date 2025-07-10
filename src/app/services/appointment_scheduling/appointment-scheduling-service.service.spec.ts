import { TestBed } from '@angular/core/testing';

import { AppointmentSchedulingServiceService } from './appointment-scheduling-service.service';

describe('AppointmentSchedulingServiceService', () => {
  let service: AppointmentSchedulingServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppointmentSchedulingServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
