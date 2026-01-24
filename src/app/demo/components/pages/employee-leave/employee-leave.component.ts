import { Component, ViewChild } from '@angular/core';
import { Form, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MessageServiceService } from 'src/app/services/message-service/message-service.service';
import { FormBuilder } from '@angular/forms';
import { EmployeeLeaveServiceService } from 'src/app/services/employee-leave/employee-leave-service.service';
import { EmployeeRegServicesService } from 'src/app/services/employee-reg/employee-reg-services.service';

@Component({
  selector: 'app-employee-leave',
  templateUrl: './employee-leave.component.html',
  styleUrl: './employee-leave.component.scss'
})
export class EmployeeLeaveComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  employeeLeaveForm: FormGroup
  dataSource = new MatTableDataSource<any>([]);
  displayedColumns: string[] = ['employeeName', 'leaveType', 'startDate', 'endDate', 'reason', 'actions'];

  employees: any[] = [];

  isButtonDisabled = false;
  submitted = false;
  saveButtonLabel = 'Save';
  mode: 'add' | 'edit' = 'add';
  electedData: any = null;
  selectedRow: any = null;
  lastAddedRow: any = null;
  lastEditedRow: any = null;

  constructor(
    private fb: FormBuilder,
    private employeeLeaveService: EmployeeLeaveServiceService,
    private messageService: MessageServiceService,
    private employeeRegService: EmployeeRegServicesService
  ) {
    this.employeeLeaveForm = this.fb.group({
      employeeName: ['', Validators.required],
      leaveType: [''],
      startDate: [''],
      endDate: [''],
      reason: ['']
    });
  }

  ngOnInit(): void {
    this.populateData();
    this.fetchEmployeeNames();
  }

  fetchEmployeeNames(): void {
    this.employeeRegService.getData().subscribe({
      next: (response: any[]) => {
        this.employees = response.map(employee => employee.firstName + ' ' + employee.lastName);  
      },
      error: (error) => {
        this.messageService.showError('Error fetching employee names');
      }
    });
  }

  get f() { return this.employeeLeaveForm.controls; }

  isInvalid(controlName: string, errorType: string): boolean {
    const control = this.f[controlName];
    return (control.touched || this.submitted) && control.hasError(errorType);
  }

  populateData(): void {
    this.employeeLeaveService.getData().subscribe({
      next: (response: any[]) => {
        this.dataSource.data = response;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (error) => {
        this.messageService.showError('Error fetching data');
      }
    });
    
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.employeeLeaveForm.invalid) 
      return;

    this.isButtonDisabled = true;
    const formValue = this.employeeLeaveForm.value;

    if (this.mode === 'add') {
      this.employeeLeaveService.serviceCall(formValue).subscribe({
        next: (response) => {
          this.dataSource.data = [response, ...this.dataSource.data];
          this.messageService.showSuccess('Saved Successfully!');       
          this.highlightRow('add', response);
          this.resetFormState();
        },
        error: (error) => this.handleError(error)
      });
    } else {
      this.employeeLeaveService.editData(this.electedData?.id, formValue).subscribe({
        next: (response) => {
          const index = this.dataSource.data.findIndex(item => item.id === this.electedData?.id);
          if (index > -1) this.dataSource.data[index] = response;
          this.messageService.showSuccess('Updated Successfully!');
          this.highlightRow('edit', response);
          this.resetFormState();
        },
        error: (error) => this.handleError(error)
      });
    }
    }

  editData(data: any): void {
    this.employeeLeaveForm.patchValue({
      ...data
    });
    this.electedData = data;
    this.saveButtonLabel = 'Update';
    this.mode = 'edit';
    this.isButtonDisabled = false;
    this.selectedRow = data;
  }

  deleteData(data: any): void {
    this.employeeLeaveService.deleteData(data.id).subscribe({
      next: () => {
        this.messageService.showSuccess('Deleted Successfully!');
        this.populateData();
      },
      error: (error) => this.messageService.showError('Delete failed: ' + error.message)
    });
  }

  resetData(): void {
    this.employeeLeaveForm.reset();
    this.submitted = false;
    this.isButtonDisabled = false;
    this.saveButtonLabel = 'Save';
    this.mode = 'add';
    this.electedData = null;
    this.selectedRow = null;
  }

  refreshData(): void {
    this.populateData();
    this.dataSource.filter = '';
    this.selectedRow = null;
  }
  
  private handleError(error: any): void {
    this.messageService.showError('Action failed: ' + error.message);
    this.isButtonDisabled = false;
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
    if (this.dataSource.paginator) this.dataSource.paginator.firstPage();
  }

  private resetFormState(): void {
    this.employeeLeaveForm.reset();
    this.submitted = false;
    this.isButtonDisabled = false;
    this.saveButtonLabel = 'Save';
    this.mode = 'add';
    this.electedData = null;
    this.selectedRow = null;
  }
  
  private highlightRow(action: 'add' | 'edit', rowData: any): void {
    if (action === 'add') {
      this.lastAddedRow = rowData;
      setTimeout(() => this.lastAddedRow = null, 3000);
    } else {
      this.lastEditedRow = rowData;
      setTimeout(() => this.lastEditedRow = null, 3000);
    }
  } 

}


