import { Component, ViewChild } from '@angular/core';
import { ChartComponent } from 'ng-apexcharts';
import { UserService } from '../../user.service';
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
  selector: 'app-bar-chart',
  standalone: false,
  templateUrl: './bar-chart.component.html',
  styleUrl: './bar-chart.component.css',
})
export class BarChartComponent {
  @ViewChild('chart') chart!: ChartComponent;
  public chartOptions!: Partial<ChartOptions>;

  constructor(private userService: UserService) {
    // Initialize chartOptions to prevent undefined errors
    this.chartOptions = {
      series: [],
      chart: { height: 350, type: 'bar' },
      xaxis: { categories: [] },
      plotOptions: {},
      dataLabels: {},
      fill: {},
      yaxis: {},
      title: {},
    };
  }

  ngOnInit(): void {
    // Fetch individual expenses
    this.userService.showExpenses().subscribe((res: any[]) => {
      this.updateExpenseChart(res);
    });

    // Fetch monthly totals for pie/bar chart
    this.loadingMonthlyChartData();
  }

  // Update chart for individual expenses
  updateExpenseChart(expenses: any[]): void {
    if (expenses && expenses.length > 0) {
      this.chartOptions.series = [
        { name: 'Amount', data: expenses.map((e) => e.amount) },
      ];
      this.chartOptions.xaxis.categories = expenses.map((e) => e.expense_name);
    } else {
      this.chartOptions.series = [{ name: 'Amount', data: [] }];
      this.chartOptions.xaxis.categories = [];
    }
  }

  // Update chart for monthly totals
  loadingMonthlyChartData(): void {
    this.userService.settingDataToPieChart().subscribe((result: any[]) => {
      const monthlyTotals = Array(12).fill(0);

      if (Array.isArray(result) && result.length > 0) {
        result.forEach((expense) => {
          if (expense.expense_date && expense.amount) {
            const date = new Date(expense.expense_date);
            if (!isNaN(date.getTime())) {
              monthlyTotals[date.getMonth()] += Number(expense.amount) || 0;
            }
          }
        });
      }

      // Set chartOptions for monthly totals
      this.chartOptions = {
        series: [{ name: 'Expenses', data: monthlyTotals }],

        chart: { height: 350, type: 'bar' },
        plotOptions: {
          bar: { dataLabels: { position: 'top' } },
        },
        dataLabels: {
          enabled: true,
          formatter: (val: any) => '₹' + val,
          offsetY: -20,
          style: { fontSize: '12px', colors: ['#304758'] },
        },
        xaxis: {
          categories: [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec',
          ],
          position: 'bottom',
          labels: { offsetY: -28 },
          axisBorder: { show: false },
          axisTicks: { show: false },
          tooltip: { enabled: true, offsetY: -35 },
        },
        fill: {
          type: 'gradient',
          gradient: {
            shade: 'light',
            type: 'horizontal',
            shadeIntensity: 0.25,
            opacityFrom: 1,
            opacityTo: 1,
            stops: [50, 0, 100, 100],
          },
        },
        yaxis: {
          labels: { show: true, formatter: (val: any) => '₹' + val },
        },
        title: {
          text: 'Monthly Expenses',
          floating: true,
          align: 'left',
          style: { color: '#444' },
        },
      };
    });
  }

  deleteExpense(id: number) {
    this.userService.DeleteExpense(id).subscribe(() => {
      window.location.reload;
    });
  }
}
