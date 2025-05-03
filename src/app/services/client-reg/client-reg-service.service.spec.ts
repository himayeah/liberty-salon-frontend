import { TestBed } from '@angular/core/testing';

import { ClientRegServiceService } from './client-reg-service.service';

describe('ClientRegServiceService', () => {
  let service: ClientRegServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClientRegServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
