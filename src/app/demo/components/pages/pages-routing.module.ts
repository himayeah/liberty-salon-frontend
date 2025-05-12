import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Routes } from '@angular/router';
import { ClientRegComponent } from './client-reg/client-reg.component';
import { EmployeeRegComponent } from './employee-reg/employee-reg.component';

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
       //{ path: 'login', component: LoginComponent }, // need to include the path here for form demo component
            { path: '**', redirectTo: '/notfound' },

    ])],
    exports: [RouterModule]
})
export class PagesRoutingModule { }


