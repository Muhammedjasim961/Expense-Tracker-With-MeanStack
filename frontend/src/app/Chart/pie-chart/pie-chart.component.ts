import { HttpClient } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { ChartComponent } from 'ng-apexcharts';
import {
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexChart,
  ApexDataLabels,
  ApexPlotOptions,
  ApexYAxis,
  ApexTitleSubtitle,
  ApexXAxis,
  ApexFill,
} from 'ng-apexcharts';
import { User } from '../../user';
import { map } from 'rxjs';

export type ChartOptions = {
  series: ApexNonAxisChartSeries | any;
  chart: ApexChart | any;
  responsive: ApexResponsive[] | any;
  labels: any | any;
  dataLabels: ApexDataLabels | any;
  plotOptions: ApexPlotOptions | any;
  yaxis: ApexYAxis | any;
  xaxis: ApexXAxis | any;
  fill: ApexFill | any;
  title: ApexTitleSubtitle | any;
};
@Component({
  selector: 'app-pie-chart',
  standalone: false,
  templateUrl: './pie-chart.component.html',
  styleUrl: './pie-chart.component.css',
})
export class PieChartComponent {
  @ViewChild('chart') chart!: ChartComponent;
  public chartOptions: Partial<ChartOptions> = {};
  constructor(private http: HttpClient) {}
  ngOnInit() {
    this.loadUserData();
  }

  loadUserData() {
    this.http.get<User[]>('http://localhost:3005').subscribe((result) => {
      const expense_name = result.map((d) => d.expense_name);
      const ExpenseAmount = result.map((d) => d.amount);
      const expense_date = result.map((d) => d.expense_date);
      const expense_payment_date = result.map((d) => d.expense_payment_date);
      const expense_category = result.map((d) => d.expense_category);
      const comments = result.map((d) => d.comments);
      const filter = expense_category.filter((d) => {
        d == d;
      });
      if (expense_category == filter) {
      }
      this.chartOptions = {
        series: ExpenseAmount, // pie chart requires number array
        chart: {
          type: 'pie',
          height: 350,
        },
        labels: expense_category,

        title: {
          text: 'User Expenses',
        },
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 300,
              },
              legend: {
                position: 'bottom',
              },
            },
          },
        ],
      };
    });
  }
}
