import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {
  HttpClientModule,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { GoogleChartsModule } from 'angular-google-charts'; // New import
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './Auth/login/login.component';
import { RegisterComponent } from './Auth/register/register.component';
import { PieChartComponent } from './Chart/pie-chart/pie-chart.component';
import { BarChartComponent } from './Chart/bar-chart/bar-chart.component';
import { UserFormComponent } from './user-form/user-form.component';
import { ExpensesTableComponent } from './expenses-table/expenses-table.component';
import { SpinnerComponent } from './spinner/spinner.component';
import { ExpenseEditComponent } from './expense-edit/expense-edit.component';
import { ProfileComponent } from './profile/profile.component';

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
    ExpenseEditComponent,
    ProfileComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    MatSnackBarModule,
    ReactiveFormsModule,
    AppRoutingModule,
    CommonModule,
    FormsModule,
    GoogleChartsModule, // Use Google Charts instead
  ],
  providers: [provideHttpClient(withInterceptorsFromDi())],
  bootstrap: [AppComponent],
})
export class AppModule {}
