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
export class AppComponent implements OnInit {
  title = 'frontend';
  username: string | null = '';
  email: string | null = '';
  userSignOutLogo: boolean = false;
  constructor(
    private _snackBar: MatSnackBar,
    private router: Router,
    private userService: UserService
  ) {
    this.checkUser();
    // this.email = localStorage.getItem('email');
    this.username = localStorage.getItem('user');
    console.log('this.userNAme', this.username);

    if (this.username) {
      this.username = localStorage.getItem('user');
      return;
    } else {
      alert('user not logged in');
    }
    console.log('userSignOutLogo', this.userSignOutLogo, this.username);
  }

  //  check if user email exists in localStorage
  checkUser() {
    const storedUser: any = localStorage.getItem('user');
    const toStringUser = JSON.parse(storedUser); // convert to object
    this.username = toStringUser.username;
    console.log(toStringUser, 'emaail');
    // const toStringEmail = JSON.parse(storedEmail); // convert to object
    // this.username = toStringUser.username;
    // this.email = toStringEmail.email;
    this.userSignOutLogo = !!this.email; // true if email exists
    this.userSignOutLogo = !!this.username; // true if user exists
  }

  //  logout code
  signOut() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    this.email = null;
    this.username = null;
    this.userSignOutLogo = false;
    this.userService.clearUser();
    this.router.navigate(['/login']).then(() => {
      this.showMessage();
    });
  }
  showMessage() {
    const storedUser: any = localStorage.getItem('user');
    if (storedUser) {
      const toStringUser = JSON.parse(storedUser); // convert to object
      this.username = toStringUser.username;
    } else {
      this.username || null;
    }
    console.log('username', this.username);
    console.log();
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
    this.userService.user$.subscribe((user) => {
      if (user) {
        this.username = user.username;
        this.email = user.email;
      } else {
        this.username = null;
        this.email = null;
      }
    });
    this.userService.isLoggedIn$.subscribe((status) => {
      this.userSignOutLogo = status;
    });
  }
}
