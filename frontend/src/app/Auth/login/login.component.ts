import { Component, EventEmitter, Output } from '@angular/core';
import { User } from '../../user';
import { UserService } from '../../user.service';
import { NavigationEnd, Router } from '@angular/router';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
//import { AuthService } from '../../auth.service';

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
  email: any = '';
  private logoutTimer: any;
  constructor(
    private UserService: UserService,
    private router: Router,
    private _snackBar: MatSnackBar //private authService: AuthService
  ) {
    this.username = localStorage.getItem('user');
    // this.email = localStorage.getItem('email');
    this.UserService.user$.subscribe((user) => {
      if (user) {
        this.username = user.username;
        this.email = user.email;
      }
    });
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
        localStorage.setItem('user', JSON.stringify(result.user));
        //console.log('user', result.user);

        // Save token to get logged in
        localStorage.setItem('token', result.message);
        //console.log('token', result.message);
        //this.authService.login(result.message); //  token

        // Save user details correctly into the service
        if (result.user) {
          this.UserService.setUser({
            username: result.user.username,
            email: result.user.email,
          });
        }

        // this is for sign out button
        this.UserService.login();

        this.router.navigate(['dashboard']).then(() => {
          this.showMessage();
        });
      },
      error: (err) => {
        console.log(err);
        alert(err.error.message || 'Invalid email or password');
      },
    });
  }

  showMessage() {
    const storedUser: any = localStorage.getItem('user');

    const toStringUser = JSON.parse(storedUser); // convert to object
    const toGetUsername = toStringUser.username;
    this._snackBar.open(
      ` ${toGetUsername || 'User'} Logged in successfully!`,
      'Close',
      {
        duration: 1500,
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
  //button to be cleared
  clickForm() {
    this.loginForm.reset();
  }

  ngOnInit() {
    this.loadUser();
    //this.authService.autoLogout();

    // 👇 Subscribe to router events
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.loadUser();
      }
    });
  }

  loadUser() {
    const user = localStorage.getItem('user');
    if (user) {
      const parsed = JSON.parse(user);
      this.username = parsed.username;
      this.email = parsed.email;
    }
  }
}
