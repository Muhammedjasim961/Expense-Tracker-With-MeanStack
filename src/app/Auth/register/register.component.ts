import { Component, EventEmitter, Output } from '@angular/core';
import { User } from '../../user';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../user.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  constructor(
    private userService: UserService,
    private router: Router,
    private _snackBar: MatSnackBar
  ) {}
  registerForm = new FormGroup({
    username: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(10),
    ]),
    email: new FormControl('', [
      Validators.required,
      Validators.email,
      Validators.pattern('[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,}'),
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(10),
    ]),
  });
  registerUserFormDetails() {
    this.userService
      .registerUserData(this.registerForm.value)
      .subscribe((result) => {
        this.router.navigate(['login']);
        this.showMessage();

        console.log('register', result);
      });
  }
  showMessage() {
    this._snackBar.open('Registered successfully!', 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: ['snackbar-success'], // 👈 custom class
    });
  }
}
