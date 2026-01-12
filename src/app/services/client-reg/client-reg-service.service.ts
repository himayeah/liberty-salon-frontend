import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpService } from '../http.service';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClientRegServiceService {
   constructor(private http: HttpClient, private httpService: HttpService) {}

   //sends whatever the client filled in the form to BE. has an observerbale (Angular is async). to listen for the response BE sends later
      serviceCall(form_details: any): Observable<any> {

          //The BE url you're sending form data etc to (connects at Controller class)
          const requestUrl = `${environment.baseUrl}/client-reg`;
          
          //extra info sent with the request. starts empty
          let headers = new HttpHeaders();
          //If a token exists-> user logged in, if not-> Not logged in
          const token = this.httpService.getAuthToken();
          //if logged in, add the token
          if (token !== null) {
              headers = headers.set('Authorization', 'Bearer ' + token);
          }
          //sends form data the user entered + BE url + token to BE
          return this.http.post(requestUrl, form_details, { headers });
      }

  getData() {
    //base url should match in getData() Controller class url
    const requestUrl = `${environment.baseUrl}/client-reg`;
    //starts with empty headers
    let headers = new HttpHeaders();
    //if user logged in, gets the Token
    const token = this.httpService.getAuthToken();
    //sets the headers
    if (token !== null) {
        headers = headers.set('Authorization', 'Bearer ' + token);
    }
    //sets headers and BE url to BE. 
    //additional: I havene't explicitly added an <Observable> here but the code by default works as an observable even if not written
    return this.http.get(requestUrl, { headers });
  }

  editData(id: number, form_details:any){
    const requestUrl = `${environment.baseUrl}/client-edit/${id}`;

    let headers = new HttpHeaders();
    const token = this.httpService.getAuthToken();
    if (token !== null){
      headers = headers.set('Authorization', 'Bearer ' + token);
    }  
    return this.http.put(requestUrl, form_details, {headers: headers});
  }

  deleteData(id: number){
    const requestUrl = `${environment.baseUrl}/client-reg/${id}`;

    let headers = new HttpHeaders();
    const token = this.httpService.getAuthToken();
    if (token !== null) {
        headers = headers.set('Authorization', 'Bearer ' + token);
    }

    return this.http.delete(requestUrl, { headers });
  }
}
