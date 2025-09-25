import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Expense {
  _id?: string;
  expense_name: string;
  amount: number;
  expense_date: string;
  expense_payment_date?: string;
  expense_category: string;
  comments: string;
}
@Injectable({
  providedIn: 'root',
})
export class ExpenseService {
  private apiUrl = 'http://localhost:3005/api';

  constructor(private http: HttpClient) {}

  // Get all expenses from your API
  getAllExpenses(): Observable<Expense[]> {
    return this.http.get<Expense[]>(`${this.apiUrl}/`);
  }
}
