import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpService } from '../http.service';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmployeeScheduleService {
   constructor(private http: HttpClient, private httpService: HttpService) {}

      serviceCall(form_details: any): Observable<any> {
          const requestUrl = `${environment.baseUrl}/employee-schedule`;
          let headers = new HttpHeaders();
          const token = this.httpService.getAuthToken();
          if (token !== null) {
              headers = headers.set('Authorization', 'Bearer ' + token);
          }
          return this.http.post(requestUrl, form_details, { headers });
      }

  getData() {
    const requestUrl = `${environment.baseUrl}/employee-schedule`;
    let headers = new HttpHeaders();
    const token = this.httpService.getAuthToken();
    if (token !== null) {
        headers = headers.set('Authorization', 'Bearer ' + token);
    }
    return this.http.get(requestUrl, { headers });
  }

  editData(id: number, form_details:any){
    const requestUrl = `${environment.baseUrl}/employee-schedule/${id}`;

    let headers = new HttpHeaders();
    const token = this.httpService.getAuthToken();
    if (token !== null){
      headers = headers.set('Authorization', 'Bearer ' + token);
    }  
    return this.http.put(requestUrl, form_details, {headers: headers});
  }

  deleteData(id: number){
    const requestUrl = `${environment.baseUrl}/employee-schedule/${id}`;

    let headers = new HttpHeaders();
    const token = this.httpService.getAuthToken();
    if (token !== null) {
        headers = headers.set('Authorization', 'Bearer ' + token);
    }

    return this.http.delete(requestUrl, { headers });
  }
}
