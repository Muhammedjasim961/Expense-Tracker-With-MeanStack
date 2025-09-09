import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { UserService } from './user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'frontend';
  username: string | null = '';
  email: string | null = '';
  userSignOutLogo: boolean = false;
  constructor(
    private _snackBar: MatSnackBar,
    private router: Router,
    private userService: UserService
  ) {
    this.checkUser(); // run once when app loads
    this.email = localStorage.getItem('email');
    this.username = localStorage.getItem('username');
    if (this.email) {
      this.username = localStorage.getItem('username');
      return;
    } else {
      alert('user not logged in');
    }
    console.log('userSignOutLogo', this.userSignOutLogo, this.username);
  }

  //  check if user email exists in localStorage
  checkUser() {
    this.email = localStorage.getItem('email');
    this.username = localStorage.getItem('username');
    // console.log('user checking from app.component', this.username);
    // console.log('email checking from app.component', this.email);
    this.userSignOutLogo = !!this.email; // true if email exists
    this.userSignOutLogo = !!this.username; // true if user exists
    this.userSignOutLogo = true;
  }
  //  logout
  signOut() {
    localStorage.removeItem('email');
    localStorage.removeItem('username');
    localStorage.removeItem('token');
    this.email = null;
    this.username = null;
    this.userSignOutLogo = false;
    // if (!this.router.navigate(['/login'])) {
    //   this.userSignOutLogo = false;
    // }
    this.router.navigate(['/register']);
    this.showMessage();
  }
  showMessage() {
    this._snackBar.open(
      `${this.username || 'User'} Sign Out successfully!`,
      '',
      {
        duration: 2000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        panelClass: ['snackbar-logOut'], // 👈 custom class
      }
    );
  }
  // update UI whenever login/logout happens
  ngOnInit() {
    this.userService.isLoggedIn$.subscribe((status) => {
      this.userSignOutLogo = status;
    });
  }
}
