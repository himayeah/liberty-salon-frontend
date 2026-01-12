import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpService } from '../http.service';
import { environment } from 'src/environments/environment';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  constructor(private http: HttpClient, private httpService: HttpService) { }

  //serviceCall() method to call Add|Edit data
    serviceCall(form_details: any): Observable<any> {
     const requestUrl = `${environment.baseUrl}/service`;
     let headers = new HttpHeaders();
     const token = this.httpService.getAuthToken();
     if (token !== null){
      headers = headers.set ('Authorization', 'Bearer ' + token);
     }
     return this.http.post (requestUrl, form_details, { headers})
     
       }
  
    //getData() Backend Call
    getData(){
      const requestUrl = `${environment.baseUrl}/service`;
      let headers = new HttpHeaders();
      const token = this.httpService.getAuthToken();
      if (token!== null){
        headers = headers.set('Authorization', 'Bearer ' + token);
      }
      return this.http.get(requestUrl, { headers });
    }
  
    editService(id: number, form_details:any){
      const requestUrl = `${environment.baseUrl}/service-edit/${id}`;
      let headers = new HttpHeaders();
      const token = this.httpService.getAuthToken();
      if (token !== null){
        headers = headers.set('Authorization', 'Bearer ' + token);
      }
      return this.http.put(requestUrl, form_details, {headers: headers});
    }
  
    deleteService(id: number){
      const requestUrl = `${environment.baseUrl}/service/${id}`;
      let headers = new HttpHeaders();
      const token = this.httpService.getAuthToken();
      if (token !== null){
        headers = headers.set('Authorization', 'Bearer ' + token);
      }
      return this.http.delete(requestUrl, { headers });
    }
  

}
