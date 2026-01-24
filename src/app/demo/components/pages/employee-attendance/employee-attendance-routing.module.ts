import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EmployeeAttendanceComponent } from './employee-attendance.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: EmployeeAttendanceComponent }
    ])],
    exports: [RouterModule]
})
export class EmployeeAttendanceRoutingModule { }
