import { Component, OnInit, ViewChild } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    FormControl,
    AbstractControl,
} from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ClientRegServiceService } from 'src/app/services/client-reg/client-reg-service.service';
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

@Component({
  selector: 'app-client-reg',
  standalone: false,
  templateUrl: './client-reg.component.html',
  styleUrls: ['./client-reg.component.scss']
})
export class ClientRegComponent implements OnInit {
  clientRegForm: FormGroup;
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
    'email',
    'phoneNumber',
    'actions'
  ];

  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private fb: FormBuilder,
    private clientRegService: ClientRegServiceService,
    private messageService: MessageServiceService
  ) {
    this.clientRegForm = this.fb.group({
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('',
        [Validators.minLength(3),
          Validators.maxLength(15)]),
      email: new FormControl('',[
        Validators.email,
        Validators.pattern(
                    '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$'
                ),
      ]),
      phoneNumber: new FormControl('',[
        Validators.required,
        Validators.pattern('^(\\+94|94|0)(7[01245678][0-9]{7})$'),
      ])
    });
  }

    ngOnInit(): void {
        //get data function
        this.populateData();
    }

  public populateData() {
    try {
      this.clientRegService.getData().subscribe(
        (Response: any[]) => {
          console.log("get Data response", Response);

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
      this.messageService.showError('Action failed with error ' + error);
    }
  }

  onSubmit() {
    this.submitted = true;
    // console.log('Form Submitted');
    console.log("Data : " , this.clientRegForm.value);
    
    if (this.clientRegForm.invalid) {
      return;
    }

    const formValue = this.clientRegForm.value;
    this.isButtonDisabled = true;

     if (this.mode === 'add') {
            this.clientRegService.serviceCall(formValue).subscribe({
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
            this.clientRegService
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
        this.clientRegForm.disable();
        this.isButtonDisabled = true;

        setTimeout(() => {
            this.mode = 'add';
            // this.dataPopulate();
            this.isButtonDisabled = true;
            this.clientRegForm.disable();
            // this.resetData();
        }, 500);
    }

    public resetData(): void {
        this.submitted = false;
        this.clientRegForm.updateValueAndValidity();
        this.clientRegForm.setErrors = null;
        this.clientRegForm.reset();
        this.clientRegForm.enable();
        this.isButtonDisabled = false;
        this.saveButtonLabel = 'save';
        this.mode = 'add';
        this.selectedRow = null;
    }

    public editData(data: any): void {
        this.clientRegForm.patchValue({
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phoneNumber: data.phoneNumber,
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
            this.clientRegService.deleteData(id).subscribe(
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

    refreshData() {
        this.populateData();
        this.selectedRow = null;
        this.dataSource.filter = ''; // Clear the filter on the dataSource
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage(); // Reset to the first page
        }
    }
}
