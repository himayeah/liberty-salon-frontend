import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environments/environment';
import { HttpService } from '../http.service';

@Injectable({
  providedIn: 'root'
})
export class AppointmentSchedulingServiceService {

  constructor(
    private http: HttpClient,
    private httpService: HttpService
  ) { }

  serviceCall(form_details: any): Observable<any> {
  
    const requestUrl = `${environment.baseUrl}/appointment-schedule-form`;
   
    let headers = new HttpHeaders();
    const token = this.httpService.getAuthToken();
    if (token !== null) {
      headers = headers.set('Authorization', 'Bearer ' + token);
    }

    return this.http.post(requestUrl, form_details, { headers });
  }

  getData() {

    const requestUrl = `${environment.baseUrl}/appointment-schedule-form`;

    let headers = new HttpHeaders();
    const token = this.httpService.getAuthToken();
    if (token !== null) {
        headers = headers.set('Authorization', 'Bearer ' + token);
    }
    return this.http.get(requestUrl, { headers });
  }

  deleteData(id: number){

    const requestUrl = `${environment.baseUrl}/appointment-schedule-form/${id}`;

    let headers = new HttpHeaders ();
    const token = this.httpService.getAuthToken();
    if(token !== null){
      headers = headers.set('Authorization', 'Bearer ' + token);
    }
    return this.http.delete(requestUrl, { headers });
  }

  editData(id: number, form_details: any) {
    console.log('In Edit Data');

    const requestUrl = `${environment.baseUrl}/appointment-schedule-form/${id}`;

    let headers = new HttpHeaders();
    const token = this.httpService.getAuthToken();
    if (token !==null){
      headers = headers.set('Authorization', 'Bearer ' + token);
    }
    return this.http.put(requestUrl, form_details, { headers });
    }

}
