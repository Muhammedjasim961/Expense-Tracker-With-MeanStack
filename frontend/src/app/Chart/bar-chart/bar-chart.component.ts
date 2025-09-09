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
  data: any = '';
  constructor(private userService: UserService) {
    this.loadingPieChartData();
    this.userService.showExpenses();
  }
  // In your component
  loadingPieChartData() {
    this.userService.settingDataToPieChart().subscribe((result) => {
      let monthlyTotals = Array(12).fill(0);

      if (Array.isArray(result) && result.length > 0) {
        result.forEach((expense: any) => {
          if (expense.expense_date && expense.amount) {
            const date = new Date(expense.expense_date);
            if (!isNaN(date.getTime())) {
              const month = date.getMonth();
              monthlyTotals[month] += Number(expense.amount) || 0;
            }
          }
        });
      }

      // ✅ Build new chartOptions fully
      this.chartOptions = {
        series: [
          {
            name: 'Expenses',
            data: monthlyTotals,
          },
        ],
        chart: {
          height: 350,
          type: 'bar',
        },
        plotOptions: {
          bar: {
            dataLabels: {
              position: 'top',
            },
          },
        },
        dataLabels: {
          enabled: true,
          formatter: function (val: any) {
            return '₹' + val;
          },
          offsetY: -20,
          style: {
            fontSize: '12px',
            colors: ['#304758'],
          },
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
          position: 'top',
          labels: {
            offsetY: -18,
          },
          axisBorder: {
            show: false,
          },
          axisTicks: {
            show: false,
          },
          tooltip: {
            enabled: true,
            offsetY: -35,
          },
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
          labels: {
            show: true,
            formatter: function (val: any) {
              return '₹' + val;
            },
          },
        },
        title: {
          text: 'Monthly Expenses',
          floating: 0,
          offsetY: 320,
          align: 'center',
          style: {
            color: '#444',
          },
        },
      };
    });
  }

  deleteExpense(id: number) {
    this.userService.DeleteExpense(id).subscribe(() => {
      this.loadingPieChartData(); // ✅ refresh after delete
    });
  }
}
