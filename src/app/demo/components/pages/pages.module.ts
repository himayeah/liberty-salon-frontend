import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagesRoutingModule } from './pages-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { ClientRegComponent } from './client-reg/client-reg.component';
import {EmployeeRegComponent} from './employee-reg/employee-reg.component';
import { AppointmentScheduleComponent } from './appointment-schedule/appointment-schedule.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import {EmployeeAttendanceComponent} from './employee-attendance/employee-attendance.component';
import { StylistTaskManagementComponent } from './stylist-task-management/stylist-task-management.component';
import { MatSelect } from '@angular/material/select';

@NgModule({
  declarations: [
    ClientRegComponent,
    EmployeeRegComponent,
    AppointmentScheduleComponent,
    EmployeeAttendanceComponent,
    AppointmentScheduleComponent,
    StylistTaskManagementComponent
  ],

    imports: [
      CommonModule,
      PagesRoutingModule,
      ReactiveFormsModule,
      FormsModule,
      MatInputModule,
      MatFormFieldModule,
      MatButtonModule,
      MatTableModule,
      MatPaginatorModule,
      MatIconModule,
      MatDatepickerModule,
      MatNativeDateModule,
      MatSelect
    ],
    providers: [MatDatepickerModule]
  })
  export class PagesModule { }