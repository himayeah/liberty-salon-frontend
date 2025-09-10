import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ClientRegServiceService } from 'src/app/services/client-reg/client-reg-service.service';
import { MessageServiceService } from 'src/app/services/message-service/message-service.service';

@Component({
    selector: 'app-client-reg',
    templateUrl: './client-reg.component.html',
    styleUrls: ['./client-reg.component.scss']
})
export class ClientRegComponent implements OnInit {
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    clientRegForm: FormGroup;
    dataSource = new MatTableDataSource<any>([]);
    displayedColumns: string[] = ['firstName', 'lastName', 'email', 'phoneNumber', 'actions'];

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
        private clientRegService: ClientRegServiceService,
        private messageService: MessageServiceService
    ) {
        this.clientRegForm = this.fb.group({
            firstName: ['', Validators.required],
            lastName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(15)]],
            email: ['', [Validators.required, Validators.email]],
            phoneNumber: ['', [Validators.required, Validators.pattern('^(\\+94|94|0)(7[01245678][0-9]{7})$')]],
            userID: ['', Validators.required],
            password: ['', Validators.required],
        });
    }

    ngOnInit(): void {
        this.populateData();
    }

    // convenience getter
    get f() { return this.clientRegForm.controls; }

    isInvalid(controlName: string, errorType: string): boolean {
        const control = this.f[controlName];
        return (control.touched || this.submitted) && control.hasError(errorType);
    }

    populateData(): void {
        this.clientRegService.getData().subscribe({
            next: (response: any[]) => {
                this.dataSource = new MatTableDataSource(response || []);
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
            },
            error: (error) => {
                this.messageService.showError('Error fetching data: ' + error);
            }
        });
    }

    onSubmit(): void {
        this.submitted = true;
        if (this.clientRegForm.invalid) return;

        this.isButtonDisabled = true;
        const formValue = this.clientRegForm.value;

        if (this.mode === 'add') {
            this.clientRegService.serviceCall(formValue).subscribe({
                next: (response) => {
                    this.dataSource.data = [response, ...this.dataSource.data];
                    this.messageService.showSuccess('Saved Successfully!');
                    this.highlightRow('add', response);
                    this.resetFormState();
                },
                error: (error) => this.handleError(error)
            });
        } else {
            this.clientRegService.editData(this.selectedData?.id, formValue).subscribe({
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
        this.clientRegForm.patchValue(data);
        this.selectedData = data;
        this.saveButtonLabel = 'Update';
        this.mode = 'edit';
        this.isButtonDisabled = false;
        this.selectedRow = data;
    }

    deleteData(data: any): void {
        this.clientRegService.deleteData(data.id).subscribe({
            next: () => {
                this.messageService.showSuccess('Deleted Successfully!');
                this.populateData();
            },
            error: (error) => this.messageService.showError('Delete failed: ' + error)
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
        this.clientRegForm.reset();
        this.clientRegForm.enable();
        this.submitted = false;
        this.saveButtonLabel = 'Save';
        this.mode = 'add';
        this.selectedRow = null;
        this.isButtonDisabled = false;
    }

    // helpers
    private handleError(error: any): void {
        this.messageService.showError('Action failed: ' + error);
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