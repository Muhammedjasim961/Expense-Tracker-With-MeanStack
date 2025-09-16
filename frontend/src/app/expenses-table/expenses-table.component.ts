import { Component } from '@angular/core';
import { User } from '../user';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-expenses-table',
  standalone: false,
  templateUrl: './expenses-table.component.html',
  styleUrl: './expenses-table.component.css',
})
export class ExpensesTableComponent {
  expenses: User[] = [];
  showToast = false;
  expenseToDelete: any;
  expenseIndex!: number;

  constructor(
    private expenseService: UserService,
    private _snackBar: MatSnackBar,
    private router: Router
  ) {
    //it shows expenses in the table on dashboard route
    this.expenseService.showExpenses().subscribe((result) => {
      this.expenses = result;
      // console.log('Result', result);
    });
  }

  deleteExpenses(expense: any, index: any) {
    const id = expense._id;
    this.expenseService.DeleteExpense(id).subscribe((result) => {
      this.expenses.splice(index, 1);
      this.expenseService.showExpenses();

      this.showMessage();
      this.router.navigate(['dashboard']);
      // this.expenseService.showExpenses();
    });
  }
  showMessage() {
    this._snackBar.open(`Expense Deleted successfully!`, '', {
      duration: 1500,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: ['snackbar-deleted'], // 👈 custom class
    });
  }
  getEditButtonId(ExpenseId: any) {
    const expenses = ExpenseId;
    const _id = expenses._id;
    this.expenseService.getExpenseById(_id).subscribe((result) => {
      console.log(result, 'result');
    });
    if (!_id) return;
    this.router.navigate(['/edit', _id]);
  }

  showDeleteToast(expense: any, index: number) {
    this.expenseToDelete = expense;
    this.expenseIndex = index;
    this.showToast = true;
  }

  confirmDelete() {
    if (this.expenseToDelete) {
      this.deleteExpenses(this.expenseToDelete, this.expenseIndex);
    }
    this.showToast = false;
  }

  cancelDelete() {
    this.showToast = false;
  }
}
