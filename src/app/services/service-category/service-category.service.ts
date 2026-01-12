import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpService } from '../http.service';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServiceCategoryService {
  constructor(private http: HttpClient, private httpService: HttpService) { }

  serviceCall(form_details: any): Observable<any>{
    const requestUrl = `${environment.baseUrl}/service-category`;
    let headers = new HttpHeaders();
    const token = this.httpService.getAuthToken();
    if (token !== null)
{
  headers = headers.set('Authorization', 'Bearer ' + token);
} 
    return this.http.post(requestUrl, form_details, {headers});
}

  getData(){
    const requestUrl = `${environment.baseUrl}/service-category`;
    let headers = new HttpHeaders();
    const token = this.httpService.getAuthToken();
    if (token !== null){
      headers = headers.set('Authorization', 'Bearer ' + token);
    }
    return this.http.post(requestUrl, {headers});
}

editData(id: number, form_details:any){
  const requestUrl = `${environment.baseUrl}/service-category-edit/${id}`;
  let headers = new HttpHeaders();
  const token = this.httpService.getAuthToken();
  if (token !== null)
{
  headers = headers.set('Authorization', 'Bearer ' + token);
}
return this.http.put(requestUrl, form_details, {headers: headers});
}

deleteData(id: number){
  const requestUrl = `${environment.baseUrl}/service-category/${id}`;
  let headers = new HttpHeaders();
  const token = this.httpService.getAuthToken();
  if (token !== null){
    headers = headers.set('Authorization', 'Bearer ' + token);
  }
  return this.http.delete(requestUrl, {headers: headers});  
}
}
