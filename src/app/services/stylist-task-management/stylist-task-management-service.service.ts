import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpService } from '../http.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StylistTaskManagementServiceService {

  constructor(
    private http: HttpClient,
    private httpService: HttpService
  ) {}


  serviceCall(formDetails: any) {
    const requestUrl = `${environment.baseUrl}/add-stylist-task`;

    let headers = new HttpHeaders();
    const token = this.httpService.getAuthToken();

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return this.http.post(requestUrl, formDetails, { headers });
  }

  getData() {
    const requestUrl = `${environment.baseUrl}/get-stylist-tasks`;

    let headers = new HttpHeaders();
    const token = this.httpService.getAuthToken();

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return this.http.get(requestUrl, { headers });
  }

  /**
   * Edit stylist task (PUT)
   */
  editData(id: number, formDetails: any) {
    console.log('In Edit Data');

    const requestUrl = `${environment.baseUrl}/edit-stylist-task/${id}`;

    let headers: any = {};

    if (this.httpService.getAuthToken() != null) {
      headers = {
        Authorization: 'Bearer ' + this.httpService.getAuthToken()
      };
    }

    return this.http.put(requestUrl, formDetails, { headers });
  }

  deleteData(id: number) {
    console.log('In Delete Data');

    const requestUrl = `${environment.baseUrl}/delete-stylist-task/${id}`;

    let headers: any = {};

    if (this.httpService.getAuthToken() != null) {
      headers = {
        Authorization: 'Bearer ' + this.httpService.getAuthToken()
      };
    }

    return this.http.delete(requestUrl, { headers });
  }
}
