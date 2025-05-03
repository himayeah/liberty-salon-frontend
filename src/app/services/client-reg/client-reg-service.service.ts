import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpService } from '../http.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClientRegServiceService {
  deleteclient(client: any) {
    throw new Error('Method not implemented.');
  }

  constructor(
    private http: HttpClient,
    private httpService: HttpService
  ) {}

  /**
   * Submits form data to the backend (POST request)
   */
  serviceCall(formDetails: any) {
    const requestUrl = `${environment.baseUrl}/client-reg`;

    let headers = new HttpHeaders();
    const token = this.httpService.getAuthToken();

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return this.http.post(requestUrl, formDetails, { headers });
  }

  /**
   * Fetches all client data from backend (GET request)
   */
  getData() {
    const requestUrl = `${environment.baseUrl}/client-reg`;

    let headers = new HttpHeaders();
    const token = this.httpService.getAuthToken();

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return this.http.get(requestUrl, { headers });
  }

  editData(id: number, form_details:any){
    console.log('In Edit Data');

    const requestUrl = environment.baseUrl + '/client-reg/'+ id.toString();

    let headers = {};

    if (this.httpService.getAuthToken()! == null){
      headers = {
        Authorization: 'Bearer ' + this.httpService.getAuthToken()
      };
    }  
    return this.http.put(requestUrl, form_details, {headers: headers});
  }
  //above code explained: The editData() function in the service file is responsible for making an HTTP PUT request to the backend to update an existing record (client registration data) using its id.
  //flow explained: 
  /**1.User clicks "Edit" on a row in the table.
   * 2.editData(data) in the component is triggered → it populates the form fields using patchValue().User makes changes in the form and clicks "Save".
   * 3.onSubmit() is triggered in the component:It checks if the mode is 'edit'.If yes, it calls this.clientRegService.editData(id, this.clientRegForm.value).
   * 4.This sends the request to the service file’s editData() method:Builds the correct PUT URL (baseUrl + '/client-reg/' + id). Adds headers (if an auth token exists)
   * 5.Sends a PUT request with form data to the backend API.
   * 6.Backend updates the data and sends a response.
   * 7.The component logs the response and refreshes the table using populateData().
   */
  //Next Step -> See Backend "ClientRegService.Java"

  deleteData(id: number){
    console.log('In Edit Data');

    const requestUrl = environment.baseUrl + '/client-reg/'+ id.toString();

    let headers = {};

    if (this.httpService.getAuthToken()! == null){
      headers = {
        Authorization: 'Bearer ' + this.httpService.getAuthToken()
      };
    }  
    return this.http.delete(requestUrl, {headers: headers});
  }

}
