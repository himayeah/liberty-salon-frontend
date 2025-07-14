import { Component, ViewChild } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    FormControl,
    AbstractControl,
} from '@angular/forms';
import { EmployeeRegServicesService } from 'src/app/services/employee-reg/employee-reg-services.service';
import { OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MessageServiceService } from 'src/app/services/message-service/message-service.service';
import { Validators } from '@angular/forms';
import { MatSort } from '@angular/material/sort';

export interface PeriodicElement {
    name: string;
    position: number;
    weight: number;
    symbol: string;
}

// const ELEMENT_DATA: any[] = [
//     {
//         firstName: 'John',
//         lastName: 'May',
//         fullName: 'John May',
//         age: 26,
//         email: 'johnmay@gmail.com',
//         phoneNumber: 506669809,
//         bloodType: 'O+',
//     },
// ];

@Component({
    selector: 'app-employee-reg',
    standalone: false,
    templateUrl: './employee-reg.component.html',
    styleUrls: ['./employee-reg.component.scss'],
})
export class EmployeeRegComponent implements OnInit {
    employeeRegForm: FormGroup;
    isButtonDisabled = false;
    submitted = false;
    saveButtonLabel = 'save';
    mode = 'add';
    selectedData: any;
    lastAddedRow: any = null;
    lastEditedRow: any = null;
    selectedRow: any = null;

    displayedColumns: string[] = [
        'firstName',
        'lastName',
        'fullName',
        'age',
        'email',
        'phoneNumber',
        'bloodType',
        'actions',
    ];

    dataSource: MatTableDataSource<any>;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    constructor(
        private fb: FormBuilder,
        private employeeRegService: EmployeeRegServicesService,
        private messageService: MessageServiceService
    ) {
        this.employeeRegForm = this.fb.group({
            firstName: new FormControl('', [Validators.required]),
            lastName: new FormControl('', [
                Validators.required,
                Validators.minLength(3),
                Validators.maxLength(15),
            ]),
            fullName: new FormControl('', [Validators.required]),
            age: new FormControl('', [
                Validators.required,
                Validators.min(18),
                Validators.max(40),
                this.customAgeValidator,
            ]),
            email: new FormControl('', [
                Validators.required,
                Validators.pattern(
                    '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$'
                ),
            ]), // <- we can use this [ Validators.email ]
            phoneNumber: new FormControl('', [
                Validators.required,
                Validators.pattern('^(\\+94|94|0)(7[01245678][0-9]{7})$'),
            ]),
            bloodType: new FormControl('', [Validators.required]),
        });
    }

    ngOnInit(): void {
        //get data function
        this.populateData();
    }

    // custom age validation
    customAgeValidator(control: AbstractControl) {
        if (!control) {
            return null;
        }

        const controlValue = +control.value;

        if (isNaN(controlValue)) {
            return { customAgeValidator: true };
        }

        if (!Number.isInteger) {
            return {
                customAgeValidator: true,
            };
        }
        return null;
    }

    //to keep the function clean, we implement it outside ngOnInit.
    public populateData() {
        try {
            this.employeeRegService.getData().subscribe(
                (Response: any[]) => {
                    console.log('get data response', Response);

                    if (Response && Response.length > 0) {
                        this.dataSource = new MatTableDataSource(Response);
                        this.dataSource.paginator = this.paginator; // Reassign paginator
                        this.dataSource.sort = this.sort; // Reassign sort
                    }
                },
                (error) => {
                    console.error('Error fetching data', error);
                }
            );
        } catch (error) {
            this.messageService.showError('Action failed with error' + error);
        }
    }

    onSubmit() {
        this.submitted = true;
        // console.log('Form Submitted');
        if (this.employeeRegForm.invalid) {
            return;
        }

        const formValue = this.employeeRegForm.value;
        this.isButtonDisabled = true;

        // if (this.mode === 'add') {
        //     this.employeeRegService.serviceCall(formValue).subscribe(
        //         () => {
        //             this.messageService.showSuccess('Data added successfully!');
        //             this.populateData();
        //             this.resetData();
        //         },
        //         () => {
        //             this.isButtonDisabled = false;
        //         }
        //     );
        // } else if (this.mode === 'edit') {
        //     this.employeeRegService
        //         .editData(this.selectedData.id, formValue)
        //         .subscribe(
        //             () => {
        //                 this.messageService.showSuccess(
        //                     'Data updated successfully!'
        //                 );
        //                 this.populateData();
        //                 this.resetData();
        //             },
        //             () => {
        //                 this.isButtonDisabled = false;
        //             }
        //         );
        // }

        if (this.mode === 'add') {
            this.employeeRegService.serviceCall(formValue).subscribe({
                next: (response: any) => {
                    if (
                        this.dataSource &&
                        this.dataSource.data &&
                        this.dataSource.data.length > 0
                    ) {
                        this.dataSource = new MatTableDataSource([
                            response,
                            ...this.dataSource.data,
                        ]);
                        this.dataSource.paginator = this.paginator; // Reassign paginator
                        this.dataSource.sort = this.sort; // Reassign sort
                    } else {
                        this.dataSource = new MatTableDataSource([response]);
                    }
                    this.messageService.showSuccess('Saved Successfully!');
                    setTimeout(() => {
                        this.populateData();
                    }, 1500);
                    // this.populateData();
                    this.lastAddedRow = response; // Track the last added row
                    setTimeout(() => {
                        this.lastAddedRow = null;
                    }, 3000);
                },
                error: (error) => {
                    this.messageService.showError(
                        'Action failed with error ' + error
                    );
                    this.isButtonDisabled = false;
                },
            });
        } else if (this.mode === 'edit') {
            this.employeeRegService
                .editData(this.selectedData?.id, formValue)
                .subscribe({
                    next: (response: any) => {
                        let elementIndex = this.dataSource.data.findIndex(
                            (element) => element.id === this.selectedData?.id
                        );
                        this.dataSource.data[elementIndex] = response;
                        this.dataSource = new MatTableDataSource(
                            this.dataSource.data
                        );
                        this.messageService.showSuccess(
                            'Successfully updated!'
                        );
                        this.lastEditedRow = response; // Track the last edited row
                        setTimeout(() => {
                            this.lastEditedRow = null; // Reset after 3 seconds
                        }, 3000);
                        this.populateData();
                        setTimeout(() => {
                            this.selectedRow = null;
                        }, 2000);
                        this.selectedData = null;
                    },
                    error: (error) => {
                        this.messageService.showError(
                            'Action failed with error ' + error
                        );
                        this.isButtonDisabled = false;
                    },
                });
        }
        this.mode = 'add';
        this.employeeRegForm.disable();
        this.isButtonDisabled = true;

        setTimeout(() => {
            this.mode = 'add';
            // this.dataPopulate();
            this.isButtonDisabled = true;
            this.employeeRegForm.disable();
            // this.resetData();
        }, 500);
    }

    public resetData(): void {
        this.submitted = false;
        this.employeeRegForm.updateValueAndValidity();
        this.employeeRegForm.setErrors = null;
        this.employeeRegForm.reset();
        this.employeeRegForm.enable();
        this.isButtonDisabled = false;
        this.saveButtonLabel = 'save';
        this.mode = 'add';
        this.selectedRow = null;
    }

    public editData(data: any): void {
        this.employeeRegForm.patchValue({
            firstName: data.firstName,
            lastName: data.lastName,
            fullName: data.fullName,
            age: data.age,
            email: data.email,
            phoneNumber: data.phoneNumber,
            bloodType: data.bloodType,
        });
        this.selectedData = data;
        this.saveButtonLabel = 'update';
        this.mode = 'edit';
        this.isButtonDisabled = false;

        if (this.selectedRow && this.selectedRow.id === data.id) {
            // this.selectedRow = null; // Toggle off if clicked again
        } else {
            this.selectedRow = data; // Highlight the new row
        }
    }

    public deleteData(data: any): void {
        try {
            const id = data.id;
            this.employeeRegService.deleteData(id).subscribe(
                () => {
                    this.messageService.showSuccess(
                        'Data deleted successfully!'
                    );
                    this.populateData();
                },
                (error) => {
                    console.error('Error deleting data', error);
                    this.messageService.showError('Failed to delete data');
                }
            );
        } catch (error) {
            this.messageService.showError('Action failed with error' + error);
        }
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    // public refreshData(): void {
    //     this.populateData();
    // }

    refreshData() {
        this.populateData();
        this.selectedRow = null;
        this.dataSource.filter = ''; // Clear the filter on the dataSource
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage(); // Reset to the first page
        }
    }
}
