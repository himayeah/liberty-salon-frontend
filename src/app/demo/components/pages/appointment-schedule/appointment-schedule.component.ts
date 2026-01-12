
import { Component, OnInit, ViewChild } from '@angular/core';
import {FormBuilder,FormGroup,FormControl,Validators} from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MessageServiceService } from 'src/app/services/message-service/message-service.service';
import { AppointmentSchedulingServiceService } from 'src/app/services/appointment_scheduling/appointment-scheduling-service.service';
import { MatSort } from '@angular/material/sort';

@Component({
    selector: 'app-appointment-schedule',
    templateUrl: './appointment-schedule.component.html',
    styleUrls: ['./appointment-schedule.component.scss']
})
export class AppointmentScheduleComponent implements OnInit {
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    
    appointmentScheduleForm: FormGroup;
    dataSource = new MatTableDataSource<any>([]);
    displayedColumns: string[] = [
        'serviceName',
        'serviceDescription',
        'serviceDate',
        'serviceTime',
        'actions',
    ];
    
    //state
    isButtonDisabled = false;
    submitted = false;
    saveButtonLabel = 'Save';
    mode: 'add' | 'edit' = 'add';
    selectedData: any = null;
    lastAddedRow: any = null;
    lastEditedRow: any = null;

    constructor(
        private fb: FormBuilder,
        private appointmentScheduleService: AppointmentSchedulingServiceService,
        private messageService: MessageServiceService
    ) {
        this.appointmentScheduleForm = this.fb.group({
            serviceName: ['', Validators.required],
            serviceDescription: ['', Validators.required],
            serviceDate: ['', Validators.required],
            serviceTime: ['', Validators.required],
        });

  }

    ngOnInit(): void {
        this.populateData();
    }

    populateData(): void {
            this.appointmentScheduleService.getData().subscribe({
            next: (response: any[]) => {
                this.dataSource = new MatTableDataSource(response || []);
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
            },
            error: (error) => {
                this.messageService.showError('Error fetching data: ' + error.message);
            }
        });
    }

  onSubmit(): void {
        this.submitted = true;
        if (this.appointmentScheduleForm.invalid) return;

        this.isButtonDisabled = true;
        const formValue = this.appointmentScheduleForm.value;

        if (this.mode === 'add') {
            this.appointmentScheduleService.serviceCall(formValue).subscribe({
                next: (response) => {
                    this.dataSource.data = [response, ...this.dataSource.data];
                    this.messageService.showSuccess('Saved Successfully!');
                    this.highlightRow('add', response);
                    this.resetFormState();
                },
                error: (error) => this.handleError(error)
            });
        } else {
            this.appointmentScheduleService.editData(this.selectedData?.id, formValue).subscribe({
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
        this.appointmentScheduleForm.patchValue(data);
        this.selectedData = data;
        this.saveButtonLabel = 'Update';
        this.mode = 'edit';
        this.isButtonDisabled = false;
    }

    deleteData(data: any): void {
        this.appointmentScheduleService.deleteData(data.id).subscribe({
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
        if (this.dataSource.paginator) this.dataSource.paginator.firstPage();
    }

    resetData(): void {
        this.appointmentScheduleForm.reset();
        this.appointmentScheduleForm.enable();
        this.submitted = false;
        this.saveButtonLabel = 'Save';
        this.mode = 'add';
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
    
    }}
