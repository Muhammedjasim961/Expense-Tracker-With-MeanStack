import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from './user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const snackbar = inject(MatSnackBar);

  // const userService = Inject(UserService);
  const token = localStorage.getItem('token');
  if (token) {
    return true;
  } else {
    snackbar.open('Please Sign In.', '', {
      duration: 1500,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['snackbar-login'],
    });
    router.navigate(['/register']);
    return false;
  }
};
