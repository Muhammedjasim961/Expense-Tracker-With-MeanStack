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
  expenses: User[] = [
    {
      expense_name: '',
      amount: 0,
      expense_date: '',
      expense_payment_type: '',
      expense_category: '',
      comments: '',
    },
  ];

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
    confirm('Are you sure you want to delete this..! ');
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
}
