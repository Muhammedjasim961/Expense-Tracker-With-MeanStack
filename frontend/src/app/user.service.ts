import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from './user';
@Injectable({
  providedIn: 'root',
})
export class UserService {
  loginUser = 'http://localhost:3005/login';
  userExits = 'http://localhost:3005/';
  registerUser = 'http://localhost:3005/register';
  getExpenses = 'http://localhost:3005';
  insertExpenses = 'http://localhost:3005/insertExpense';
  DeleteOneExpense = 'http://localhost:3005/deleteExpense/';
  EditExpense = 'http://localhost:3005/updateExpense';
  expensesById = 'http://localhost:3005/expense/';
  pagination = 'http://localhost:3000/expenses'; // backend URL

  private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
  //with a BehaviorSubject (reactive variable) that tells the whole app whether the user is logged in or not.
  // private userSubject = new BehaviorSubject<any>(this.getUserFromStorage());
  constructor(private http: HttpClient) {
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
  userLogin(email: any, password: any): Observable<any> {
    return this.http.post(this.loginUser, { email, password });
  }
  // { headers: { 'Content-Type': 'application/json' } }

  login() {
    this.isLoggedInSubject.next(true); // 🔔 notify login
    // localStorage.setItem('username', username);
    // localStorage.setItem('token', token);
  }
  // login(user: { username: string; email: string; token: string }) {
  //   localStorage.setItem('user', JSON.stringify(user));
  //   this.isLoggedInSubject.next(true);
  //   // this.userSubject.next(user); // 🔔 update user immediately
  // }
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
  showExpenses(): Observable<any> {
    return this.http.get<User[]>(this.getExpenses);
  }
  submitData(data: any): Observable<any> {
    return this.http.post(this.insertExpenses, data);
  }
  DeleteExpense(id: number) {
    return this.http.delete(this.DeleteOneExpense + id);
  }
  registerUserData(user: any) {
    return this.http.post<User>(this.registerUser, user);
  }
  checkingUserExits(username: any): Observable<any> {
    return this.http.get<User[]>(this.userExits, username);
  }

  settingDataToPieChart() {
    return this.http.get<User[]>(this.userExits);
  }

  updateExpense(id: any, expenseData: any) {
    return this.http.put<User>(
      `http://localhost:3005/updateExpense/${id}`,
      expenseData
    );
  }
  // fetch a single expense (GET)
  getExpenseById(id: string) {
    return this.http.get<User>(`http://localhost:3005/expense/${id}`);
    // or whatever your "get single expense" route is
  }
  setPagination(page: number, limit: number): Observable<any> {
    return this.http.get(
      `http://localhost:3005/expenses?page=${page}&limit=${limit}`
    );
  }
}
