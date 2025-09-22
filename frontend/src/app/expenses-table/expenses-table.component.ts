import { Component, OnChanges, OnInit } from '@angular/core';
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
export class ExpensesTableComponent implements OnInit, OnChanges {
  expenses: User[] = [];
  showToast = false;
  expenseToDelete: any;
  expenseIndex!: number;
  expense: any[] = [];
  expenseBackup: any[] = [];
  page: number = 1;
  limit: number = 5;
  totalPages: number = 0;
  pageNumbers: number[] = [];
  searchName: string = '';
  totalPrice: any = 0;
  ngOnChanges(changes: any) {
    console.log('change', changes);
    this.calculateTotalExpenses();
  }
  constructor(
    private expenseService: UserService,
    private _snackBar: MatSnackBar,
    private router: Router
  ) {
    //it shows expenses in the table on dashboard route
    this.expenseService.showExpenses().subscribe((result) => {
      this.expenses = result; //One for all data (original).
    });
    this.expenseService.showExpenses().subscribe((result) => {
      this.expenseBackup = result; // backup master list, One for filtered data (used in template).
      this.calculateTotalExpenses();
    });

    // this.expenses.map((expense) => {
    //   return {
    //     expense_name: expense.expense_name,
    //     amount: expense.amount,
    //     expense_date: expense.expense_date,
    //   };
    // });
  }

  //Search Filter Area
  // searchChangeExpense() {
  //   this.expenses = this.expenseBackup.filter((expense) =>
  //     expense.expense_name.toLowerCase().includes(this.searchName.toLowerCase())
  //   );
  // }
  // resetExpenses() {
  //   this.loadExpenses();
  // }
  searchChangeExpense() {
    const searchTerm = this.searchName.trim().toLowerCase();

    if (!searchTerm) {
      // If input is cleared, restore all expenses
      this.expenses = [...this.expenseBackup];
      this.loadExpenses();
      this.calculateTotalExpenses();
    } else {
      this.expenses = this.expenseBackup.filter((expense) =>
        expense.expense_name?.toLowerCase().includes(searchTerm)
      );
    }

    console.log('search changes', this.expenses);
  }

  // filterResult() {
  //   this.expenses = this.expenses.filter((expense) => expense.amount <= 25);
  // }
  calculateTotalExpenses() {
    this.totalPrice = this.expenses.reduce(
      (total, expense) => total + Number(expense.amount ?? 0),
      0
    );
  }
  resetExpenses() {
    this.loadExpenses();
  }
  //pagination Area
  ngOnInit(): void {
    this.loadExpenses();
  }
  loadExpenses() {
    this.expenseService.setPagination(this.page, this.limit).subscribe({
      next: (res) => {
        this.expenses = res.expenses;
        this.totalPages = res.totalPages;

        // If current page is greater than total pages, reset to last valid page
        if (this.page > this.totalPages && this.totalPages > 0) {
          this.page = this.totalPages;
          this.loadExpenses(); // reload with corrected page
          return;
        }

        // Build page numbers
        this.pageNumbers = [];
        for (let i = 1; i <= this.totalPages; i++) {
          this.pageNumbers.push(i);
        }
      },

      error: (err) => {
        console.error('Error loading expenses:', err);
      },
    });
  }

  goToPage(page: number) {
    this.page = page;
    this.expense = this.expenses.slice(
      (this.page - 1) * this.limit,
      this.page * this.limit
    );

    this.loadExpenses();
  }
  nextPage() {
    if (this.page < this.totalPages) {
      this.page++;
      this.loadExpenses();
    }
  }
  prevPage() {
    if (this.page > 1) {
      this.page--;
      this.loadExpenses();
    }
  }
  //pagination end
  // deleteExpenses(expense: any, index: any) {
  //   const id = expense._id;
  //   this.expenseService.DeleteExpense(id).subscribe((result) => {
  //     // Remove from local array
  //     this.expenses = this.expenses.filter((e) => e.id !== id);
  //     this.expenseBackup = this.expenseBackup.filter((e) => e.id !== id);

  //     // Adjust page if no items left on current page
  //     if (this.expenses.length === 0 && this.page > 1) {
  //       this.page--;
  //       this.loadExpenses(); // reload the previous page
  //     } else {
  //       // Just recalc total for remaining items
  //       this.calculateTotalExpenses();
  //     }
  //     this.expenses.splice(index, 1);
  //     this.expenseService.showExpenses();
  //     this.calculateTotalExpenses();

  //     this.showMessage();
  //     this.router.navigate(['dashboard']);
  //     // this.expenseService.showExpenses();
  //   });
  // }

  deleteExpenses(expense: any) {
    const id = expense._id;

    this.expenseService.DeleteExpense(id).subscribe(() => {
      // Remove from both arrays
      this.expenses = this.expenses.filter((e) => e._id !== id);
      this.expenseBackup = this.expenseBackup.filter((e) => e._id !== id);

      // Adjust page if current page becomes empty
      if (this.expenses.length === 0 && this.page > 1) {
        this.page--;
        this.loadExpenses(); // reload previous page from server
      } else {
        // Recalculate total for **all remaining expenses**, not just current page
        this.totalPrice = this.expenseBackup.reduce(
          (total, exp) => total + Number(exp.amount ?? 0),
          0
        );
      }
      window.location.reload();
      this.router.navigate(['/dashboard']);
      this.showMessage();
      this.loadExpenses(); // reload previous page from server
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
      this.deleteExpenses(this.expenseToDelete);
    }
    this.showToast = false;
  }

  cancelDelete() {
    this.showToast = false;
  }
}
