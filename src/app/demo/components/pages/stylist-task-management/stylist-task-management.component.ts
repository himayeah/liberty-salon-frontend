import { Component, OnInit, ViewChild } from '@angular/core';
import {
    FormGroup,
    FormBuilder,
    Validators,
    FormControl,
} from '@angular/forms';
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
    displayedColumns: string[] = [
        'stylistName',
        'serviceType',
        'date',
        'startTime',
        'endTime',
        'status',
        'actions',
    ];
    dataSource: MatTableDataSource<any>;

    @ViewChild(MatPaginator) paginator: MatPaginator;

    mode = 'add';
    selectedData;
    submitted = false;
    saveButtonLabel = 'Save';
    isButtonDisabled = false;

    constructor(
        private fb: FormBuilder,
        private stylistTaskManagementService: StylistTaskManagementServiceService,
        private messageService: MessageServiceService
    ) {
        this.stylistTaskManagementForm = this.fb.group({
            stylistName: new FormControl('', [Validators.required]),
            serviceType: new FormControl('', [Validators.required]),
            date: new FormControl('', [Validators.required]),
            startTime: new FormControl('', [Validators.required]),
            endTime: new FormControl('', [Validators.required]),
            status: new FormControl('', [Validators.required]),
        });
    }

    ngOnInit(): void {
        this.populateData();
    }

    public populateData(): void {
        try {
            this.stylistTaskManagementService.getData().subscribe(
                (response: any[]) => {
                    console.log('get Data response', response);

                    if (response && response.length > 0) {
                        this.dataSource = new MatTableDataSource(response);
                        this.dataSource.paginator = this.paginator;
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
    try {
      // console.log('Mode: ' + this.mode); ///// for testing ////
      // console.log('Form Submitted'); /////// for testing ////////

      this.submitted = true;

      //check if the form is valid
      if (this.stylistTaskManagementForm.invalid) {
        return;
      }

      if (this.mode === 'add') {
        this.stylistTaskManagementService.serviceCall(this.stylistTaskManagementForm.value).subscribe({
          next: (response: any) => {
            if (this.dataSource && this.dataSource.data && this.dataSource.data.length > 0) {
              this.dataSource = new MatTableDataSource([response, ...this.dataSource.data]);
            } else {
              this.dataSource = new MatTableDataSource([response]);
            }
            this.messageService.showSuccess('Employee Saved Successfully!');
          },
          error: (error) => {
            this.messageService.showError('Action failed with error ' + error);
          }
        });
      } else if (this.mode === 'edit') {
        this.stylistTaskManagementService.editData(this.selectedData?.id, this.stylistTaskManagementForm.value).subscribe({
          next: (response: any) => {
            let elementIndex = this.dataSource.data.findIndex((element) => element.id === this.selectedData?.id);
            this.dataSource.data[elementIndex] = response;
            this.dataSource = new MatTableDataSource(this.dataSource.data);
            this.messageService.showSuccess('Successfully updated!');
          },
          error: (error) => {
            this.messageService.showError('Action failed with error ' + error);
          }
        });
      }

      this.mode = 'add';
      this.stylistTaskManagementForm.disable();
      this.isButtonDisabled = true;
    } catch (error) {
      console.log(error);
      this.messageService.showError('Action failed with error ' + error);
    }
  }

    public resetForm(): void {
        this.stylistTaskManagementForm.reset();
        this.stylistTaskManagementForm.enable();
        // this.mode = 'add';
        this.saveButtonLabel = 'Save';
        // this.selectedData = null;
        this.submitted = false;
        this.isButtonDisabled = false; // re-enable the Save button
    }

    public editData(data: any): void {
      
        let formattedDate: Date | null = null;
        if (data.date) {
            formattedDate = new Date(data.date);
        }
        this.stylistTaskManagementForm.patchValue({
            stylistName: data.stylistName,
            serviceType: data.serviceType,
            date: formattedDate,
            startTime: data.startTime,
            endTime: data.endTime,
            status: data.status,
        });
        // console.log('Editing data:', data);

        this.selectedData = data;
        this.mode = 'edit';
        this.saveButtonLabel = 'Edit';
        this.isButtonDisabled = false; // allow saving after edit
        this.stylistTaskManagementForm.enable(); // enable the form for editing

        console.log('mode:', this.mode);

    }

    public deleteData(data: any): void {
        const id = data.id;
        this.stylistTaskManagementService.deleteData(id).subscribe(() => {
            this.messageService.showSuccess('Data deleted successfully');
            this.populateData();
        });
    }
}
