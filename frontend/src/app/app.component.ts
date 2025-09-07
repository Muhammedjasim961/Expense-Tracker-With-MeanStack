import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

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
  constructor(private _snackBar: MatSnackBar, private router: Router) {
    this.checkUser(); // run once when app loads
    console.log('userSignOutLogo', this.userSignOutLogo);
  }

  //  check if user exists in localStorage
  checkUser() {
    this.email = localStorage.getItem('email');
    this.username = localStorage.getItem('username');
    this.userSignOutLogo = !!this.email; // true if email exists
    this.userSignOutLogo = !!this.username; // true if user exists
  }
  //  logout
  signOut() {
    localStorage.removeItem('email');
    localStorage.removeItem('username');
    this.email = null;
    this.username = null;
    this.userSignOutLogo = false;
    this.showMessage();
    if (!this.router.navigate(['/login'])) {
      this.userSignOutLogo = false;
    }
    this.router.navigate(['/login']);
  }
  showMessage() {
    this._snackBar.open('User Sign Out successfully!', 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: ['snackbar-logOut'], // 👈 custom class
    });
  }
}
