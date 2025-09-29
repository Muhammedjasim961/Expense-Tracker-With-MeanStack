import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-form',
  standalone: false,
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.css',
})
export class UserFormComponent {
  constructor(
    private _snackBar: MatSnackBar,
    private userService: UserService,
    private router: Router
  ) {}
  loading = false;

  userForm = new FormGroup({
    expense_name: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(20),
    ]),
    amount: new FormControl('', [
      Validators.required,
      Validators.minLength(1),
      Validators.max(10000000),
    ]),
    expense_date: new FormControl('', Validators.required),
    expense_payment_type: new FormControl(
      'Choose a Payment Type',
      Validators.required
    ),
    expense_category: new FormControl('', Validators.required),
    comments: new FormControl('', Validators.required),
  });
  submitExpenseDetails() {
    this.loading = true;
    this.userService.submitData(this.userForm.value).subscribe((result) => {
      console.log('submitUserDetails', result);
      // this.loading = true;

      // // simulate API call
      setTimeout(() => {
        console.log(this.userForm.value);
        this.loading = false; // hide spinner when done
      }, 10000);
      // this.loading = false;

      this.router.navigate(['dashboard']);
      this.showMessage();
      this.loading = false;
    });
  }

  showMessage() {
    this._snackBar.open('Expense saved successfully!', 'Close', {
      duration: 1500,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: ['snackbar-success'], //custom class here
    });
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      alert('Please fill in all required fields.');
      // Optionally, mark all controls as touched to display validation messages
      this.userForm.markAllAsTouched();
      return;
    }
    // Proceed with form submission logic if the form is valid
    console.log('Form submitted successfully:', this.userForm.value);
  }
}
