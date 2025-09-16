import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private token: string | null = null;
  private logoutTimer: any;

  constructor(private router: Router) {}

  // Save token after login
  login(token: string) {
    this.token = token;
    localStorage.setItem('token', token);

    // decode and set auto-logout
    const decoded: any = this.decodeJwt(token);
    if (decoded && decoded.exp) {
      const expiryTime = decoded.exp * 1000 - Date.now();
      this.autoLogout(expiryTime);
    }
  }

  // Load token if already logged in
  autoLogin() {
    const savedToken = localStorage.getItem('token');
    if (!savedToken) return;

    this.token = savedToken;
    const decoded: any = this.decodeJwt(savedToken);
    if (decoded && decoded.exp) {
      const expiryTime = decoded.exp * 1000 - Date.now();
      if (expiryTime > 0) {
        this.autoLogout(expiryTime);
      } else {
        this.logout();
      }
    }
  }

  // Auto logout after token expires
  autoLogout(expiryTime: number) {
    if (this.logoutTimer) {
      clearTimeout(this.logoutTimer);
    }
    this.logoutTimer = setTimeout(() => {
      this.logout();
    }, expiryTime);
  }

  // Clear session
  logout() {
    this.token = null;
    localStorage.removeItem('token');
    if (this.logoutTimer) {
      clearTimeout(this.logoutTimer);
    }
    this.router.navigate(['/login']);
  }

  // ✅ Manual JWT decode (no jwt-decode dependency)
  private decodeJwt(token: string): any {
    try {
      const payload = token.split('.')[1]; // JWT has 3 parts
      const decodedPayload = atob(payload); // base64 decode
      return JSON.parse(decodedPayload);
    } catch (e) {
      console.error('Invalid JWT', e);
      return null;
    }
  }
}
