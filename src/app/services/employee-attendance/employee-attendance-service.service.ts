import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpService } from '../http.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmployeeAttendanceService {

  constructor(
    private http: HttpClient,
    private httpService: HttpService
  ) {}

  /**
   * Submits attendance form data to backend (POST request)
   */
  serviceCall(formDetails: any) {
    const requestUrl = `${environment.baseUrl}/employee-attendance`;

    let headers = new HttpHeaders();
    const token = this.httpService.getAuthToken();

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return this.http.post(requestUrl, formDetails, { headers });
  }

  /**
   * Fetches all attendance records from backend (GET request)
   */
  getData() {
    const requestUrl = `${environment.baseUrl}/employee-attendance`;

    let headers = new HttpHeaders();
    const token = this.httpService.getAuthToken();

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return this.http.get(requestUrl, { headers });
  }

  /**
   * Edits a specific attendance record using its ID (PUT request)
   */
  editData(id: number, form_details: any) {
    console.log('In Edit Data');

    const requestUrl = `${environment.baseUrl}/employee-attendance/${id}`;

    let headers: any = {};

    if (this.httpService.getAuthToken() != null) {
      headers = {
        Authorization: 'Bearer ' + this.httpService.getAuthToken()
      };
    }
    return this.http.put(requestUrl, form_details, { headers });
  }

  /**
   * Deletes a specific attendance record using its ID (DELETE request)
   */
  deleteData(id: number) {
    console.log('In Delete Data');

    const requestUrl = `${environment.baseUrl}/employee-attendance/${id}`;

    let headers: any = {};

    if (this.httpService.getAuthToken() != null) {
      headers = {
        Authorization: 'Bearer ' + this.httpService.getAuthToken()
      };
    }
    return this.http.delete(requestUrl, { headers });
  }

}
