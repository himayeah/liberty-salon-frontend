import { Injectable } from '@angular/core';
import { authenticationEnum } from '../guards/auth.enum';

const navigationModel = [
    {
        label: 'Home',
        isVisible: false,
        auth: authenticationEnum.Home,
        items: [
            {
                label: 'Dashboard',
                isVisible: false,
                auth: authenticationEnum.Home_Dashboard,
                icon: 'pi pi-fw pi-home',
                routerLink: ['/dashboard'],
            },
        ],
    },


    {
        label: 'Registration',
        isVisible: false,
        auth: authenticationEnum.Home,
        items: [
            {
                label: 'Client Registration',
                isVisible: false,
                auth: authenticationEnum.Home_Dashboard,
                icon: 'pi pi-fw pi-home',
                routerLink: ['/pages/client-reg'],
            },
        ],
    },

       
    {
        label: 'Privileges',
        isVisible: true,
        auth: authenticationEnum.Privileges,
        items: [
            {
                label: 'System Privileges',
                icon: 'pi pi-fw pi-prime',
                routerLink: ['/privileges/system-privileges'],
                isVisible: false,
                auth: authenticationEnum.System_Privileges,
            },
            {
                label: 'Privilege Groups',
                icon: 'pi pi-fw pi-desktop',
                routerLink: ['/privileges/privilege-groups'],
                isVisible: false,
                auth: authenticationEnum.Privilege_Groups,
            },
        ],
    },

    {
        label: 'UI Components',
        isVisible:true ,
        items: [
            {
                label: 'Form Layout',
                icon: 'pi pi-fw pi-id-card',
                routerLink: ['/uikit/formlayout'],
            },
            {
                label: 'Input',
                icon: 'pi pi-fw pi-check-square',
                routerLink: ['/uikit/input'],
            },
            {
                label: 'Float Label',
                icon: 'pi pi-fw pi-bookmark',
                routerLink: ['/uikit/floatlabel'],
            },
            {
                label: 'Invalid State',
                icon: 'pi pi-fw pi-exclamation-circle',
                routerLink: ['/uikit/invalidstate'],
            },
            {
                label: 'Button',
                icon: 'pi pi-fw pi-box',
                routerLink: ['/uikit/button'],
            },
            {
                label: 'Table',
                icon: 'pi pi-fw pi-table',
                routerLink: ['/uikit/table'],
            },
            {
                label: 'List',
                icon: 'pi pi-fw pi-list',
                routerLink: ['/uikit/list'],
            },
            {
                label: 'Tree',
                icon: 'pi pi-fw pi-share-alt',
                routerLink: ['/uikit/tree'],
            },
            {
                label: 'Panel',
                icon: 'pi pi-fw pi-tablet',
                routerLink: ['/uikit/panel'],
            },
            {
                label: 'Overlay',
                icon: 'pi pi-fw pi-clone',
                routerLink: ['/uikit/overlay'],
            },
            {
                label: 'Media',
                icon: 'pi pi-fw pi-image',
                routerLink: ['/uikit/media'],
            },
            {
                label: 'Menu',
                icon: 'pi pi-fw pi-bars',
                routerLink: ['/uikit/menu'],
                routerLinkActiveOptions: {
                    paths: 'subset',
                    queryParams: 'ignored',
                    matrixParams: 'ignored',
                    fragment: 'ignored',
                },
            },
            {
                label: 'Message',
                icon: 'pi pi-fw pi-comment',
                routerLink: ['/uikit/message'],
            },
            {
                label: 'File',
                icon: 'pi pi-fw pi-file',
                routerLink: ['/uikit/file'],
            },
            {
                label: 'Chart',
                icon: 'pi pi-fw pi-chart-bar',
                routerLink: ['/uikit/charts'],
            },
            {
                label: 'Misc',
                icon: 'pi pi-fw pi-circle',
                routerLink: ['/uikit/misc'],
            },
        ],
    },
  
    {
        label: 'Utilities',
        isVisible: false,
        items: [
            {
                label: 'PrimeIcons',
                icon: 'pi pi-fw pi-prime',
                routerLink: ['/utilities/icons'],
            },
            {
                label: 'PrimeFlex',
                icon: 'pi pi-fw pi-desktop',
                url: ['https://www.primefaces.org/primeflex/'],
                target: '_blank',
            },
        ],
    },
    {
        label: 'Pages',
        icon: 'pi pi-fw pi-briefcase',
        isVisible: false,
        items: [
            {
                label: 'Landing',
                icon: 'pi pi-fw pi-globe',
                routerLink: ['/landing'],
            },
            {
                label: 'Auth',
                icon: 'pi pi-fw pi-user',
                items: [
                    {
                        label: 'Login',
                        icon: 'pi pi-fw pi-sign-in',
                        routerLink: ['/auth/login'],
                    },
                    {
                        label: 'Error',
                        icon: 'pi pi-fw pi-times-circle',
                        routerLink: ['/auth/error'],
                    },
                    {
                        label: 'Access Denied',
                        icon: 'pi pi-fw pi-lock',
                        routerLink: ['/auth/access'],
                    },
                ],
            },
            {
                label: 'Crud',
                icon: 'pi pi-fw pi-pencil',
                routerLink: ['/pages/crud'],
            },
            {
                label: 'Timeline',
                icon: 'pi pi-fw pi-calendar',
                routerLink: ['/pages/timeline'],
            },
            {
                label: 'Not Found',
                icon: 'pi pi-fw pi-exclamation-circle',
                routerLink: ['/notfound'],
            },
            {
                label: 'Empty',
                icon: 'pi pi-fw pi-circle-off',
                routerLink: ['/pages/empty'],
            },
        ],
    },
    {
        label: 'Hierarchy',
        isVisible: false,
        items: [
            {
                label: 'Submenu 1',
                icon: 'pi pi-fw pi-bookmark',
                items: [
                    {
                        label: 'Submenu 1.1',
                        icon: 'pi pi-fw pi-bookmark',
                        items: [
                            {
                                label: 'Submenu 1.1.1',
                                icon: 'pi pi-fw pi-bookmark',
                            },
                            {
                                label: 'Submenu 1.1.2',
                                icon: 'pi pi-fw pi-bookmark',
                            },
                            {
                                label: 'Submenu 1.1.3',
                                icon: 'pi pi-fw pi-bookmark',
                            },
                        ],
                    },
                    {
                        label: 'Submenu 1.2',
                        icon: 'pi pi-fw pi-bookmark',
                        items: [
                            {
                                label: 'Submenu 1.2.1',
                                icon: 'pi pi-fw pi-bookmark',
                            },
                        ],
                    },
                ],
            },
            {
                label: 'Submenu 2',
                icon: 'pi pi-fw pi-bookmark',
                items: [
                    {
                        label: 'Submenu 2.1',
                        icon: 'pi pi-fw pi-bookmark',
                        items: [
                            {
                                label: 'Submenu 2.1.1',
                                icon: 'pi pi-fw pi-bookmark',
                            },
                            {
                                label: 'Submenu 2.1.2',
                                icon: 'pi pi-fw pi-bookmark',
                            },
                        ],
                    },
                    {
                        label: 'Submenu 2.2',
                        icon: 'pi pi-fw pi-bookmark',
                        items: [
                            {
                                label: 'Submenu 2.2.1',
                                icon: 'pi pi-fw pi-bookmark',
                            },
                        ],
                    },
                ],
            },
        ],
    },
    {
        label: 'Get Started',
        isVisible: false,
        items: [
            {
                label: 'Documentation',
                icon: 'pi pi-fw pi-question',
                routerLink: ['/documentation'],
            },
            {
                label: 'View Source',
                icon: 'pi pi-fw pi-search',
                url: ['https://github.com/primefaces/sakai-ng'],
                target: '_blank',
            },
        ],
    },
];

@Injectable()
export class NavigationModel {
    get() {
        return navigationModel;
    }
}
