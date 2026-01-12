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
import { MatSortModule } from '@angular/material/sort';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ClientRegComponent } from './client-reg/client-reg.component';
import {EmployeeRegComponent} from './employee-reg/employee-reg.component';
import { AppointmentScheduleComponent } from './appointment-schedule/appointment-schedule.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import {EmployeeAttendanceComponent} from './employee-attendance/employee-attendance.component';
import { StylistTaskManagementComponent } from './stylist-task-management/stylist-task-management.component';
import { MatSelectModule } from '@angular/material/select';
import { InventoryComponent } from './inventory/inventory.component';
import { ServiceCategoryComponent } from './service-category/service-category.component';
import { ServiceComponent } from './service/service.component';


@NgModule({
  declarations: [
    ClientRegComponent,
    EmployeeRegComponent,
    AppointmentScheduleComponent,
    EmployeeAttendanceComponent,
    StylistTaskManagementComponent,
    InventoryComponent,
    ServiceCategoryComponent,
    ServiceComponent
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
    MatSortModule,
    MatTooltipModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatCheckboxModule,
]
  })
  export class PagesModule { }