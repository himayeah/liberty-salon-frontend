import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from './service/app.layout.service';
import { Subscription } from 'rxjs';
import { CacheService } from '../services/CacheService';
import { NavigationModel } from './app.menu';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html',
})
export class AppMenuComponent implements OnInit {
    model: any[] = [];
    private cacheSubscription!: Subscription;
    data!: number[];
    windowWidth: number;

    constructor(
        public layoutService: LayoutService,
        private cacheService: CacheService,
        public navigationMenu: NavigationModel
    ) {
        this.cacheSubscription = this.cacheService.cache$.subscribe((data) => {
            this.data = data;

            this.setAuthStatusInNavItems(this.data);
        });
    }

    ngOnInit() {}

    public setEntitlements(
        navigationArray: any[],
        isAdmin: boolean,
        privilegeArray?: number[]
    ): void {
        navigationArray.forEach((element) => {
            if (isAdmin) {
                element.isVisible = true;
            } else if (privilegeArray.includes(element.auth)) {
                element.isVisible = true;
            } else {
                element.isVisible = false;
            }

            if (element.items && element.items.length > 0) {
                this.setEntitlements(element.items, isAdmin, privilegeArray);
            }

            if (!element.items || element.items.length === 0) {
                if (isAdmin) {
                    element.isVisible = true;
                    return;
                } else {
                    if (privilegeArray.includes(element.auth)) {
                        element.isVisible = true;
                    } else {
                        element.isVisible = false;
                    }
                }

                if (privilegeArray && privilegeArray.length === 0) {
                    element.isVisible = false;
                }
                return;
            }
        });
    }

    public setAuthStatusInNavItems(authId: number[]) {
        this.model = this.navigationMenu.get();
        let isAdmin = false;
        if (authId && authId.length > 0) {
            if (authId.includes(1)) {
                isAdmin = true;
                this.setEntitlements(this.model, isAdmin);
                return;
            }

            this.setEntitlements(this.model, isAdmin, authId);
        } else if (
            JSON.parse(window.localStorage.getItem('privileges')!)?.length! > 0
        ) {
            const privilegeArray = JSON.parse(
                window.localStorage.getItem('privileges')!
            );
            if (privilegeArray.includes(1)) {
                isAdmin = true;
                this.setEntitlements(this.model, isAdmin, privilegeArray);
                return;
            }
            isAdmin = false;
            this.setEntitlements(this.model, isAdmin, privilegeArray);
        } else if (authId && authId.length === 0) {
            isAdmin = false;
            this.setEntitlements(this.model, isAdmin, authId);
        }

        console.log(this.model);
    }
}
