import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../user.service';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from '../user';
import { Router } from '@angular/router';
@Component({
  selector: 'app-expense-edit',
  standalone: false,
  templateUrl: './expense-edit.component.html',
  styleUrl: './expense-edit.component.css',
})
export class ExpenseEditComponent implements OnInit {
  loading: boolean = false;
  expenseId!: any;

  userForm!: FormGroup;
  constructor(
    private router: Router,
    private _snackBar: MatSnackBar,
    private userService: UserService,
    private route: ActivatedRoute
  ) {}
  ngOnInit() {
    this.userForm = new FormGroup({
      _id: new FormControl(''),
      expense_name: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(15),
      ]),
      amount: new FormControl('', [
        Validators.required,
        Validators.minLength(1),
        Validators.max(10000000),
      ]),
      expense_date: new FormControl('', Validators.required),
      expense_payment_type: new FormControl('', Validators.required),
      expense_category: new FormControl('', Validators.required),
      comments: new FormControl('', Validators.required),
    });
    //getting url ID
    const expenseId = this.route.snapshot.paramMap.get('id');
    if (expenseId) {
      this.userService.getExpenseById(expenseId).subscribe({
        next: (data) => {
          console.log('Fetched expense:', data);
          const expense = data;
          //getting values and adding to expenses
          this.userForm.patchValue({
            expense_name: expense.expense_name,
            amount: expense.amount,
            expense_date: expense.expense_date
              ? expense.expense_date.split('T')[0] // ✅ trim time
              : '',
            expense_payment_type: expense.expense_payment_type,
            expense_category: expense.expense_category,
            comments: expense.comments,
          });
        },
        error: (err) => {
          console.error(err);
          this.loading = false;
        },
      });
    }
  }

  // Called when user clicks "Update" to submit changes
  submitUpdatedExpense() {
    if (this.userForm.invalid) return;
    this.loading = true; // Start loader ✅
    const expenseId = this.route.snapshot.paramMap.get('id');
    const updatedData = { ...this.userForm.value };
    // ✅ remove _id so MongoDB won’t throw error
    delete updatedData._id;
    this.userService.updateExpense(expenseId, updatedData).subscribe({
      next: () => {
        this.loading = false; // Stop loader ✅
        this.router.navigate(['dashboard']);
        this.showMessage();
      },
      error: (err) => {
        this.loading = false; // Stop loader even on error ✅
        console.error(err);
        alert('Failed to update expense ❌');
      },
      complete: () => {
        this.loading = false; // Extra safety ✅
      },
    });
  }

  showMessage() {
    const expenseData = this.userForm.value.expense_name;
    this._snackBar.open(`${expenseData} Updated successfully!`, 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: ['snackbar-success'], // 👈 custom class
    });
  }
}
