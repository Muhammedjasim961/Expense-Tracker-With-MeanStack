import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Modal } from 'flowbite';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from '../user';
import { UserService } from '../user.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements AfterViewInit {
  username: any = '';
  email = '';
  constructor(
    private router: Router,
    private _snackBar: MatSnackBar,
    private userService: UserService,
    private snackBar: MatSnackBar,
    private authService: AuthService
  ) {
    const storedUser: any = localStorage.getItem('user');

    const toStringUser = JSON.parse(storedUser); // convert to object
    this.username = toStringUser.username;
  }
  profileForm = new FormGroup({
    username: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(15),
      // Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/),
    ]),
    email: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern('[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,}'),
    ]),
  });

  ngAfterViewInit() {
    // Grab the modal element
    const modalEl = document.getElementById('authentication-modal');
    if (modalEl) {
      // Initialize modal
      const modal = new Modal(modalEl, {
        placement: 'center', // you can change placement
        backdrop: 'dynamic',
        closable: true,
      });

      // Show the modal automatically
      modal.show();
      // 🔹 Attach close button manually
      const closeBtn = modalEl.querySelector(
        '[data-modal-hide="authentication-modal"]'
      );
      if (closeBtn) {
        closeBtn.addEventListener('click', () => {
          modal.hide();
          this.router.navigate(['/dashboard']);
        });
      }
    }
  }
  // This way, when you update the profile, every component subscribed to user$ will instantly update, without needing a refresh.
  updateProfile() {
    this.authService.updatedUserProfile(this.profileForm.value).subscribe({
      next: (result: User) => {
        console.log('Backend response:', result);

        // ✅ update shared state
        this.authService.setUser(result);

        //  update form instantly
        this.profileForm.patchValue({
          username: result.username,
          email: result.email,
        });
        //this is coming from auth service to show profile when its updated
        this.userService.setUser(result);

        this.username = result.username; // if locally used

        this.showMessage();
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        console.error('Error while updating profile:', error);
        this.snackBar.open('Failed to update profile. Please try again.', '', {
          duration: 1500,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          panelClass: ['snackbar-deleted'],
        });
      },
    });
  }

  showMessage() {
    this._snackBar.open(
      ` ${this.username || 'Profile'} Updated successfully!`,
      'Close',
      {
        duration: 1500,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        panelClass: ['snackbar-success'], // 👈 custom class
      }
    );
  }
}
