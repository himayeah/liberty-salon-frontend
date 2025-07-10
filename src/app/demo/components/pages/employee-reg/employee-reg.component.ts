import { Component, ViewChild } from '@angular/core';
import { FormBuilder,FormGroup, FormControl, AbstractControl } from '@angular/forms';
import { EmployeeRegServicesService } from 'src/app/services/employee-reg/employee-reg-services.service';
import { OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MessageServiceService } from 'src/app/services/message-service/message-service.service';
import { Validators } from '@angular/forms';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA:any[] = [
  {firstName: "John", lastName: 'May', fullName:"John May", age: 26, email:"johnmay@gmail.com", phoneNumber: 506669809, bloodType: "O+"},
];

@Component({
  selector: 'app-employee-reg',
  standalone: false,
  templateUrl: './employee-reg.component.html',
  styleUrl: './employee-reg.component.scss'
})
export class EmployeeRegComponent implements OnInit {

  employeeRegForm: FormGroup;
  isButtonDisabled: boolean = false;
 submitted: boolean = false;

  displayedColumns: string[] = ['firstName', 'lastName', 'fullName', 'age', 'email', 'phoneNumber', 'bloodType', 'actions'];
  dataSource: MatTableDataSource<any>;
   @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor (
    private fb: FormBuilder, 
    private employeeRegService:EmployeeRegServicesService,
    private messageService : MessageServiceService
    ){
    this.employeeRegForm = this.fb.group({
      firstName: new FormControl('',[Validators.required]),
      lastName: new FormControl('',[Validators.required,Validators.minLength(3),Validators.maxLength(15)]),
      fullName: new FormControl('',[Validators.required]),
      age: new FormControl('',[Validators.required,Validators.min(18),Validators.max(40),this.customAgeValidator]),
      email: new FormControl('',[Validators.required,Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')]), // <- we can use this [ Validators.email ]
      phoneNumber: new FormControl('',[Validators.required, Validators.pattern('^(\\+94|94|0)(7[01245678][0-9]{7})$')]),
      bloodType: new FormControl('',[Validators.required]),
    });
  }

  ngOnInit():void{
    //get data function
    this.populateData();
  }

  // custom age validation
  customAgeValidator(control:AbstractControl){
    if(!control){
      return null;
    }

    const controlValue = +control.value;

    if(isNaN(controlValue)){
      return {customAgeValidator :true};
    };

    if(!Number.isInteger){
      return {
        customAgeValidator :true
      };
    }
    return null;
  }


  //to keep the function clean, we implement it outside ngOnInit.
   public populateData(){
    //implement data code
    //ts -> calls service file function
    //service file -> calls backend 

    try{
      this.employeeRegService.getData().subscribe((Response:any)=>{
      console.log('get data response', Response);
      //calls the getData() func. in the service file by serviceCall(),
      //subscribe to get the response.
      //display the response by console.log
      this.dataSource = new MatTableDataSource(Response);
       this.dataSource.paginator = this.paginator;
    });
    } catch(error){
      this.messageService.showError('Action failed with error' + error);
    }

  }

  onSubmit(){
    console.log('Form Submitted');

    this.submitted = true;

    //check if the form is valid
    if (this.employeeRegForm.invalid){
      return;
    }

    this.employeeRegService.serviceCall(this.employeeRegForm.value).subscribe((response)=>{
      console.log('server response:', response);

        const newData = { ...this.employeeRegForm.value, ...response }; // Merge response if needed
    this.dataSource.data.push(newData); // Add to data array
    this.dataSource = new MatTableDataSource(this.dataSource.data); // Refresh table
    this.dataSource.paginator = this.paginator;

      this.messageService.showSuccess('Data saved successfully');

    });
    this.employeeRegForm.disable();
    this.isButtonDisabled = true;
  }

  public resetData(): void{
    this.employeeRegForm.reset();
    this.employeeRegForm.enable();
    this.isButtonDisabled = false;
    this.employeeRegForm.updateValueAndValidity();
    this.isButtonDisabled = false;
  }

  public editData(data:any): void{
    this.employeeRegForm.patchValue(data);
    this.messageService.showSuccess('Data edited successfully');
  }

  public deleteData(data:any): void{
    const id = data.id;

    try{
      this.employeeRegService.deleteData(id).subscribe((Response)=>{

      console.log('server response for delete:', Response);

      const index = this.dataSource.data.findIndex((element) => element.id === id);

      if (index !== -1){
        this.dataSource.data.splice(index,1);
      }
      this.dataSource = new MatTableDataSource(this.dataSource.data);

    });
    } catch(error){
      console.log(error);
      this.messageService.showError('Action failed with error' + error);
    }

  }
}
