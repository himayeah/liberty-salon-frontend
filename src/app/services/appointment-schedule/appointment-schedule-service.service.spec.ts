import { TestBed } from '@angular/core/testing';

import { AppointmentScheduleServiceService } from './appointment-schedule-service.service';

describe('AppointmentScheduleServiceService', () => {
  let service: AppointmentScheduleServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppointmentScheduleServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
