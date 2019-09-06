import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardComponent } from './dashboard.component';
import { UnavailablePipe } from './unavailable/unavailable.pipe';

@NgModule({
  declarations: [
    DashboardComponent,
    UnavailablePipe
  ],
  imports: [
    CommonModule
  ]
})
export class DashboardModule { }
