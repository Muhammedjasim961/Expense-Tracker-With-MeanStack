import { Component, OnInit } from '@angular/core';
import { UserService } from '../../user.service';

@Component({
  selector: 'app-bar-chart',
  standalone: false,
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css'],
})
export class BarChartComponent implements OnInit {
  // Modern color palette
  colorPalette = [
    '#667eea',
    '#764ba2',
    '#f093fb',
    '#f5576c',
    '#4facfe',
    '#00f2fe',
    '#43e97b',
    '#38f9d7',
    '#fa709a',
    '#fee140',
    '#a8edea',
    '#fed6e3',
  ];

  // Individual Expenses Chart
  individualTitle = 'Individual Expenses';
  individualType: any = 'ColumnChart';
  individualData: any[] = [];
  individualColumns = ['Expense', 'Amount', { role: 'style', type: 'string' }];
  individualOptions = {
    legend: { position: 'none' },
    backgroundColor: {
      fill: 'transparent',
      stroke: '#e0e6ed',
      strokeWidth: 1,
    },
    chartArea: {
      width: '85%',
      height: '75%',
      backgroundColor: {
        stroke: '#e0e6ed',
        strokeWidth: 1,
      },
    },
    hAxis: {
      title: 'Expenses',
      textStyle: { color: '#64748b', fontSize: 12, fontName: 'Inter' },
      titleTextStyle: {
        color: '#334155',
        fontSize: 14,
        fontName: 'Inter',
        bold: true,
      },
    },
    vAxis: {
      title: 'Amount (₹)',
      format: '₹#,##0',
      textStyle: { color: '#64748b', fontSize: 12, fontName: 'Inter' },
      titleTextStyle: {
        color: '#334155',
        fontSize: 14,
        fontName: 'Inter',
        bold: true,
      },
      gridlines: { color: '#f1f5f9', count: 5 },
    },
    bar: { groupWidth: '65%' },
    animation: {
      startup: true,
      duration: 1000,
      easing: 'out',
    },
    tooltip: {
      textStyle: { color: '#1e293b', fontName: 'Inter' },
      showColorCode: true,
    },
  };
  individualWidth = 650;
  individualHeight = 450;

  // Monthly Expenses Chart
  monthlyTitle = 'Monthly Expenses Overview';
  monthlyType: any = 'ColumnChart';
  monthlyData: any[] = [];
  monthlyColumns = ['Month', 'Total Amount', { role: 'style', type: 'string' }];
  monthlyOptions = {
    legend: { position: 'none' },
    backgroundColor: {
      fill: 'transparent',
      stroke: '#e0e6ed',
      strokeWidth: 1,
    },
    chartArea: {
      width: '85%',
      height: '75%',
      backgroundColor: {
        stroke: '#e0e6ed',
        strokeWidth: 1,
      },
    },
    hAxis: {
      title: 'Months',
      textStyle: { color: '#64748b', fontSize: 12, fontName: 'Inter' },
      titleTextStyle: {
        color: '#334155',
        fontSize: 14,
        fontName: 'Inter',
        bold: true,
      },
    },
    vAxis: {
      title: 'Total Amount (₹)',
      format: '₹#,##0',
      textStyle: { color: '#64748b', fontSize: 12, fontName: 'Inter' },
      titleTextStyle: {
        color: '#334155',
        fontSize: 14,
        fontName: 'Inter',
        bold: true,
      },
      gridlines: { color: '#f1f5f9', count: 5 },
    },
    bar: { groupWidth: '75%' },
    animation: {
      startup: true,
      duration: 1200,
      easing: 'out',
    },
    tooltip: {
      textStyle: { color: '#1e293b', fontName: 'Inter' },
      showColorCode: true,
      isHtml: true,
    },
  };
  monthlyWidth = 850;
  monthlyHeight = 500;

  // Statistics
  totalAnnualExpenses = 0;
  highestExpenseMonth = '';
  averageMonthlyExpense = 0;
  currentMonthExpense = 0;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadIndividualExpenses();
    this.loadMonthlyExpenses();
  }

  // Load individual expenses
  loadIndividualExpenses(): void {
    this.userService.showExpenses().subscribe((res: any[]) => {
      this.individualData = res.map((expense, index) => [
        expense.expense_name,
        Number(expense.amount),
        this.colorPalette[index % this.colorPalette.length],
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

      // Prepare data for Google Charts with colors
      this.monthlyData = monthNames.map((monthName, index) => [
        monthName,
        monthlyTotals[index],
        this.colorPalette[index % this.colorPalette.length],
      ]);

      // Update statistics
      this.updateStatistics(monthlyTotals);
    });
  }

  // Update statistics
  private updateStatistics(monthlyTotals: number[]): void {
    this.totalAnnualExpenses = monthlyTotals.reduce(
      (sum, amount) => sum + amount,
      0
    );
    this.averageMonthlyExpense = this.totalAnnualExpenses / 12;

    const currentMonth = new Date().getMonth();
    this.currentMonthExpense = monthlyTotals[currentMonth];

    const maxIndex = monthlyTotals.indexOf(Math.max(...monthlyTotals));
    this.highestExpenseMonth = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ][maxIndex];
  }

  // Chart events for interactivity
  onIndividualChartSelect(event: any): void {
    console.log('Individual chart selected:', event);
  }

  onMonthlyChartSelect(event: any): void {
    console.log('Monthly chart selected:', event);
  }

  deleteExpense(id: number): void {
    this.userService.DeleteExpense(id).subscribe(() => {
      this.loadIndividualExpenses();
      this.loadMonthlyExpenses();
    });
  }

  // Get formatted currency
  getFormattedCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  }
}
