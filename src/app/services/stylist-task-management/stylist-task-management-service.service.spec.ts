import { TestBed } from '@angular/core/testing';

import { StylistTaskManagementServiceService } from './stylist-task-management-service.service';

describe('StylistTaskManagementServiceService', () => {
  let service: StylistTaskManagementServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StylistTaskManagementServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
