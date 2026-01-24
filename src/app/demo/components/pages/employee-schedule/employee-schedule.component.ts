import { Component, effect, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { EmployeeScheduleService } from 'src/app/services/employee-schedule/employee-schedule-service.service';
import { MessageServiceService } from 'src/app/services/message-service/message-service.service';
import { EmployeeRegServicesService } from 'src/app/services/employee-reg/employee-reg-services.service';

@Component({
  selector: 'app-employee-schedule',
  templateUrl: './employee-schedule.component.html',
  styleUrls: ['./employee-schedule.component.scss']
})
export class EmployeeScheduleComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  employeeScheduleForm: FormGroup;
  dataSource: MatTableDataSource<any>;
  employees: any[] = [];

  displayedColumns: string[] = ['employeeName','workDay','startTime','endTime','effectiveDate','endDate','actions'];

  isButtonDisabled: boolean = false;
  submitted: boolean = false;
  saveButtonLabel: string = 'Save';
  mode: 'add' | 'edit' = 'add';
  selectedData: any = null;
  selectedRow: any = null;
  lastAddedRow: any;
  lastEditedRow: any;

  constructor(
    private fb: FormBuilder,
    private employeeScheduleService: EmployeeScheduleService,
    private messageService: MessageServiceService,
    private employeeRegServices: EmployeeRegServicesService
  ) {
    this.employeeScheduleForm = this.fb.group({
      employeeId: ['', Validators.required],
      workDay: ['', Validators.required],
      isActive: [true],
      startTime: [''],
      endTime: [''],
      effectiveDate: [''],
      endDate: ['']
    });
    this.dataSource = new MatTableDataSource<any>();
  }

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.employeeRegServices.getData().subscribe({
      next: (response: any[]) => {
        this.employees = response || [];
        this.populateData();
      },
      error: (error) => {
        this.messageService.showError('Error fetching employees: ' + error.message);
        this.populateData();
      }
    });
  }

  // convenience getter
    get f() { return this.employeeScheduleForm.controls; }

    isInvalid(controlName: string, errorType: string): boolean {
        const control = this.f[controlName];
        return (control.touched || this.submitted) && control.hasError(errorType);
    }

  populateData(): void {
    this.employeeScheduleService.getData().subscribe({
      next: (response: any[]) => {
        this.dataSource.data = new MatTableDataSource(response || []).data;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (error) => {
        this.messageService.showError('Error fetching schedules: ' + error.message);
      }
    });
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.employeeScheduleForm.invalid) return;
    
    this.isButtonDisabled = true;
    const formValue = this.employeeScheduleForm.value;

    if (this.mode === 'add'){
      this.employeeScheduleService.serviceCall(formValue).subscribe({
        next: (response) => {
          this.dataSource.data = [response, ...this.dataSource.data];
          this.messageService.showSuccess('Saved Successfully!');
          this.highlightRow('add', response);
          this.resetFormState();
        },
        error: (error) => this.handleError(error)
      });
    }  }

  deleteSchedule(schedule: any): void {
    this.employeeScheduleService.deleteData(schedule.id).subscribe({
      next: () => {
        this.dataSource.data = this.dataSource.data.filter(s => s.id !== schedule.id);
        this.messageService.showSuccess('Deleted Successfully!');
      },
      error: (error) => this.handleError(error)
    });
  }

  resetData(): void {
    this.employeeScheduleForm.reset();
    this.employeeScheduleForm.enable();
    this.submitted = false;
    this.saveButtonLabel = 'Save';
    this.mode = 'add';
    this.selectedRow = null;
    this.isButtonDisabled = false;
  }

  refreshData(): void {
    this.populateData();
    if (this.dataSource) {
        this.dataSource.filter = '';
        if (this.dataSource.paginator) this.dataSource.paginator.firstPage();
    }
    this.selectedRow = null;
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
    if (this.dataSource.paginator) this.dataSource.paginator.firstPage();
  }

  private handleError(error: any): void {
    this.messageService.showError('Action failed: ' + error.message);
    this.isButtonDisabled = false;
  } 

  private highlightRow(type: 'add' | 'edit', response: any): void {
    if (type === 'add') this.lastAddedRow = response;
    else this.lastEditedRow = response;
    setTimeout(() => {
        this.lastAddedRow = null;
        this.lastEditedRow = null;
    }, 3000);
  }

  private resetFormState(): void {
    this.resetData();
    this.isButtonDisabled = false;
  }
}
