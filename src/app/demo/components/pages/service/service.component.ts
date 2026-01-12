import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MessageServiceService } from 'src/app/services/message-service/message-service.service';
import { ServiceService } from 'src/app/services/service/service.service';

@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrl: './service.component.scss'
})
export class ServiceComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  serviceForm: FormGroup;
  dataSource = new MatTableDataSource<any>([]);
  displayedColumns: string[] = ['serviceName', 'duration', 'price', 'commission', 'colorCode', 'description', 'isActive', 'actions'];

  //state control
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
    private serviceService: ServiceService,
    private messageService: MessageServiceService
  ){
    //field types are also given here (String/Number/Boolean)
    this.serviceForm = this.fb.group({
      serviceName: ['', Validators.required],
      duration: [30, Validators.min(1)],
      price: [0, Validators.min(0)],
      commission: [0, [Validators.min(0), Validators.max(100)]],
      colorCode: ['#ffffff'],
      isActive: [true],
      description: ['']
    });
  }

ngOnInit(): void {
  //this.populateData();
}

get f() { return this.serviceForm.controls; }

isInvalid(controlName: string, errorType: string): boolean {
  const control = this.f[controlName];
  return (control.touched || this.submitted) && control.hasError(errorType);
}

applyFilter(event: Event): void {
  const filterValue = (event.target as HTMLInputElement).value;
  this.dataSource.filter = filterValue.trim().toLowerCase();
  if (this.dataSource.paginator) this.dataSource.paginator.firstPage();
}

populateData(): void {
  //getData()
  this.serviceService.getData().subscribe({
    next: (response: any[]) => {
      this.dataSource = new MatTableDataSource<any>(response || []);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    },
    error: (error) => {
      console.error('Error fetching Data:', error);
      this.messageService.showError('Failed to fetch data: ' + (error?.message ?? error?.statusText ?? 'Unknown error'));
    }
  });
}

onSubmit(): void {
  this.submitted = true;
  if (this.serviceForm.invalid) return;

  this.isButtonDisabled = true;
  const rawValue = this.serviceForm.value;
  // map UI field to backend field
  const payload: any = { ...rawValue, is_active: !!rawValue.isActive };
  delete payload.isActive;

  if (this.mode === 'add'){
    this.serviceService.serviceCall(payload).subscribe({
      next: (response) => {
        this.dataSource.data = [response, ...this.dataSource.data];
        this.messageService.showSuccess('Saved Successfully');
        this.highlightRow('add', response);
        this.resetFormState();
      },
      error: (error) => this.handleError(error)
    });
  } else {
    // edit
    if (!this.selectedData?.id) {
      this.handleError({ message: 'No selected service to update' });
      return;
    }
    this.serviceService.editService(this.selectedData.id, payload).subscribe({
      next: (response) => {
        // update local datasource entry
        const idx = this.dataSource.data.findIndex((d: any) => d.id === this.selectedData.id);
        if (idx > -1) {
          this.dataSource.data[idx] = response;
          this.dataSource._updateChangeSubscription();
        }
        this.messageService.showSuccess('Updated Successfully');
        this.highlightRow('edit', response);
        this.resetFormState();
      },
      error: (error) => this.handleError(error)
    });
  }
}

editService(data: any): void {
  // map backend is_active to form control isActive
  const patch: any = { ...data, isActive: data.is_active ?? true };
  this.serviceForm.patchValue(patch);
  this.selectedData = data;
  this.saveButtonLabel = 'Update';
  this.mode = 'edit';
  this.selectedRow = data;
}

deleteService(data: any): void {
  this.serviceService.deleteService(data.id).subscribe({
    next: () => {
      this.messageService.showSuccess('Deleted Successfully!');
      this.populateData();
    },
      error: (error) => {
      console.error('Delete failed:', error);
      this.messageService.showError('Delete Failed: ' + (error?.message ?? error?.statusText ?? 'Unknown error'))
    }
  });
}

refreshData(): void {
  this.populateData();
  this.dataSource.filter = '';
  this.selectedRow = null;
  if (this.dataSource.paginator) this.dataSource.paginator.firstPage();
}

// Toggle active state from the table
toggleActive(element: any, newState: boolean): void {
  // optimistic UI update
  const prev = element.is_active;
  element.is_active = newState;
  this.serviceService.editService(element.id, { is_active: newState }).subscribe({
    next: (response) => {
      // replace element with response (if returned)
      const idx = this.dataSource.data.findIndex((d: any) => d.id === element.id);
      if (idx > -1) {
        this.dataSource.data[idx] = response;
        this.dataSource._updateChangeSubscription();
      }
      this.messageService.showSuccess('Status updated');
    },
    error: (error) => {
      // rollback
      element.is_active = prev;
      this.dataSource._updateChangeSubscription();
      this.handleError(error);
    }
  });
}

//helpers
private handleError(error?: any): void{
  // log full error for diagnostics
  console.error('Request error:', error);

  const message = error?.message ?? error?.error?.message ?? (error?.status ? `${error.status} ${error.statusText}` : 'Unknown error');

  this.messageService.showError('Action failed: ' + message);
  this.isButtonDisabled = false;
}

private highlightRow(type: 'add' | 'edit', response: any): void {
  if (type === 'add') this.lastAddedRow = response;
  else this.lastEditedRow = response;
  setTimeout(() =>{
    this.lastAddedRow = null;
    this.lastEditedRow = null;
  }, 3000);
}

public resetData(): void {
  this.serviceForm.reset({
    serviceName: '',
    duration: 30,
    price: 0,
    commission: 0,
    colorCode: '#ffffff',
    isActive: true,
    description: ''
  });
  this.serviceForm.enable();
  this.submitted = false;
  this.saveButtonLabel = 'Save';
  this.mode = 'add';
  this.selectedData = null;
  this.selectedRow = null;
}

private resetFormState(): void {
  this.resetData();
  this.isButtonDisabled = false;
  this.populateData();
}


}
