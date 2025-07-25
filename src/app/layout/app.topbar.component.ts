import { Component, ElementRef, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { LayoutService } from './service/app.layout.service';
import { Router } from '@angular/router';
import { CacheService } from '../services/CacheService';
import { HttpService } from '../services/http.service';

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html',
})
export class AppTopBarComponent {
    items!: MenuItem[];

    @ViewChild('menubutton') menuButton!: ElementRef;

    @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

    @ViewChild('topbarmenu') menu!: ElementRef;

    constructor(
        public layoutService: LayoutService,
        private httpService: HttpService,
        private router: Router,
        private cacheService: CacheService
    ) {}

    public logOutUser(): void {
        this.cacheService.clear(this.httpService.getUserId()!);
        this.httpService.removeToken();
        this.router.navigate(['/auth/login']);
    }
}
