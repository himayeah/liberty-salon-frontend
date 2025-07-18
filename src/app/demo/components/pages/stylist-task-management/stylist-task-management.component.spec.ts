import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StylistTaskManagementComponent } from './stylist-task-management.component';

describe('StylistTaskManagementComponent', () => {
  let component: StylistTaskManagementComponent;
  let fixture: ComponentFixture<StylistTaskManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StylistTaskManagementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StylistTaskManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
