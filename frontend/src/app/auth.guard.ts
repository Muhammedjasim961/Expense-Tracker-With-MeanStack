import { Inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from './user.service';
export const authGuard: CanActivateFn = (route, state) => {
  const router = Inject(Router);
  // const userService = Inject(UserService);
  const token = localStorage.getItem('token');
  if (token) {
    return true;
  } else {
    alert('Please Sign in!');
    router.navigate(['/register']);
    return false;
  }
};
