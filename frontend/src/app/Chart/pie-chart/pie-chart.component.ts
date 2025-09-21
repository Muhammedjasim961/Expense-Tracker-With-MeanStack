import { Component, OnInit } from '@angular/core';
import { UserService } from '../../user.service';

@Component({
  selector: 'app-pie-chart',
  standalone: false,
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.css'],
})
export class PieChartComponent implements OnInit {
  // Google Charts configuration
  title = 'User Expenses';
  type: any = 'PieChart';
  data: any[] = [];
  columnNames = ['Expense', 'Amount']; // This stays the same
  options = {
    is3D: true,
    backgroundColor: 'transparent',
    legend: { position: 'labeled' },
    pieSliceText: 'value',
    chartArea: { width: '90%', height: '80%' },
  };
  width = 550;
  height = 350;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.loadUserData();
  }

  loadUserData() {
    this.userService.settingDataToPieChart().subscribe((result) => {
      // Transform data for Google Charts
      this.data = result.map((item) => [item.expense_name, item.amount]);
    });
  }
}
