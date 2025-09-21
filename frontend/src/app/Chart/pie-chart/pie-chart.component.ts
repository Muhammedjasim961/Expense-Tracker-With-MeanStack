import { Component, OnInit } from '@angular/core';
import { UserService } from '../../user.service';

@Component({
  selector: 'app-pie-chart',
  standalone: false,
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.css'],
})
export class PieChartComponent implements OnInit {
  // Elegant color palette for pie chart
  colorPalette = [
    '#FF6B6B',
    '#4ECDC4',
    '#45B7D1',
    '#FFBE0B',
    '#FB5607',
    '#FF006E',
    '#8338EC',
    '#3A86FF',
    '#38B000',
    '#F15BB5',
    '#9B5DE5',
    '#FEE440',
    '#00BBF9',
    '#00F5D4',
    '#FF9E00',
    '#FF6392',
    '#7AE582',
    '#8AC926',
    '#1982C4',
    '#6A4C93',
  ];

  // Chart configuration
  title = 'Expense Distribution';
  type: any = 'PieChart';
  data: any[] = [];
  columnNames = ['Category', 'Amount'];

  options = {
    is3D: false,
    backgroundColor: 'transparent',
    legend: {
      position: 'labeled',
      textStyle: {
        color: '#2D3748',
        fontSize: 12,
        fontName: 'Inter',
        bold: true,
      },
      alignment: 'center',
      maxLines: 2,
    },
    pieSliceText: 'percentage',
    pieSliceTextStyle: {
      color: 'white',
      fontSize: 11,
      fontName: 'Inter',
      bold: true,
    },
    chartArea: {
      width: '100%',
      height: '100%',
      left: 0,
      top: 20,
      right: 0,
      bottom: 20,
    },
    tooltip: {
      text: 'value',
      showColorCode: true,
      textStyle: {
        color: '#2D3748',
        fontName: 'Inter',
        fontSize: 12,
      },
      isHtml: true,
    },
    slices: {},
    pieHole: 0.3, // Donut style
    animation: {
      startup: true,
      duration: 1000,
      easing: 'out',
    },
    enableInteractivity: true,
    sliceVisibilityThreshold: 0.01,
  };

  width = 500;
  height = 400;

  // Statistics
  totalExpenses = 0;
  largestCategory = '';
  largestAmount = 0;
  categoryCount = 0;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.loadUserData();
  }

  loadUserData() {
    this.userService.settingDataToPieChart().subscribe((result) => {
      if (result && result.length > 0) {
        // Transform data and assign colors
        this.data = result.map((item, index) => [
          item.expense_name,
          Number(item.amount),
        ]);

        // Calculate statistics
        this.calculateStatistics(result);

        // Assign colors to slices
        this.assignSliceColors(result.length);
      } else {
        // Default data if no expenses
        this.data = [['No Expenses', 1]];
        this.options.slices = { 0: { color: '#E2E8F0' } };
      }
    });
  }

  private calculateStatistics(expenses: any[]): void {
    this.totalExpenses = expenses.reduce(
      (sum, item) => sum + Number(item.amount),
      0
    );
    this.categoryCount = expenses.length;

    if (expenses.length > 0) {
      const largest = expenses.reduce((max, item) =>
        Number(item.amount) > Number(max.amount) ? item : max
      );
      this.largestCategory = largest.expense_name;
      this.largestAmount = Number(largest.amount);
    }
  }

  private assignSliceColors(count: number): void {
    const slices: any = {};
    for (let i = 0; i < count; i++) {
      slices[i] = {
        color: this.colorPalette[i % this.colorPalette.length],
      };
    }
    this.options.slices = slices;
  }

  // Get formatted currency
  getFormattedCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  }

  // Get percentage of total
  getPercentage(amount: number): string {
    if (this.totalExpenses === 0) return '0%';
    return ((amount / this.totalExpenses) * 100).toFixed(1) + '%';
  }

  // Chart interaction events
  onChartSelect(event: any): void {
    console.log('Chart selected:', event);
  }

  onChartReady(event: any): void {
    console.log('Chart is ready:', event);
  }
}
