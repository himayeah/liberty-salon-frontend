import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpService } from '../http.service';
import { environment } from 'src/app/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class InventoryServiceService {
    deleteclient(client: any) {
        throw new Error('Method not implemented.');
    }
    constructor(private http: HttpClient, private httpService: HttpService) {}

    serviceCall(formDetails: any) {
        const requestUrl = `${environment.baseUrl}/inventory`;

        let headers = new HttpHeaders();
        const token = this.httpService.getAuthToken();

        if (token) {
            headers = headers.set('Authorization', `Bearer ${token}`);
        }

        return this.http.post(requestUrl, formDetails, { headers });
    }

    getData() {
        const requestUrl = `${environment.baseUrl}/inventory`;

        let headers = new HttpHeaders();
        const token = this.httpService.getAuthToken();

        if (token) {
            headers = headers.set('Authorization', `Bearer ${token}`);
        }

        return this.http.get(requestUrl, { headers });
    }

    editData(id: number, form_details: any) {
        console.log('In Edit Data');

        const requestUrl = environment.baseUrl + '/inventory/' + id.toString();

        let headers = {};

        if (this.httpService.getAuthToken()! == null) {
            headers = {
                Authorization: 'Bearer ' + this.httpService.getAuthToken(),
            };
        }
        return this.http.put(requestUrl, form_details, { headers: headers });
    }

    deleteData(id: number) {
        console.log('In Edit Data');

        const requestUrl = environment.baseUrl + '/inventory/' + id.toString();

        let headers = {};

        if (this.httpService.getAuthToken()! == null) {
            headers = {
                Authorization: 'Bearer ' + this.httpService.getAuthToken(),
            };
        }
        return this.http.delete(requestUrl, { headers: headers });
    }
}
