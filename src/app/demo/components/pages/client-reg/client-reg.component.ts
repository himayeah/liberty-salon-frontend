import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ClientRegServiceService } from 'src/app/services/client-reg/client-reg-service.service';
import { MatPaginator } from '@angular/material/paginator';
import { MessageServiceService } from 'src/app/services/message-service/message-service.service';

@Component({
  selector: 'app-client-reg',
  standalone: false,
  templateUrl: './client-reg.component.html',
  styleUrls: ['./client-reg.component.scss']
})
export class ClientRegComponent implements OnInit {

  clientRegForm: FormGroup;
  displayedColumns: string[] = ['firstName', 'lastName', 'email', 'phoneNumber', 'actions'];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  mode = 'add';
  selectedData: any;
  isButtonDisabled = false;
  submitted = false;

  searchValue = ''; //added for search

  constructor(
    private fb: FormBuilder,
    private clientRegService: ClientRegServiceService,
    private messageService: MessageServiceService
  ) {
    this.clientRegForm = this.fb.group({
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.minLength(3), Validators.maxLength(8)]),
      email: new FormControl('', [Validators.email]),
      phoneNumber: new FormControl('', [Validators.required])
    });

    this.dataSource = new MatTableDataSource([
      { firstName: 'John', lastName: 'Doe', email: 'john@example.com', phoneNumber: '1234567890' }
    ]);
  }

  ngOnInit(): void {
    this.populateData();
  }

  public populateData(): void {
    try {
      this.clientRegService.getData().subscribe((response: any[]) => {
        console.log("get Data response", response);

        this.dataSource = new MatTableDataSource(response);
        this.dataSource.paginator = this.paginator;

        //Filter works on all columns
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
      console.log("Form Submitted", this.clientRegForm.value);
      this.submitted = true;

      if (this.clientRegForm.invalid) {
        return;
      }

      if (this.mode === 'add') {
        this.clientRegService.serviceCall(this.clientRegForm.value).subscribe(response => {
          console.log('Server response:', response);
          this.populateData();
          this.messageService.showSuccess('Data added successfully!');
        });
      } else if (this.mode === 'edit') {
        this.clientRegService.editData(this.selectedData.id, this.clientRegForm.value).subscribe(response => {
          console.log('Server response for edit:', response);
          this.populateData();
          this.messageService.showSuccess('Data edited successfully!');
        });
      }

      this.mode = 'add';
      this.clientRegForm.disable();
      this.isButtonDisabled = true;
    } catch (error) {
      this.messageService.showError('Action failed with error ' + error);
    }
  }

  public resetData(): void {
    this.clientRegForm.reset();
    this.clientRegForm.enable();
    this.isButtonDisabled = false;
  }

  public editData(data: any): void {
    this.clientRegForm.patchValue(data);
    this.clientRegForm.enable();
    this.mode = 'edit';
    this.selectedData = data;
    this.isButtonDisabled = false;
  }

  public deleteData(data: any): void {
    try {
      const id = data.id;
      this.clientRegService.deleteData(id).subscribe(response => {
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
