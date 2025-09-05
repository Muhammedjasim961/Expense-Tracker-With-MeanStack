import { Component } from '@angular/core';
import { User } from '../../user';
import { UserService } from '../../user.service';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  // users: User = { email: '', password: '' };
  errorMsg = '';

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

  constructor(private UserService: UserService, private router: Router) {
    console.log('username', this.loginForm.get('username')?.value);
    this.loginForm.valueChanges.subscribe((values) => {
      // this.users = values as User; // ✅ only values, not validators
      // console.log('Live Users JSON:', this.users);
    });
  }

  login() {
    this.UserService.userLogin(
      this.loginForm.value.password,
      this.loginForm.value.email
    ).subscribe({
      next: (response) => {
        console.log('Login success', response);

        localStorage.setItem('token', response.message);
        // console.log('Full response message:', response.message);

        // Get token
        const stringToken = localStorage.getItem('token');
        console.log('token message', stringToken);
        // Redirect after login
        this.router.navigate(['dashboard']);
      },
      error: (err) => {
        console.error('Login failed:', err);
        // console.log('user', this.users.email);
        this.errorMsg = err.error?.message || 'Wrong Credentials';
      },
    });
  }
  onSubmit() {
    if (this.loginForm.valid) {
      console.log('Form submitted:', this.loginForm.value);
    }
  }
}
