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

  //getData()function
  getData(){
    
    const requestUrl = environment.baseUrl + '/employee_reg_form';
    //environement.baseURL means the port Backend is listening at

    let headers = {};

    if (this.httpService.getAuthToken() !==null){
      headers={
        Authorization: 'Bearer' + this.httpService.getAuthToken()
      };
    }
    return this.http.get(requestUrl, headers);
  }

 deleteData(id: number) {
  const requestUrl = `${environment.baseUrl}/employee_reg_form/${id}`;

  let headers: any = {};
  const token = this.httpService.getAuthToken();
  if (token !== null) {
    headers = {
      Authorization: 'Bearer ' + token
    };
  }

  return this.http.delete(requestUrl, { headers });
}

}

