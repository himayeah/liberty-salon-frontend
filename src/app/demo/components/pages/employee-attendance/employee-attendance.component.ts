import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { EmployeeAttendanceService } from 'src/app/services/employee-attendance/employee-attendance-service.service';
import { MessageServiceService } from 'src/app/services/message-service/message-service.service';

@Component({
  selector: 'app-employee-attendance',
  standalone: false,
  templateUrl: './employee-attendance.component.html',
  styleUrl: './employee-attendance.component.scss'
})
export class EmployeeAttendanceComponent implements OnInit {

  attendanceForm: FormGroup;

  displayedColumns: string[] = ['employeeName', 'status', 'date', 'actions'];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  mode = 'add';
  selectedData: any;
  isButtonDisabled = false;
  submitted = false;

  employeeNameList: string[] = ['John Doe', 'Jane Smith', 'Michael Johnson', 'Emily Brown'];
  statusList: string[] = ['Present', 'Absent', 'On Leave'];

  constructor(
    private fb: FormBuilder,
    private employeeAttendanceService: EmployeeAttendanceService,
    private messageService: MessageServiceService
  ) {
    this.attendanceForm = this.fb.group({
      employeeName: new FormControl('', [Validators.required]),
      status: new FormControl('', [Validators.required]),
      date: new FormControl('', [Validators.required])
    });

    // Default fallback data
    // this.dataSource = new MatTableDataSource([
    //   { employeeName: 'John Doe', status: 'Present', date: new Date().toISOString() }
    // ]);
  }

  ngOnInit(): void {
    this.populateData();
  }

  public populateData(): void {
    try {
      this.employeeAttendanceService.getData().subscribe((response: any[]) => {
        console.log("get Data response", response);

        if (response && response.length > 0) {
          this.dataSource = new MatTableDataSource(response);
          this.dataSource.paginator = this.paginator;
        }
      }, error => {
        console.error("Error fetching data", error);
      });
    } catch (error) {
      this.messageService.showError('Action failed with error ' + error);
    }
  }

  onSubmit(): void {
    try {
      console.log("Form Submitted");
      console.log(this.attendanceForm.value);

      this.submitted = true;

      if (this.attendanceForm.invalid) {
        return;
      }

      if (this.mode === 'add') {
        this.employeeAttendanceService.serviceCall(this.attendanceForm.value).subscribe(response => {
          console.log('server response:', response);
          this.populateData();
          this.messageService.showSuccess('Attendance added successfully!');
        });
      } else if (this.mode === 'edit') {
        this.employeeAttendanceService.editData(this.selectedData.id, this.attendanceForm.value).subscribe(response => {
          console.log('server response for edit:', response);
          this.populateData();
          this.messageService.showSuccess('Attendance updated successfully!');
        });
      }

      this.mode = 'add';
      this.attendanceForm.disable();
      this.isButtonDisabled = true;
    } catch (error) {
      this.messageService.showError('Action failed with error ' + error);
    }
  }

  public resetData(): void {
    this.attendanceForm.reset();
    this.attendanceForm.enable();
    this.isButtonDisabled = false;
  }

  public editData(data: any): void {
    this.attendanceForm.patchValue(data);
    this.attendanceForm.enable();
    this.mode = 'edit';
    this.selectedData = data;
    this.isButtonDisabled = false;
  }

  public deleteData(data: any): void {
    try {
      const id = data.id;
      this.employeeAttendanceService.deleteData(id).subscribe(response => {
        console.log('server response for delete:', response);
        this.populateData();
        this.messageService.showSuccess('Attendance deleted successfully!');
      });
    } catch (error) {
      console.log(error);
      this.messageService.showError(error);
    }
  }
}
