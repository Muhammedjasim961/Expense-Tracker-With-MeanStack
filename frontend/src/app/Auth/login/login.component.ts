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
  // username: any = '';
  email: any = '';
  constructor(
    private UserService: UserService,
    private router: Router,
    private _snackBar: MatSnackBar
  ) {
    localStorage.getItem('username');
  }
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

  //user login checking with email and password
  login() {
    this.UserService.userLogin(
      this.loginForm.value.email,
      this.loginForm.value.password
    ).subscribe({
      next: (result) => {
        console.log('Backend response:', result);

        // Save token
        localStorage.setItem('token', result.message);

        // Save user details
        if (result.user) {
          localStorage.setItem('email', result.user.email);
          localStorage.setItem('username', result.user.username);
          console.log(result.user.email);
        }
        //this reload for
        this.UserService.userLogin('', '');
        this.router.navigate(['dashboard']).then(() => {
          this.showMessage(); // ✅ snackbar works bottom center
        });
      },
      error: (err) => {
        alert(err.error.message || 'Invalid email or password');
      },
    });
  }

  showMessage() {
    const getUsername = localStorage.getItem('username');
    this._snackBar.open(
      `User ${getUsername} Logged in successfully!`,
      'Close',
      {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        panelClass: ['snackbar-success'], // 👈 custom class
      }
    );
  }
  onSubmit() {
    if (this.loginForm.valid) {
      console.log('Form submitted:', this.loginForm.value);
    }
  }
  clickForm() {
    this.loginForm.reset();
  }
}
