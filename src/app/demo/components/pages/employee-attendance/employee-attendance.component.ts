import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup,FormBuilder,FormControl,AbstractControl} from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { EmployeeAttendanceService } from 'src/app/services/employee-attendance/employee-attendance-service.service';
import { MessageServiceService } from 'src/app/services/message-service/message-service.service';
import { Validators } from '@angular/forms';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-employee-attendance',
  standalone: false,
  templateUrl: './employee-attendance.component.html',
  styleUrl: './employee-attendance.component.scss'
})
export class EmployeeAttendanceComponent implements OnInit {
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    attendanceForm: FormGroup;
    dataSource = new MatTableDataSource<any>();
    displayedColumns: string[] = [
    'employeeName',
    'status',
    'date',
    'actions'
  ];

  // state
    isButtonDisabled = false;
    submitted = false;
    saveButtonLabel = 'Save';
    mode: 'add' | 'edit' = 'add';
    selectedData: any = null;
    selectedRow: any = null;
    lastAddedRow: any = null;
    lastEditedRow: any = null;


  constructor(
    private fb: FormBuilder,
    private employeeAttendanceService: EmployeeAttendanceService,
    private messageService: MessageServiceService
  ) {
    this.attendanceForm = this.fb.group({
      employeeName: new FormControl('', [Validators.required,
      Validators.minLength(3),
      Validators.maxLength(45),
      ]),
      status: new FormControl('', [Validators.required]),
      date: new FormControl('', [Validators.required])
    });
  }

  ngOnInit(): void {
    this.populateData();
  }

  populateData():void{
    this.employeeAttendanceService.getData().subscribe({
        next: (response: any [])=> {
            this.dataSource = new MatTableDataSource (response || []);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
        },
        error: (error) => {
            this.messageService.showError('Error Fetching data:'+ error.message);
        }
    });
  }

    onSubmit():void {
        this.submitted = true;
        if (this.attendanceForm.invalid)return;
        
        this.isButtonDisabled = true;
        const formValue = this.attendanceForm.value;

        if(this.mode === 'add'){
            this.employeeAttendanceService.serviceCall(formValue).subscribe({
                next: (response) => {
                    this.dataSource.data = [response,...this.dataSource.data];
                    this.messageService.showSuccess('Saved Successfully!');
                    this.highlightRow('add', response);
                    this.resetFormState();
                },
                error: (error) => this.handleError(error)
            });
        }else{
            this.employeeAttendanceService.editData(this.selectedData?.id, formValue).subscribe({
                next: (response) => {
                    const index = this.dataSource.data.findIndex(item => item.id === this.selectedData?.id);
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
        this.attendanceForm.patchValue(data);
        this.selectedData = data;
        this.saveButtonLabel = 'Update';
        this.mode = 'edit';
        this.isButtonDisabled = false;
        this.selectedRow = data;
    }

    deleteData(data: any): void {
        this.employeeAttendanceService.deleteData(data.id).subscribe({
            next: () => {
                this.messageService.showSuccess('Deleted Successfully!');
                this.populateData();
            },
            error: (error) => this.messageService.showError('Delete failed: ' + error.message)
        });
    }

    applyFilter(event: Event): void {
        const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
        this.dataSource.filter = filterValue;
        if (this.dataSource.paginator) this.dataSource.paginator.firstPage();
    }

    refreshData(): void {
        this.populateData();
        this.dataSource.filter = '';
        this.selectedRow = null;
        if (this.dataSource.paginator) this.dataSource.paginator.firstPage();
    }

    resetData(): void {
        this.attendanceForm.reset();
        this.attendanceForm.enable();
        this.submitted = false;
        this.saveButtonLabel = 'Save';
        this.mode = 'add';
        this.selectedRow = null;
        this.isButtonDisabled = false;
    }

    // helpers
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
        this.populateData();
    }

}
