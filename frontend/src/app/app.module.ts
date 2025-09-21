import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import {
  HttpClientModule,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './Auth/login/login.component';
import { RegisterComponent } from './Auth/register/register.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { PieChartComponent } from './Chart/pie-chart/pie-chart.component';
import { BarChartComponent } from './Chart/bar-chart/bar-chart.component';
import { UserFormComponent } from './user-form/user-form.component';
import { ExpensesTableComponent } from './expenses-table/expenses-table.component';
import { SpinnerComponent } from './spinner/spinner.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ExpenseEditComponent } from './expense-edit/expense-edit.component';
import { ProfileComponent } from './profile/profile.component';
import { ApexChartsWrapperModule } from '../apex-charts-wrapper.module'; // Import the wrapper

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
    ApexChartsWrapperModule.forRoot(), // Use the wrapper instead
    ReactiveFormsModule,
    AppRoutingModule,
    CommonModule,
    FormsModule,
  ],
  providers: [provideHttpClient(withInterceptorsFromDi())],
  bootstrap: [AppComponent],
})
export class AppModule {}
