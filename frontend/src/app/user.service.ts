import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from './user';
import { environment } from '../environments/environment';
@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = environment.apiUrl;

  isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
  //with a BehaviorSubject (reactive variable) that tells the whole app whether the user is logged in or not.
  // private userSubject = new BehaviorSubject<any>(this.getUserFromStorage());
  constructor(private http: HttpClient) {
    this.apiUrl = 'http://localhost:3005';
    console.log('FORCED API URL:', this.apiUrl);

    console.log('Current API URL:', environment.apiUrl);
    console.log('Production mode:', environment.production);
    if (!environment.production) {
      console.log('Debug info: App is running in development mode');
    }

    // Load from localStorage on app start
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.userSubject.next(JSON.parse(storedUser));
    }
  }

  isLoggedIn$ = this.isLoggedInSubject.asObservable();
  //to update profile changes
  private userSubject = new BehaviorSubject<any>(null);
  user$ = this.userSubject.asObservable();

  setUser(user: any) {
    localStorage.setItem('user', JSON.stringify(user));
    this.userSubject.next(user);
  }
  clearUser() {
    localStorage.removeItem('user');
    this.userSubject.next(null);
  }

  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  login() {
    this.isLoggedInSubject.next(true); // 🔔 notify login
    // localStorage.setItem('username', username);
    // localStorage.setItem('token', token);
  }

  logout() {
    localStorage.clear();
    this.isLoggedInSubject.next(false);
    // this.userSubject.next(null);
    // 🔔 notify logout
  }
  //this is for reloading the to get the profile user name on time
  // private getUserFromStorage(): any {
  //   const user = localStorage.getItem('user');
  //   return user ? JSON.parse(user) : null;
  // }
  //Just checks if a token exists  used when the app starts to know if user is still logged in.
  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }
  //BACKEND URLS
  //  loginUser = 'http://localhost:3005/login';
  //  userExits = 'http://localhost:3005/';
  //registerUser = 'http://localhost:3005/register';
  //  insertExpenses = 'http://localhost:3005/insertExpense';
  //DeleteOneExpense = 'http://localhost:3005/deleteExpense/';
  // EditExpense = 'http://localhost:3005/updateExpense';
  // expensesById = 'http://localhost:3005/expense/';
  // pagination = 'http://localhost:3000/expenses'; // backend URL

  // Add this to your service methods for debugging
  userLogin(email: any, password: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/auth/login`, { email, password });
  }

  // In user.service.ts
  registerUserData(user: any) {
    const url = `${this.apiUrl}/api/auth/register`;
    console.log('Service calling URL:', url); // ← Add this
    console.log('With data:', user);

    return this.http.post(url, user);
    // ✅ Use the correct endpoint
    // return this.http.post(`${this.apiUrl}/api/auth/register`, user);
  }

  showExpenses(): Observable<any> {
    return this.http.get<User[]>(`${this.apiUrl}/api`);
  }
  submitData(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/insertExpense`, data);
  }
  DeleteExpense(id: number) {
    return this.http.delete(`${this.apiUrl}/api/deleteExpense/${id}`);
  }

  checkingUserExits(username: any): Observable<any> {
    return this.http.get<User[]>(`${this.apiUrl}/api`, username);
  }

  settingDataToPieChart() {
    return this.http.get<User[]>(`${this.apiUrl}/api`);
  }

  updateExpense(id: any, expenseData: any) {
    return this.http.put(`${this.apiUrl}/api/updateExpense/${id}`, expenseData);
  }
  // fetch a single expense (GET)
  getExpenseById(id: string) {
    return this.http.get<User>(`${this.apiUrl}/api/expense/${id}`);
    // or whatever your "get single expense" route is
  }
  setPagination(page: number, limit: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/expenses?page=${page}&limit=${limit}`);
  }
}
