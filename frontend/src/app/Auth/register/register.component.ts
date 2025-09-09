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
      .checkingUserExits(this.registerForm.value.username)
      .subscribe((result) => {
        if (result.length) {
          alert(
            `user ${this.registerForm.value.username} already exits AND Check Out Your Email Also!`
          );
          // console.log( `user ${this.registerForm.value.username} exits checking`,result);
        }
        this.userService
          .registerUserData(this.registerForm.value)
          .subscribe((result) => {
            this.router.navigate(['login']);
            if (this.registerForm.valid) {
              const email: any = this.registerForm.value.email;
              localStorage.setItem('email', email);
            }
            const username: any = this.registerForm.value.username;
            localStorage.setItem('username', username);

            this.showMessage();
            console.log('register', result);
          });
      });
  }
  showMessage() {
    this._snackBar.open('Registered successfully!', 'Close', {
      duration: 1500,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: ['snackbar-success'], // 👈 custom class
    });
  }
  clearForm() {
    this.registerForm.reset();
  }
}
