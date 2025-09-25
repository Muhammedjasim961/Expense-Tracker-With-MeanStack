export interface User {
  _id?: string; // add this
  id?: number; // optional if you have local id
  username?: string;
  email?: string;
  password?: string;
  expense_name?: string;
  amount?: number;
  expense_date?: string;
  expense_payment_type?: string;
  expense_category?: string;
  comments?: string;
}
