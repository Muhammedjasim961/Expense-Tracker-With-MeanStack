import { AfterViewInit, Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { UserService } from './user.service';
import { initFlowbite } from 'flowbite';
declare global {
  interface Window {
    Flowbite: any;
  }
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'frontend';
  username: string | null = '';
  email: string | null = '';
  userSignOutLogo: boolean = false;
  registerStatus: boolean = true;
  constructor(
    private _snackBar: MatSnackBar,
    private router: Router,
    private userService: UserService
  ) {
    const storedUser: any = localStorage.getItem('user');
    console.log('storedUser', storedUser);
    const StringUser = JSON.parse(storedUser); // convert to object
    const getUserName = (this.username = StringUser?.username || null);
    // if (getUserName) {
    //   this.registerStatus = false;
    // } else {
    //   this.registerStatus = true;
    // }
    // console.log('StringUser', StringUser.username);
    // this.username = StringUser.username || 'getting User Delay';

    // if (storedUser) {
    //   this.checkUser();
    // }
  }

  ngAfterViewInit() {
    // Initialize Flowbite if using npm version
    if (typeof window !== 'undefined' && window['Flowbite']) {
      window['Flowbite'].init();
    }
  }
  //  check if user email exists in localStorage
  checkUser() {
    const storedUser: any = localStorage.getItem('user');
    console.log('storedUser', storedUser);
    const StringUser = JSON.parse(storedUser); // convert to object
    console.log('StringUser', StringUser.username);
    this.username = StringUser.username || 'getting User Delay';
    if (this.username) {
      console.log('username exists:', this.username);
      this.username;
      return;
    } else {
      alert('User not logged in');
      this.userSignOutLogo = !!this.email; // true if email exists
      this.registerStatus = !!this.username; // true if email exists
    }
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
    initFlowbite();

    console.log('checking troubling Routes:', this.router.config);

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
