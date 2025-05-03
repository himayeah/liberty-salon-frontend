import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { CacheService } from 'src/app/services/CacheService';
import { HttpService } from 'src/app/services/http.service';
import { MessageServiceService } from 'src/app/services/message-service/message-service.service';

@Component({
    selector: 'app-login',
    templateUrl: './signup.component.html',
    styles: [
        `
            :host ::ng-deep .pi-eye,
            :host ::ng-deep .pi-eye-slash {
                transform: scale(1.6);
                margin-right: 1rem;
                color: var(--primary-color) !important;
            }
        `,
    ],
})
export class SignupComponent implements OnInit {
    registerForm: FormGroup;
    submitted = false;
    // data: string[] = [];

    constructor(
        public layoutService: LayoutService,
        private formBuilder: FormBuilder,
        private router: Router,
        private httpService: HttpService
    ) {
        this.registerForm = this.formBuilder.group({
            firstName: ['', [Validators.required]],
            lastName: ['', [Validators.required]],
            login: ['', [Validators.required]],
            password: ['', [Validators.required]],
        });
    }

    ngOnInit(): void {
        // this.httpService
        //   .request('GET', '/messages', null)
        //   .then((response: any) => {
        //     this.data = response;
        //   });
    }

    get formControl() {
        return this.registerForm?.controls;
    }

    onSubmitRegister() {
        this.submitted = true;
        if (this.registerForm?.valid) {
            this.httpService
                .request('POST', '/register', {
                    firstName: this.registerForm.value.firstName,
                    lastName: this.registerForm.value.lastName,
                    login: this.registerForm.value.login,
                    password: this.registerForm.value.password,
                })
                .then((response: any) => {
                    this.httpService.setAuthToken(response.token);
                    this.router.navigate(['/auth/login']);
                })
                .catch((error) => {
                    this.submitted = false;
                });
        }
    }
}
