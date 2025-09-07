import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html'
})
export class SignupComponent implements OnInit {
  registerForm: FormGroup;
  submitted = false;

  constructor(
    public layoutService: LayoutService,
    private fb: FormBuilder,
    private router: Router,
    private httpService: HttpService
  ) {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      login: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  get formControl() {
    return this.registerForm.controls;
  }

  onSubmitRegister(): void {
    this.submitted = true;

    if (this.registerForm.invalid) return;

    const { firstName, lastName, login, password } = this.registerForm.value;

    this.httpService
      .request('POST', '/register', { firstName, lastName, login, password })
      .then((response: any) => {
        this.httpService.setAuthToken(response.token);
        this.router.navigate(['/auth/login']);
      })
      .catch(() => {
        this.submitted = false;
      });
  }
}