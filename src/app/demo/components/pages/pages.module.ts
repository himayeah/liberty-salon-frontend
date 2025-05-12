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
import { EmployeeRegComponent } from './employee-reg/employee-reg.component';


@NgModule({
  declarations: [
    ClientRegComponent,
    EmployeeRegComponent
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
      MatIconModule
    ]
  })
  export class PagesModule { }