import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageServiceService } from 'src/app/services/message-service/message-service.service';
import { ServiceCategoryService } from 'src/app/services/service-category/service-category.service';
import { MatTableDataSource } from '@angular/material/table';
import { filter } from 'rxjs';

@Component({
  selector: 'app-service-category',
  templateUrl: './service-category.component.html',
  styleUrls: ['./service-category.component.scss']
})
export class ServiceCategoryComponent implements OnInit{
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  serviceCategoryForm: FormGroup;
  dataSource = new MatTableDataSource<any>([]);
  displayedColumns: string[] = ['displayOrder', 'categoryName', 'description', 'actions'];

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
        private serviceCategoryService: ServiceCategoryService,
        private messageService: MessageServiceService
    ){
      this.serviceCategoryForm = this.fb.group({
        categoryName: ['', Validators.required],
        displayOrder: [0, Validators.min(0)],
        description: [''],
      });
    }

  //ngOnInit's populateData() method runs when the page first loads
  ngOnInit(): void {
    this.populateData(); 
  }

  //convenience getter
  get f() { return this.serviceCategoryForm.controls; }

  isInvalid(controlName: string, errorType: string): boolean {
    const control = this.f[controlName];
    return (control.touched || this.submitted) && control.hasError(errorType);
  }

  populateData(): void {
    //populateData() fetches all the table data from the database when ngOnInit runs
    this.serviceCategoryService.getData().subscribe({
      next: (response: any[]) => {
        this.dataSource = new MatTableDataSource(response || []);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (error) => {
        this.messageService.showError('Error fetching data', error.message);
      }
    })
  }

  //onSubmit() -> when the form is submitted through "Save" button in the UI (POST request)
  onSubmit(): void {
    this.submitted = true;
    if (this.serviceCategoryForm.invalid) {
      return;
    }

    this.isButtonDisabled = true;
    const formValue = this.serviceCategoryForm.value;

    if (this.mode === 'add') {
      this.serviceCategoryService.serviceCall(formValue).subscribe ({
        next: (response) => {
          this.dataSource.data = [response, ...this.dataSource.data];
          this.messageService.showSuccess('Saved Successfully!');
          this.highlightRow('add', response);
          this.resetFormState();
        },
        error: (error) => this.handleError(error)
      });
    } else {
      //editData()
      this.serviceCategoryService.editData(this.selectedData?.id, formValue).subscribe ({
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

  //html Table edit method
  editData(data: any): void {
    this.serviceCategoryForm.patchValue(data);
    this.selectedData = data;
    this.saveButtonLabel = 'Update';
    this.mode = 'edit';
    this.isButtonDisabled = false;
    this.selectedRow = data;
  }

  //deleteData() method
  deleteData(data: any): void {
    this.serviceCategoryService.deleteData(data.id).subscribe({
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

  // Reset form and UI state
  resetData(): void {
    this.serviceCategoryForm.reset();
    this.saveButtonLabel = 'Save';
    this.mode = 'add';
    this.selectedData = null;
    this.selectedRow = null;
    this.submitted = false;
    this.isButtonDisabled = false;
  }

  private handleError(error: any): void {
    this.messageService.showError('Action failed:' + (error?.message || error));
    this.isButtonDisabled = false;
  }

  private highlightRow(action: 'add' | 'edit', rowData: any): void {
    if (action === 'add') this.lastAddedRow = rowData;
    else this.lastEditedRow = rowData;
    setTimeout(() => {
      this.lastAddedRow = null;
      this.lastEditedRow = null;
    }, 3000);
  }

  private resetFormState(): void {
    // reset form
    this.serviceCategoryForm.reset();
    this.isButtonDisabled = false;
    this.populateData();
  }

}
      
    

    
  

