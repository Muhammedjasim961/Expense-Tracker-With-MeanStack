import { HttpClient } from '@angular/common/http';
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
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
  //with a BehaviorSubject (reactive variable) that tells the whole app whether the user is logged in or not.

  isLoggedIn$ = this.isLoggedInSubject.asObservable();
  constructor(private http: HttpClient) {}

  userLogin(email: any, password: any): Observable<any> {
    this.isLoggedInSubject.next(true); // 🔔 notify login

    return this.http.post(this.loginUser, { email, password });
  }
  // { headers: { 'Content-Type': 'application/json' } }

  // login() {
  //   // localStorage.setItem('username', username);
  //   // localStorage.setItem('token', token);
  // }
  logout() {
    localStorage.clear();
    this.isLoggedInSubject.next(false); // 🔔 notify logout
  }
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
  // DeleteExpense(id: number) {
  //   return this.http.delete(`${this.DeleteExpense}/expenses/${id}`);
  // }
}
