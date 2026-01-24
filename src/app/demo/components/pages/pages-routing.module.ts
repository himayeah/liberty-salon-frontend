import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Routes } from '@angular/router';
import { ClientRegComponent } from './client-reg/client-reg.component';
import { EmployeeRegComponent } from './employee-reg/employee-reg.component';
import { AppointmentScheduleComponent } from './appointment-schedule/appointment-schedule.component';
import { StylistTaskManagementComponent } from './stylist-task-management/stylist-task-management.component';
import { InventoryComponent } from './inventory/inventory.component';
import { ServiceCategoryComponent } from './service-category/service-category.component';
import { ServiceComponent } from './service/service.component';
import { EmployeeScheduleComponent } from './employee-schedule/employee-schedule.component';
import { EmployeeLeaveComponent } from './employee-leave/employee-leave.component';

export const PagesRoutes: Routes = [
    //export array holds routing definitions, unless you add the routing inside Imports array, this won't have any meaning
    //{ path:'form-demo',component:FormDemoComponent },

]

@NgModule({
    imports: [RouterModule.forChild([
        { path: 'crud', loadChildren: () => import('./crud/crud.module').then(m => m.CrudModule) }, // localhost:4200/pages/crud
        { path: 'empty', loadChildren: () => import('./empty/emptydemo.module').then(m => m.EmptyDemoModule) },
        { path: 'timeline', loadChildren: () => import('./timeline/timelinedemo.module').then(m => m.TimelineDemoModule) },
        { path: 'client-reg', component: ClientRegComponent }, // need to include the path here for form demo component
        { path: 'employee-reg', component: EmployeeRegComponent },
        { path: 'appointment-schedule', component: AppointmentScheduleComponent },
        { path: 'employee-attendance', loadChildren: () => import('./employee-attendance/employee-attendance.module').then(m => m.EmployeeAttendanceModule) },
        {path:'stylist-task-management', component: StylistTaskManagementComponent},
        {path:'inventory', component: InventoryComponent},
        {path:'service-category', component: ServiceCategoryComponent},
        {path:'service', component: ServiceComponent},
        {path:'employee-schedule', component: EmployeeScheduleComponent},
        {path:'employee-leave', component: EmployeeLeaveComponent},
        { path: '**', redirectTo: '/notfound' },

    ])],
    exports: [RouterModule]
})
export class PagesRoutingModule { }

