import { Component, ViewChild, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, AbstractControl, Validators } from '@angular/forms';
import { EmployeeRegServicesService } from 'src/app/services/employee-reg/employee-reg-services.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MessageServiceService } from 'src/app/services/message-service/message-service.service';

@Component({
  selector: 'app-employee-reg',
  templateUrl: './employee-reg.component.html',
  styleUrls: ['./employee-reg.component.scss']
})

export class EmployeeRegComponent implements OnInit {

  employeeRegForm: FormGroup;
  displayedColumns: string[] = ['firstName', 'lastName', 'fullName', 'age', 'email', 'phoneNumber', 'bloodType', 'actions'];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  mode = 'add';
  selectedData: any;
  isButtonDisabled = false;
  submitted = false;

  searchValue = '';

  constructor(
    private fb: FormBuilder,
    private employeeRegServiceService: EmployeeRegServicesService,
    private messageService: MessageServiceService
  ) {
    this.employeeRegForm = this.fb.group({
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(15)]),
      fullName: new FormControl('', [Validators.required]),
      age: new FormControl('', [Validators.required, Validators.min(18), Validators.max(120)]),
      email: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$')]),
      phoneNumber: new FormControl('', [Validators.required, Validators.pattern('^(\\+94|94|0)(7[01245678][0-9]{7})$')]),
      bloodType: new FormControl('', [Validators.required]),
    });

    this.dataSource = new MatTableDataSource([
      { firstName: 'John', lastName: 'Doe',fullName: 'John Doe', email: 'john@example.com', phoneNumber: '1234567890', bloodType:'AB+' }
    ]);
  }

  ngOnInit(): void {
    this.populateData();
  }

  public populateData(): void {
    try {
      this.employeeRegServiceService.getData().subscribe((response: any[]) => {
        console.log("get Data response", response);

        this.dataSource = new MatTableDataSource(response);
        this.dataSource.paginator = this.paginator;

        this.dataSource.filterPredicate = (data, filter: string) => {
          const dataStr = Object.values(data).join(' ').toLowerCase();
          return dataStr.includes(filter);
        };

      }, error => {
        console.error("Error fetching data", error);
      });
    } catch (error) {
      this.messageService.showError('Action failed with error ' + error);
    }
  }

  onSubmit(): void {
    try {
      console.log("Form Submitted", this.employeeRegForm.value);
      this.submitted = true;

      if (this.employeeRegForm.invalid) {
        return;
      }

      if (this.mode === 'add') {
        this.employeeRegServiceService.serviceCall(this.employeeRegForm.value).subscribe(response => {
          console.log('Server response:', response);
          this.populateData();
          this.messageService.showSuccess('Data added successfully!');
        });
      } else if (this.mode === 'edit') {
        this.employeeRegServiceService.editData(this.selectedData.id, this.employeeRegForm.value).subscribe(response => {
          console.log('Server response for edit:', response);
          this.populateData();
          this.messageService.showSuccess('Data edited successfully!');
        });
      }

      this.mode = 'add';
      this.employeeRegForm.disable();
      this.isButtonDisabled = true;
    } catch (error) {
      this.messageService.showError('Action failed with error ' + error);
    }
  }

  public resetData(): void {
    this.employeeRegForm.reset();
    this.employeeRegForm.enable();
    this.isButtonDisabled = false;
  }

  public editData(data: any): void {
    this.employeeRegForm.patchValue(data);
    this.employeeRegForm.enable();
    this.mode = 'edit';
    this.selectedData = data;
    this.isButtonDisabled = false;
  }

  public deleteData(data: any): void {
    try {
      const id = data.id;
      this.employeeRegServiceService.deleteData(id).subscribe(response => {
        console.log('Server response for delete:', response);
        this.populateData();
        this.messageService.showSuccess('Data deleted successfully');
      });
    } catch (error) {
      console.log(error);
      this.messageService.showError(error);
    }
  }
  /*Search*/
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.searchValue = filterValue;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  clearSearch(): void {
    this.searchValue = '';
    this.dataSource.filter = '';
  }
}




/** 
export class EmployeeRegComponent implements OnInit {

  employeeRegForm: FormGroup;
  isButtonDisabled: boolean = false;
  submitted: boolean = false;

  displayedColumns: string[] = ['firstName', 'lastName', 'fullName', 'age', 'email', 'phoneNumber', 'bloodType', 'actions'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource([]);
  @ViewChild(MatPaginator) paginator: MatPaginator;

  mode = 'add';
  selectedData: any;
  searchValue = '';

  constructor(
    private fb: FormBuilder,
    private employeeRegService: EmployeeRegServicesService,
    private messageService: MessageServiceService
  ) {
    this.employeeRegForm = this.fb.group({
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(15)]),
      fullName: new FormControl('', [Validators.required]),
      age: new FormControl('', [Validators.required, Validators.min(18), Validators.max(40), this.customAgeValidator]),
      email: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$')]),
      phoneNumber: new FormControl('', [Validators.required, Validators.pattern('^(\\+94|94|0)(7[01245678][0-9]{7})$')]),
      bloodType: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.populateData();
  }

  customAgeValidator(control: AbstractControl) {
    const controlValue = +control.value;
    if (isNaN(controlValue) || !Number.isInteger(controlValue)) {
      return { customAgeValidator: true };
    }
    return null;
  }

  public populateData(): void {
    try {
      this.employeeRegService.getData().subscribe((response: any) => {
        console.log('get data response', response);
        this.dataSource = new MatTableDataSource(response);
        this.dataSource.paginator = this.paginator;
      });
    } catch (error) {
      this.messageService.showError('Action failed with error ' + error);
    }
  }

  onSubmit(): void {
    console.log('Form Submitted');
    this.submitted = true;

    if (this.employeeRegForm.invalid) {
      return;
    }

    try {
      if (this.mode === 'add') {
        this.employeeRegService.serviceCall(this.employeeRegForm.value).subscribe((response) => {
          console.log('server response:', response);
          this.populateData();
          this.messageService.showSuccess('Data saved successfully');
        });
      } else if (this.mode === 'edit') {
        this.employeeRegService.editData(this.selectedData.id, this.employeeRegForm.value).subscribe((response) => {
          console.log('server response for edit:', response);
          this.populateData();
          this.messageService.showSuccess('Data updated successfully');
        });
      }
      this.resetFormState();
    } catch (error) {
      this.messageService.showError('Action failed with error ' + error);
    }
  }

  public resetData(): void {
    this.employeeRegForm.reset();
    this.employeeRegForm.enable();
    this.isButtonDisabled = false;
    this.submitted = false;
    this.mode = 'add';
  }

  public editData(data: any): void {
    this.employeeRegForm.patchValue(data);
    this.employeeRegForm.enable();
    this.mode = 'edit';
    this.selectedData = data;
    this.isButtonDisabled = false;
    this.submitted = false;
  }

  public deleteData(data: any): void {
    const id = data.id;
    try {
      this.employeeRegService.deleteData(id).subscribe((response) => {
        console.log('server response for delete:', response);
        this.populateData();
        this.messageService.showSuccess('Data deleted successfully');
      });
    } catch (error) {
      console.log(error);
      this.messageService.showError('Action failed with error ' + error);
    }
  }

  private resetFormState(): void {
    this.employeeRegForm.reset();
    this.employeeRegForm.disable();
    this.isButtonDisabled = true;
    this.mode = 'add';
    this.selectedData = null;
    this.submitted = false;
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.searchValue = filterValue;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  clearSearch(): void {
    this.searchValue = '';
    this.dataSource.filter = '';
  }
}
*/