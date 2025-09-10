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
                icon: 'pi pi-th-large', // dashboard
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
                icon: 'pi pi-user-plus', // client add
                routerLink: ['/pages/client-reg'],
            },
            {
                label: 'Employee Registration',
                isVisible: false,
                auth: authenticationEnum.Home_Dashboard,
                icon: 'pi pi-users', // employees
                routerLink: ['/pages/employee-reg'],
            },
            {
                label: 'Appointment Schedule',
                isVisible: false,
                auth: authenticationEnum.Home_Dashboard,
                icon: 'pi pi-calendar-plus', // scheduling
                routerLink: ['/pages/appointment-schedule'],
            },
            {
                label: 'Employee Attendance',
                isVisible: false,
                auth: authenticationEnum.Home_Dashboard,
                icon: 'pi pi-clock', // attendance/time
                routerLink: ['/pages/employee-attendance'],
            },
            {
                label: 'Stylist Task Management',
                isVisible: false,
                auth: authenticationEnum.Home_Dashboard,
                icon: 'pi pi-briefcase', // tasks/work
                routerLink: ['/pages/stylist-task-management'],
            },
            {
                label: 'Inventory',
                isVisible: false,
                auth: authenticationEnum.Home_Dashboard,
                icon: 'pi pi-box', // inventory/storage
                routerLink: ['/pages/inventory'],
            }
        ],
    },
       
    {
        label: 'Privileges',
        isVisible: true,
        auth: authenticationEnum.Privileges,
        items: [
            {
                label: 'System Privileges',
                icon: 'pi pi-lock', // security/privileges
                routerLink: ['/privileges/system-privileges'],
                isVisible: false,
                auth: authenticationEnum.System_Privileges,
            },
            {
                label: 'Privilege Groups',
                icon: 'pi pi-shield', // group security
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
            { label: 'Form Layout', icon: 'pi pi-id-card', routerLink: ['/uikit/formlayout'] },
            { label: 'Input', icon: 'pi pi-pencil', routerLink: ['/uikit/input'] },
            { label: 'Float Label', icon: 'pi pi-tag', routerLink: ['/uikit/floatlabel'] },
            { label: 'Invalid State', icon: 'pi pi-exclamation-triangle', routerLink: ['/uikit/invalidstate'] },
            { label: 'Button', icon: 'pi pi-circle', routerLink: ['/uikit/button'] },
            { label: 'Table', icon: 'pi pi-table', routerLink: ['/uikit/table'] },
            { label: 'List', icon: 'pi pi-list', routerLink: ['/uikit/list'] },
            { label: 'Tree', icon: 'pi pi-sitemap', routerLink: ['/uikit/tree'] },
            { label: 'Panel', icon: 'pi pi-window-maximize', routerLink: ['/uikit/panel'] },
            { label: 'Overlay', icon: 'pi pi-clone', routerLink: ['/uikit/overlay'] },
            { label: 'Media', icon: 'pi pi-image', routerLink: ['/uikit/media'] },
            { label: 'Menu', icon: 'pi pi-bars', routerLink: ['/uikit/menu'] },
            { label: 'Message', icon: 'pi pi-envelope', routerLink: ['/uikit/message'] },
            { label: 'File', icon: 'pi pi-file', routerLink: ['/uikit/file'] },
            { label: 'Chart', icon: 'pi pi-chart-bar', routerLink: ['/uikit/charts'] },
            { label: 'Misc', icon: 'pi pi-cog', routerLink: ['/uikit/misc'] },
        ],
    },
  
    {
        label: 'Utilities',
        isVisible: false,
        items: [
            { label: 'PrimeIcons', icon: 'pi pi-prime', routerLink: ['/utilities/icons'] },
            { label: 'PrimeFlex', icon: 'pi pi-external-link', url: ['https://www.primefaces.org/primeflex/'], target: '_blank' },
        ],
    },

    {
        label: 'Pages',
        icon: 'pi pi-briefcase',
        isVisible: false,
        items: [
            { label: 'Landing', icon: 'pi pi-globe', routerLink: ['/landing'] },
            {
                label: 'Auth',
                icon: 'pi pi-user',
                items: [
                    { label: 'Login', icon: 'pi pi-sign-in', routerLink: ['/auth/login'] },
                    { label: 'Error', icon: 'pi pi-times-circle', routerLink: ['/auth/error'] },
                    { label: 'Access Denied', icon: 'pi pi-lock', routerLink: ['/auth/access'] },
                ],
            },
            { label: 'Crud', icon: 'pi pi-pencil', routerLink: ['/pages/crud'] },
            { label: 'Timeline', icon: 'pi pi-calendar', routerLink: ['/pages/timeline'] },
            { label: 'Not Found', icon: 'pi pi-exclamation-circle', routerLink: ['/notfound'] },
            { label: 'Empty', icon: 'pi pi-circle-off', routerLink: ['/pages/empty'] },
        ],
    },

    {
        label: 'Hierarchy',
        isVisible: false,
        items: [
            {
                label: 'Submenu 1',
                icon: 'pi pi-folder',
                items: [
                    {
                        label: 'Submenu 1.1',
                        icon: 'pi pi-folder-open',
                        items: [
                            { label: 'Submenu 1.1.1', icon: 'pi pi-file' },
                            { label: 'Submenu 1.1.2', icon: 'pi pi-file' },
                            { label: 'Submenu 1.1.3', icon: 'pi pi-file' },
                        ],
                    },
                    {
                        label: 'Submenu 1.2',
                        icon: 'pi pi-folder-open',
                        items: [
                            { label: 'Submenu 1.2.1', icon: 'pi pi-file' },
                        ],
                    },
                ],
            },
            {
                label: 'Submenu 2',
                icon: 'pi pi-folder',
                items: [
                    {
                        label: 'Submenu 2.1',
                        icon: 'pi pi-folder-open',
                        items: [
                            { label: 'Submenu 2.1.1', icon: 'pi pi-file' },
                            { label: 'Submenu 2.1.2', icon: 'pi pi-file' },
                        ],
                    },
                    {
                        label: 'Submenu 2.2',
                        icon: 'pi pi-folder-open',
                        items: [
                            { label: 'Submenu 2.2.1', icon: 'pi pi-file' },
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
            { label: 'Documentation', icon: 'pi pi-question-circle', routerLink: ['/documentation'] },
            { label: 'View Source', icon: 'pi pi-github', url: ['https://github.com/primefaces/sakai-ng'], target: '_blank' },
        ],
    },
];

@Injectable()
export class NavigationModel {
    get() {
        return navigationModel;
    }
}
