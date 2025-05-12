import { Component } from '@angular/core';
import { FormBuilder,FormGroup, FormControl } from '@angular/forms';
import { EmployeeRegServicesService } from 'src/app/services/employee-reg/employee-reg-services.service';

@Component({
  selector: 'app-employee-reg',
  standalone: false,
  templateUrl: './employee-reg.component.html',
  styleUrl: './employee-reg.component.scss'
})
export class EmployeeRegComponent {

  employeeRegForm: FormGroup;

  constructor (private fb: FormBuilder, private employeeRegService:EmployeeRegServicesService){
    this.employeeRegForm = this.fb.group({
      firstName: new FormControl(''),
      lastName: new FormControl(''),
      fullName: new FormControl(''),
      age: new FormControl(''),
      email: new FormControl(''),
      phoneNumber: new FormControl(''),
      bloodType: new FormControl(''),
    });
  }

  onSubmit(){
    console.log('Form Submitted');

    this.employeeRegService.serviceCall(this.employeeRegForm.value).subscribe((response)=>{
      console.log('server response:', response);
    });
  }

  
}
