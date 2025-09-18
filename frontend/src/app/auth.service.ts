import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from './user';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  // This way, when you update the profile, every component subscribed to user$ will instantly update, without needing a refresh.
  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();

  setUser(user: User) {
    this.userSubject.next(user);
    localStorage.setItem('user', JSON.stringify(user));
  }
  getUser(): User | null {
    const stored = localStorage.getItem('user');
    if (stored) {
      const parsed: User = JSON.parse(stored);
      this.userSubject.next(parsed);
      return parsed;
    }
    return null;
  }
  updatedUserProfile(profileData: any) {
    const token = localStorage.getItem('token') || ''; // fallback to empty string

    return this.http.put<User>('http://localhost:3005/profile', profileData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
  }
}
