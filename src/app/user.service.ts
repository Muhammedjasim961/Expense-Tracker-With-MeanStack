import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from './user';
@Injectable({
  providedIn: 'root',
})
export class UserService {
  loginUser = 'http://localhost:3005/login';
  registerUser = 'http://localhost:3005/register';
  getExpenses = 'http://localhost:3005';
  insertExpenses = 'http://localhost:3005/insertExpense';
  DeleteOneExpense = 'http://localhost:3005/deleteExpense/';
  constructor(private http: HttpClient) {}

  userLogin(email: any, password: any): Observable<any> {
    return this.http.post<User>(this.loginUser, email, password);
  }
  //headers: { 'Content-Type': 'application/json' },

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
  // DeleteExpense(id: number) {
  //   return this.http.delete(`${this.DeleteExpense}/expenses/${id}`);
  // }
}
