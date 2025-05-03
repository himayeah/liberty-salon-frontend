import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ClientRegServiceService } from 'src/app/services/client-reg/client-reg-service.service';
import { MatPaginator } from '@angular/material/paginator';
import { MessageService } from 'primeng/api';
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
  //Validation :we make a variable to check if the input field is submitted w/o entering data. Check (<span> at html file to see how submitted is used)
  //after submitting the form, status should change to true. check (OnSubmit at this file)
  constructor(
    private fb: FormBuilder,
    private clientRegService: ClientRegServiceService,
    private messageService : MessageServiceService
  ) 
  {
    this.clientRegForm = this.fb.group({
      firstName: new FormControl('', [Validators.required]),
      //Input field validations.1st step. Next Step at : client-reg.component.html(check <span> line).3rd Step : client-reg.component.ts (ngOnsubmit)
      lastName: new FormControl('', [Validators.minLength(3), Validators.maxLength(8)]),
      email: new FormControl('', [Validators.email]),
      phoneNumber: new FormControl('', [Validators.required])
    });

    // Default fallback data
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
  
        if (response && response.length > 0) {
          this.dataSource = new MatTableDataSource(response);
          this.dataSource.paginator = this.paginator;
        }
      }, error => {
        console.error("Error fetching data", error);
      });
    }
    catch (error){
        this.messageService.showError('Action failed with error' + error);
    }

  }

  onSubmit(): void {
    try {
      console.log("Form Submitted");
      console.log(this.clientRegForm.value);

      this.submitted = true;
      //Validation. see how submitted has become true after submitting

      //Validation 3rd step (below)
      if(this.clientRegForm.invalid){
        return;
      }
  
      if (this.mode === 'add') {
        this.clientRegService.serviceCall(this.clientRegForm.value).subscribe(response => {
          console.log('server response:', response);
          this.populateData(); // refresh after add
          this.messageService.showSuccess('Data added successfully!');
        });
      } else if (this.mode === 'edit') {
        this.clientRegService.editData(this.selectedData.id, this.clientRegForm.value).subscribe(response => {
          console.log('server response for edit:', response);
          this.populateData(); // refresh after edit
          this.messageService.showSuccess('Data edited successfully!');
        });
      }
  
      this.mode = 'add';
      this.clientRegForm.disable(); // disables the form after submission
      this.isButtonDisabled = true;
    } catch (error) {
      this.messageService.showError('Action failed with error' + error);
      //1st Step. Next step -> message-service.service.ts
  }
}
  

  public resetData(): void {
    this.clientRegForm.reset();
    this.clientRegForm.enable();
    this.isButtonDisabled = false; // re-enable the Save button
  }

  public editData(data: any): void {
    this.clientRegForm.patchValue(data);
    this.clientRegForm.enable();
    this.mode = 'edit';
    this.selectedData = data;
    this.isButtonDisabled = false; // allow saving after edit
  }

  public deleteData(data: any): void {
    try {
      const id = data.id;
      this.clientRegService.deleteData(id).subscribe(response => {
        console.log('server response for delete:', response);
        this.populateData();
        this.messageService.showSuccess('Data deleted successfully');
      });
    } catch (error) {
      console.log(error);
      this.messageService.showError(error);
    }
  }
  
}
