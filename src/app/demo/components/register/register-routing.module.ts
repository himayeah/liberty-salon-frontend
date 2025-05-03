import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TestRegComponent } from './test-reg/test-reg.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        redirectTo: '/testreg',
        pathMatch: 'full'
      },
      {
        path: 'testreg',
        component: TestRegComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegisterRoutingModule { }
