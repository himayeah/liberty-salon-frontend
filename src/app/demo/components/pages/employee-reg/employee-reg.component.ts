import { Component, ViewChild } from '@angular/core';
import {FormBuilder,FormGroup,FormControl,AbstractControl, Validators} from '@angular/forms';

import { EmployeeRegServicesService } from 'src/app/services/employee-reg/employee-reg-services.service';
import { OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MessageServiceService } from 'src/app/services/message-service/message-service.service';
import { MatSort } from '@angular/material/sort';
import { ServiceService } from 'src/app/services/service/service.service';


@Component({
    selector: 'app-employee-reg',
    standalone: false,
    templateUrl: './employee-reg.component.html',
    styleUrls: ['./employee-reg.component.scss'],
})
export class EmployeeRegComponent implements OnInit {
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    employeeRegForm: FormGroup;
    dataSource = new MatTableDataSource<any>([]);
    displayedColumns: string[] = [
        'employeeName',
        'dateJoined',
        'designation',
        'specializations',
        'hourlyRate',
        'commissionRate',
        'weeklyOffDays',
        'maxAppointmentsPerDay',
        'actions'
    ];

    services: any[] = [];

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
        private employeeRegService: EmployeeRegServicesService,
        private messageService: MessageServiceService,
        private serviceService: ServiceService
    ) {
        this.employeeRegForm = this.fb.group({
            employeeName: new FormControl('', [Validators.required]),
            dateJoined: new FormControl('', [Validators.required]),
            designation: new FormControl('', [Validators.required]),
            specializations: new FormControl({ value: '', disabled: true }), // Initially disabled
            hourlyRate: new FormControl('', [Validators.required, Validators.min(0.01)]),
            commissionRate: new FormControl('', [Validators.required, Validators.min(0), Validators.max(100)]),
            weeklyOffDays: new FormControl('', [Validators.required]),
            maxAppointmentsPerDay: new FormControl('', [Validators.required]),
        });

        // Listen for changes in designation to enable/disable specializations
        this.employeeRegForm.get('designation')?.valueChanges.subscribe(designation => {
            const specializationsControl = this.employeeRegForm.get('specializations');
            if (designation === 'Bridal stylist' || designation === 'Groom stylist') {
                specializationsControl?.enable();
                specializationsControl?.setValidators(Validators.required);
            } else {
                specializationsControl?.disable();
                specializationsControl?.clearValidators();
                specializationsControl?.setValue('');
            }
            specializationsControl?.updateValueAndValidity();
        });
    }

    ngOnInit(): void {
        this.populateData();
        this.fetchServices();
    }

    fetchServices(): void {
        this.serviceService.getData().subscribe({
            next: (response: any) => {
                this.services = response;
            },
            error: (error) => {
                this.messageService.showError('Error fetching services: ' + error.message);
            }
        });
    }

    populateData(): void {
        this.employeeRegService.getData().subscribe({
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
        if (this.employeeRegForm.invalid) return;

        this.isButtonDisabled = true;
        const formValue = this.employeeRegForm.value;

        if (this.mode === 'add') {
            this.employeeRegService.serviceCall(formValue).subscribe({
                next: (response) => {
                    this.dataSource.data = [response, ...this.dataSource.data];
                    this.messageService.showSuccess('Saved Successfully!');
                    this.highlightRow('add', response);
                    this.resetFormState();
                },
                error: (error) => this.handleError(error)
            });
        } else {
            this.employeeRegService.editData(this.selectedData?.id, formValue).subscribe({
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
        this.employeeRegForm.patchValue({
            ...data,
            specializations: data.specializations ? data.specializations.map((s: any) => s.id) : []
        });
        this.selectedData = data;
        this.saveButtonLabel = 'Update';
        this.mode = 'edit';
        this.isButtonDisabled = false;
        this.selectedRow = data;
    }

    deleteData(data: any): void {
        this.employeeRegService.deleteData(data.id).subscribe({
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
        this.employeeRegForm.reset();
        this.employeeRegForm.enable();
        this.submitted = false;
        this.saveButtonLabel = 'Save';
        this.mode = 'add';
        this.selectedRow = null;
        this.isButtonDisabled = false;
        this.employeeRegForm.get('specializations')?.disable(); // Re-disable after reset
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