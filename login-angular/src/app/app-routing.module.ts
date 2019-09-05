import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthService } from './core/auth-services/auth.service';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardModule } from './dashboard/dashboard.module';
import { LoginComponent } from './login/login.component';
import { LoginModule } from './login/login.module';
import { RegisterComponent } from './register/register.component';
import { RegisterModule } from './register/register.module';

const routes: Routes = [{
  component: DashboardComponent,
  path: '',
  canActivate: [AuthService]
}, {
  component: LoginComponent,
  path: 'login'
}, {
  component: RegisterComponent,
  path: 'register'
}, {
  path: '**',
  redirectTo: '/'
}];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),

    DashboardModule,
    LoginModule,
    RegisterModule
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
