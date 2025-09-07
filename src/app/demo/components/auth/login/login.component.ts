import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { CacheService } from 'src/app/services/CacheService';
import { HttpService } from 'src/app/services/http.service';
import { MessageServiceService } from 'src/app/services/message-service/message-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit, OnDestroy {
  
  loginForm: FormGroup;
  submitted = false;
  userNamePasswordError = false;
  private cacheSubscription?: Subscription;
  private cachedData: any[] = [];

  constructor(
    public layoutService: LayoutService,
    private fb: FormBuilder,
    private router: Router,
    private httpService: HttpService,
    private cacheService: CacheService,
    private messageService: MessageServiceService
  ) {
    this.loginForm = this.fb.group({
      loginName: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.clearCacheIfUnauthorized();
    this.cacheSubscription = this.cacheService.cache$.subscribe(data => {
      this.cachedData = data;
    });
  }

  ngOnDestroy(): void {
    this.cacheSubscription?.unsubscribe();
  }

  get formControl(): { [key: string]: AbstractControl } {
    return this.loginForm.controls;
  }

  private clearCacheIfUnauthorized(): void {
    if (this.httpService.isTokenExpired()) {
      this.httpService.clearCache();
    }
  }

  private async fetchUserData(userId: number): Promise<void> {
    const cacheKey = userId.toString();
    const cachedData = this.cacheService.get(cacheKey);

    if (cachedData) {
      this.router.navigate(['/']);
      return;
    }

    try {
      const data = await this.httpService.getAuthIds(userId);
      if (data && data.length > 0) {
        this.cacheService.set(cacheKey, data);
        this.router.navigate(['/dashboard']);
      } else {
        this.messageService.showError('User does not have privileges');
      }
    } catch {
      this.messageService.showError('Action Failed');
    }
  }

  async onSubmitLogin(): Promise<void> {
    this.submitted = true;
    if (this.loginForm.invalid) return;

    try {
      const { loginName, password } = this.loginForm.value;
      const response = await this.httpService.request('POST', '/login', { login: loginName, password });

      this.httpService.setAuthToken(response.token);
      this.httpService.setUserId(response.id);
      this.httpService.setLoginNameToCache(response.login);

      await this.fetchUserData(response.id);
    } catch {
      this.userNamePasswordError = true;
      this.submitted = false;
    }
  }
}