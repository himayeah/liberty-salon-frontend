import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpService } from '../http.service';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmployeeRegServicesService {

  constructor(
    private http: HttpClient,
    private httpService: HttpService
  ) {}

  serviceCall(form_details: any): Observable<any> {
    console.log("In the service");

    const requestUrl = environment.baseUrl + '/employee_reg_form';

    let headers = new HttpHeaders();

    const token = this.httpService.getAuthToken();
    if (token !== null) {
      headers = headers.set('Authorization', 'Bearer ' + token);
    }

    return this.http.post(requestUrl, form_details, { headers });
  }

  // serviceCall(form_details: any) {
  //   console.log('In the service');

  //   const requestUrl = environment.baseUrl + '/employee_reg_form';
  //   let headers = {};

  //   if (this.httpService.getAuthToken() !== null) {
  //     headers = {
  //       Authorization: 'Bearer ' + this.httpService.getAuthToken()
  //     };
  //   }

  //   return this.http.post(requestUrl, form_details, { headers: headers });
  // }
}

