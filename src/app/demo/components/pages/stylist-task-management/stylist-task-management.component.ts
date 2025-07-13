import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { StylistTaskManagementServiceService } from 'src/app/services/stylist-task-management/stylist-task-management-service.service';
import { MessageServiceService } from 'src/app/services/message-service/message-service.service';

@Component({
  selector: 'app-stylist-task-management',
  templateUrl: './stylist-task-management.component.html',
  styleUrls: ['./stylist-task-management.component.scss'],
})
export class StylistTaskManagementComponent implements OnInit {
  stylistTaskManagementForm: FormGroup;
  displayedColumns: string[] = ['stylistName', 'serviceType', 'date', 'startTime', 'endTime','serviceStatus', 'actions'];
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  mode = 'add';
  selectedData: any;
  submitted = false;
  serviceTypes: string[] = ['Haircut', 'Coloring', 'Styling', 'Treatment'];
  serviceStatus: string[] = ['Scheduled', 'In-Progress', 'Completed', 'Cancelled'];

  constructor(
    private fb: FormBuilder,
    private stylistTaskManagementService: StylistTaskManagementServiceService,
    private messageService: MessageServiceService
  ) {
    this.stylistTaskManagementForm = this.fb.group({
      stylistName: ['', Validators.required],
      serviceType: ['', Validators.required],
      date: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      serviceStatus: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.populateData();
  }

   public populateData(): void {
      try {
        this.stylistTaskManagementService.getData().subscribe((response: any[]) => {
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
    this.submitted = true;

    if (this.stylistTaskManagementForm.invalid) return;

    const formValue = this.stylistTaskManagementForm.value;

    if (this.mode === 'add') {
      this.stylistTaskManagementService.serviceCall(formValue).subscribe(() => {
        this.messageService.showSuccess('Data added successfully!');
        this.populateData();
        this.resetForm();
      });
    } else if (this.mode === 'edit') {
      this.stylistTaskManagementService.editData(this.selectedData.id, formValue).subscribe(() => {
        this.messageService.showSuccess('Data updated successfully!');
        this.populateData();
        this.resetForm();
      });
    }
  }

  resetForm(): void {
    this.stylistTaskManagementForm.reset();
    this.stylistTaskManagementForm.setErrors = null;
    this.stylistTaskManagementForm.updateValueAndValidity();
    this.stylistTaskManagementForm.enable();
    this.mode = 'add';
    this.selectedData = null;
    this.submitted = false;
  }

  editData(data: any): void {
    this.stylistTaskManagementForm.patchValue({
      stylistName: data.stylistName,
      serviceType: data.serviceType,
      date: data.date,
      startTime: data.startTime,
      endTime: data.endTime,
      serviceStatus :data.serviceStatus,
    });
    this.selectedData = data;
    this.mode = 'edit';
  }

  deleteData(data: any): void {
    const id = data.id;
    this.stylistTaskManagementService.deleteData(id).subscribe(() => {
      this.messageService.showSuccess('Data deleted successfully');
      this.populateData();
    });
  }
}

