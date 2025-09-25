import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { UserService } from '../../user.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { User } from '../../user';
import { ExpenseService } from '../../expense.service';

interface Expense {
  expense_name: string;
  amount: number;
  expense_date: string;
  expense_category: string;
  comments: string;
}

interface CategoryData {
  name: string;
  amount: number;
}

interface MonthlyData {
  name: string;
  amount: number;
}
@Component({
  selector: 'app-bar-chart',
  standalone: false,
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css'],
})
export class BarChartComponent implements OnInit {
  // Loading states
  isLoading: boolean = true;
  isRefreshing: boolean = false;

  // All expenses from database
  allExpenses: Expense[] = [];

  // Statistics
  monthlyTotal: number = 0;
  dailyAverage: number = 0;
  transactionCount: number = 0;

  // Budget
  monthlyBudget: number = 0;
  spentAmount: number = 0;
  remainingAmount: number = 0;
  budgetProgress: number = 0;

  // Recent transactions
  recentTransactions: Expense[] = [];

  // Monthly data for horizontal chart
  monthlyData: any[] = [];

  constructor(private expenseService: ExpenseService) {}

  ngOnInit() {
    this.loadBudgetFromStorage();
    this.loadRealData();
  }

  // Load real data from your API
  loadRealData() {
    this.isLoading = true;

    this.expenseService.getAllExpenses().subscribe({
      next: (expenses: Expense[]) => {
        console.log('Received expenses from API:', expenses);
        this.allExpenses = expenses;
        this.processRealExpensesData(expenses);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching expenses:', error);
        this.isLoading = false;
        // Initialize with empty data if API fails
        this.initializeWithEmptyData();
      },
    });
  }

  // Process real expenses data from your database
  private processRealExpensesData(expenses: Expense[]) {
    if (!expenses || expenses.length === 0) {
      console.log('No expenses found in database');
      this.initializeWithEmptyData();
      return;
    }

    console.log('Processing', expenses.length, 'expenses from database');

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    // Filter current month expenses
    const currentMonthExpenses = expenses.filter((expense) => {
      try {
        const expenseDate = new Date(expense.expense_date);
        return (
          expenseDate.getMonth() === currentMonth &&
          expenseDate.getFullYear() === currentYear
        );
      } catch (error) {
        console.error('Error parsing date:', expense.expense_date);
        return false;
      }
    });

    // Calculate statistics
    this.monthlyTotal = currentMonthExpenses.reduce(
      (sum, expense) => sum + expense.amount,
      0
    );
    this.dailyAverage = Math.round(this.monthlyTotal / currentDate.getDate());
    this.transactionCount = currentMonthExpenses.length;

    // Process monthly data for horizontal chart
    this.processMonthlyData(expenses);

    // Set recent transactions (latest 10)
    this.recentTransactions = expenses
      .sort(
        (a, b) =>
          new Date(b.expense_date).getTime() -
          new Date(a.expense_date).getTime()
      )
      .slice(0, 10);

    // Update budget progress
    this.updateBudgetProgress();

    console.log('Monthly Total:', this.monthlyTotal);
    console.log('Transactions count:', this.transactionCount);
    console.log('Monthly data:', this.monthlyData);
  }

  // Process monthly data for horizontal chart
  private processMonthlyData(expenses: Expense[]) {
    const monthlyMap = new Map<string, number>();

    expenses.forEach((expense) => {
      try {
        const date = new Date(expense.expense_date);
        const monthYear = `${date.getFullYear()}-${(date.getMonth() + 1)
          .toString()
          .padStart(2, '0')}`;
        const monthName = date.toLocaleDateString('en-US', {
          month: 'short',
          year: 'numeric',
        });

        const currentAmount = monthlyMap.get(monthYear) || 0;
        monthlyMap.set(monthYear, currentAmount + expense.amount);
      } catch (error) {
        console.error('Error processing expense date:', expense.expense_date);
      }
    });

    // Convert to array and sort by date
    this.monthlyData = Array.from(monthlyMap.entries())
      .map(([monthYear, amount]) => ({
        month: monthYear,
        name: new Date(monthYear + '-01').toLocaleDateString('en-US', {
          month: 'short',
          year: 'numeric',
        }),
        amount: amount,
      }))
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-12); // Last 12 months

    console.log('Processed monthly data:', this.monthlyData);
  }

  // Initialize with empty data
  private initializeWithEmptyData() {
    this.monthlyTotal = 0;
    this.dailyAverage = 0;
    this.transactionCount = 0;
    this.monthlyData = [];
    this.recentTransactions = [];
    this.updateBudgetProgress();
  }

  // Budget methods
  setBudget() {
    localStorage.setItem('monthlyBudget', this.monthlyBudget.toString());
    this.updateBudgetProgress();
  }

  private loadBudgetFromStorage() {
    const savedBudget = localStorage.getItem('monthlyBudget');
    if (savedBudget) {
      this.monthlyBudget = parseInt(savedBudget, 10);
    } else {
      this.monthlyBudget = 10000; // Default budget
    }
  }

  private updateBudgetProgress() {
    this.spentAmount = this.monthlyTotal;
    this.remainingAmount = this.monthlyBudget - this.spentAmount;
    this.budgetProgress =
      this.monthlyBudget > 0
        ? Math.min(100, (this.spentAmount / this.monthlyBudget) * 100)
        : 0;
  }

  // Get max amount for chart scaling
  getMaxAmount(): number {
    if (this.monthlyData.length === 0) return 100;
    return Math.max(...this.monthlyData.map((item) => item.amount));
  }

  // Refresh dashboard
  refreshDashboard() {
    this.isRefreshing = true;
    this.loadRealData();
    setTimeout(() => {
      this.isRefreshing = false;
    }, 1000);
  }
}
