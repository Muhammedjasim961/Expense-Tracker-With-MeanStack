import { Component, EventEmitter, Output } from '@angular/core';
import { User } from '../../user';
import { UserService } from '../../user.service';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  // users: User = { email: '', password: '' };
  errorMsg = '';
  username: any = '';
  @Output() setUserProfileEvent = new EventEmitter<any>();

  loginForm = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern('[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,}'),
    ]),

    password: new FormControl('', [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(10),
      // Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/),
    ]),
  });

  constructor(
    private UserService: UserService,
    private router: Router,
    private _snackBar: MatSnackBar
  ) {
    // this.UserService.registerUserData(this.username).subscribe((result) => {
    //   console.log('from logging checking user name', result);
    // });
  }
  //user login checking with email and password
  login() {
    this.UserService.userLogin(
      this.loginForm.value.email,
      this.loginForm.value.password
    ).subscribe({
      next: (result) => {
        localStorage.setItem('token', result.message);
        const setEmailInLocal = localStorage.setItem(
          'email',
          this.loginForm.value.email || ''
        );
        console.log('setEmailInLocal', setEmailInLocal);

        this.router.navigate(['dashboard']).then(() => {
          //to reload the page to display sign out button
          window.location.reload();
        });
        this.showMessage();
      },
      error: (err) => {
        //error message coming from backend
        alert(err.error.message || 'Invalid email or password');
      },
    });
  }

  showMessage() {
    this._snackBar.open('User Logged in successfully!', 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: ['snackbar-success'], // 👈 custom class
    });
  }
  onSubmit() {
    if (this.loginForm.valid) {
      console.log('Form submitted:', this.loginForm.value);
    }
  }
}
