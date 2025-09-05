import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './Auth/login/login.component';
import { RegisterComponent } from './Auth/register/register.component';
import { CommonModule } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import ApexCharts from 'apexcharts';
import { NgApexchartsModule } from 'ng-apexcharts';
import { PieChartComponent } from './Chart/pie-chart/pie-chart.component';
import { BarChartComponent } from './Chart/bar-chart/bar-chart.component';
import { UserFormComponent } from './user-form/user-form.component';
import { ExpensesTableComponent } from './expenses-table/expenses-table.component';
import { SpinnerComponent } from './spinner/spinner.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    LoginComponent,
    RegisterComponent,
    PieChartComponent,
    BarChartComponent,
    UserFormComponent,
    ExpensesTableComponent,
    SpinnerComponent,
  ],
  imports: [
    BrowserModule,
    MatSnackBarModule,
    NgApexchartsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    CommonModule,
    FormsModule,
  ],
  providers: [provideHttpClient()],
  bootstrap: [AppComponent],
})
export class AppModule {}
