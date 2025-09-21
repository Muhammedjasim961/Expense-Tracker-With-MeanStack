import { Component, OnInit } from '@angular/core';
import { UserService } from '../../user.service';

@Component({
  selector: 'app-bar-chart',
  standalone: false,
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css'],
})
export class BarChartComponent implements OnInit {
  type: any = '';
  // Individual Expenses Chart
  individualTitle = 'Individual Expenses';
  individualType: any = 'ColumnChart';
  individualData: any[] = [];
  individualColumns = ['Expense', 'Amount'];
  individualOptions = {
    legend: { position: 'none' },
    backgroundColor: 'transparent',
    chartArea: { width: '80%', height: '70%' },
    hAxis: { title: 'Expenses' },
    vAxis: { title: 'Amount (₹)', format: '₹#,##0' },
  };
  individualWidth = 600;
  individualHeight = 400;

  // Monthly Expenses Chart
  monthlyTitle = 'Monthly Expenses';
  monthlyType: any = 'ColumnChart';
  monthlyData: any[] = [];
  monthlyColumns = ['Month', 'Total Amount'];
  monthlyOptions = {
    legend: { position: 'none' },
    backgroundColor: 'transparent',
    chartArea: { width: '80%', height: '70%' },
    hAxis: { title: 'Months' },
    vAxis: { title: 'Total Amount (₹)', format: '₹#,##0' },
    animation: {
      startup: true,
      duration: 1000,
      easing: 'out',
    },
  };
  monthlyWidth = 800;
  monthlyHeight = 400;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadIndividualExpenses();
    this.loadMonthlyExpenses();
  }

  // Load individual expenses
  loadIndividualExpenses(): void {
    this.userService.showExpenses().subscribe((res: any[]) => {
      this.individualData = res.map((expense) => [
        expense.expense_name,
        Number(expense.amount),
      ]);
    });
  }

  // Load and calculate monthly expenses
  loadMonthlyExpenses(): void {
    this.userService.settingDataToPieChart().subscribe((result: any[]) => {
      const monthlyTotals = Array(12).fill(0);
      const monthNames = [
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
      ];

      if (Array.isArray(result) && result.length > 0) {
        result.forEach((expense) => {
          if (expense.expense_date && expense.amount) {
            const date = new Date(expense.expense_date);
            if (!isNaN(date.getTime())) {
              const month = date.getMonth();
              monthlyTotals[month] += Number(expense.amount) || 0;
            }
          }
        });
      }

      // Prepare data for Google Charts
      this.monthlyData = monthNames.map((monthName, index) => [
        monthName,
        monthlyTotals[index],
      ]);
    });
  }

  // Chart events for interactivity
  onIndividualChartSelect(event: any): void {
    console.log('Individual chart selected:', event);
  }

  onMonthlyChartSelect(event: any): void {
    console.log('Monthly chart selected:', event);
    // You can add more interactive features here
  }

  deleteExpense(id: number): void {
    this.userService.DeleteExpense(id).subscribe(() => {
      // Refresh both charts after deletion
      this.loadIndividualExpenses();
      this.loadMonthlyExpenses();
    });
  }

  // Get total annual expenses
  getTotalAnnualExpenses(): number {
    return this.monthlyData.reduce(
      (total, monthData) => total + (monthData[1] || 0),
      0
    );
  }

  // Get month with highest expenses
  getHighestExpenseMonth(): string {
    if (this.monthlyData.length === 0) return 'No data';

    let maxIndex = 0;
    let maxValue = 0;

    this.monthlyData.forEach((monthData, index) => {
      if (monthData[1] > maxValue) {
        maxValue = monthData[1];
        maxIndex = index;
      }
    });

    return this.monthlyData[maxIndex][0];
  }
}
